from backend.api.database import SessionLocal, engine, Base
from backend.api.models_db import StudentDB, FacultyDB, AdminDB, CourseDB, AssignmentDB, EnrollmentDB, AttendanceDB
from backend.api.auth import get_password_hash
import uuid
from datetime import datetime

def seed_data():
    db = SessionLocal()
    
    # 1. Clear existing data (optional, but good for reset)
    print("Clearing old data...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    # 2. Create Users
    print("Creating Users...")
    
    # Student (User Request: 24ucy129nandha@kgkite.ac.in)
    student = StudentDB(
        id=str(uuid.uuid4()),
        first_name="Nandha",
        last_name="Kumar",
        email="24ucy129nandha@kgkite.ac.in",
        hashed_password=get_password_hash("password"), # Keeping simple default
        major="Artificial Intelligence",
        year=2
    )
    db.add(student)

    # Faculty
    faculty = FacultyDB(
        id=str(uuid.uuid4()),
        first_name="Dr. Ashvadharsini S",
        last_name="",
        email="Ashvadharsini@kgkite.ac.in",
        hashed_password=get_password_hash("password"),
        department="Computer Science"
    )
    db.add(faculty)

    # Admin
    admin = AdminDB(
        id=str(uuid.uuid4()),
        first_name="Admin",
        last_name="User",
        email="admin@kgkite.ac.in",
        hashed_password=get_password_hash("password")
    )
    db.add(admin)

    # 3. Create Course & Enrollment
    course = CourseDB(
        id=str(uuid.uuid4()),
        name="Intro to AGI",
        code="AGI101",
        description="Foundations of Artificial General Intelligence",
        faculty_id=faculty.id,
        schedule="Mon/Wed 10:00 AM",
        credits=4,
        location="Lab 304",
        fee=500
    )
    db.add(course)

    enrollment = EnrollmentDB(
        id=str(uuid.uuid4()),
        student_id=student.id,
        course_id=course.id,
        enrollment_date=datetime.now().isoformat(),
        grade="A"
    )
    db.add(enrollment)

    # 4. Assignment
    assign = AssignmentDB(
        id=str(uuid.uuid4()),
        title="Neural Network cleanup",
        course_id=course.id,
        due_date="2025-12-31",
        total_points=100
    )
    db.add(assign)

    db.commit()
    print("✅ Database populated successfully!")
    print(f"Student: 24ucy129nandha@kgkite.ac.in / password")
    print(f"Faculty: faculty@kgkite.ac.in / password")
    print(f"Admin:   admin@kgkite.ac.in / password")
    db.close()

if __name__ == "__main__":
    seed_data()
