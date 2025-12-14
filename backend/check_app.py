import sys
import os

sys.path.append(os.getcwd())

try:
    from backend.api.main import app
    print("Import main OK")
except Exception as e:
    print(f"Import Error: {e}")
