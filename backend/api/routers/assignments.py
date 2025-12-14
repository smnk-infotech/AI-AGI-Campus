from fastapi import APIRouter, HTTPException, Depends
from typing import List
import uuid
from sqlalchemy.orm import Session
from datetime import datetime

from ...models.assignment import Assignment
from ..database import get_db
from ..models_db import AssignmentDB

router = APIRouter(prefix="/api/assignments", tags=["assignments"])

@router.get("/", response_model=List[Assignment])
def list_assignments(db: Session = Depends(get_db)):
    items = db.query(AssignmentDB).all()
    # Manual mapping if needed, or rely on pydantic
    return items

@router.post("/", response_model=Assignment)
def create_assignment(payload: Assignment, db: Session = Depends(get_db)):
    if not payload.id:
        payload.id = str(uuid.uuid4())
    
    # Store datetime as ISO format string for SQLite if needed, 
    # or rely on SQLAlchemy TypeDecorator. For MVP, string is safest.
    # Convert payload.due_date (datetime) to string
    due_str = payload.due_date.isoformat() if isinstance(payload.due_date, datetime) else str(payload.due_date)

    db_item = AssignmentDB(
        id=payload.id,
        title=payload.title,
        course_id=payload.course_id,
        due_date=due_str,
        description=payload.description,
        total_points=payload.total_points
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{assignment_id}")
def delete_assignment(assignment_id: str, db: Session = Depends(get_db)):
    item = db.query(AssignmentDB).filter(AssignmentDB.id == assignment_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Assignment not found")
    db.delete(item)
    db.commit()
    return {"ok": True}
