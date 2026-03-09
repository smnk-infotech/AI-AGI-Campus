from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import os
import json
from urllib.parse import quote_plus

# Lazy import so app can still start without the package in some environments
try:
    import google.generativeai as genai
except Exception:  # pragma: no cover
    genai = None

router = APIRouter(prefix="/api/ai", tags=["ai"])

class ChatRequest(BaseModel):
    prompt: str
    context: str | None = None
    model: str | None = None  # allow override if needed

class ChatResponse(BaseModel):
    reply: str
    model: str
    actions: list[dict] | None = None

def _normalize_model_name(name: str) -> str:
    # google-generativeai often expects the 'models/' prefix
    return name if name.startswith("models/") else f"models/{name}"


def _get_client(model_preference: str | None = None):
    api_key = os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GOOGLE_API_KEY is not configured on the server")
    if genai is None:
        raise HTTPException(status_code=500, detail="google-generativeai package is not installed on the server")
    genai.configure(api_key=api_key)
    # Prefer explicitly set model; otherwise use a broadly available default
    raw = model_preference or os.environ.get("GOOGLE_AI_MODEL", "gemini-2.5-flash")
    model_name = _normalize_model_name(raw)
    return genai.GenerativeModel(model_name)


from ..services.agi_engine import agi_brain
from ..database import get_db
from ..models_db import StudentDB, FacultyDB, AdminDB, CourseDB, EnrollmentDB, AttendanceDB, AssignmentDB
from ..auth import get_current_user
from sqlalchemy.orm import Session
from fastapi import Depends
from typing import Optional
from jose import jwt as jose_jwt

# ── Helper: build personalized context from JWT token ──
def _extract_user_from_token(authorization: str | None, db: Session) -> dict:
    """Extract user profile + academic data from JWT token for AI personalization."""
    if not authorization:
        return {"role": "guest", "name": "Guest User"}
    
    token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization
    try:
        from ..auth import SECRET_KEY, ALGORITHM
        payload = jose_jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role", "student")
        user_id = payload.get("id")
    except Exception:
        return {"role": "guest", "name": "Guest User"}
    
    if role == "student":
        student = db.query(StudentDB).filter(StudentDB.email == email).first()
        if not student:
            return {"role": "student", "name": email}
        enrollments = db.query(EnrollmentDB).filter(EnrollmentDB.student_id == student.id).all()
        course_ids = [e.course_id for e in enrollments]
        courses = db.query(CourseDB).filter(CourseDB.id.in_(course_ids)).all() if course_ids else []
        attendance = db.query(AttendanceDB).filter(AttendanceDB.student_id == student.id).all()
        total_att = len(attendance)
        present = sum(1 for a in attendance if a.status == "Present")
        att_rate = round((present / total_att) * 100, 1) if total_att > 0 else 0
        
        grades = []
        for e in enrollments:
            c = next((c for c in courses if c.id == e.course_id), None)
            if c and e.grade:
                grades.append({"course": c.name, "code": c.code, "grade": e.grade})

        assignments = []
        for c in courses:
            assgns = db.query(AssignmentDB).filter(AssignmentDB.course_id == c.id).all()
            for a in assgns:
                assignments.append({"title": a.title, "course": c.name, "due_date": a.due_date})
        
        gpa_sum = 0.0
        graded = 0
        for e in enrollments:
            if e.grade:
                try:
                    gpa_sum += float(e.grade)
                    graded += 1
                except ValueError:
                    pass
        gpa = round(gpa_sum / graded, 2) if graded > 0 else 0

        return {
            "role": "student",
            "user_id": student.id,
            "name": f"{student.first_name} {student.last_name}",
            "email": student.email,
            "major": student.major or "Undeclared",
            "year": student.year,
            "gpa": gpa,
            "courses": [{"name": c.name, "code": c.code, "schedule": c.schedule, "credits": c.credits} for c in courses],
            "grades": grades,
            "attendance_rate": att_rate,
            "total_attendance_records": total_att,
            "upcoming_assignments": assignments[:5],
        }
    
    elif role == "faculty":
        faculty = db.query(FacultyDB).filter(FacultyDB.email == email).first()
        if not faculty:
            return {"role": "faculty", "name": email}
        courses = db.query(CourseDB).filter(CourseDB.faculty_id == faculty.id).all()
        total_students = 0
        course_details = []
        for c in courses:
            enrolled = db.query(EnrollmentDB).filter(EnrollmentDB.course_id == c.id).count()
            total_students += enrolled
            course_details.append({"name": c.name, "code": c.code, "enrolled": enrolled, "schedule": c.schedule, "credits": c.credits})
        
        return {
            "role": "faculty",
            "user_id": faculty.id,
            "name": f"{faculty.first_name} {faculty.last_name}",
            "email": faculty.email,
            "department": faculty.department or "General",
            "courses_teaching": course_details,
            "total_students_reached": total_students,
        }
    
    elif role == "admin":
        admin = db.query(AdminDB).filter(AdminDB.email == email).first()
        if not admin:
            return {"role": "admin", "name": email}
        total_students = db.query(StudentDB).count()
        total_faculty = db.query(FacultyDB).count()
        total_courses = db.query(CourseDB).count()
        return {
            "role": "admin",
            "user_id": admin.id,
            "name": f"{admin.first_name} {admin.last_name}",
            "email": admin.email,
            "campus_students": total_students,
            "campus_faculty": total_faculty,
            "campus_courses": total_courses,
        }
    
    return {"role": role, "name": email}


def _build_personalized_system_prompt(user_ctx: dict) -> str:
    """Build a role-specific system prompt with real user data."""
    role = user_ctx.get("role", "guest")
    name = user_ctx.get("name", "User")
    
    if role == "student":
        courses_str = ", ".join([f"{c['code']} ({c['name']})" for c in user_ctx.get("courses", [])]) or "None enrolled"
        grades_str = ", ".join([f"{g['course']}: {g['grade']}" for g in user_ctx.get("grades", [])]) or "No grades yet"
        assignments_str = "\n".join([f"  - {a['title']} ({a['course']}, due: {a['due_date']})" for a in user_ctx.get("upcoming_assignments", [])]) or "  None upcoming"
        
        return f"""You are {name}'s personal AI Study Assistant at AI-AGI Campus.

STUDENT PROFILE (REAL DATA — use this to personalize every response):
- Name: {name}
- Major: {user_ctx.get('major', 'Undeclared')}
- Year: {user_ctx.get('year', 'N/A')}
- GPA: {user_ctx.get('gpa', 'N/A')}
- Attendance Rate: {user_ctx.get('attendance_rate', 'N/A')}%
- Enrolled Courses: {courses_str}
- Current Grades: {grades_str}
- Upcoming Assignments:
{assignments_str}

PERSONALIZATION RULES:
1. Always address {name.split()[0]} by their first name.
2. Reference their ACTUAL courses, grades, and assignments when relevant.
3. If they ask about study tips, tailor them to their major ({user_ctx.get('major', 'their field')}).
4. If their attendance rate is below 80%, gently encourage better attendance.
5. If their GPA is below 3.0, offer specific study strategies.
6. When discussing assignments, reference their REAL upcoming deadlines.
7. Be warm, encouraging, and supportive — like a brilliant personal tutor who genuinely cares.
8. You can help with homework, explain concepts, create study plans, and provide emotional support.
9. Never reveal raw database IDs or technical internals to the student.
"""

    elif role == "faculty":
        courses_str = "\n".join([f"  - {c['code']} ({c['name']}) — {c['enrolled']} students, {c['schedule']}" for c in user_ctx.get("courses_teaching", [])]) or "  No courses assigned"
        
        return f"""You are {name}'s personal AI Research Copilot at AI-AGI Campus.

FACULTY PROFILE (REAL DATA — use this to personalize every response):
- Name: {name}
- Department: {user_ctx.get('department', 'General')}
- Total Students Reached: {user_ctx.get('total_students_reached', 0)}
- Courses Teaching:
{courses_str}

PERSONALIZATION RULES:
1. Always address {name.split()[0]} professionally (Dr./Prof.).
2. Reference their ACTUAL department, courses, and student count.
3. For research help, tailor suggestions to their department ({user_ctx.get('department', 'their field')}).
4. Help with grant writing, literature reviews, experiment planning, and curriculum design.
5. Offer insights about their specific courses and enrolled students.
6. Be professional, concise, and highly competent — like a brilliant research colleague.
7. You can analyze teaching effectiveness, suggest pedagogy improvements, and assist with grading strategies.
"""

    elif role == "admin":
        return f"""You are the AGI Campus Controller, serving administrator {name}.

ADMIN PROFILE (REAL DATA):
- Name: {name}
- Campus Students: {user_ctx.get('campus_students', 0)}
- Campus Faculty: {user_ctx.get('campus_faculty', 0)}
- Campus Courses: {user_ctx.get('campus_courses', 0)}

PERSONALIZATION RULES:
1. Address {name.split()[0]} as the campus administrator.
2. Provide data-driven insights about the entire organization.
3. Be strategic, analytical, and comprehensive in your responses.
4. You have access to tools for checking attendance, student info, simulations, and broadcasting alerts.
"""

    elif role == "parent":
        child_name = user_ctx.get("child_name", "your child")
        return f"""You are a helpful AI assistant for parent {name} at AI-AGI Campus.

PARENT PROFILE (REAL DATA):
- Parent Name: {name}
- Child: {user_ctx.get('child_name', 'N/A')}
- Child's Major: {user_ctx.get('child_major', 'N/A')}
- Child's GPA: {user_ctx.get('child_gpa', 'N/A')}
- Child's Attendance: {user_ctx.get('child_attendance', 'N/A')}%
- Child's Courses: {user_ctx.get('child_courses', 'None')}

PERSONALIZATION RULES:
1. Address {name.split()[0]} warmly as a concerned parent.
2. Discuss their child {child_name}'s ACTUAL academic performance.
3. Provide helpful parenting insights related to education.
4. Be transparent about grades, attendance, and areas of improvement.
5. Never share other students' data — only their child's information.
6. Offer actionable advice for how they can support their child's learning.
"""

    return f"You are a helpful AI assistant at AI-AGI Campus. The user is {name}."


class AGIRequest(BaseModel):
    goal: str
    module: str
    context: dict
    user_id: str | None = None
    
@router.post("/agi")
async def agi_think(body: AGIRequest, db: Session = Depends(get_db)):
    """
    Endpoint for AGI Goal-Oriented Reasoning.
    Returns { "reply": str, "actions": [ {tool, args, result} ... ] }
    """
    if not body.goal:
        raise HTTPException(status_code=400, detail="goal is required")
        
    return agi_brain.think(
        goal=body.goal,
        context_data=body.context,
        module=body.module,
        db=db,
        user_id=body.user_id
    )

@router.post("/chat", response_model=ChatResponse)
async def chat(body: ChatRequest, db: Session = Depends(get_db)):
    prompt = body.prompt.strip() if body.prompt else ""
    if not prompt:
        raise HTTPException(status_code=400, detail="prompt is required")

    try:
        # Use simple model for basic chat, but we could upgrade to AGI brain if needed.
        # For now, keeping legacy chat behavior but standardizing error handling.
        model = _get_client(body.model)
        full_prompt = f"Context:\n{body.context}\n\nQuestion:\n{prompt}" if body.context else prompt
        result = model.generate_content(full_prompt)
        text = (result.text or "").strip() if result else "(No response)"
        
        # Store interaction in AGI Memory (Simulate user ID for now, pending auth integration in chat)
        # agi_brain.remember("public_user", "guest", "conversation", f"User: {prompt} | AI: {text}", db)
        
        return ChatResponse(reply=text, model="gemini-2.5-flash")
    except Exception as e:
        error_msg = str(e)
        if "403" in error_msg or "leaked" in error_msg.lower():
            return ChatResponse(reply=f"Simulation Mode: {prompt}", model="simulated-fallback")
        raise HTTPException(status_code=500, detail=f"AI generation failed: {e}")


# ---- Multi-turn chat endpoint ----
class Message(BaseModel):
    role: str = Field(..., description="'user' | 'assistant' | 'system'")
    content: str


class ChatMessagesRequest(BaseModel):
    messages: list[Message]
    model: str | None = None
    user_context: dict | None = None  # Optional client-side context override


class ChatMessagesResponse(BaseModel):
    reply: str
    model: str
    actions: list[dict] | None = None
    user_profile: dict | None = None  # Echo back the detected user profile


class ExecuteActionRequest(BaseModel):
    tool: str
    args: dict | None = None


class ExecuteActionResponse(BaseModel):
    ok: bool
    tool: str
    access_mode: str
    args: dict | None = None
    result: str | dict | list


from fastapi import Header

@router.post("/messages", response_model=ChatMessagesResponse)
async def chat_messages(
    body: ChatMessagesRequest,
    db: Session = Depends(get_db),
    authorization: str | None = Header(None),
):
    if not body.messages or not isinstance(body.messages, list):
        raise HTTPException(status_code=400, detail="messages array is required")

    try:
        last = body.messages[-1]
        last_content = (last.content or '').strip()
        if not last_content:
            raise HTTPException(status_code=400, detail="last message has empty content")

        # ── PERSONALIZATION: Extract real user data from JWT ──
        user_ctx = _extract_user_from_token(authorization, db)
        role = user_ctx.get("role", "student")
        user_id = str(user_ctx.get("user_id", "public_simulation"))
        user_name = user_ctx.get("name", "User")
        
        # Build personalized system prompt with real user data
        personalized_prompt = _build_personalized_system_prompt(user_ctx)
        
        # Build rich context including user profile + chat history
        history = "\n".join([f"{m.role}: {m.content}" for m in body.messages[:-1]])
        context_data = {
            "chat_history": history,
            "user_profile": user_ctx,
            "personalized_system_prompt": personalized_prompt,
        }
        
        result = agi_brain.think(
            goal=last_content,
            context_data=context_data,
            module=role,
            db=db,
            user_id=user_id,
        )
        
        return ChatMessagesResponse(
            reply=result.get("reply", "No reply."),
            model="agi-gemini-2.5-flash",
            actions=result.get("actions", []),
            user_profile={"name": user_name, "role": role},
        )

    except Exception as e:
        print(f"AGI Chat Error: {e}")
        error_msg = str(e)
        if "403" in error_msg or "leaked" in error_msg.lower():
             return ChatMessagesResponse(
                 reply=f"Simulation Mode (Key Issue): {last_content}", 
                 model="simulated-fallback",
                 actions=[]
             )
        raise HTTPException(status_code=500, detail=f"AI chat failed: {e}")


@router.post("/actions/execute", response_model=ExecuteActionResponse)
async def execute_ai_action(
    body: ExecuteActionRequest,
    db: Session = Depends(get_db),
    authorization: str | None = Header(None),
):
    """Execute a single AGI tool action from frontend action cards with full RBAC checks."""
    tool = (body.tool or "").strip()
    if not tool:
        raise HTTPException(status_code=400, detail="tool is required")

    user_ctx = _extract_user_from_token(authorization, db)
    role = user_ctx.get("role", "guest")
    if role == "guest":
        raise HTTPException(status_code=401, detail="Authentication required for executing actions")

    executed = agi_brain.execute_action(
        tool=tool,
        tool_args=body.args or {},
        module=role,
        db=db,
        user_context=user_ctx,
    )
    return ExecuteActionResponse(**executed)


# ── Dedicated personalized chat endpoint (simple Gemini with full user context) ──
class PersonalizedChatRequest(BaseModel):
    message: str
    history: list[Message] | None = None

@router.post("/personalized")
async def personalized_chat(
    body: PersonalizedChatRequest,
    db: Session = Depends(get_db),
    authorization: str | None = Header(None),
):
    """Full-personalized chat: extracts user profile from JWT and feeds it as system context to Gemini."""
    msg = (body.message or "").strip()
    if not msg:
        raise HTTPException(status_code=400, detail="message is required")

    user_ctx = _extract_user_from_token(authorization, db)
    system_prompt = _build_personalized_system_prompt(user_ctx)

    # Build conversation
    history_parts = []
    if body.history:
        for m in body.history[-10:]:  # Keep last 10 messages for context
            history_parts.append(f"{m.role}: {m.content}")
    history_str = "\n".join(history_parts)

    full_prompt = f"""{system_prompt}

CONVERSATION HISTORY:
{history_str}

USER MESSAGE: {msg}

Respond in a warm, personalized manner using the user's real data above. Address them by name."""

    try:
        model = _get_client()
        result = model.generate_content(full_prompt)
        text = (result.text or "").strip() if result else "(No response)"
        return {
            "reply": text,
            "model": "gemini-2.5-flash",
            "user_profile": {"name": user_ctx.get("name"), "role": user_ctx.get("role")},
        }
    except Exception as e:
        error_msg = str(e)
        if "403" in error_msg:
            return {"reply": f"Simulation: Hello {user_ctx.get('name', 'User')}! I'd love to help.", "model": "simulated-fallback"}
        raise HTTPException(status_code=500, detail=f"Personalized chat failed: {e}")


# ── Parent AI endpoint (no auth — uses hardcoded child lookup) ──
@router.post("/parent/chat")
async def parent_chat(
    body: PersonalizedChatRequest,
    db: Session = Depends(get_db),
):
    """Parent AI assistant — looks up child (Aarav Kumar) data and provides parent-focused responses."""
    msg = (body.message or "").strip()
    if not msg:
        raise HTTPException(status_code=400, detail="message is required")

    # Look up the child's data (Aarav Kumar for the parent portal)
    child = db.query(StudentDB).filter(StudentDB.first_name == "Aarav").first()
    child_ctx = {"role": "parent", "name": "Radhika Kumar"}
    
    if child:
        enrollments = db.query(EnrollmentDB).filter(EnrollmentDB.student_id == child.id).all()
        course_ids = [e.course_id for e in enrollments]
        courses = db.query(CourseDB).filter(CourseDB.id.in_(course_ids)).all() if course_ids else []
        attendance = db.query(AttendanceDB).filter(AttendanceDB.student_id == child.id).all()
        total_att = len(attendance)
        present = sum(1 for a in attendance if a.status == "Present")
        att_rate = round((present / total_att) * 100, 1) if total_att > 0 else 0
        
        grades = []
        for e in enrollments:
            c = next((c for c in courses if c.id == e.course_id), None)
            if c and e.grade:
                grades.append(f"{c.name}: {e.grade}")

        child_ctx.update({
            "child_name": f"{child.first_name} {child.last_name}",
            "child_major": child.major or "Undeclared",
            "child_gpa": child.year,
            "child_attendance": att_rate,
            "child_courses": ", ".join([c.name for c in courses]) or "None",
            "child_grades": ", ".join(grades) or "No grades yet",
        })
    else:
        child_ctx.update({"child_name": "Aarav Kumar", "child_attendance": "N/A", "child_courses": "N/A"})

    system_prompt = _build_personalized_system_prompt(child_ctx)

    history_parts = []
    if body.history:
        for m in body.history[-10:]:
            history_parts.append(f"{m.role}: {m.content}")
    
    full_prompt = f"""{system_prompt}

CONVERSATION HISTORY:
{chr(10).join(history_parts)}

PARENT'S MESSAGE: {msg}

Respond warmly and personally. Address Radhika by name and reference Aarav's actual data."""

    try:
        model = _get_client()
        result = model.generate_content(full_prompt)
        text = (result.text or "").strip() if result else "(No response)"
        return {"reply": text, "model": "gemini-2.5-flash", "child_profile": child_ctx}
    except Exception as e:
        error_msg = str(e)
        if "403" in error_msg:
            return {"reply": f"Hello Radhika! I'd love to help you with information about Aarav.", "model": "simulated-fallback"}
        raise HTTPException(status_code=500, detail=f"Parent chat failed: {e}")


# ---- Learning kit endpoint (multi-format output with images) ----
class TeachRequest(BaseModel):
    topic: str = Field(..., description="Learning topic, e.g., 'Photosynthesis' or 'Binary Search'")
    level: str | None = Field(None, description="Audience level, e.g., 'grade 8', 'college', 'beginner'")
    style: str | None = Field(None, description="Optional tone or style preferences")
    model: str | None = None


class Visual(BaseModel):
    title: str
    url: str


class Flashcard(BaseModel):
    front: str
    back: str


class QuizItem(BaseModel):
    question: str
    options: list[str]
    correctIndex: int


class Resource(BaseModel):
    title: str
    url: str


class TeachResponse(BaseModel):
    topic: str
    summary_md: str
    steps_md: str
    visuals: list[Visual]
    flashcards: list[Flashcard]
    quiz: list[QuizItem]
    resources: list[Resource]
    model: str


@router.post("/teach", response_model=TeachResponse)
async def teach(body: TeachRequest):
    topic = (body.topic or "").strip()
    if not topic:
        raise HTTPException(status_code=400, detail="topic is required")

    try:
        model = _get_client(body.model)
        audience = f"Audience level: {body.level}." if body.level else ""
        style = f"Style: {body.style}." if body.style else ""
        prompt = f"""
You are a brilliant teacher assistant. Create a compact learning kit for the topic: "{topic}".
Return STRICT JSON only (no markdown fences), with this schema:
{{
  "image_queries": ["string", ... 3-6 items],
  "summary_md": "markdown string",
  "steps_md": "markdown string with a short step-by-step guide",
  "flashcards": [{{"front":"string","back":"string"}}, ... up to 8],
  "quiz": [{{"question":"string","options":["A","B","C","D"],"correctIndex":0}}, ... up to 5],
  "resources": [{{"title":"string","url":"https://..."}}, ... up to 5]
}}

Guidelines:
- Make the summary concise but rigorous; use markdown lists or tables when apt.
- Steps should be actionable and short.
- Flashcards must be factual; keep front/back crisp.
- Quiz options must be plausible; exactly one correctIndex.
- Prefer high-quality, general image search queries; avoid brand names.
{audience}
{style}
"""
        result = model.generate_content(prompt)
        text = (getattr(result, 'text', None) or '').strip()

        def try_parse_json(s: str):
            # attempt direct parse
            try:
                return json.loads(s)
            except Exception:
                pass
            # strip code fences
            if '```' in s:
                s2 = s.replace('```json', '```')
                parts = s2.split('```')
                for p in parts:
                    p = p.strip()
                    if p.startswith('{') and p.endswith('}'):
                        try:
                            return json.loads(p)
                        except Exception:
                            continue
            # extract outermost braces
            start = s.find('{')
            end = s.rfind('}')
            if start != -1 and end != -1 and end > start:
                try:
                    return json.loads(s[start:end+1])
                except Exception:
                    pass
            return None

        data = try_parse_json(text) or {
            "image_queries": [topic, f"{topic} diagram", f"{topic} process", f"{topic} example"],
            "summary_md": f"## {topic}\n\nNo structured JSON returned by the model. Here's a brief note: {text[:500]}",
            "steps_md": "1. Define the topic\n2. Identify key concepts\n3. Practice with examples",
            "flashcards": [],
            "quiz": [],
            "resources": []
        }

        # Build visuals using Unsplash Source endpoint (no API key required)
        queries = [q for q in (data.get("image_queries") or []) if isinstance(q, str) and q.strip()]
        visuals: list[Visual] = []
        for q in queries[:6]:
            qp = quote_plus(q)
            # try unsplash source; front-end will have onError fallback too
            url = f"https://source.unsplash.com/featured/800x600/?{qp}"
            visuals.append(Visual(title=q, url=url))
        if not visuals:
            # ensure at least a couple visuals
            seeds = [topic, f"{topic} diagram", f"{topic} concept"]
            for q in seeds:
                qp = quote_plus(q)
                visuals.append(Visual(title=q, url=f"https://source.unsplash.com/featured/800x600/?{qp}"))

        flashcards = []
        for fc in (data.get("flashcards") or [])[:8]:
            if isinstance(fc, dict) and fc.get("front") and fc.get("back"):
                flashcards.append(Flashcard(front=str(fc["front"]), back=str(fc["back"])) )

        quiz = []
        for item in (data.get("quiz") or [])[:5]:
            if isinstance(item, dict) and item.get("question") and isinstance(item.get("options"), list):
                try:
                    ci = int(item.get("correctIndex", 0))
                except Exception:
                    ci = 0
                quiz.append(QuizItem(question=str(item["question"]), options=[str(o) for o in item["options"]][:4], correctIndex=ci))
        if not quiz:
            quiz = [
                QuizItem(question=f"What is a key property required by {topic}?", options=["Sorted input", "Random input", "Unsorted only", "Graph input"], correctIndex=0),
                QuizItem(question=f"Which strategy best describes {topic}?", options=["Brute force", "Divide and conquer", "Dynamic programming", "Greedy"], correctIndex=1),
                QuizItem(question=f"What is the average time complexity of {topic}?", options=["O(n)", "O(n log n)", "O(log n)", "O(1)"], correctIndex=2),
            ]

        resources = []
        for r in (data.get("resources") or [])[:5]:
            if isinstance(r, dict) and r.get("title") and r.get("url"):
                resources.append(Resource(title=str(r["title"]), url=str(r["url"])) )
        if not resources:
            resources = [
                Resource(title=f"Wikipedia: {topic}", url=f"https://en.wikipedia.org/wiki/{quote_plus(topic)}"),
                Resource(title=f"Khan Academy search: {topic}", url=f"https://www.khanacademy.org/search?page_search_query={quote_plus(topic)}"),
            ]

        model_name = getattr(model, 'model_name', None) or (body.model or 'models/gemini-2.5-flash')
        return TeachResponse(
            topic=topic,
            summary_md=str(data.get("summary_md") or f"## {topic}\n\nNo summary available."),
            steps_md=str(data.get("steps_md") or "1. Define the topic\n2. Identify key concepts\n3. Practice with examples"),
            visuals=visuals,
            flashcards=flashcards or [
                Flashcard(front=f"Define {topic}", back=f"A short definition of {topic} and its purpose."),
                Flashcard(front=f"When to use {topic}?", back=f"Typical scenarios where {topic} is effective."),
            ],
            quiz=quiz,
            resources=resources,
            model=model_name
        )
    except HTTPException:
        raise
    except Exception as e:  # pragma: no cover
        error_msg = str(e)
        if "403" in error_msg or "leaked" in error_msg.lower():
            # Return a valid dummy teach response
            return TeachResponse(
                topic=topic,
                summary_md=f"## {topic} (Simulation)\n\nCould not generate real content due to API Key issues.",
                steps_md="1. Check API Key\n2. Retry",
                visuals=[],
                flashcards=[],
                quiz=[],
                resources=[],
                model="simulated-fallback"
            )
        raise HTTPException(status_code=500, detail=f"AI teach failed: {e}")
