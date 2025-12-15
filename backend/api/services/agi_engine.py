import google.generativeai as genai
import os
import json
import uuid
from datetime import datetime
from datetime import datetime
from sqlalchemy.orm import Session
from ..models_db import AGIMemory, AGILogs
from ..database import SessionLocal
from ..prompts import SMART_CAMPUS_BRAIN_PROMPT

class AGIBrain:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-2.5-flash') # Using flash model as per requirements
        else:
            self.model = None

    def remember(self, user_id: str, role: str, context_type: str, content: str, db: Session):
        """Stores a memory snippet in the database."""
        memory = AGIMemory(
            id=str(uuid.uuid4()),
            user_id=user_id,
            role=role,
            context_type=context_type,
            content=content,
            timestamp=datetime.now().isoformat()
        )
        db.add(memory)
        db.commit()

    def recall(self, user_id: str, db: Session, limit: int = 5) -> str:
        """Retrieves regular short-term memory context."""
        memories = db.query(AGIMemory).filter(AGIMemory.user_id == user_id)\
                     .order_by(AGIMemory.timestamp.desc()).limit(limit).all()
        
        if not memories:
            return "No previous context."
        
        return "\n".join([f"- [{m.timestamp}] {m.content}" for m in memories])

    def _fetch_cross_module_context(self, user_id: str, role: str, db: Session) -> dict:
        """Fetches relevant data from other modules based on role."""
        context = {}
        
        try:
            # Lazy import to avoid circular dependency
            from ..models_db import StudentDB, FacultyDB, CourseDB, AssignmentDB, AttendanceDB, EnrollmentDB
            
            if role == "student":
                # Get Student Info
                student = db.query(StudentDB).filter(StudentDB.id == user_id).first()
                if student:
                    context["profile"] = {"name": f"{student.first_name} {student.last_name}", "major": student.major, "year": student.year}
                    
                # Get Enrollments & Courses & Grades
                enrollments = db.query(EnrollmentDB).filter(EnrollmentDB.student_id == user_id).all()
                course_ids = [e.course_id for e in enrollments]
                courses = db.query(CourseDB).filter(CourseDB.id.in_(course_ids)).all()
                context["courses"] = [c.name for c in courses]

                # Calculate Grades / Weak Subjects
                assignments = db.query(AssignmentDB).filter(AssignmentDB.course_id.in_(course_ids)).all()
                # Mock grade calculation for now (since we don't have a SubmissionDB yet, assumes all assignments are 'graded' for context)
                # In a real app, we'd query submissions. Here we'll simulate based on seed data logic or just return assignment list.
                context["assignments"] = [f"{a.title} (Due: {a.due_date})" for a in assignments]
                
                # Retrieve actual grades if available (mocking high risk for demo if needed, or reading from a new 'Grade' model if we had one. 
                # For this MVP, we will simulate "Weak Subjects" based on random logic or if we seed it.)
                # Let's seed specific "performance_context" in the prompt if we can't query it yet.
                pass
                
                # Get Recent Attendance
                attendance = db.query(AttendanceDB).filter(AttendanceDB.student_id == user_id).limit(5).all()
                context["recent_attendance"] = [f"{a.date}: {a.status}" for a in attendance]
                
            elif role == "faculty":
                # Get Faculty Info
                faculty = db.query(FacultyDB).filter(FacultyDB.id == user_id).first()
                if faculty:
                    context["profile"] = {"name": f"{faculty.first_name} {faculty.last_name}", "dept": faculty.department}
                
                # Get Courses Taught & At-Risk Students
                courses = db.query(CourseDB).filter(CourseDB.faculty_id == user_id).all()
                context["teaching_courses"] = [c.name for c in courses]
                
                # Identify At-Risk Students (Simulation logic for MVP)
                # In real system: Query all students in these courses -> Check avg grade < 60
                course_ids = [c.id for c in courses]
                enrolled_count = db.query(EnrollmentDB).filter(EnrollmentDB.course_id.in_(course_ids)).count()
                
                # Simulating a report for the AGI to analyze
                context["course_health"] = {
                    "total_students": enrolled_count,
                    "at_risk_count": max(0, int(enrolled_count * 0.1)), # Simulate 10% risk
                    "issues": ["Low attendance in AI-101", "Missing assignments in CS-202"]
                }
                
            elif role == "admin":
                # Get Global Stats
                s_count = db.query(StudentDB).count()
                f_count = db.query(FacultyDB).count()
                c_count = db.query(CourseDB).count()
                
                # Global Attendance Rate
                total_att = db.query(AttendanceDB).count()
                present_att = db.query(AttendanceDB).filter(AttendanceDB.status == "Present").count()
                att_rate = int((present_att / total_att * 100) if total_att > 0 else 0)

                context["campus_stats"] = {
                    "total_students": s_count, 
                    "total_faculty": f_count, 
                    "total_courses": c_count,
                    "avg_attendance": f"{att_rate}%"
                }

                # Simulated Department Health (since we don't have full dept links in seed yet)
                context["dept_health"] = {
                    "CS": "92% Attendance, 85% Avg Grade",
                    "Robotics": "88% Attendance, 78% Avg Grade (Warning: Drop in attendance)"
                }
                
        except Exception as e:
            print(f"Context Fetch Error: {e}")
            
        return context

    def think(self, goal: str, context_data: dict, module: str, db: Session, user_id: str = None) -> dict:
        """
        Core AGI Reasoning Loop.
        Uses the 'Always-On' System Identity to debate involved agents and reach a consensus.
        """
        if not self.model:
            return {
                "analysis": "AI Service Unavailable",
                "decision": "Error",
                "explanation": "API Key missing."
            }
            
        # 1. Enrich Context
        enriched_context = context_data.copy()
        if user_id:
            role_map = {"student": "student", "faculty": "faculty", "admin": "admin"}
            db_context = self._fetch_cross_module_context(user_id, role_map.get(module, "student"), db)
            enriched_context.update(db_context)

        user_context_str = json.dumps(enriched_context, indent=2)
        
        # Construct the AGI Prompt using the Global Identity
        prompt = f"""
        {SMART_CAMPUS_BRAIN_PROMPT}

        STATS & CONTEXT:
        GOAL: {goal}
        MODULE: {module.upper()}
        CONTEXT DATA:
        {user_context_str}

        EXECUTE REASONING LOOP NOW.
        """

        try:
            response = self.model.generate_content(prompt)
            # Safe JSON extraction
            content = response.text.replace("```json", "").replace("```", "").strip()
            result = json.loads(content)
            
            # Log the reasoning
            self._log_thought(goal, user_context_str, result, module, db)
            
            return result
        
        except Exception as e:
            print(f"AGI Error: {e}")
            return {
                "analysis": "Error in reasoning.",
                "decision": "Default Action",
                "explanation": f"The AGI encountered an error processing this request: {str(e)}",
                "confidence": 0
            }

    def _log_thought(self, goal, context, result, module, db: Session):
        """Logs the thought process for Admin audit."""
        log_entry = AGILogs(
            id=str(uuid.uuid4()),
            timestamp=datetime.now().isoformat(),
            goal=goal,
            context_summary=context[:500], # Truncate large context
            analysis=result.get("analysis", ""),
            decision=result.get("decision", ""),
            explanation=result.get("explanation", ""),
            confidence=result.get("confidence", 0),
            module=module
        )
        db.add(log_entry)
        db.commit()

# Singleton instance
agi_brain = AGIBrain()
