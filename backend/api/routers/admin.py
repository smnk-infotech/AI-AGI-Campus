from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models_db import StudentDB, FacultyDB, EnrollmentDB, AttendanceDB, AssignmentDB, CourseDB

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
