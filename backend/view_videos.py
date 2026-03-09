import requests
import json

# First login to get token
login_url = 'http://127.0.0.1:8000/auth/login'
login_data = {'email': 'test@example.com', 'password': 'pass123'}

print("🔐 Logging in...")
response = requests.post(login_url, json=login_data)
if response.status_code == 200:
    token = response.json()['access_token']
    print("✅ Login successful!\n")
    
    headers = {'Authorization': f'Bearer {token}'}
    
    # Get all courses to find the Full Stack Web Development course
    courses_url = 'http://127.0.0.1:8000/courses/'
    response = requests.get(courses_url, headers=headers)
    
    if response.status_code == 200:
        courses = response.json()
        
        # Find our course
        target_course = None
        for course in courses:
            if course['title'] == 'Full Stack Web Development':
                target_course = course
                break
        
        if target_course:
            print("=" * 80)
            print(f"📖 Course: {target_course['title']}")
            print(f"   Category: {target_course['category']}")
            print(f"   Description: {target_course['description']}")
            print("=" * 80)
            
            # Get modules for this course
            course_id = target_course['id']
            modules_url = f'http://127.0.0.1:8000/modules/course/{course_id}'
            response = requests.get(modules_url, headers=headers)
            
            if response.status_code == 200:
                modules = response.json()
                print(f"\n📹 Total Videos: {len(modules)}\n")
                
                # Print organized content by sections
                current_section = ""
                for module in modules:
                    # Determine section
                    if module['order'] <= 6:
                        section = "HTML & CSS"
                    elif module['order'] <= 13:
                        section = "JavaScript"
                    else:
                        section = "Frontend (React)"
                    
                    if section != current_section:
                        current_section = section
                        print(f"\n{'='*80}")
                        print(f"📚 SECTION: {section}")
                        print(f"{'='*80}\n")
                    
                    print(f"  {module['order']:2d}. 🎬 {module['title']}")
                    print(f"       ⏱️  Duration: {module['duration_minutes']} minutes")
                    print(f"       🔗 Video: {module['content']}")
                    print()
                
                print("=" * 80)
                print("✅ All videos loaded successfully!")
                print("=" * 80)
            else:
                print(f"Error fetching modules: {response.status_code}")
                print(response.text)
        else:
            print("Course 'Full Stack Web Development' not found!")
    else:
        print(f"Error fetching courses: {response.status_code}")
        print(response.text)
else:
    print(f"Login failed: {response.status_code}")
    print(response.text)
