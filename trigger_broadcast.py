import requests
import json

def trigger_broadcast():
    url = "http://localhost:8001/api/admin/agi/broadcast"
    headers = {"Content-Type": "application/json"}
    payload = {
        "message": "Real-time Broadcast SUCCESS Test!",
        "target_role": "all"
    }
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Failed to trigger broadcast: {e}")

if __name__ == "__main__":
    trigger_broadcast()
