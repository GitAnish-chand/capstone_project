"""
Quick test to verify login functionality
Run this after starting the backend server
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_register():
    """Test user registration"""
    print("\n=== Testing Registration ===")
    data = {
        "email": "test@example.com",
        "password": "test123456",
        "full_name": "Test User"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code in [200, 400]  # 400 if user exists
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_login():
    """Test user login"""
    print("\n=== Testing Login ===")
    data = {
        "email": "test@example.com",
        "password": "test123456"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=data)
        print(f"Status Code: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if response.status_code == 200 and "access_token" in result:
            print("✅ Login successful!")
            print(f"Token: {result['access_token'][:50]}...")
            return True
        else:
            print("❌ Login failed!")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_protected_route(token):
    """Test accessing protected route with token"""
    print("\n=== Testing Protected Route ===")
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.get(f"{BASE_URL}/courses/", headers=headers)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("✅ Protected route accessible!")
            return True
        else:
            print(f"❌ Failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("  Learning Portal - Login Test")
    print("=" * 50)
    print("\n⚠️  Make sure backend is running on http://localhost:8000")
    input("Press Enter to start tests...")
    
    # Test 1: Register
    if test_register():
        print("✅ Registration working")
    
    # Test 2: Login
    login_response = requests.post(
        f"{BASE_URL}/auth/login",
        json={"email": "test@example.com", "password": "test123456"}
    )
    
    if login_response.status_code == 200:
        token = login_response.json()["access_token"]
        test_login()
        test_protected_route(token)
    else:
        print("\n❌ Login failed. Check:")
        print("1. Backend server is running")
        print("2. Database is configured")
        print("3. .env file has SECRET_KEY")
        print("4. User is registered")
    
    print("\n" + "=" * 50)
    print("  Test Complete")
    print("=" * 50)
