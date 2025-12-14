import sys
import os
from sqlalchemy import text

sys.path.append(os.getcwd())
from backend.api.database import SessionLocal

def check_db():
    print("Checking DB connection...")
    try:
        db = SessionLocal()
        result = db.execute(text("SELECT 1"))
        print(f"DB Connection OK: {result.fetchone()}")
        db.close()
    except Exception as e:
        print(f"DB Error: {e}")

if __name__ == "__main__":
    check_db()
