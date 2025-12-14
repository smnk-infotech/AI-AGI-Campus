from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
import uuid

class Student(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    first_name: str
    last_name: str
    email: str
    major: Optional[str] = None
    year: Optional[int] = None

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "first_name": "John",
                "last_name": "Doe",
                "email": "john.doe@example.edu",
                "major": "Computer Science",
                "year": 3,
            }
        },
    )
