from fastapi import APIRouter, HTTPException
from typing import List
import uuid

from ...models.faculty import Faculty


router = APIRouter(prefix="/api/faculty", tags=["faculty"])


faculty_db: dict[str, Faculty] = {}


@router.get("/", response_model=List[Faculty])
def list_faculty():
    return list(faculty_db.values())


@router.post("/", response_model=Faculty)
def create_faculty(payload: Faculty):
    if not payload.id:
        payload.id = str(uuid.uuid4())
    faculty_db[payload.id] = payload
    return payload


@router.get("/{faculty_id}", response_model=Faculty)
def get_faculty(faculty_id: str):
    if faculty_id not in faculty_db:
        raise HTTPException(status_code=404, detail="Faculty not found")
    return faculty_db[faculty_id]


@router.put("/{faculty_id}", response_model=Faculty)
def update_faculty(faculty_id: str, payload: Faculty):
    if faculty_id not in faculty_db:
        raise HTTPException(status_code=404, detail="Faculty not found")
    faculty_db[faculty_id] = payload
    return payload


@router.delete("/{faculty_id}")
def delete_faculty(faculty_id: str):
    if faculty_id not in faculty_db:
        raise HTTPException(status_code=404, detail="Faculty not found")
    del faculty_db[faculty_id]
    return {"ok": True}
