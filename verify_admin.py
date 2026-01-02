
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def get_token(email, password):
    res = requests.post(f"{BASE_URL}/api/auth/token", data={"username": email, "password": password})
    if res.status_code != 200:
        print(f"LOGIN ERROR for {email}: {res.status_code} - {res.text}")
        return None, None
    return res.json().get("access_token"), res.json().get("id")

try:
    print("Logging in Admin...")
    t_admin, _ = get_token("admin@campus.edu", "admin123")
    if not t_admin: raise Exception("Admin Login Failed")
    
    print("Fetching Admin Dashboard...")
    res = requests.get(f"{BASE_URL}/api/admin/dashboard", headers={"Authorization": f"Bearer {t_admin}"})
    
    if res.status_code == 200:
        data = res.json()
        print("\n--- ADMIN DASHBOARD DATA ---")
        print(json.dumps(data, indent=2))
        
        # Validation Logic
        stats = {s['label']: s['value'] for s in data.get('stats', [])}
        
        # Check Attendance Rate
        att_rate = stats.get('Attendance Rate')
        if att_rate and "%" in att_rate and att_rate != "92%": # 92% was the mock value
             print(f"\n✅ Attendance Rate is Dynamic: {att_rate}")
        elif att_rate == "92%":
             print(f"\n⚠️ Attendance Rate might still be mock (92%) unless coincidence.")
        else:
             print(f"\n❌ Attendance Rate format error: {att_rate}")
             
        # Check Fees
        fees = stats.get('Estimated Fees')
        if fees and "$" in fees and fees != "$18.4k":
            print(f"✅ Fees are Dynamic: {fees}")
        else:
            print(f"⚠️ Fees might be mock: {fees}")
            
        # Check Events
        events = data.get('events', [])
        if events and "Deadline:" in events[0].get('title', ''):
            print(f"✅ Events are Dynamic (Sourced from Assignments)")
        else:
            print(f"⚠️ Events might be static: {events[0].get('title') if events else 'None'}")
            
    else:
        print(f"ERROR: {res.status_code} - {res.text}")

except Exception as e:
    import traceback
    traceback.print_exc()
    print(f"FATAL ERROR: {e}")
