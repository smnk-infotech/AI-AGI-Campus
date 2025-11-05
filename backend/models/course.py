from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
import uuid

class Course(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    name: str
    code: str
    department: str
    credits: int
    description: Optional[str] = None
    faculty_id: str # Foreign key to Faculty model

    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "name": "Introduction to Quantum Mechanics",
                "code": "PHYS-101",
                "department": "Physics",
                "credits": 4,
                "description": "A foundational course on quantum mechanics.",
                "faculty_id": "some-faculty-uuid",
            }
        },
    )
