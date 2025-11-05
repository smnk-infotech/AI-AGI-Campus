from fastapi import APIRouter, HTTPException
from typing import List
import uuid

from ...models.course import Course


router = APIRouter(prefix="/api/courses", tags=["courses"])


courses_db: dict[str, Course] = {}


@router.get("/", response_model=List[Course])
def list_courses():
    return list(courses_db.values())


@router.post("/", response_model=Course)
def create_course(payload: Course):
    if not payload.id:
        payload.id = str(uuid.uuid4())
    courses_db[payload.id] = payload
    return payload


@router.get("/{course_id}", response_model=Course)
def get_course(course_id: str):
    if course_id not in courses_db:
        raise HTTPException(status_code=404, detail="Course not found")
    return courses_db[course_id]


@router.put("/{course_id}", response_model=Course)
def update_course(course_id: str, payload: Course):
    if course_id not in courses_db:
        raise HTTPException(status_code=404, detail="Course not found")
    courses_db[course_id] = payload
    return payload


@router.delete("/{course_id}")
def delete_course(course_id: str):
    if course_id not in courses_db:
        raise HTTPException(status_code=404, detail="Course not found")
    del courses_db[course_id]
    return {"ok": True}
