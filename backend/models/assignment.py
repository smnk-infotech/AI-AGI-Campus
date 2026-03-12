from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

class RubricCriterion(BaseModel):
    name: str
    points: int
    description: Optional[str] = None

class Assignment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    course_id: str # Foreign key to Course model
    due_date: datetime
    description: Optional[str] = None
    total_points: int = 100
    rubric_criteria: Optional[List[RubricCriterion]] = None  # e.g., [{"name": "Clarity", "points": 20}, ...]
    point_allocations: Optional[Dict[str, int]] = None  # e.g., {"participation": 10, "submission": 60, "quality": 30}
    grading_scale: Optional[Dict[str, float]] = None  # e.g., {"A": 90, "B": 80, "C": 70, "D": 60, "F": 0}

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "title": "Problem Set 1",
                "course_id": "some-course-uuid",
                "due_date": "2025-11-20T23:59:59Z",
                "description": "Solve the first 5 problems in the textbook.",
                "total_points": 100,
                "rubric_criteria": [
                    {"name": "Clarity", "points": 20, "description": "Is the solution clear and well-organized?"},
                    {"name": "Correctness", "points": 60, "description": "Are the answers correct?"},
                    {"name": "Completeness", "points": 20, "description": "Are all parts answered?"}
                ],
                "point_allocations": {"participation": 10, "submission": 60, "quality": 30},
                "grading_scale": {"A": 90, "B": 80, "C": 70, "D": 60, "F": 0}
            }
        },
    )
