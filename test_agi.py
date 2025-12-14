import requests
import json

BASE_URL = "http://localhost:8000/api/ai/agi"

def test_agi(role, goal, user_id):
    print(f"\n--- Testing {role.upper()} ---")
    payload = {
        "goal": goal,
        "module": role,
        "context": {},
        "user_id": user_id
    }
    try:
        res = requests.post(BASE_URL, json=payload)
        res.raise_for_status()
        data = res.json()
        print("Status: Success")
        print(f"Decision: {data.get('decision')}")
        print(f"Analysis: {data.get('analysis')[:100]}...")
        print(f"Explanation: {data.get('explanation')}")
        print(f"Confidence: {data.get('confidence')}%")
    except Exception as e:
        print(f"Failed: {e}")
        try:
            print(res.text)
        except:
            pass

test_agi("student", "Help me study", "53576fbc-5bde-46ac-b4d7-48eeed9b5f126")
test_agi("faculty", "Reduce faculty workload", "fac-001")
test_agi("admin", "Optimize campus budget", "admin-global")
