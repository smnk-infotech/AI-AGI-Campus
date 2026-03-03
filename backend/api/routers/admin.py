from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from ..database import get_db
from ..models_db import (
    StudentDB, FacultyDB, EnrollmentDB, AttendanceDB,
    AssignmentDB, CourseDB, AGILogs, AGIMemory, NotificationDB,
)

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/dashboard")
def get_admin_dashboard(db: Session = Depends(get_db)):
    # 1. Counts
    active_students = db.query(StudentDB).count()
    teachers = db.query(FacultyDB).count()
    
    # 2. Attendance (Real Calculation)
    # For demo simplicity, calculate global attendance rate
    all_att = db.query(AttendanceDB).count()
    present_att = db.query(AttendanceDB).filter(AttendanceDB.status == "Present").count()
    att_rate = f"{int(present_att / all_att * 100)}%" if all_att > 0 else "100%"

    # 3. Fees (Real Calculation based on Enrollment -> Course.fee)
    # Join Enrollment with Course to sum fees
    enrollments_data = db.query(EnrollmentDB, CourseDB).join(CourseDB, EnrollmentDB.course_id == CourseDB.id).all()
    total_fees = sum(c.fee for e, c in enrollments_data) if enrollments_data else 0
    fees_val = f"${total_fees}"

    # 4. Events (Derived from Assignments)
    # In a real system, you'd have an EventDB. Here we use Assignments as academic events.
    assignments = db.query(AssignmentDB).limit(5).all()
    events = []
    for a in assignments:
        events.append({
            "title": f"Deadline: {a.title}",
            "date": a.due_date,
            "owner": "Academic Office"
        })
    if not events:
         events.append({ "title": "Start of Semester", "date": "2026-01-05", "owner": "Admin" })

    # 5. Alerts (Derived from Data anomalies)
    alerts = []
    # Check for low attendance students
    students = db.query(StudentDB).all()
    for s in students:
        s_att = db.query(AttendanceDB).filter(AttendanceDB.student_id == s.id).count()
        s_present = db.query(AttendanceDB).filter(AttendanceDB.student_id == s.id, AttendanceDB.status == "Present").count()
        if s_att > 0 and (s_present / s_att) < 0.6:
             alerts.append(f"Low Attendance Risk: {s.first_name} {s.last_name}")
    
    # If no real alerts, show a system check
    if not alerts:
        alerts.append("System All Green: No operation anomalies detected.")

    return {
        "stats": [
            { "label": 'Active Students', "value": str(active_students) },
            { "label": 'Teachers', "value": str(teachers) },
            { "label": 'Attendance Rate', "value": att_rate },
            { "label": 'Estimated Fees', "value": fees_val } 
        ],
        "events": events,
        "alerts": alerts
    }


# --------------- Grade Update ---------------
class GradeUpdate(BaseModel):
    student_id: str
    course_id: str
    grade: str


@router.post("/grades")
def update_grade(payload: GradeUpdate, db: Session = Depends(get_db)):
    enrollment = db.query(EnrollmentDB).filter(
        EnrollmentDB.student_id == payload.student_id,
        EnrollmentDB.course_id == payload.course_id
    ).first()
    if not enrollment:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Enrollment not found")
    enrollment.grade = payload.grade
    db.commit()
    return {"success": True, "student_id": payload.student_id, "grade": payload.grade}


# --------------- Alerts ---------------
@router.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    alerts = []
    students = db.query(StudentDB).all()
    for s in students:
        s_att = db.query(AttendanceDB).filter(AttendanceDB.student_id == s.id).count()
        s_present = db.query(AttendanceDB).filter(
            AttendanceDB.student_id == s.id, AttendanceDB.status == "Present"
        ).count()
        if s_att > 0 and (s_present / s_att) < 0.6:
            alerts.append({
                "type": "warning",
                "message": f"Low Attendance Risk: {s.first_name} {s.last_name}",
            })
    if not alerts:
        alerts.append({"type": "info", "message": "System All Green: No anomalies detected."})
    return alerts


# =====================================================================
#  AGI ORGANIZATION CONTROLLER — Full Campus Intelligence
# =====================================================================

@router.get("/agi/status")
def agi_org_status(db: Session = Depends(get_db)):
    """Real-time campus-wide intelligence snapshot."""
    # Counts
    total_students = db.query(StudentDB).count()
    total_faculty = db.query(FacultyDB).count()
    total_courses = db.query(CourseDB).count()
    total_assignments = db.query(AssignmentDB).count()

    # Attendance
    att_total = db.query(AttendanceDB).count()
    att_present = db.query(AttendanceDB).filter(AttendanceDB.status == "Present").count()
    att_late = db.query(AttendanceDB).filter(AttendanceDB.status == "Late").count()
    att_absent = db.query(AttendanceDB).filter(AttendanceDB.status == "Absent").count()
    att_rate = round((att_present / att_total * 100), 1) if att_total else 0

    # Enrollment stats
    total_enrollments = db.query(EnrollmentDB).count()
    graded = db.query(EnrollmentDB).filter(EnrollmentDB.grade.isnot(None), EnrollmentDB.grade != "").count()

    # Revenue
    enrollments_data = db.query(EnrollmentDB, CourseDB).join(CourseDB, EnrollmentDB.course_id == CourseDB.id).all()
    total_revenue = sum(c.fee for e, c in enrollments_data) if enrollments_data else 0

    # At-risk students (attendance < 60%)
    at_risk = []
    students = db.query(StudentDB).all()
    for s in students:
        s_att = db.query(AttendanceDB).filter(AttendanceDB.student_id == s.id).count()
        s_pres = db.query(AttendanceDB).filter(AttendanceDB.student_id == s.id, AttendanceDB.status == "Present").count()
        rate = round((s_pres / s_att * 100), 1) if s_att else 100
        if rate < 60:
            at_risk.append({"id": s.id, "name": f"{s.first_name} {s.last_name}", "rate": rate, "major": s.major})

    # AGI activity
    agi_log_count = db.query(AGILogs).count()
    agi_memory_count = db.query(AGIMemory).count()
    notification_count = db.query(NotificationDB).count()

    return {
        "campus": {
            "students": total_students,
            "faculty": total_faculty,
            "courses": total_courses,
            "assignments": total_assignments,
            "enrollments": total_enrollments,
            "graded_enrollments": graded,
            "revenue": total_revenue,
        },
        "attendance": {
            "total": att_total,
            "present": att_present,
            "late": att_late,
            "absent": att_absent,
            "rate": att_rate,
        },
        "at_risk_students": at_risk,
        "agi": {
            "logs": agi_log_count,
            "memories": agi_memory_count,
            "notifications": notification_count,
        },
    }


@router.get("/agi/logs")
def agi_logs(limit: int = 20, db: Session = Depends(get_db)):
    """Fetch recent AGI thought logs."""
    logs = db.query(AGILogs).order_by(AGILogs.timestamp.desc()).limit(limit).all()
    return [
        {
            "id": l.id,
            "timestamp": l.timestamp,
            "goal": l.goal,
            "context": l.context_summary,
            "decision": l.decision,
            "module": l.module,
        }
        for l in logs
    ]


@router.get("/agi/notifications")
def agi_notifications(db: Session = Depends(get_db)):
    """All broadcast notifications."""
    notes = db.query(NotificationDB).order_by(NotificationDB.timestamp.desc()).limit(30).all()
    return [
        {
            "id": n.id,
            "sender": n.sender_role,
            "message": n.message,
            "target": n.target_role,
            "timestamp": n.timestamp,
        }
        for n in notes
    ]


class BroadcastRequest(BaseModel):
    message: str
    target_role: str = "all"


@router.post("/agi/broadcast")
def agi_broadcast(body: BroadcastRequest, db: Session = Depends(get_db)):
    """Admin manually broadcasts an alert via the AGI controller."""
    import uuid
    from datetime import datetime

    note = NotificationDB(
        id=str(uuid.uuid4()),
        sender_role="admin",
        message=body.message,
        target_role=body.target_role,
        timestamp=datetime.now().isoformat(),
    )
    db.add(note)
    db.commit()
    return {"success": True, "message": body.message, "target": body.target_role}


class AGICommandRequest(BaseModel):
    command: str
    context: Optional[dict] = None


@router.post("/agi/command")
def agi_command(body: AGICommandRequest, db: Session = Depends(get_db)):
    """Execute a goal through the AGI Brain with admin-level tool access."""
    from ..services.agi_engine import agi_brain

    result = agi_brain.think(
        goal=body.command,
        context_data=body.context or {},
        module="admin",
        db=db,
        user_id="admin",
    )
    return result


@router.get("/agi/students-overview")
def agi_students_overview(db: Session = Depends(get_db)):
    """Detailed per-student analysis for org control."""
    students = db.query(StudentDB).all()
    overview = []
    for s in students:
        s_att = db.query(AttendanceDB).filter(AttendanceDB.student_id == s.id).count()
        s_pres = db.query(AttendanceDB).filter(AttendanceDB.student_id == s.id, AttendanceDB.status == "Present").count()
        rate = round((s_pres / s_att * 100), 1) if s_att else 100

        enrollments = db.query(EnrollmentDB).filter(EnrollmentDB.student_id == s.id).all()
        courses = db.query(CourseDB).filter(CourseDB.id.in_([e.course_id for e in enrollments])).all()
        grades = [e.grade for e in enrollments if e.grade]

        overview.append({
            "id": s.id,
            "name": f"{s.first_name} {s.last_name}",
            "email": s.email,
            "major": s.major,
            "year": s.year,
            "attendance_rate": rate,
            "courses": len(courses),
            "grades": grades,
            "status": "at-risk" if rate < 60 else ("warning" if rate < 80 else "good"),
        })
    return overview


@router.get("/agi/faculty-overview")
def agi_faculty_overview(db: Session = Depends(get_db)):
    """Per-faculty workload analysis."""
    faculty = db.query(FacultyDB).all()
    overview = []
    for f in faculty:
        courses = db.query(CourseDB).filter(CourseDB.faculty_id == f.id).all()
        total_students = 0
        for c in courses:
            enrolled = db.query(EnrollmentDB).filter(EnrollmentDB.course_id == c.id).count()
            total_students += enrolled

        overview.append({
            "id": f.id,
            "name": f"{f.first_name} {f.last_name}",
            "email": f.email,
            "department": f.department,
            "courses_count": len(courses),
            "courses": [{"id": c.id, "name": c.name, "code": c.code} for c in courses],
            "total_students": total_students,
        })
    return overview
