from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from ..database import get_db
from ..models_db import StudentDB, FacultyDB, AdminDB
from ..auth import verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

async def get_curr_user_db(email: str = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check student
    student = db.query(StudentDB).filter(StudentDB.email == email).first()
    if student:
        return {"user": student, "role": "student"}
    
    # Check faculty
    faculty = db.query(FacultyDB).filter(FacultyDB.email == email).first()
    if faculty:
        return {"user": faculty, "role": "faculty"}
        
    # Check admin
    admin = db.query(AdminDB).filter(AdminDB.email == email).first()
    if admin:
        return {"user": admin, "role": "admin"}

    raise HTTPException(status_code=404, detail="User not found")

@router.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # 1. Search StudentDB
    user = db.query(StudentDB).filter(StudentDB.email == form_data.username).first()
    role = "student"
    
    if not user:
        # 2. Search FacultyDB
        user = db.query(FacultyDB).filter(FacultyDB.email == form_data.username).first()
        role = "faculty"
        
    if not user:
        # 3. Search AdminDB
        user = db.query(AdminDB).filter(AdminDB.email == form_data.username).first()
        role = "admin"

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": role, "id": user.id},
        expires_delta=access_token_expires
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "id": user.id,
        "role": role,
        "name": f"{user.first_name} {user.last_name}"
    }

@router.get("/me")
async def read_users_me(current_user_data: dict = Depends(get_curr_user_db)):
    user = current_user_data["user"]
    role = current_user_data["role"]
    
    if role == "student":
        return {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": "student",
            "major": user.major,
            "year": user.year
        }
    elif role == "faculty":
        return {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": "faculty",
            "department": user.department
        }
    elif role == "admin":
        return {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": "admin"
        }
    return {}
