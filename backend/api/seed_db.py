from backend.api.database import SessionLocal, engine, Base
from backend.api.models_db import StudentDB, FacultyDB, AdminDB, CourseDB, EnrollmentDB, AssignmentDB
from backend.api.auth import get_password_hash
import uuid

def seed():
    # Re-create tables to support schema changes (SQLite MVP approach)
    print("Dropping and creating tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if we already have students
    if db.query(StudentDB).first():
        print("Database already seeded.")
        return

    sample_student = StudentDB(
        id="53576fbc-5bde-46ac-b4d7-48eeed9b5f126", # Fixed ID for Frontend compatibility
        first_name="Aarav",
        last_name="Kumar",
        email="aarav.kumar@student.edu",
        major="Robotics",
        year=8,
        hashed_password=get_password_hash("password123")
    )
    
    db.add(sample_student)
    
    # Faculty
    faculty_user = FacultyDB(
        id="fac-001",
        first_name="Dr. Gupta",
        last_name="(Faculty)",
        email="dr.gupta@faculty.edu",
        department="Computer Science",
        hashed_password=get_password_hash("password123")
    )
    db.add(faculty_user)
    
    # Admin
    admin_user = AdminDB(
        id="adm-001",
        first_name="Campus",
        last_name="Admin",
        email="admin@campus.edu",
        hashed_password=get_password_hash("admin123")
    )
    db.add(admin_user)
    
    # ------------------ NEW CONTEXT ------------------
    # Create Course
    course = CourseDB(
        id=str(uuid.uuid4()),
        name="Artificial Intelligence 101",
        description="Intro to AI",
        faculty_id=faculty_user.id
    )
    db.add(course)

    # Enroll Student
    enrollment = EnrollmentDB(
        id=str(uuid.uuid4()),
        student_id=sample_student.id,
        course_id=course.id
    )
    db.add(enrollment)
    
    # Create Mock Assignments
    a1 = AssignmentDB(
        id=str(uuid.uuid4()),
        title="AI History Essay",
        description="Write about Turing.",
        due_date="2025-12-20",
        course_id=course.id
    )
    a2 = AssignmentDB(
        id=str(uuid.uuid4()),
        title="Neural Net Lab",
        description="Build a perceptron.",
        due_date="2025-12-25",
        course_id=course.id
    )
    db.add(a1)
    db.add(a2)

    db.commit()
    print(f"Seeded student: {sample_student.first_name} {sample_student.last_name} (ID: {sample_student.id})")
    print(f"Seeded faculty: {faculty_user.first_name} {faculty_user.last_name}")
    print(f"Seeded admin:   {admin_user.first_name} {admin_user.last_name}")
    
    print("\n--- Credentials ---")
    print("Student: aarav.kumar@student.edu / password123")
    print("Faculty: dr.gupta@faculty.edu / password123")
    print("Admin:   admin@campus.edu / admin123")
    
    db.close()

if __name__ == "__main__":
    seed()
