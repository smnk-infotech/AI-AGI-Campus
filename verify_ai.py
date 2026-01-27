import requests
import json
import os

BASE_URL = "http://localhost:8001/api"

def test_chat():
    print("--- TESTING /api/ai/chat (Admin/General) ---")
    payload = {
        "prompt": "Hello, are you online?",
        "context": "You are a system check bot."
    }
    try:
        res = requests.post(f"{BASE_URL}/ai/chat", json=payload)
        if res.status_code == 200:
            data = res.json()
            print(f"[SUCCESS] Status 200. Model: {data.get('model')}")
            print(f"   Reply: {data.get('reply')[:100]}...")
        else:
            print(f"[FAILED] Status: {res.status_code} - {res.text}")
    except Exception as e:
        print(f"[ERROR] {e}")

def test_messages():
    print("\n--- TESTING /api/ai/messages (Student) ---")
    payload = {
        "messages": [
            {"role": "user", "content": "Help me study Physics."}
        ]
    }
    try:
        res = requests.post(f"{BASE_URL}/ai/messages", json=payload)
        if res.status_code == 200:
            data = res.json()
            print(f"[SUCCESS] Status 200. Model: {data.get('model')}")
            print(f"   Reply: {data.get('reply')[:100]}...")
        else:
            print(f"[FAILED] Status {res.status_code} - {res.text}")
    except Exception as e:
        print(f"[ERROR] {e}")

if __name__ == "__main__":
    test_chat()
    test_messages()
