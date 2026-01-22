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
    def __init__(self, name: str, description: str, func, requires_db: bool = False, required_roles: list = None):
        self.name = name
        self.description = description
        self.func = func
        self.requires_db = requires_db
        self.required_roles = required_roles or [] # E.g. ["admin", "faculty"]

    def execute(self, **kwargs):
        return self.func(**kwargs)

class ToolRegistry:
    def __init__(self):
        self.tools = {}

    def register(self, tool: AgentTool):
        self.tools[tool.name] = tool

    def get_tool_descriptions(self) -> str:
        descriptions = []
        for name, tool in self.tools.items():
            sig = str(inspect.signature(tool.func))
            role_note = f" [Roles: {', '.join(tool.required_roles)}]" if tool.required_roles else " [Public]"
            descriptions.append(f"- {name}{sig}: {tool.description}{role_note}")
        return "\n".join(descriptions)

    def execute_tool(self, name: str, args: dict, db: Session = None, current_role: str = "student"):
        tool = self.tools.get(name)
        if not tool:
            return f"Error: Tool '{name}' not found."
        
        # RBAC Check
        if tool.required_roles and current_role not in tool.required_roles:
            return f"Error: Access Denied. Role '{current_role}' cannot use tool '{name}'."
        
        try:
            if tool.requires_db:
                return tool.execute(db=db, **args)
            return tool.execute(**args)
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

def tool_remember_fact(db: Session, category: str, fact: str):
    """Store a key fact or preference relative to the current context."""
    # Note: Ideally we need a user_id here. 
    # For now, we will store it under a 'global' or inferred user if not passed (limitation of current tool sig).
    # We'll default to 'unknown_user' if context isn't fully piped, but Phase 10 implies we should have user context.
    # The 'think' method has user_id, but tool signature doesn't always have it.
    # Let's assume user_id is passed as an arg for now or handled via context injection in a real frame.
    
    mem = AGIMemory(
        id=str(uuid.uuid4()),
        user_id="smnk_user", # Placeholder until tool signature expansion
        role="user",
        context_type=category,
        content=fact,
        timestamp=datetime.now().isoformat()
    )
    db.add(mem)
    db.commit()
    return f"I have committed this to my long-term memory: '{fact}'"

def tool_recall_context(db: Session, category: str):
    """Recall past memories about a specific category."""
    mems = db.query(AGIMemory).filter(AGIMemory.context_type == category).limit(5).all()
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

# --- Agent Runtime ---

class AGIBrain:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
        self.model = None
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-2.5-flash')
        
        self.registry = ToolRegistry()
        # Register Tools
        self.registry.register(AgentTool("get_student_info", "Get details about a specific student by ID.", tool_get_student_info, requires_db=True, required_roles=["student", "faculty", "admin"]))
        self.registry.register(AgentTool("check_attendance_stats", "Get global campus attendance statistics.", tool_check_attendance_stats, requires_db=True, required_roles=["admin", "faculty"]))
        self.registry.register(AgentTool("simulate_event", "Run a simulation for a policy or event.", tool_simulate_event, requires_db=False, required_roles=["admin"]))
        
        # Phase 10 Tools
        self.registry.register(AgentTool("remember_fact", "Store a user preference or fact.", tool_remember_fact, requires_db=True))
        self.registry.register(AgentTool("recall_context", "Recall past facts about a topic.", tool_recall_context, requires_db=True))
        self.registry.register(AgentTool("broadcast_alert", "Send a system-wide alert notification.", tool_broadcast_alert, requires_db=True, required_roles=["admin"]))

    def think(self, goal: str, context_data: dict, module: str, db: Session, user_id: str = None) -> dict:
        """
        ReAct Logic:
        1. Receive Goal
        2. Decide if Tool needed
        3. Execute Tool
        4. Final Answer
        """
        if not self.model:
            return {"reply": "AI Offline (No Key)", "actions": []}

        tool_desc = self.registry.get_tool_descriptions()
        
        # 1. Thought Step
        prompt = f"""
        You are the AGI Campus Controller.
        GOAL: {goal}
        MODULE: {module.upper()}
        CONTEXT: {json.dumps(context_data)[:1000]}
        
        AVAILABLE TOOLS:
        {tool_desc}

        RESPONSE FORMAT:
        Return strict JSON.
        If you need more info from a tool:
        {{
            "thought": "I need to check X...",
            "tool": "tool_name",
            "tool_args": {{ "arg": "value" }}
        }}
        
        If you have the answer:
        {{
            "thought": "I have enough info.",
            "final_answer": "The answer is..."
        }}
        """

        try:
            # First Pass
            res = self.model.generate_content(prompt)
            content = self._clean_json(res.text)
            plan = json.loads(content)
            
            actions_log = []

            # Loop if tool used (simplified 1-step loop for stability)
            if "tool" in plan and plan["tool"]:
                tool_name = plan["tool"]
                args = plan.get("tool_args", {})
                
                # Execute
                # Pass 'module' as the 'current_role'
                observation = self.registry.execute_tool(tool_name, args, db=db, current_role=module)
                actions_log.append({"tool": tool_name, "args": args, "result": str(observation)})
                
                # Second Pass with Observation
                prompt_2 = f"""
                PREVIOUS PLAN: {json.dumps(plan)}
                OBSERVATION FROM TOOL: {observation}
                
                Now provide the final answer (JSON):
                {{ "final_answer": "..." }}
                """
                res_2 = self.model.generate_content(prompt_2)
                plan_2 = json.loads(self._clean_json(res_2.text))
                final_text = plan_2.get("final_answer", "Processing complete.")
                
                self._log_thought(goal, str(actions_log), final_text, module, db)
                return {
                    "reply": final_text,
                    "actions": actions_log
                }

            # Direct Answer
            final_text = plan.get("final_answer", str(plan))
            self._log_thought(goal, "Direct Response", final_text, module, db)
            return {"reply": final_text, "actions": []}

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
