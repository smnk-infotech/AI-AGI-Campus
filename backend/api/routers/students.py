from fastapi import APIRouter, HTTPException
from typing import List
import uuid

from ...models.student import Student


router = APIRouter(prefix="/api/students", tags=["students"])


students_db: dict[str, Student] = {}


@router.get("/", response_model=List[Student])
def list_students():
    return list(students_db.values())


@router.post("/", response_model=Student)
def create_student(payload: Student):
    if not payload.id:
        payload.id = str(uuid.uuid4())
    students_db[payload.id] = payload
    return payload


@router.get("/{student_id}", response_model=Student)
def get_student(student_id: str):
    if student_id not in students_db:
        raise HTTPException(status_code=404, detail="Student not found")
    return students_db[student_id]


@router.put("/{student_id}", response_model=Student)
def update_student(student_id: str, payload: Student):
    if student_id not in students_db:
        raise HTTPException(status_code=404, detail="Student not found")
    students_db[student_id] = payload
    return payload


@router.delete("/{student_id}")
def delete_student(student_id: str):
    if student_id not in students_db:
        raise HTTPException(status_code=404, detail="Student not found")
    del students_db[student_id]
    return {"ok": True}
