from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models_db import StudentDB, FacultyDB

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/dashboard")
def get_admin_dashboard(db: Session = Depends(get_db)):
    active_students = db.query(StudentDB).count()
    teachers = db.query(FacultyDB).count()
    
    return {
        "stats": [
            { "label": 'Active Students', "value": str(active_students) },
            { "label": 'Teachers', "value": str(teachers) },
            { "label": 'Attendance This Week', "value": '92%' }, # Mock
            { "label": 'Pending Fees', "value": '$18.4k' } # Mock
        ],
        "events": [
            { "title": 'Parent-Teacher Conference', "date": 'Nov 05, 2025', "owner": 'Academic Office' },
            { "title": 'Winter Term Planning', "date": 'Nov 12, 2025', "owner": 'Operations' },
            { "title": 'Audit Submission', "date": 'Nov 28, 2025', "owner": 'Finance' },
        ],
        "alerts": [
            'Bus Route 4 experiencing delays — notify parents',
            '5 teacher contracts expiring this quarter',
            'Server maintenance scheduled on Nov 10, 9PM',
        ]
    }
