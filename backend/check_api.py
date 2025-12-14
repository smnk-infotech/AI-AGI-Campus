import sys
import os
from fastapi.testclient import TestClient

sys.path.append(os.getcwd())
from backend.api.main import app

client = TestClient(app)

def test_api():
    print("Testing API...")
    
    # Health
    res = client.get("/health")
    print(f"Health: {res.status_code}")
    assert res.status_code == 200

    # Login (Student)
    res = client.post("/api/auth/token", data={"username": "aarav.kumar@student.edu", "password": "password123"})
    print(f"Login Student: {res.status_code}")
    if res.status_code == 200:
        token = res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Me
        me = client.get("/api/auth/me", headers=headers)
        print(f"Me: {me.status_code} - {me.json().get('role')}")
        
        # Dashboard
        if me.status_code == 200:
            sid = me.json()["id"]
            dash = client.get(f"/api/students/{sid}/dashboard", headers=headers)
            print(f"Dashboard: {dash.status_code}")
    
    print("API Test Complete")

if __name__ == "__main__":
    try:
        test_api()
    except Exception as e:
        print(f"Test Error: {e}")
