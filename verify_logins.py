
import requests
import json

BASE_URL = "http://127.0.0.1:8000"
AUTH_URL = f"{BASE_URL}/api/auth/token"

creds = [
    ("Student", "24ucy129nandha@kgkite.ac.in", "password"),
    ("Faculty", "Ashvadharsini@kgkite.ac.in", "password"),
    ("Admin", "admin@kgkite.ac.in", "password")
]

print(f"Verifying Auth for {len(creds)} roles at {AUTH_URL}...\n")

for role, email, password in creds:
    try:
        response = requests.post(
            AUTH_URL, 
            data={"username": email, "password": password},
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        if response.status_code == 200:
            token = response.json().get("access_token")
            # Verify /me endpoint
            headers = {"Authorization": f"Bearer {token}"}
            me_res = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
            user_data = me_res.json()
            print(f"[SUCCESS] {role}: Login OK. User: {user_data.get('name')} ({user_data.get('role')})")
        else:
            print(f"[FAILED]  {role}: Status {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"[ERROR]   {role}: {e}")

print("\nVerification Complete.")
