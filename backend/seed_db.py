import sys
import os
import uuid

# Ensure backend module is found from project root
sys.path.append(os.getcwd())

from backend.api.database import SessionLocal, engine, Base
from backend.api.models_db import StudentDB, FacultyDB, AdminDB, CourseDB, EnrollmentDB
from backend.api.auth import get_password_hash

def seed():
    print("Seeding database...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Admin
    if not db.query(AdminDB).filter_by(email="admin@campus.edu").first():
        admin = AdminDB(
            id=str(uuid.uuid4()),
            first_name="Admin",
            last_name="User",
            email="admin@campus.edu",
            hashed_password=get_password_hash("password123")
        )
        db.add(admin)
        print("Created Admin user: admin@campus.edu")

    # Faculty
    fac = db.query(FacultyDB).filter_by(email="riley.thompson@faculty.edu").first()
    if not fac:
        fac = FacultyDB(
            id=str(uuid.uuid4()),
            first_name="Riley",
            last_name="Thompson",
            email="riley.thompson@faculty.edu",
            department="Physics & Emerging Robotics",
            hashed_password=get_password_hash("password123")
        )
        db.add(fac)
        db.commit() # Commit to get ID
        db.refresh(fac)
        print("Created Faculty user: riley.thompson@faculty.edu")
    
    # Student
    stu = db.query(StudentDB).filter_by(email="aarav.kumar@student.edu").first()
    if not stu:
        stu = StudentDB(
            id=str(uuid.uuid4()),
            first_name="Aarav",
            last_name="Kumar",
            email="aarav.kumar@student.edu",
            major="Robotics Engineering",
            year=3,
            hashed_password=get_password_hash("password123")
        )
        db.add(stu)
        db.commit()
        db.refresh(stu)
        print("Created Student user: aarav.kumar@student.edu")

    # Courses
    course_list = [
        {"name": "Mathematics · Algebra II", "code": "MATH201", "schedule": "Mon 9:00 - 10:00"},
        {"name": "Science · Robotics Lab", "code": "SCI301", "schedule": "Mon 10:15 - 11:15"},
        {"name": "English · Literature", "code": "ENG102", "schedule": "Mon 11:30 - 12:15"}
    ]

    for c_data in course_list:
        course = db.query(CourseDB).filter_by(code=c_data["code"]).first()
        if not course:
            course = CourseDB(
                id=str(uuid.uuid4()),
                name=c_data["name"],
                code=c_data["code"],
                schedule=c_data["schedule"],
                faculty_id=fac.id if fac else None
            )
            db.add(course)
            db.commit()
            db.refresh(course)
            print(f"Created Course: {course.name}")
        
        # Enroll student
        if stu:
            enroll = db.query(EnrollmentDB).filter_by(student_id=stu.id, course_id=course.id).first()
            if not enroll:
                enroll = EnrollmentDB(
                    id=str(uuid.uuid4()),
                    student_id=stu.id,
                    course_id=course.id,
                    enrollment_date="2025-01-01"
                )
                db.add(enroll)
                print(f"Enrolled student in {course.name}")

    db.commit()
    db.close()
    print("Seeding complete.")

if __name__ == "__main__":
    seed()
