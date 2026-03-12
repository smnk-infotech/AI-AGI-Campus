import requests
import uuid

BASE_URL = "http://localhost:8001"

def test_manual_student_and_attendance():
    # 1. Add Student
    student_id = str(uuid.uuid4())
    payload = {
        "id": student_id,
        "first_name": "Test",
        "last_name": "Student",
        "email": f"test.{uuid.uuid4().hex[:4]}@example.com",
        "major": "Computer Science",
        "year": 1
    }
    print(f"Adding student: {payload['email']}...")
    res = requests.post(f"{BASE_URL}/api/students/", json=payload)
    if res.status_code == 200:
        print("Student added successfully.")
    else:
        print(f"Failed to add student: {res.text}")
        return

    # 2. Mark Attendance (Manual)
    att_payload = {
        "student_id": student_id,
        "status": "Present",
        "method": "Manual"
    }
    print(f"Marking manual attendance for {student_id}...")
    res = requests.post(f"{BASE_URL}/api/attendance/", json=att_payload)
    if res.status_code == 200:
        print("Attendance marked successfully.")
    else:
        print(f"Failed to mark attendance: {res.text}")

if __name__ == "__main__":
    test_manual_student_and_attendance()
