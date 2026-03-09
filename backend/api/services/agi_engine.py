import google.generativeai as genai
import os
import json
import uuid
import inspect
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import text as sql_text
from ..models_db import AGIMemory, AGILogs, StudentDB, FacultyDB, CourseDB, AssignmentDB, AttendanceDB, EnrollmentDB, NotificationDB
from ..database import SessionLocal
from ..prompts import SMART_CAMPUS_BRAIN_PROMPT

# --- Tool Registry & Schema ---

class AgentTool:
    def __init__(self, name: str, description: str, func, requires_db: bool = False, required_roles: list = None, access_mode: str = "read"):
        self.name = name
        self.description = description
        self.func = func
        self.requires_db = requires_db
        self.required_roles = required_roles or [] # E.g. ["admin", "faculty"]
        self.access_mode = access_mode

    def execute(self, **kwargs):
        return self.func(**kwargs)

class ToolRegistry:
    def __init__(self):
        self.tools = {}

    def register(self, tool: AgentTool):
        self.tools[tool.name] = tool

    def get_tool(self, name: str):
        return self.tools.get(name)

    def get_tool_descriptions(self) -> str:
        descriptions = []
        for name, tool in self.tools.items():
            sig = str(inspect.signature(tool.func))
            role_note = f" [Roles: {', '.join(tool.required_roles)}]" if tool.required_roles else " [Public]"
            access_note = f" [Access: {tool.access_mode}]"
            descriptions.append(f"- {name}{sig}: {tool.description}{role_note}{access_note}")
        return "\n".join(descriptions)

    def execute_tool(self, name: str, args: dict, db: Session = None, current_role: str = "student", user_context: dict | None = None):
        tool = self.tools.get(name)
        if not tool:
            return f"Error: Tool '{name}' not found."
        
        # RBAC Check
        if tool.required_roles and current_role not in tool.required_roles:
            return f"Error: Access Denied. Role '{current_role}' cannot use tool '{name}'."
        
        try:
            args = args or {}
            call_kwargs = dict(args)
            sig = inspect.signature(tool.func)
            if tool.requires_db and "db" in sig.parameters:
                call_kwargs["db"] = db
            if "user_context" in sig.parameters:
                call_kwargs["user_context"] = user_context or {}
            if "current_role" in sig.parameters:
                call_kwargs["current_role"] = current_role

            valid_kwargs = {k: v for k, v in call_kwargs.items() if k in sig.parameters}
            return tool.execute(**valid_kwargs)
        except Exception as e:
            return f"Error executing tool '{name}': {str(e)}"

# --- Core Tools Definition ---

def tool_get_student_info(db: Session, student_id: str):
    """Fetch full profile, courses, and risk stats for a student."""
    s = db.query(StudentDB).filter(StudentDB.id == student_id).first()
    if not s: return "Student not found."
    
    # Enrich
    enrollments = db.query(EnrollmentDB).filter(EnrollmentDB.student_id == student_id).all()
    courses = db.query(CourseDB).filter(CourseDB.id.in_([e.course_id for e in enrollments])).all()
    attendance = db.query(AttendanceDB).filter(AttendanceDB.student_id == student_id).limit(5).all()
    
    return {
        "profile": {"name": f"{s.first_name} {s.last_name}", "major": s.major},
        "courses": [c.name for c in courses],
        "attendance_sample": [a.status for a in attendance]
    }

def tool_check_attendance_stats(db: Session):
    """Calculate campus-wide attendance percentage."""
    total = db.query(AttendanceDB).count()
    if total == 0: return "No attendance records available."
    present = db.query(AttendanceDB).filter(AttendanceDB.status == 'Present').count()
    rate = (present / total) * 100
    return f"Campus Attendance Rate: {rate:.1f}% (Total: {total})"

def tool_simulate_event(description: str):
    """Simulate a campus event or policy change and predict outcome."""
    # This would ideally use a model, but for now we simulate reasoning
    # In a real expanded version, this could query historical data trends
    return f"SIMULATION RESULT for '{description}': Prediction - 15% increase in student engagement, slight impact on faculty load."

def tool_remember_fact(db: Session, category: str, fact: str, user_context: dict | None = None):
    """Store a key fact or preference relative to the current context."""
    user_ctx = user_context or {}
    user_id = str(user_ctx.get("user_id") or "smnk_user")
    role = str(user_ctx.get("role") or "user")
    
    mem = AGIMemory(
        id=str(uuid.uuid4()),
        user_id=user_id,
        role=role,
        context_type=category,
        content=fact,
        timestamp=datetime.now().isoformat()
    )
    db.add(mem)
    db.commit()
    return f"I have committed this to my long-term memory: '{fact}'"

def tool_recall_context(db: Session, category: str, user_context: dict | None = None):
    """Recall past memories about a specific category."""
    user_ctx = user_context or {}
    user_id = str(user_ctx.get("user_id") or "smnk_user")
    mems = db.query(AGIMemory).filter(AGIMemory.context_type == category, AGIMemory.user_id == user_id).limit(5).all()
    if not mems: return "No specific memories found for this category."
    return [m.content for m in mems]

def tool_broadcast_alert(db: Session, message: str, target_role: str = "all"):
    """Send a system-wide alert to user dashboards."""
    note = NotificationDB(
        id=str(uuid.uuid4()),
        sender_role="admin",
        message=message,
        target_role=target_role,
        timestamp=datetime.now().isoformat()
    )
    db.add(note)
    db.commit()
    return f"Alert Broadcasted to {target_role}: '{message}'"


def tool_get_my_profile(db: Session, user_context: dict | None = None):
    """Get the authenticated user's profile and key stats."""
    user_ctx = user_context or {}
    role = user_ctx.get("role", "guest")
    user_id = user_ctx.get("user_id")
    if not user_id:
        return "No authenticated user profile available."

    if role == "student":
        student = db.query(StudentDB).filter(StudentDB.id == str(user_id)).first()
        if not student:
            return "Student profile not found."
        enrollments = db.query(EnrollmentDB).filter(EnrollmentDB.student_id == str(user_id)).all()
        courses = db.query(CourseDB).filter(CourseDB.id.in_([e.course_id for e in enrollments])).all() if enrollments else []
        return {
            "id": student.id,
            "name": f"{student.first_name} {student.last_name}",
            "email": student.email,
            "major": student.major,
            "year": student.year,
            "courses": [{"id": c.id, "code": c.code, "name": c.name} for c in courses],
        }

    if role == "faculty":
        faculty = db.query(FacultyDB).filter(FacultyDB.id == str(user_id)).first()
        if not faculty:
            return "Faculty profile not found."
        courses = db.query(CourseDB).filter(CourseDB.faculty_id == str(user_id)).all()
        return {
            "id": faculty.id,
            "name": f"{faculty.first_name} {faculty.last_name}",
            "email": faculty.email,
            "department": faculty.department,
            "courses": [{"id": c.id, "code": c.code, "name": c.name} for c in courses],
        }

    return {
        "role": role,
        "name": user_ctx.get("name", "User"),
        "email": user_ctx.get("email")
    }


def tool_get_course_roster(db: Session, course_id: str, user_context: dict | None = None, current_role: str = "student"):
    """Get student roster for a course (faculty/admin)."""
    course = db.query(CourseDB).filter(CourseDB.id == course_id).first()
    if not course:
        return "Course not found."

    user_ctx = user_context or {}
    if current_role == "faculty" and str(course.faculty_id) != str(user_ctx.get("user_id")):
        return "Error: Faculty can only access roster for their own courses."

    enrollments = db.query(EnrollmentDB).filter(EnrollmentDB.course_id == course_id).all()
    student_ids = [e.student_id for e in enrollments]
    students = db.query(StudentDB).filter(StudentDB.id.in_(student_ids)).all() if student_ids else []
    student_map = {s.id: s for s in students}

    return {
        "course": {"id": course.id, "code": course.code, "name": course.name},
        "roster_count": len(enrollments),
        "students": [
            {
                "student_id": e.student_id,
                "name": f"{student_map[e.student_id].first_name} {student_map[e.student_id].last_name}" if e.student_id in student_map else "Unknown",
                "grade": e.grade,
            }
            for e in enrollments
        ]
    }


def tool_mark_attendance(db: Session, student_id: str, status: str = "Present", date: str | None = None):
    """Mark attendance for a student."""
    target_date = date or datetime.now().strftime("%Y-%m-%d")
    exists = db.query(AttendanceDB).filter(AttendanceDB.student_id == student_id, AttendanceDB.date == target_date).first()
    if exists:
        exists.status = status
        exists.method = "AI-Agent"
        db.commit()
        return {"updated": True, "attendance_id": exists.id, "student_id": student_id, "date": target_date, "status": status}

    row = AttendanceDB(
        id=str(uuid.uuid4()),
        student_id=student_id,
        date=target_date,
        status=status,
        method="AI-Agent",
    )
    db.add(row)
    db.commit()
    return {"created": True, "attendance_id": row.id, "student_id": student_id, "date": target_date, "status": status}


def tool_create_assignment(db: Session, course_id: str, title: str, due_date: str, description: str | None = None, total_points: int = 100, rubric_criteria: list | None = None, point_allocations: dict | None = None, grading_scale: dict | None = None, user_context: dict | None = None, current_role: str = "student"):
    """Create assignment for a course with optional rubric and assessment (faculty/admin)."""
    import json
    
    course = db.query(CourseDB).filter(CourseDB.id == course_id).first()
    if not course:
        return "Course not found."

    user_ctx = user_context or {}
    if current_role == "faculty" and str(course.faculty_id) != str(user_ctx.get("user_id")):
        return "Error: Faculty can only create assignments in their own courses."

    item = AssignmentDB(
        id=str(uuid.uuid4()),
        title=title,
        course_id=course_id,
        due_date=due_date,
        description=description,
        total_points=total_points,
        rubric_criteria=json.dumps(rubric_criteria) if rubric_criteria else None,
        point_allocations=json.dumps(point_allocations) if point_allocations else None,
        grading_scale=json.dumps(grading_scale) if grading_scale else None,
    )
    db.add(item)
    db.commit()
    return {
        "assignment_id": item.id,
        "course_id": course_id,
        "title": title,
        "due_date": due_date,
        "rubric_criteria": rubric_criteria,
        "point_allocations": point_allocations,
        "grading_scale": grading_scale,
    }


def tool_update_grade(db: Session, student_id: str, course_id: str, grade: str, user_context: dict | None = None, current_role: str = "student"):
    """Update enrollment grade for a student in a specific course (faculty/admin)."""
    enrollment = db.query(EnrollmentDB).filter(EnrollmentDB.student_id == student_id, EnrollmentDB.course_id == course_id).first()
    if not enrollment:
        return "Enrollment not found for given student/course."

    if current_role == "faculty":
        course = db.query(CourseDB).filter(CourseDB.id == course_id).first()
        user_ctx = user_context or {}
        if not course or str(course.faculty_id) != str(user_ctx.get("user_id")):
            return "Error: Faculty can only update grades for their own courses."

    enrollment.grade = str(grade)
    db.commit()
    return {"student_id": student_id, "course_id": course_id, "grade": str(grade), "updated": True}

# --- Agent Runtime ---

class AGIBrain:
    def __init__(self):
        self.model = None
        self._model_checked = False
        self.registry = ToolRegistry()
        # Register Tools
        self.registry.register(AgentTool("get_student_info", "Get details about a specific student by ID.", tool_get_student_info, requires_db=True, required_roles=["student", "faculty", "admin"], access_mode="read"))
        self.registry.register(AgentTool("check_attendance_stats", "Get global campus attendance statistics.", tool_check_attendance_stats, requires_db=True, required_roles=["admin", "faculty"], access_mode="read"))
        self.registry.register(AgentTool("simulate_event", "Run a simulation for a policy or event.", tool_simulate_event, requires_db=False, required_roles=["admin"]))
        
        # Phase 10 Tools
        self.registry.register(AgentTool("remember_fact", "Store a user preference or fact.", tool_remember_fact, requires_db=True, access_mode="write"))
        self.registry.register(AgentTool("recall_context", "Recall past facts about a topic.", tool_recall_context, requires_db=True, access_mode="read"))
        self.registry.register(AgentTool("broadcast_alert", "Send a system-wide alert notification.", tool_broadcast_alert, requires_db=True, required_roles=["admin"], access_mode="write"))

        # Operational campus tools (read/write)
        self.registry.register(AgentTool("get_my_profile", "Get the current authenticated user's profile and key stats.", tool_get_my_profile, requires_db=True, required_roles=["student", "faculty", "admin"], access_mode="read"))
        self.registry.register(AgentTool("get_course_roster", "Get roster and grades for a course.", tool_get_course_roster, requires_db=True, required_roles=["faculty", "admin"], access_mode="read"))
        self.registry.register(AgentTool("mark_attendance", "Create or update attendance for a student.", tool_mark_attendance, requires_db=True, required_roles=["faculty", "admin"], access_mode="write"))
        self.registry.register(AgentTool("create_assignment", "Create a new assignment in a course.", tool_create_assignment, requires_db=True, required_roles=["faculty", "admin"], access_mode="write"))
        self.registry.register(AgentTool("update_grade", "Update student grade for a course enrollment.", tool_update_grade, requires_db=True, required_roles=["faculty", "admin"], access_mode="write"))

    def execute_action(self, tool: str, tool_args: dict, module: str, db: Session, user_context: dict | None = None) -> dict:
        """Execute a named tool with RBAC and return structured result for UI action buttons."""
        tool_meta = self.registry.get_tool(tool)
        if not tool_meta:
            return {
                "ok": False,
                "tool": tool,
                "access_mode": "unknown",
                "result": f"Error: Tool '{tool}' not found.",
            }

        result = self.registry.execute_tool(
            tool,
            tool_args or {},
            db=db,
            current_role=module,
            user_context=user_context or {},
        )
        return {
            "ok": not (isinstance(result, str) and result.startswith("Error")),
            "tool": tool,
            "access_mode": tool_meta.access_mode,
            "args": tool_args or {},
            "result": result,
        }

    def _ensure_model(self):
        """Lazy-init: configure the Gemini model on first use so the .env
        has been loaded by main.py before we read the key."""
        if self._model_checked:
            return
        self._model_checked = True
        api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-2.5-flash')

    def think(self, goal: str, context_data: dict, module: str, db: Session, user_id: str = None) -> dict:
        """
        ReAct Logic:
        1. Receive Goal
        2. Decide if Tool needed
        3. Execute Tool
        4. Final Answer
        """
        self._ensure_model()
        if not self.model:
            return {"reply": "AI Offline (No Key)", "actions": []}

        tool_desc = self.registry.get_tool_descriptions()
        
        # ── Build personalized prompt if user context provided ──
        personalized_intro = ""
        if "personalized_system_prompt" in context_data:
            personalized_intro = context_data["personalized_system_prompt"]
        
        # Clean context for display (remove the large system prompt from serialized context)
        display_context = {k: v for k, v in context_data.items() if k != "personalized_system_prompt"}
        
        # 1. Thought Step
        prompt = f"""
        {personalized_intro if personalized_intro else "You are the AGI Campus Controller."}
        
        GOAL: {goal}
        MODULE: {module.upper()}
        CONTEXT: {json.dumps(display_context)[:2000]}
        
        AVAILABLE TOOLS:
        {tool_desc}

        RESPONSE FORMAT:
        Return strict JSON.
        If you need to use a tool next:
        {{
            "thought": "I need to check X...",
            "tool": "tool_name",
            "tool_args": {{ "arg": "value" }}
        }}
        
        If you have the answer now:
        {{
            "thought": "I have enough info.",
            "final_answer": "The answer is..."
        }}
        
        You may use multiple tools in sequence. After each observation, continue planning safely.
        Never use write tools unless the user explicitly asks for an action/update.
        IMPORTANT: Personalize your response using the user profile data above. Address the user by name.
        """

        try:
            actions_log = []

            working_prompt = prompt
            final_text = "Processing complete."
            max_steps = 4

            for _ in range(max_steps):
                res = self.model.generate_content(working_prompt)
                content = self._clean_json(res.text)
                plan = json.loads(content)

                tool_name = plan.get("tool")
                if tool_name:
                    args = plan.get("tool_args", {})
                    tool_meta = self.registry.get_tool(tool_name)
                    observation = self.registry.execute_tool(
                        tool_name,
                        args,
                        db=db,
                        current_role=module,
                        user_context=context_data.get("user_profile", {}),
                    )
                    actions_log.append({
                        "tool": tool_name,
                        "args": args,
                        "access_mode": (tool_meta.access_mode if tool_meta else "unknown"),
                        "result": str(observation)
                    })
                    working_prompt = f"""
                    ORIGINAL_GOAL: {goal}
                    PREVIOUS_STEPS: {json.dumps(actions_log)[:4000]}
                    LAST_OBSERVATION: {str(observation)[:2000]}

                    Return strict JSON only.
                    - If more tools are needed: {{"thought": "...", "tool": "...", "tool_args": {{...}}}}
                    - If complete: {{"final_answer": "..."}}
                    """
                    continue

                final_text = plan.get("final_answer", str(plan))
                break

            self._log_thought(goal, "Direct Response", final_text, module, db)
            return {"reply": final_text, "actions": actions_log}

        except Exception as e:
            fallback = f"I encountered an error while thinking: {e}"
            return {"reply": fallback, "actions": []}

    def _clean_json(self, text):
        return text.replace("```json", "").replace("```", "").strip()

    def _log_thought(self, goal, context, decision, module, db: Session):
        try:
            log = AGILogs(
                id=str(uuid.uuid4()),
                timestamp=datetime.now().isoformat(),
                goal=goal,
                context_summary=str(context)[:500],
                decision=str(decision)[:500],
                module=module
            )
            db.add(log)
            db.commit()
        except:
            db.rollback()

agi_brain = AGIBrain()
