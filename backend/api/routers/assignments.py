from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime, timedelta
import uuid

from ...models.assignment import Assignment


router = APIRouter(prefix="/api/assignments", tags=["assignments"])


# In-memory store (id -> Assignment)
assignments_db: dict[str, Assignment] = {}


def seed_assignments():
    if assignments_db:
        return
    now = datetime.utcnow()
    items = [
        Assignment(
            id=str(uuid.uuid4()),
            title="Algebra II Problem Set 4",
            course_id="MATH-201",
            due_date=now + timedelta(days=2),
            description="Complete exercises 5-20 on page 143.",
            total_points=100,
        ),
        Assignment(
            id=str(uuid.uuid4()),
            title="Robotics Lab Report",
            course_id="SCI-210",
            due_date=now + timedelta(days=4),
            description="Document your sensor calibration and line-following results.",
            total_points=50,
        ),
        Assignment(
            id=str(uuid.uuid4()),
            title="Literary Analysis Essay",
            course_id="ENG-150",
            due_date=now + timedelta(days=10),
            description="Analyze themes in the assigned short story.",
            total_points=100,
        ),
    ]
    for a in items:
        assignments_db[a.id] = a


@router.get("/", response_model=List[Assignment])
def list_assignments():
    seed_assignments()
    return list(assignments_db.values())


@router.post("/", response_model=Assignment)
def create_assignment(payload: Assignment):
    assignments_db[payload.id] = payload
    return payload


@router.get("/{assignment_id}", response_model=Assignment)
def get_assignment(assignment_id: str):
    if assignment_id not in assignments_db:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignments_db[assignment_id]


@router.put("/{assignment_id}", response_model=Assignment)
def update_assignment(assignment_id: str, payload: Assignment):
    if assignment_id not in assignments_db:
        raise HTTPException(status_code=404, detail="Assignment not found")
    assignments_db[assignment_id] = payload
    return payload


@router.delete("/{assignment_id}")
def delete_assignment(assignment_id: str):
    if assignment_id not in assignments_db:
        raise HTTPException(status_code=404, detail="Assignment not found")
    del assignments_db[assignment_id]
    return {"ok": True}
