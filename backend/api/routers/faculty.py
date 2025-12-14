from fastapi import APIRouter, HTTPException, Depends
from typing import List
import uuid
from sqlalchemy.orm import Session

from ...models.faculty import Faculty
from ..database import get_db
from ..models_db import FacultyDB, CourseDB, EnrollmentDB

router = APIRouter(prefix="/api/faculty", tags=["faculty"])

@router.get("/{faculty_id}/dashboard")
def get_faculty_dashboard(faculty_id: str, db: Session = Depends(get_db)):
    faculty = db.query(FacultyDB).filter(FacultyDB.id == faculty_id).first()
    if not faculty:
        raise HTTPException(status_code=404, detail="Faculty not found")

    # Metrics
    courses = db.query(CourseDB).filter(CourseDB.faculty_id == faculty_id).all()
    courses_count = len(courses)
    
    students_reached = 0
    for course in courses:
        count = db.query(EnrollmentDB).filter(EnrollmentDB.course_id == course.id).count()
        students_reached += count

    # Mock avg rating
    avg_rating = "4.7 / 5"

    return {
        "stats": [
            { "id": 1, "label": "Courses This Term", "value": str(courses_count), "detail": "Active" },
            { "id": 2, "label": "Students Reached", "value": str(students_reached), "detail": "Total Enrolled" },
            { "id": 3, "label": "Avg. Course Rating", "value": avg_rating, "detail": "Student Feedback" },
            { "id": 4, "label": "Upcoming Advising Sessions", "value": "6", "detail": "This Week" } # Mock
        ],
        "research_highlights": [
            { "id": 1, "title": "AI Ethics Grant", "org": "NSF", "status": "In Review", "amount": "$250K" },
            { "id": 2, "title": "Robotics Journal Submission", "org": "IEEE", "status": "Revisions Due 11/12", "amount": "N/A" }
        ],
        "notifications": [
            "Course evaluations window closes Nov 8.",
            "Upload final project rubric to LMS by Friday.",
            "Submit conference travel receipts for reimbursement."
        ]
    }

@router.get("/", response_model=List[Faculty])
def list_faculty(db: Session = Depends(get_db)):
    # Convert DB objects to Pydantic models manually if needed, or rely on orm_mode
    items = db.query(FacultyDB).all()
    # Simple conversion if names match
    return items

@router.post("/", response_model=Faculty)
def create_faculty(payload: Faculty, db: Session = Depends(get_db)):
    if not payload.id:
        payload.id = str(uuid.uuid4())
    
    db_item = FacultyDB(
        id=payload.id,
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=payload.email,
        department=payload.department
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/{faculty_id}", response_model=Faculty)
def get_faculty(faculty_id: str, db: Session = Depends(get_db)):
    item = db.query(FacultyDB).filter(FacultyDB.id == faculty_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Faculty not found")
    return item

@router.put("/{faculty_id}", response_model=Faculty)
def update_faculty(faculty_id: str, payload: Faculty, db: Session = Depends(get_db)):
    item = db.query(FacultyDB).filter(FacultyDB.id == faculty_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Faculty not found")
    
    item.first_name = payload.first_name
    item.last_name = payload.last_name
    item.email = payload.email
    item.department = payload.department
    
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{faculty_id}")
def delete_faculty(faculty_id: str, db: Session = Depends(get_db)):
    item = db.query(FacultyDB).filter(FacultyDB.id == faculty_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Faculty not found")
    db.delete(item)
    db.commit()
    return {"ok": True}
