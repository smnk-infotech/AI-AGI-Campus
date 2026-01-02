
import os
from pathlib import Path
from dotenv import load_dotenv

env_path = Path('backend/api/.env')
print(f"Checking {env_path.absolute()}")
load_dotenv(dotenv_path=env_path)

key = os.environ.get("GOOGLE_API_KEY")
if key:
    print(f"GOOGLE_API_KEY found (Length: {len(key)})")
else:
    print("GOOGLE_API_KEY NOT found")
