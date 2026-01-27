
import requests
import json
import uuid

BASE_URL = "http://127.0.0.1:8001"

def get_token(email, password):
    res = requests.post(f"{BASE_URL}/api/auth/token", data={"username": email, "password": password})
    if res.status_code == 200:
        return res.json()["access_token"]
    raise Exception(f"Login failed for {email}: {res.text}")

print("starting logic check...")

# 1. Faculty: Create Course
try:
    fac_token = get_token("dr.gupta@faculty.edu", "password123")
    headers = {"Authorization": f"Bearer {fac_token}"}
    
    course_name = f"Advanced AI {uuid.uuid4().hex[:4]}"
    course_data = {
        "name": course_name,
        "description": "Deep dive into AGI",
        "department": "Computer Science",
        "schedule": "Mon-Wed 10am",
        "code": f"AI-{uuid.uuid4().hex[:4].upper()}"
    }
    
    # Create
    res = requests.post(f"{BASE_URL}/api/courses/", json=course_data, headers=headers)
    if res.status_code in [200, 201]:
        print(f"[SUCCESS] Faculty created course: ' {course_name}'")
        new_course = res.json()
        
        # Verify it lists
        list_res = requests.get(f"{BASE_URL}/api/courses/", headers=headers)
        if any(c['name'] == course_name for c in list_res.json()):
             print(f"[SUCCESS] Course '{course_name}' appears in list.")
        else:
             print(f"[FAILED] Created course not found in list.")
    else:
        print(f"[FAILED] Create Course: {res.status_code} - {res.text}")

except Exception as e:
    print(f"[ERROR] Faculty Logic: {e}")

# 2. Admin: Check Stats
try:
    admin_token = get_token("admin@campus.edu", "admin123")
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    res = requests.get(f"{BASE_URL}/api/admin/dashboard", headers=headers)
    if res.status_code == 200:
        stats = res.json()
        print(f"[SUCCESS] Admin Stats: {json.dumps(stats, indent=2)}")
    else:
        print(f"[FAILED] Admin Stats: {res.status_code} - {res.text}")

except Exception as e:
    print(f"[ERROR] Admin Logic: {e}")

print("Logic check complete.")
