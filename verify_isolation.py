
import requests
import json
import uuid

BASE_URL = "http://127.0.0.1:8000"

def get_token(email, password):
    res = requests.post(f"{BASE_URL}/api/auth/token", data={"username": email, "password": password})
    if res.status_code != 200:
        print(f"LOGIN ERROR for {email}: {res.status_code} - {res.text}")
        return None, None
    return res.json().get("access_token"), res.json().get("id")

def get_user_id_from_me(token):
     headers = {"Authorization": f"Bearer {token}"}
     res = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
     return res.json()['id']

print("--- STARTING ISOLATION CHECK ---")

try:
    # 1. Aarav (Student)
    print("Logging in Aarav...")
    t_aarav, id_aarav = get_token("aarav.kumar@student.edu", "password123")
    if not t_aarav: raise Exception("Aarav Login Failed")
    
    print(f"Getting Dashboard for {id_aarav}...")
    res = requests.get(f"{BASE_URL}/api/students/{id_aarav}/dashboard", headers={"Authorization": f"Bearer {t_aarav}"})
    if res.status_code != 200:
        print(f"DASHBOARD ERROR: {res.status_code} - {res.text}")
    else:
        dash_aarav = res.json()
        print(f"\n[AARAV] Stats: {json.dumps(dash_aarav.get('stats'), indent=2)}")
        print(f"[AARAV] Schedule: {[c['subject'] for c in dash_aarav.get('schedule', [])]}")

    # 2. Priya (Student)
    print("\nLogging in Priya...")
    t_priya, id_priya = get_token("priya@student.edu", "password123")
    if not t_priya: raise Exception("Priya Login Failed")

    res = requests.get(f"{BASE_URL}/api/students/{id_priya}/dashboard", headers={"Authorization": f"Bearer {t_priya}"})
    if res.status_code != 200:
        print(f"DASHBOARD ERROR: {res.status_code} - {res.text}")
    else:
        dash_priya = res.json()
        print(f"\n[PRIYA] Stats: {json.dumps(dash_priya.get('stats'), indent=2)}")

    # 3. Dr. Gupta (Faculty)
    print("\nLogging in Gupta...")
    t_gupta, _ = get_token("dr.gupta@faculty.edu", "password123")
    id_gupta = "fac-001"
    
    res = requests.get(f"{BASE_URL}/api/faculty/{id_gupta}/dashboard", headers={"Authorization": f"Bearer {t_gupta}"})
    if res.status_code != 200:
        print(f"DASHBOARD ERROR: {res.status_code} - {res.text}")
    else:
        dash_gupta = res.json()
        print(f"\n[DR. GUPTA] Stats: {json.dumps(dash_gupta.get('stats'), indent=2)}")

    # 4. Prof. Dave (Faculty)
    print("\nLogging in Dave...")
    t_dave, _ = get_token("prof.dave@faculty.edu", "password123")
    id_dave = "fac-002" 
    
    res = requests.get(f"{BASE_URL}/api/faculty/{id_dave}/dashboard", headers={"Authorization": f"Bearer {t_dave}"})
    if res.status_code != 200:
        print(f"DASHBOARD ERROR: {res.status_code} - {res.text}")
    else:
        dash_dave = res.json()
        print(f"\n[PROF. DAVE] Stats: {json.dumps(dash_dave.get('stats'), indent=2)}")

except Exception as e:
    import traceback
    traceback.print_exc()
    print(f"ERROR: {e}")

print("\n--- CHECK COMPLETE ---")
