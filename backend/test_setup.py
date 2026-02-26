"""
Test script to verify the Learning Portal backend setup
Run this after starting the server to ensure everything works
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def print_section(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print('='*60)

def test_health():
    """Test if server is running"""
    print_section("1. Server Health Check")
    try:
        response = requests.get(f"{BASE_URL}/docs")
        if response.status_code == 200:
            print("✅ Server is running!")
            print(f"   Visit {BASE_URL}/docs for API documentation")
            return True
    except Exception as e:
        print(f"❌ Server not running. Error: {e}")
        print("   Start server with: uvicorn app.main:app --reload")
        return False

def test_register():
    """Test user registration"""
    print_section("2. User Registration")
    
    # Register employee
    employee_data = {
        "email": "test_employee@company.com",
        "password": "password123",
        "full_name": "Test Employee"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=employee_data)
    if response.status_code in [200, 400]:  # 400 if already exists
        print("✅ Employee registration endpoint working")
        if response.status_code == 400:
            print("   (User already exists)")
    else:
        print(f"❌ Registration failed: {response.text}")
        return None
    
    # Register admin
    admin_data = {
        "email": "test_admin@company.com",
        "password": "admin123",
        "full_name": "Test Admin"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=admin_data)
    if response.status_code in [200, 400]:
        print("✅ Admin registration endpoint working")
        print("   ⚠️  Remember to manually change role to 'admin' in database")
    
    return True

def test_login():
    """Test login and get token"""
    print_section("3. User Login")
    
    login_data = {
        "email": "test_employee@company.com",
        "password": "password123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    if response.status_code == 200:
        token = response.json().get("access_token")
        print("✅ Login successful!")
        print(f"   Token: {token[:50]}...")
        return token
    else:
        print(f"❌ Login failed: {response.text}")
        return None

def test_protected_routes(token):
    """Test protected routes with authentication"""
    print_section("4. Protected Routes")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test courses endpoint
    response = requests.get(f"{BASE_URL}/courses/", headers=headers)
    if response.status_code == 200:
        print("✅ Courses endpoint accessible")
        print(f"   Found {len(response.json())} courses")
    else:
        print(f"❌ Courses endpoint failed: {response.text}")
    
    # Test enrollments endpoint
    response = requests.get(f"{BASE_URL}/enrollments/", headers=headers)
    if response.status_code == 200:
        print("✅ Enrollments endpoint accessible")
        print(f"   Found {len(response.json())} enrollments")
    else:
        print(f"❌ Enrollments endpoint failed: {response.text}")
    
    # Test chat endpoint
    chat_data = {
        "question": "How do I enroll in a course?",
        "context": "general"
    }
    response = requests.post(f"{BASE_URL}/chat/ask", json=chat_data, headers=headers)
    if response.status_code == 200:
        print("✅ Chat endpoint accessible")
        answer = response.json().get("answer", "")
        print(f"   Answer: {answer[:80]}...")
    else:
        print(f"❌ Chat endpoint failed: {response.text}")

def test_endpoints_without_auth():
    """Test that protected endpoints require authentication"""
    print_section("5. Authentication Required Test")
    
    # Try accessing protected route without token
    response = requests.get(f"{BASE_URL}/courses/")
    if response.status_code == 403 or response.status_code == 401:
        print("✅ Authentication properly required for protected routes")
    else:
        print(f"⚠️  Protected routes might not be secured properly")

def main():
    """Run all tests"""
    print("""
    ╔══════════════════════════════════════════════════════════╗
    ║   Learning Portal Backend - Setup Verification Test      ║
    ╚══════════════════════════════════════════════════════════╝
    """)
    
    # Test 1: Server health
    if not test_health():
        return
    
    # Test 2: Registration
    test_register()
    
    # Test 3: Login
    token = test_login()
    
    # Test 4: Protected routes with auth
    if token:
        test_protected_routes(token)
    
    # Test 5: Auth required
    test_endpoints_without_auth()
    
    # Summary
    print_section("Test Summary")
    print("""
    ✅ If all tests passed, your backend is ready!
    
    Next Steps:
    1. Change test_admin@company.com role to 'admin' in database
    2. Login as admin to create courses
    3. Create modules and quizzes
    4. Test as employee
    
    Documentation:
    - API Docs: http://localhost:8000/docs
    - Overview: See API_OVERVIEW.md
    - Quick Start: See QUICK_START.md
    - Summary: See BUILD_SUMMARY.md
    """)

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n❌ Error running tests: {e}")
        print("   Make sure the server is running: uvicorn app.main:app --reload")
