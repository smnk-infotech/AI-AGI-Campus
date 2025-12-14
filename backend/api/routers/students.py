from fastapi import APIRouter, HTTPException, Depends
from typing import List
import uuid
from sqlalchemy.orm import Session

from ...models.student import Student
from ..database import get_db
from ..models_db import StudentDB, EnrollmentDB, CourseDB

router = APIRouter(prefix="/api/students", tags=["students"])

@router.get("/{student_id}/dashboard")
def get_student_dashboard(student_id: str, db: Session = Depends(get_db)):
    student = db.query(StudentDB).filter(StudentDB.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Get enrolled courses for schedule
    enrollments = db.query(EnrollmentDB).filter(EnrollmentDB.student_id == student_id).all()
    courses = []
    for enrollment in enrollments:
        course = db.query(CourseDB).filter(CourseDB.id == enrollment.course_id).first()
        if course:
            courses.append(course)

    # Simplified schedule/stats logic for demo
    # In real app, would query specific schedule tables and grade tables
    schedule = []
    for idx, c in enumerate(courses):
        schedule.append({
            "id": c.id,
            "subject": c.name,
            "time": c.schedule, # e.g. "Mon 9:00"
            "location": "Room " + str(100 + idx) # Mock location
        })

    return {
        "stats": [
            { "id": 1, "label": 'GPA', "value": '4.0', "detail": 'Honors Track' }, # Mock
            { "id": 2, "label": 'Attendance', "value": '95%', "detail": 'On Track' }, # Mock
            { "id": 3, "label": 'Credits', "value": str(len(courses) * 3), "detail": f'{len(courses)} courses' }
        ],
        "schedule": schedule,
        "alerts": [
            { "id": 1, "title": 'Welcome back to campus!', "type": 'General' }
        ]
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
