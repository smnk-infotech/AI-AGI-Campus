
import os

TARGET_DIR = "frontend"
OLD_PORTS = ["localhost:8000", "127.0.0.1:8000"]
NEW_PORT = "8001"

def update_file(filepath):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        new_content = content
        for old in OLD_PORTS:
            new_part = old.replace("8000", NEW_PORT)
            new_content = new_content.replace(old, new_part)
        
        if content != new_content:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"[UPDATED] {filepath}")
        else:
            # print(f"[SKIPPED] {filepath}")
            pass
            
    except Exception as e:
        print(f"[ERROR] {filepath}: {e}")

def main():
    print(f"Scanning {TARGET_DIR} to update ports to {NEW_PORT}...")
    for root, dirs, files in os.walk(TARGET_DIR):
        for file in files:
            if file.endswith((".js", ".jsx", ".ts", ".tsx")):
                update_file(os.path.join(root, file))
    print("Done.")

if __name__ == "__main__":
    main()
