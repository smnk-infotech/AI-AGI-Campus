import requests
import json
import sys

BASE_URL = "http://localhost:8000/api"

def login(email, password):
    res = requests.post(f"{BASE_URL}/auth/token", data={
        "username": email, "password": password
    })
    if res.status_code != 200:
        print(f"Login failed for {email}: {res.text}")
        return None
    return res.json()["access_token"]

def check_schedule():
    print("--- CHECKING SCHEDULE DATA ---")
    
    # 1. Student
    token_stu = login("aarav.kumar@student.edu", "password123")
    if token_stu:
        # Get ID first? No, dashboard endpoint needs ID.
        # But for now we hardcode Aarav ID or fetch me?
        # Let's use ID from seed: 53576fbc-5bde-46ac-b4d7-48eeed9b5f126
        sid = "53576fbc-5bde-46ac-b4d7-48eeed9b5f126"
        res = requests.get(f"{BASE_URL}/students/{sid}/dashboard", headers={"Authorization": f"Bearer {token_stu}"})
        data = res.json()
        print("\n[STUDENT DASHBOARD SCHEDULE]")
        print(json.dumps(data.get("schedule"), indent=2))
        
        # Check if 'time' field exists and has expected format
        sched = data.get("schedule", [])
        if sched and "time" in sched[0] and "location" in sched[0]:
            print("✅ Student Schedule Format OK")
        else:
            print("❌ Student Schedule Format MISSING 'time' or 'location'")

    # 2. Faculty
    token_fac = login("dr.gupta@faculty.edu", "password123")
    if token_fac:
        fid = "fac-001"
        res = requests.get(f"{BASE_URL}/faculty/{fid}/dashboard", headers={"Authorization": f"Bearer {token_fac}"})
        data = res.json()
        print("\n[FACULTY DASHBOARD COURSES]")
        courses = data.get("courses")
        print(json.dumps(courses, indent=2))
        
        if courses and "schedule" in courses[0]:
             print("✅ Faculty Courses Format OK")
        else:
             print("❌ Faculty Courses Format MISSING 'schedule' (Dashboard update failed?)")

if __name__ == "__main__":
    check_schedule()
