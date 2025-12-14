from fastapi import APIRouter, HTTPException, Depends
from typing import List
from pydantic import BaseModel
import uuid
from sqlalchemy.orm import Session
from datetime import datetime

from ..database import get_db
from ..models_db import AttendanceDB

router = APIRouter(prefix="/api/attendance", tags=["attendance"])

class AttendanceCreate(BaseModel):
    student_id: str
    status: str = "Present"
    method: str = "FaceRec"

@router.get("/", response_model=List[dict])
def list_attendance(db: Session = Depends(get_db)):
    return db.query(AttendanceDB).all()

@router.post("/")
def mark_attendance(payload: AttendanceCreate, db: Session = Depends(get_db)):
    # Simple logic: One entry per day per student
    today = datetime.now().strftime("%Y-%m-%d")
    
    existing = db.query(AttendanceDB).filter(
        AttendanceDB.student_id == payload.student_id,
        AttendanceDB.date == today
    ).first()

    if existing:
        return {"message": "Attendance already marked for today", "id": existing.id}

    db_item = AttendanceDB(
        id=str(uuid.uuid4()),
        student_id=payload.student_id,
        date=today,
        status=payload.status,
        method=payload.method
    )
    db.add(db_item)
    db.commit()
    return db_item

@router.get("/student/{student_id}")
def student_history(student_id: str, db: Session = Depends(get_db)):
    return db.query(AttendanceDB).filter(AttendanceDB.student_id == student_id).all()
