# Learning Portal API Documentation

## Overview
Complete backend API for a company learning portal focused on coding skills enhancement for employees.

## Base URL
```
http://localhost:8000
```

## Authentication
All endpoints (except `/auth/register` and `/auth/login`) require Bearer token authentication.

Add header: `Authorization: Bearer <your_token>`

---

## API Endpoints

### 🔐 Authentication (`/auth`)

#### Register User
- **POST** `/auth/register`
- Body: `{"email": "user@company.com", "password": "pass123", "full_name": "John Doe"}`
- Response: `{"message": "User registered successfully"}`

#### Login
- **POST** `/auth/login`
- Body: `{"email": "user@company.com", "password": "pass123"}`
- Response: `{"access_token": "jwt_token_here"}`

---

### 📚 Courses (`/courses`)

#### List All Courses
- **GET** `/courses/`
- Query params: `?skip=0&limit=100&category=python`
- Auth: Required (any user)

#### Search Courses
- **GET** `/courses/search?q=python`
- Auth: Required

#### Get Course Details
- **GET** `/courses/{course_id}`
- Auth: Required

#### Create Course (Admin Only)
- **POST** `/courses/`
- Body: `{"title": "Python Basics", "description": "...", "category": "python"}`
- Auth: Admin required

#### Update Course (Admin Only)
- **PUT** `/courses/{course_id}`
- Body: `{"title": "Updated Title", ...}`
- Auth: Admin required

#### Delete Course (Admin Only)
- **DELETE** `/courses/{course_id}`
- Auth: Admin required

---

### 📖 Modules (`/modules`)

#### Get Course Modules
- **GET** `/modules/course/{course_id}`
- Returns all modules in order
- Auth: Required

#### Get Module Details
- **GET** `/modules/{module_id}`
- Auth: Required

#### Create Module (Admin Only)
- **POST** `/modules/`
- Body: `{"course_id": 1, "title": "Introduction", "content": "...", "order": 1, "duration_minutes": 30}`
- Auth: Admin required

#### Update Module (Admin Only)
- **PUT** `/modules/{module_id}`
- Auth: Admin required

#### Delete Module (Admin Only)
- **DELETE** `/modules/{module_id}`
- Auth: Admin required

---

### 🎓 Enrollments (`/enrollments`)

#### Enroll in Course
- **POST** `/enrollments/`
- Body: `{"course_id": 1}`
- Auth: Required

#### Get My Enrollments
- **GET** `/enrollments/`
- Returns all user's enrollments
- Auth: Required

#### Unenroll from Course
- **DELETE** `/enrollments/{course_id}`
- Auth: Required

#### Update Progress
- **PUT** `/enrollments/{course_id}/progress`
- Body: `{"progress_percent": 75.5}`
- Auto-completes course at 100%
- Auth: Required

#### Get Course Progress
- **GET** `/enrollments/{course_id}/progress`
- Auth: Required

---

### 📝 Quizzes (`/quizzes`)

#### Get Course Quizzes
- **GET** `/quizzes/course/{course_id}`
- Returns quizzes without correct answers
- Auth: Required

#### Get Quiz Details
- **GET** `/quizzes/{quiz_id}`
- Auth: Required

#### Submit Quiz
- **POST** `/quizzes/{quiz_id}/submit`
- Body: `{"answers": [{"question_id": 1, "answer": "option1"}, ...]}`
- Returns score and pass/fail status
- Auth: Required

#### Get My Quiz Results
- **GET** `/quizzes/results/my-results?course_id=1`
- Auth: Required

#### Create Quiz (Admin Only)
- **POST** `/quizzes/`
- Body: 
```json
{
  "course_id": 1,
  "title": "Python Quiz",
  "passing_score": 70,
  "questions": [
    {
      "question_text": "What is Python?",
      "question_type": "multiple_choice",
      "options": ["A", "B", "C"],
      "correct_answer": "A",
      "points": 1,
      "order": 1
    }
  ]
}
```
- Auth: Admin required

#### Update Quiz (Admin Only)
- **PUT** `/quizzes/{quiz_id}`
- Auth: Admin required

#### Delete Quiz (Admin Only)
- **DELETE** `/quizzes/{quiz_id}`
- Auth: Admin required

---

### 📊 Reports (`/reports`) - Admin Only

#### Generate User Progress Report
- **POST** `/reports/user-progress`
- Shows all employees' learning progress
- Auth: Admin required

#### Generate Course Engagement Report
- **POST** `/reports/course-engagement`
- Shows course completion rates and scores
- Auth: Admin required

#### Generate Performance Report
- **POST** `/reports/performance`
- Overall platform analytics
- Auth: Admin required

#### Get All Reports
- **GET** `/reports/?report_type=user_progress`
- Auth: Admin required

#### Get Report Details
- **GET** `/reports/{report_id}`
- Auth: Admin required

---

### 💬 Chat (`/chat`)

#### Ask Question
- **POST** `/chat/ask`
- Body: `{"question": "How do I complete a course?", "context": "general", "course_id": null}`
- Context types: `general`, `course-specific`, `quiz-help`
- Auth: Required

#### Get Chat History
- **GET** `/chat/history?limit=50`
- Auth: Required

#### Get Course-Specific Chat
- **GET** `/chat/history/course/{course_id}`
- Auth: Required

---

## User Roles

### Employee
- Browse and enroll in courses
- Track progress
- Take quizzes
- Use chat assistant
- View own progress

### Admin
- All employee permissions
- Create/update/delete courses
- Create modules and quizzes
- Generate reports
- View all user analytics

---

## Running the Server

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Visit: `http://localhost:8000/docs` for interactive API documentation (Swagger UI)

---

## Database Models

1. **User** - Authentication and user management
2. **Course** - Course information
3. **Module** - Course content/lessons
4. **Enrollment** - User-Course relationships
5. **Progress** - Learning progress tracking
6. **Quiz** - Quiz metadata
7. **QuizQuestion** - Individual questions
8. **QuizResult** - User quiz submissions
9. **Report** - Analytics and reports
10. **ChatHistory** - AI chat interactions

---

## Next Steps / Enhancements

1. **AI Integration**: Replace placeholder chat responses with OpenAI/Claude API
2. **File Uploads**: Add support for video lessons, PDFs, code files
3. **Certificates**: Auto-generate completion certificates
4. **Notifications**: Email notifications for course updates
5. **Leaderboards**: Gamification with points and rankings
6. **Code Execution**: In-browser code editor for practice
7. **Peer Reviews**: Student code review system
8. **Forums**: Discussion boards per course
