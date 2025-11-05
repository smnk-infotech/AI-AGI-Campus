from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
import uuid

class Assignment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    title: str
    course_id: str # Foreign key to Course model
    due_date: datetime
    description: Optional[str] = None
    total_points: int = 100

    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "title": "Problem Set 1",
                "course_id": "some-course-uuid",
                "due_date": "2025-11-20T23:59:59Z",
                "description": "Solve the first 5 problems in the textbook.",
                "total_points": 100,
            }
        },
    )
