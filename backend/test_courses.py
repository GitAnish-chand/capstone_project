import requests
import json

# First login to get token
login_url = 'http://127.0.0.1:8000/auth/login'
login_data = {'email': 'test@example.com', 'password': 'pass123'}

print("🔐 Logging in...")
response = requests.post(login_url, json=login_data)
if response.status_code == 200:
    token = response.json()['access_token']
    print("✅ Login successful!")
    
    headers = {'Authorization': f'Bearer {token}'}
    
    # Get courses
    print("\n📚 Fetching courses...")
    courses_url = 'http://127.0.0.1:8000/courses/'
    response = requests.get(courses_url, headers=headers)
    
    if response.status_code == 200:
        courses = response.json()
        print(f"Found {len(courses)} course(s)\n")
        
        for course in courses:
            print("=" * 60)
            print(f"📖 Course: {course['title']}")
            print(f"   Category: {course['category']}")
            print(f"   Description: {course['description']}")
            print(f"   Active: {'Yes' if course['is_active'] else 'No'}")
            print(f"   Created: {course['created_at']}")
            print("=" * 60)
    else:
        print(f"Error fetching courses: {response.status_code}")
        print(response.text)
else:
    print(f"Login failed: {response.status_code}")
    print(response.text)
