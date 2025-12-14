from fastapi import APIRouter, HTTPException, Depends
from typing import List
from pydantic import BaseModel
import uuid
from sqlalchemy.orm import Session
from datetime import datetime

from ..database import get_db
from ..models_db import CourseDB, EnrollmentDB

router = APIRouter(prefix="/api/courses", tags=["courses"])

class CourseCreate(BaseModel):
    name: str
    code: str
    description: str | None = None
    schedule: str | None = None
    faculty_id: str | None = None

class EnrollmentCreate(BaseModel):
    student_id: str

@router.get("/", response_model=List[dict])
def list_courses(db: Session = Depends(get_db)):
    # Simple list, could add response_model schema later
    return db.query(CourseDB).all()

@router.post("/")
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    db_course = CourseDB(
        id=str(uuid.uuid4()),
        name=course.name,
        code=course.code,
        description=course.description,
        schedule=course.schedule,
        faculty_id=course.faculty_id
    )
    db.add(db_course)
    db.commit()
    return db_course

@router.post("/{course_id}/enroll")
def enroll_student(course_id: str, payload: EnrollmentCreate, db: Session = Depends(get_db)):
    # Check if exists
    exists = db.query(EnrollmentDB).filter(
        EnrollmentDB.course_id == course_id,
        EnrollmentDB.student_id == payload.student_id
    ).first()
    
    if exists:
        return {"message": "Already enrolled"}

    enrollment = EnrollmentDB(
        id=str(uuid.uuid4()),
        course_id=course_id,
        student_id=payload.student_id,
        enrollment_date=datetime.utcnow().isoformat()
    )
    db.add(enrollment)
    db.commit()
    return {"message": "Enrolled successfully"}

@router.get("/my/{student_id}")
def my_courses(student_id: str, db: Session = Depends(get_db)):
    # Join enrollments and courses
    results = db.query(CourseDB).join(EnrollmentDB, CourseDB.id == EnrollmentDB.course_id)\
                .filter(EnrollmentDB.student_id == student_id).all()
    return results
