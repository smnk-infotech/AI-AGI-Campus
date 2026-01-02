from fastapi import APIRouter, HTTPException, Depends
from typing import List
import uuid
from sqlalchemy.orm import Session

from ...models.student import Student
from ..database import get_db
from ..models_db import StudentDB, EnrollmentDB, CourseDB, AssignmentDB, AttendanceDB

router = APIRouter(prefix="/api/students", tags=["students"])

@router.get("/{student_id}/dashboard")
def get_student_dashboard(student_id: str, db: Session = Depends(get_db)):
    student = db.query(StudentDB).filter(StudentDB.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Get enrolled courses for schedule
    enrollments = db.query(EnrollmentDB).filter(EnrollmentDB.student_id == student_id).all()
    courses_ids = [e.course_id for e in enrollments]
    courses = db.query(CourseDB).filter(CourseDB.id.in_(courses_ids)).all()

    # 1. Schedule Logic
    schedule = []
    total_credits = 0
    gpa_sum = 0.0
    graded_count = 0
    
    # Map courses
    course_map = {c.id: c for c in courses}
    
    for idx, e in enumerate(enrollments):
        c = course_map.get(e.course_id)
        if c:
            # Schedule
            schedule.append({
                "id": c.id,
                "subject": c.name,
                "time": c.schedule or "TBD",
                "location": c.location or "TBD"
            })
            # Credits
            total_credits += (c.credits or 0)
            
            # GPA
            if e.grade:
                try:
                    gpa_val = float(e.grade)
                    gpa_sum += gpa_val
                    graded_count += 1
                except:
                    pass

    # 2. Stats Calculation
    gpa = round(gpa_sum / graded_count, 2) if graded_count > 0 else 0.0
    
    # Attendance
    total_att = db.query(AttendanceDB).filter(AttendanceDB.student_id == student_id).count()
    present_att = db.query(AttendanceDB).filter(AttendanceDB.student_id == student_id, AttendanceDB.status == "Present").count()
    att_rate = int((present_att / total_att * 100)) if total_att > 0 else 100

    # 3. Alerts (Assignments)
    alerts = []
    # due_soon = db.query(AssignmentDB).filter(AssignmentDB.course_id.in_(courses_ids)).limit(2).all() # Simple logic
    # Using python filtering for simplicity on small datasets
    all_assignments = db.query(AssignmentDB).filter(AssignmentDB.course_id.in_(courses_ids)).all()
    for a in all_assignments:
        alerts.append({ "id": a.id, "title": f"Due: {a.title}", "type": "Assignment" })
        
    if not alerts:
        alerts.append({ "id": "welcome", "title": "Welcome to the new term!", "type": "General" })

    return {
        "stats": [
            { "id": 1, "label": 'GPA', "value": str(gpa), "detail": 'Calculated' },
            { "id": 2, "label": 'Attendance', "value": f"{att_rate}%", "detail": f"{total_att} sessions" },
            { "id": 3, "label": 'Credits', "value": str(total_credits), "detail": f'{len(courses)} courses' }
        ],
        "schedule": schedule,
        "alerts": alerts[:4]
    }

@router.get("/", response_model=List[Student])
def list_students(db: Session = Depends(get_db)):
    students = db.query(StudentDB).all()
    # Map DB objects to Pydantic models implies strict mapping, or ConfigDict logic. 
    # Since Pydantic V2 config allows from_attributes=True (orm_mode), let's ensure models support it.
    # For now, explicit conversion if needed, but fastapi can handle ORM objects if response_model is correct and config set.
    return students

@router.post("/", response_model=Student)
def create_student(payload: Student, db: Session = Depends(get_db)):
    if not payload.id:
        payload.id = str(uuid.uuid4())
    
    # Check if exists
    existing = db.query(StudentDB).filter(StudentDB.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Student with this email already exists")

    db_student = StudentDB(
        id=payload.id,
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=payload.email,
        major=payload.major,
        year=payload.year
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

@router.get("/{student_id}", response_model=Student)
def get_student(student_id: str, db: Session = Depends(get_db)):
    student = db.query(StudentDB).filter(StudentDB.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.put("/{student_id}", response_model=Student)
def update_student(student_id: str, payload: Student, db: Session = Depends(get_db)):
    item = db.query(StudentDB).filter(StudentDB.id == student_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Student not found")
    
    item.first_name = payload.first_name
    item.last_name = payload.last_name
    item.email = payload.email
    item.major = payload.major
    item.year = payload.year
    
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{student_id}")
def delete_student(student_id: str, db: Session = Depends(get_db)):
    item = db.query(StudentDB).filter(StudentDB.id == student_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(item)
    db.commit()
    return {"ok": True}
