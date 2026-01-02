from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class StudentDB(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    major = Column(String, nullable=True)
    year = Column(Integer, nullable=True)
    hashed_password = Column(String, nullable=True) # For auth

class FacultyDB(Base):
    __tablename__ = "faculty"

    id = Column(String, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    department = Column(String, nullable=True)
    hashed_password = Column(String, nullable=True)

class AdminDB(Base):
    __tablename__ = "admins"

    id = Column(String, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=True)

class AssignmentDB(Base):
    __tablename__ = "assignments"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    course_id = Column(String, index=True) # In a real app, ForeignKey("courses.id")
    due_date = Column(String) # Store as ISO string for simplicity in SQLite
    description = Column(String, nullable=True)
    total_points = Column(Integer, default=100)

class CourseDB(Base):
    __tablename__ = "courses"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    code = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)
    faculty_id = Column(String, nullable=True) # ID of faculty teaching it
    schedule = Column(String, nullable=True) # e.g. "Mon/Wed 10am"
    credits = Column(Integer, default=3)
    location = Column(String, default="TBD")
    fee = Column(Integer, default=500)

class EnrollmentDB(Base):
    __tablename__ = "enrollments"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, index=True)
    course_id = Column(String, index=True)
    enrollment_date = Column(String)
    grade = Column(String, nullable=True) # e.g. "A", "B", "95" or float stored as string

class AttendanceDB(Base):
    __tablename__ = "attendance"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, index=True)
    date = Column(String, index=True) # YYYY-MM-DD
    status = Column(String) # Present, Absent, Late
    method = Column(String) # Manual, FaceRec

class AGIMemory(Base):
    __tablename__ = "agi_memory"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)
    role = Column(String, index=True)
    context_type = Column(String) # "conversation", "preference", "fact"
    content = Column(String)
    timestamp = Column(String) # ISO Format

class AGILogs(Base):
    __tablename__ = "agi_logs"

    id = Column(String, primary_key=True, index=True)
    timestamp = Column(String, index=True)
    goal = Column(String)
    context_summary = Column(String)
    analysis = Column(String)
    decision = Column(String)
    explanation = Column(String)
    confidence = Column(Integer) # 0-100
    module = Column(String) # "student", "faculty", "admin"

