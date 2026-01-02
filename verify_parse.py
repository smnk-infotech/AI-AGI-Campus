import requests
import json

BASE_URL = "http://localhost:8000/api"

def login(email, password):
    res = requests.post(f"{BASE_URL}/auth/token", data={
        "username": email, "password": password
    })
    if res.status_code != 200:
        return None
    return res.json()["access_token"]

def simulate_parsing():
    print("--- PARSING SIMULATION ---")
    
    token = login("aarav.kumar@student.edu", "password123")
    sid = "53576fbc-5bde-46ac-b4d7-48eeed9b5f126"
    
    res = requests.get(f"{BASE_URL}/students/{sid}/dashboard", headers={"Authorization": f"Bearer {token}"})
    data = res.json()
    courses = data.get("schedule", [])
    
    print(f"Raw API Data: {len(courses)} items")
    
    days_map = { 'Mon': 'Monday', 'Tue': 'Tuesday', 'Wed': 'Wednesday', 'Thu': 'Thursday', 'Fri': 'Friday' }
    week = { 'Monday': [], 'Tuesday': [], 'Wednesday': [], 'Thursday': [], 'Friday': [] }
    
    for c in courses:
        time_str = c.get('time', 'TBD')
        print(f"Processing: {c.get('subject')} | Time: '{time_str}'")
        
        if not time_str or time_str == 'TBD':
            print("  -> SKIP (TBD)")
            continue
            
        parts = time_str.split(' ')
        if len(parts) < 2:
            print("  -> SKIP (Format)")
            continue
            
        days_part = parts[0]
        time_part = " ".join(parts[1:])
        
        days = days_part.split('/')
        for d in days:
            clean_d = d.strip()
            full_day = days_map.get(clean_d)
            if full_day:
                week[full_day].append(f"{c.get('subject')} at {time_part}")
                print(f"  -> Mapped '{clean_d}' to {full_day}")
            else:
                print(f"  -> FAIL Map '{clean_d}'")

    print("\nFinal Week:")
    print(json.dumps(week, indent=2))

if __name__ == "__main__":
    simulate_parsing()
