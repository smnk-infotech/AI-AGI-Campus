from fastapi import APIRouter, HTTPException, Depends
from typing import List
import uuid
import json
from sqlalchemy.orm import Session
from datetime import datetime

from ...models.assignment import Assignment
from ..database import get_db
from ..models_db import AssignmentDB

router = APIRouter(prefix="/api/assignments", tags=["assignments"])

@router.get("/", response_model=List[Assignment])
def list_assignments(db: Session = Depends(get_db)):
    items = db.query(AssignmentDB).all()
    return [_assignment_db_to_model(item) for item in items]

def _assignment_db_to_model(db_item: AssignmentDB) -> Assignment:
    """Convert AssignmentDB to Assignment model, parsing JSON fields."""
    return Assignment(
        id=db_item.id,
        title=db_item.title,
        course_id=db_item.course_id,
        due_date=db_item.due_date if isinstance(db_item.due_date, datetime) else datetime.fromisoformat(db_item.due_date),
        description=db_item.description,
        total_points=db_item.total_points,
        rubric_criteria=json.loads(db_item.rubric_criteria) if db_item.rubric_criteria else None,
        point_allocations=json.loads(db_item.point_allocations) if db_item.point_allocations else None,
        grading_scale=json.loads(db_item.grading_scale) if db_item.grading_scale else None
    )

@router.post("/", response_model=Assignment)
def create_assignment(payload: Assignment, db: Session = Depends(get_db)):
    if not payload.id:
        payload.id = str(uuid.uuid4())
    
    # Convert payload.due_date (datetime) to string
    due_str = payload.due_date.isoformat() if isinstance(payload.due_date, datetime) else str(payload.due_date)

    db_item = AssignmentDB(
        id=payload.id,
        title=payload.title,
        course_id=payload.course_id,
        due_date=due_str,
        description=payload.description,
        total_points=payload.total_points,
        rubric_criteria=json.dumps(payload.rubric_criteria) if payload.rubric_criteria else None,
        point_allocations=json.dumps(payload.point_allocations) if payload.point_allocations else None,
        grading_scale=json.dumps(payload.grading_scale) if payload.grading_scale else None
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return _assignment_db_to_model(db_item)

@router.delete("/{assignment_id}")
def delete_assignment(assignment_id: str, db: Session = Depends(get_db)):
    item = db.query(AssignmentDB).filter(AssignmentDB.id == assignment_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Assignment not found")
    db.delete(item)
    db.commit()
    return {"ok": True}
