from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
import uuid

class Faculty(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    first_name: str
    last_name: str
    email: str
    department: str
    title: Optional[str] = "Professor"
    office_location: Optional[str] = None

    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "first_name": "Jane",
                "last_name": "Smith",
                "email": "jane.smith@example.edu",
                "department": "Physics",
                "title": "Associate Professor",
            }
        },
    )
