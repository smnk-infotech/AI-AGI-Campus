import requests
import json
import sys

BASE_URL = "http://localhost:8000"

def test_agi_agent():
    print(f"Testing AGI Agent at {BASE_URL}...")
    
    # 1. Test Simple Chat (No Tool)
    print("\n[1] Testing Simple Reasoning (No Tool Needed)...")
    payload = {
        "goal": "Explain what ID means.",
        "module": "student",
        "context": {"current_page": "dashboard"}
    }
    try:
        res = requests.post(f"{BASE_URL}/api/ai/agi", json=payload)
        res.raise_for_status()
        data = res.json()
        print(f"Reply: {data.get('reply')[:100]}...")
        print(f"Actions: {data.get('actions')}")
    except Exception as e:
        print(f"FAILED: {e}")

    # 2. Test Tool Execution (Mock Context)
    print("\n[2] Testing Tool Execution (Check Attendance)...")
    payload = {
        "goal": "What is the global attendance rate?",
        "module": "admin",
        "context": {"role": "admin"}
    }
    try:
        res = requests.post(f"{BASE_URL}/api/ai/agi", json=payload)
        res.raise_for_status()
        data = res.json()
        print(f"Reply: {data.get('reply')}")
        actions = data.get('actions', [])
        if actions:
            print("✅ Agent used tools!")
            for a in actions:
                print(f"   - Tool: {a['tool']}")
                print(f"   - Result: {a['result']}")
        else:
            print("❌ Agent did NOT use tools (Expected 'check_attendance_stats').")
            
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    test_agi_agent()
