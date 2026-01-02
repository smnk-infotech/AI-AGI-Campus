from backend.api.database import SessionLocal, engine, Base
from backend.api.models_db import StudentDB, FacultyDB, AdminDB, CourseDB, EnrollmentDB, AssignmentDB, AttendanceDB
from backend.api.auth import get_password_hash
import uuid
import random
from datetime import datetime, timedelta

def seed():
    print("re-creating tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # 1. FACULTY
    # Dr. Gupta (CS)
    fac_gupta = FacultyDB(
        id="fac-001", first_name="Dr. Gupta", last_name="(CS)", email="dr.gupta@faculty.edu", department="Computer Science", hashed_password=get_password_hash("password123")
    )
    # Prof. Dave (Robotics)
    fac_dave = FacultyDB(
        id="fac-002", first_name="Prof. Dave", last_name="(Robotics)", email="prof.dave@faculty.edu", department="Robotics", hashed_password=get_password_hash("password123")
    )
    db.add_all([fac_gupta, fac_dave])
    
    # 2. STUDENTS
    # Aarav (The main demo user)
    s_aarav = StudentDB(
        id="53576fbc-5bde-46ac-b4d7-48eeed9b5f126", first_name="Aarav", last_name="Kumar", email="aarav.kumar@student.edu", major="Robotics", year=8, hashed_password=get_password_hash("password123")
    )
    # Priya (Another student to verify isolation)
    s_priya = StudentDB(
        id="stu-002", first_name="Priya", last_name="Singh", email="priya@student.edu", major="Computer Science", year=8, hashed_password=get_password_hash("password123")
    )
    db.add_all([s_aarav, s_priya])

    # 3. ADMIN
    admin = AdminDB(id="adm-001", first_name="Campus", last_name="Admin", email="admin@campus.edu", hashed_password=get_password_hash("admin123"))
    db.add(admin)
    db.commit()

    # 4. COURSES
    c1 = CourseDB(id=str(uuid.uuid4()), name="Artificial Intelligence 101", code="AI101", faculty_id=fac_gupta.id, schedule="Mon/Wed 10:00 AM", credits=3, location="Lab 304", fee=750)
    c2 = CourseDB(id=str(uuid.uuid4()), name="Robotics Foundations", code="ROB101", faculty_id=fac_dave.id, schedule="Tue/Thu 2:00 PM", credits=4, location="Workshop A", fee=900)
    c3 = CourseDB(id=str(uuid.uuid4()), name="AI Ethics", code="ETH200", faculty_id=fac_gupta.id, schedule="Fri 10:00 AM", credits=2, location="Seminar Hall", fee=400)
    
    db.add_all([c1, c2, c3])
    db.commit()

    # 5. ENROLLMENTS & GRADES
    # Aarav takes AI (A) and Robotics (B+)
    e1 = EnrollmentDB(id=str(uuid.uuid4()), student_id=s_aarav.id, course_id=c1.id, enrollment_date="2025-09-01", grade="4.0")
    e2 = EnrollmentDB(id=str(uuid.uuid4()), student_id=s_aarav.id, course_id=c2.id, enrollment_date="2025-09-01", grade="3.5")
    
    # Priya takes AI (B) and Ethics (A)
    e3 = EnrollmentDB(id=str(uuid.uuid4()), student_id=s_priya.id, course_id=c1.id, enrollment_date="2025-09-01", grade="3.0")
    e4 = EnrollmentDB(id=str(uuid.uuid4()), student_id=s_priya.id, course_id=c3.id, enrollment_date="2025-09-01", grade="4.0")
    
    db.add_all([e1, e2, e3, e4])

    # 6. ASSIGNMENTS (For Alerts)
    # AI Assignment (Due soon)
    a1 = AssignmentDB(id=str(uuid.uuid4()), title="Neural Net Essay", course_id=c1.id, due_date=(datetime.now() + timedelta(days=2)).isoformat(), description="Explain backprop.")
    # Robotics Lab (Due later)
    a2 = AssignmentDB(id=str(uuid.uuid4()), title="Build Servo Arm", course_id=c2.id, due_date=(datetime.now() + timedelta(days=5)).isoformat(), description="Hardware lab.")
    
    db.add_all([a1, a2])

    # 7. ATTENDANCE (Recent 5 days)
    # Aarav: Mostly Present, 1 Late
    dates = [datetime.now() - timedelta(days=i) for i in range(5)]
    for d in dates:
        att = AttendanceDB(id=str(uuid.uuid4()), student_id=s_aarav.id, date=d.strftime("%Y-%m-%d"), status=random.choice(["Present", "Present", "Present", "Late"]), method="Face")
        db.add(att)

    db.commit()
    print("Database seeded with REALISTIC data.")
    print(f"- Students: Aarav ({s_aarav.id}), Priya")
    print(f"- Courses: AI (Gupta), Robotics (Dave), Ethics (Gupta)")
    print(f"- Enrollments: Aarav (AI, Rob), Priya (AI, Eth)")
    db.close()

if __name__ == "__main__":
    seed()
