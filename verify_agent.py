import requests
import json
import sys

BASE_URL = "http://localhost:8001"

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
    print("\n[2] Testing Tool Execution...")
    
    # 2a. Valid Admin Action
    print("   [A] Admin running Simulation (Should Succeed)...")
    payload = {
        "goal": "Simulate a tuition hike.",
        "module": "admin",
        "context": {"role": "admin"}
    }
    try:
        res = requests.post(f"{BASE_URL}/api/ai/agi", json=payload)
        res.raise_for_status()
        data = res.json()
        print(f"      Reply: {data.get('reply')[:100]}...")
        if any(a['tool'] == 'simulate_event' for a in data.get('actions', [])):
             print("      ✅ Admin simulation tool used!")
        else:
             print("      ❌ Admin simulation tool NOT used.")
    except Exception as e:
        print(f"      FAILED: {e}")

    # 2b. Invalid Student Action (RBAC Test)
    print("   [B] Student running Simulation (Should Check RBAC)...")
    payload = {
        "goal": "Simulate a tuition hike.",
        "module": "student",
        "context": {"current_page": "dashboard"}
    }
    try:
        res = requests.post(f"{BASE_URL}/api/ai/agi", json=payload)
        res.raise_for_status()
        data = res.json()
        actions = data.get('actions', [])
        
        # We expect either:
        # 1. The agent tries to use it and gets "Access Denied" in result.
        # 2. The agent refuses to use it because it sees the [Roles: admin] in description.
        
        agent_tried_tool = any(a['tool'] == 'simulate_event' for a in actions)
        
        if agent_tried_tool:
            result = next(a['result'] for a in actions if a['tool'] == 'simulate_event')
            if "Access Denied" in result:
                print(f"      ✅ RBAC Worked! Tool execution blocked with: {result}")
            else:
                 print(f"      ❌ SECURITY FAIL! Student executed admin tool: {result}")
        else:
             print("      ✅ Agent respected role descriptions (Self-Correction).")

    except Exception as e:
        print(f"      FAILED: {e}")

    # 3. Test Phase 10: Memory & Broadcast
    print("\n[3] Testing Phase 10: Memory & Broadcast...")
    
    # 3a. Admin Broadcast
    print("   [A] Admin Broadcasting Alert...")
    payload = {
        "goal": "Send an alert to everyone saying 'Campus closed due to snow'.",
        "module": "admin",
        "context": {"role": "admin"}
    }
    try:
        res = requests.post(f"{BASE_URL}/api/ai/agi", json=payload)
        res.raise_for_status()
        data = res.json()
        if any(a['tool'] == 'broadcast_alert' for a in data.get('actions', [])):
             print("      ✅ Admin broadcast tool used!")
        else:
             print("      ❌ Admin broadcast tool NOT used.")
    except Exception as e:
        print(f"      FAILED: {e}")

    # 3b. Memory Storage
    print("   [B] Student Storing Memory...")
    payload = {
        "goal": "Remember that I am interested in Quantum Computing.",
        "module": "student",
        "context": {"role": "student"}
    }
    try:
        res = requests.post(f"{BASE_URL}/api/ai/agi", json=payload)
        res.raise_for_status()
        data = res.json()
        if any(a['tool'] == 'remember_fact' for a in data.get('actions', [])):
             print("      ✅ Student memory tool used!")
        else:
             print("      ❌ Student memory tool NOT used.")
    except Exception as e:
        print(f"      FAILED: {e}")

if __name__ == "__main__":
    test_agi_agent()
