# Learning Portal - Quick Start Guide

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment
Create a `.env` file in the `backend` folder:

```env
DATABASE_URL=sqlite:///./learning_portal.db
SECRET_KEY=your-super-secret-key-change-in-production
```

For PostgreSQL:
```env
DATABASE_URL=postgresql://user:password@localhost/learning_portal
SECRET_KEY=your-super-secret-key-change-in-production
```

### 3. Run the Server
```bash
uvicorn app.main:app --reload
```

Server will start at: `http://localhost:8000`

### 4. Access API Documentation
Open your browser and visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

## 📋 Testing the API

### Step 1: Register a User (Employee)
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employee@company.com",
    "password": "password123",
    "full_name": "John Employee"
  }'
```

### Step 2: Register an Admin (Manual - Update DB)
After registering, manually change the user's role in database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@company.com';
```

Or register and update via Python:
```python
from app.core.database import SessionLocal
from app.models.user import User

db = SessionLocal()
user = db.query(User).filter(User.email == "admin@company.com").first()
user.role = "admin"
db.commit()
```

### Step 3: Login
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "password123"
  }'
```

Save the `access_token` from response!

### Step 4: Create a Course (Admin)
```bash
curl -X POST "http://localhost:8000/courses/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Python Programming Basics",
    "description": "Learn Python from scratch",
    "category": "python",
    "is_active": true
  }'
```

### Step 5: Add Modules to Course
```bash
curl -X POST "http://localhost:8000/modules/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "course_id": 1,
    "title": "Introduction to Python",
    "content": "Python is a high-level programming language...",
    "order": 1,
    "duration_minutes": 30
  }'
```

### Step 6: Create a Quiz
```bash
curl -X POST "http://localhost:8000/quizzes/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "course_id": 1,
    "title": "Python Basics Quiz",
    "description": "Test your Python knowledge",
    "passing_score": 70.0,
    "questions": [
      {
        "question_text": "What is Python?",
        "question_type": "multiple_choice",
        "options": ["A programming language", "A snake", "A database"],
        "correct_answer": "A programming language",
        "points": 1,
        "order": 1
      }
    ]
  }'
```

### Step 7: Employee Enrolls in Course
```bash
curl -X POST "http://localhost:8000/enrollments/" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer EMPLOYEE_TOKEN" \
  -d '{
    "course_id": 1
  }'
```

### Step 8: Update Progress
```bash
curl -X PUT "http://localhost:8000/enrollments/1/progress" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer EMPLOYEE_TOKEN" \
  -d '{
    "progress_percent": 50.0
  }'
```

### Step 9: Take a Quiz
```bash
curl -X POST "http://localhost:8000/quizzes/1/submit" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer EMPLOYEE_TOKEN" \
  -d '{
    "answers": [
      {
        "question_id": 1,
        "answer": "A programming language"
      }
    ]
  }'
```

### Step 10: Generate Reports (Admin)
```bash
curl -X POST "http://localhost:8000/reports/performance" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 🎯 Complete Feature List

### ✅ Phase 1: Course Management
- [x] Create courses (Admin)
- [x] List/search courses
- [x] Update/delete courses (Admin)
- [x] Course categories

### ✅ Phase 2: Learning Content
- [x] Course modules/lessons
- [x] Ordered content
- [x] Duration tracking

### ✅ Phase 3: Enrollment & Progress
- [x] Enroll in courses
- [x] Track progress
- [x] Auto-complete at 100%
- [x] Unenroll functionality

### ✅ Phase 4: Quizzes & Assessment
- [x] Create quizzes with questions
- [x] Multiple choice questions
- [x] Auto-grading
- [x] Pass/fail based on score
- [x] Quiz history

### ✅ Phase 5: Reports & Analytics
- [x] User progress reports
- [x] Course engagement metrics
- [x] Overall performance dashboard
- [x] Admin-only access

### ✅ Phase 6: AI Chat Assistant
- [x] Ask questions
- [x] Context-aware responses
- [x] Chat history
- [x] Course-specific help

### ✅ Security
- [x] JWT authentication
- [x] Role-based authorization
- [x] Password hashing
- [x] Protected routes

---

## 📊 Database Schema

The system automatically creates these tables:
1. `users` - User accounts
2. `courses` - Course catalog
3. `modules` - Course content
4. `enrollments` - User enrollments
5. `progress` - Learning progress
6. `quizzes` - Quiz metadata
7. `quiz_questions` - Questions
8. `quiz_results` - Quiz submissions
9. `reports` - Generated reports
10. `chat_history` - AI interactions

---

## 🔧 Customization

### Change Default User Role
Edit `app/api/v1/auth/service.py` line 14:
```python
role="employee"  # Change to "admin" for admin registration
```

### Adjust Token Expiration
Edit `.env`:
```env
ACCESS_TOKEN_EXPIRE_MINUTES=1440  # 24 hours
```

### Add More Question Types
Edit `app/models/quiz.py` and extend question_type field.

---

## 📱 Next Steps

1. **Frontend Development**: Build React/Vue/Angular frontend
2. **AI Integration**: Connect to OpenAI API for smart chat
3. **File Uploads**: Add video/PDF support
4. **Certificates**: Auto-generate upon completion
5. **Email Notifications**: Course updates and reminders
6. **Code Editor**: In-browser coding practice
7. **Social Features**: Forums, peer reviews

---

## 🐛 Troubleshooting

### Database Connection Error
- Check your `DATABASE_URL` in `.env`
- For SQLite, ensure the path is writable

### Authentication Failed
- Verify JWT token is included in headers
- Check token hasn't expired
- Ensure user role matches endpoint requirements

### Module Import Errors
- Install all dependencies: `pip install -r requirements.txt`
- Check Python version (3.9+)

---

## 📞 Support

For issues or questions:
1. Check API docs at `/docs`
2. Review `API_OVERVIEW.md`
3. Check model relationships in `app/models/`

Happy Learning! 🎓
