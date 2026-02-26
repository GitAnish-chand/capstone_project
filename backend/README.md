# 🎓 Company Learning Portal - Backend API

> A complete, production-ready backend for a company learning management system focused on coding skills enhancement.

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=flat&logo=sqlalchemy&logoColor=white)](https://www.sqlalchemy.org/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=json-web-tokens&logoColor=white)](https://jwt.io/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [Authentication](#-authentication)
- [Testing](#-testing)
- [Deployment](#-deployment)

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin/Employee)
- Secure password hashing (bcrypt)
- Protected API routes

### 📚 Course Management
- Complete CRUD operations for courses
- Course categories and search
- Active/inactive course status
- Course modules with ordered content

### 🎓 Learning Experience
- Course enrollment system
- Real-time progress tracking (0-100%)
- Auto-completion at 100% progress
- Interactive quiz system with auto-grading

### 📝 Assessment System
- Create quizzes with multiple questions
- Multiple choice, true/false, coding questions
- Automatic grading
- Quiz history and results tracking
- Configurable passing scores

### 📊 Analytics & Reporting
- User progress reports
- Course engagement metrics
- Platform-wide performance analytics
- Admin dashboard data

### 💬 AI Chat Assistant
- Context-aware AI responses
- Course-specific help
- Chat history tracking
- Ready for OpenAI/Claude integration

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9 or higher
- pip package manager

### Installation

1. **Clone and navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**
   
   Create a `.env` file in the `backend` folder:
   ```env
   DATABASE_URL=sqlite:///./learning_portal.db
   SECRET_KEY=your-super-secret-key-change-in-production
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   ```

4. **Run the server**
   ```bash
   uvicorn app.main:app --reload
   ```

5. **Access API documentation**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

### Quick Test

Run the automated test script:
```bash
python test_setup.py
```

---

## 📖 API Documentation

### Base URL
```
http://localhost:8000
```

### Authentication
All endpoints (except `/auth/register` and `/auth/login`) require authentication:
```
Authorization: Bearer <your_token>
```

### Main Endpoint Groups

| Group | Prefix | Description |
|-------|--------|-------------|
| Authentication | `/auth` | Register, login |
| Courses | `/courses` | Course management |
| Modules | `/modules` | Learning content |
| Enrollments | `/enrollments` | Course enrollment & progress |
| Quizzes | `/quizzes` | Quiz system |
| Reports | `/reports` | Analytics (Admin only) |
| Chat | `/chat` | AI assistant |

### Example Requests

**Register a User**
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employee@company.com",
    "password": "password123",
    "full_name": "John Doe"
  }'
```

**Login**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employee@company.com",
    "password": "password123"
  }'
```

**Create a Course (Admin)**
```bash
curl -X POST http://localhost:8000/courses/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Python Programming",
    "description": "Learn Python from scratch",
    "category": "python"
  }'
```

For complete API documentation, see:
- **[API_OVERVIEW.md](API_OVERVIEW.md)** - Detailed endpoint documentation
- **[QUICK_START.md](QUICK_START.md)** - Setup and testing guide

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/v1/
│   │   ├── auth/              # Authentication endpoints
│   │   │   ├── routes.py
│   │   │   ├── schemas.py
│   │   │   └── service.py
│   │   ├── courses/           # Course management
│   │   ├── modules/           # Course content
│   │   ├── enrollments/       # Enrollment & progress
│   │   ├── quizzes/           # Quiz system
│   │   ├── reports/           # Analytics
│   │   ├── chat/              # AI chat
│   │   └── api_router.py      # Route aggregator
│   ├── core/
│   │   ├── auth.py           # Auth middleware
│   │   ├── config.py         # Configuration
│   │   ├── database.py       # Database setup
│   │   └── security.py       # Security utilities
│   ├── models/               # Database models
│   │   ├── user.py
│   │   ├── course.py
│   │   ├── module.py
│   │   ├── enrollment.py
│   │   ├── progress.py
│   │   ├── quiz.py
│   │   ├── report.py
│   │   └── chat_history.py
│   └── main.py              # FastAPI app
├── .env                     # Environment variables
├── requirements.txt         # Dependencies
├── test_setup.py           # Setup verification script
├── API_OVERVIEW.md         # Complete API docs
├── QUICK_START.md          # Setup guide
├── BUILD_SUMMARY.md        # Build documentation
└── README.md               # This file
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **FastAPI** | Modern, fast web framework |
| **SQLAlchemy** | SQL toolkit and ORM |
| **Pydantic** | Data validation |
| **JWT (python-jose)** | Authentication tokens |
| **Passlib** | Password hashing (bcrypt) |
| **Uvicorn** | ASGI server |
| **PostgreSQL/SQLite** | Database |

---

## 🗄️ Database Schema

### Core Tables

1. **users** - User accounts with roles
2. **courses** - Course catalog
3. **modules** - Structured learning content
4. **enrollments** - User-course relationships
5. **progress** - Learning progress tracking
6. **quizzes** - Quiz metadata
7. **quiz_questions** - Individual questions
8. **quiz_results** - Quiz submissions and scores
9. **reports** - Generated analytics
10. **chat_history** - AI chat interactions

### Relationships

```
User ──< Enrollment >── Course
User ──< Progress >──── Course
User ──< QuizResult >── Quiz
Course ──< Module
Course ──< Quiz
Quiz ──< QuizQuestion
```

---

## 🔐 Authentication

### User Roles

**Employee (Default)**
- Browse and search courses
- Enroll in courses
- Track progress
- Take quizzes
- Use chat assistant
- View personal data

**Admin**
- All employee permissions
- Create/edit/delete courses
- Create modules and quizzes
- Generate reports
- Access analytics

### JWT Token Flow

1. User registers/logs in
2. Server returns JWT token
3. Client includes token in `Authorization` header
4. Server validates token for protected routes
5. Token expires after 24 hours (configurable)

---

## 🧪 Testing

### Automated Testing

Run the setup verification script:
```bash
python test_setup.py
```

This tests:
- Server health
- User registration
- Login functionality
- Protected routes
- Authentication requirements

### Manual Testing

1. **Start the server**
   ```bash
   uvicorn app.main:app --reload
   ```

2. **Visit interactive docs**
   - http://localhost:8000/docs

3. **Try the endpoints**
   - Register a user
   - Login and get token
   - Use "Authorize" button in Swagger UI
   - Test various endpoints

---

## 🚀 Deployment

### Production Checklist

- [ ] Change `SECRET_KEY` in `.env`
- [ ] Use PostgreSQL instead of SQLite
- [ ] Set `DATABASE_URL` for production DB
- [ ] Configure CORS for frontend domain
- [ ] Enable HTTPS
- [ ] Set up logging
- [ ] Configure rate limiting
- [ ] Enable database backups

### Environment Variables

```env
# Required
DATABASE_URL=postgresql://user:pass@localhost/dbname
SECRET_KEY=your-production-secret-key

# Optional
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

### Docker Deployment (Coming Soon)

```dockerfile
# Dockerfile example
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 📚 Documentation

- **[API_OVERVIEW.md](API_OVERVIEW.md)** - Complete API endpoint documentation
- **[QUICK_START.md](QUICK_START.md)** - Setup and testing guide
- **[BUILD_SUMMARY.md](BUILD_SUMMARY.md)** - Detailed build documentation
- **Swagger UI** - http://localhost:8000/docs
- **ReDoc** - http://localhost:8000/redoc

---

## 🔄 What's Next?

### Immediate Enhancements
1. Connect AI chat to OpenAI/Claude API
2. Add file upload support (videos, PDFs)
3. Implement certificate generation
4. Add email notifications

### Future Features
1. Discussion forums
2. Code execution sandbox
3. Peer code reviews
4. Gamification (badges, leaderboards)
5. Mobile app API extensions
6. Real-time notifications (WebSockets)
7. Advanced analytics dashboard

---

## 🤝 Contributing

This is a capstone project for a company learning portal. To extend functionality:

1. Follow the existing code structure
2. Add new routes in `app/api/v1/`
3. Create corresponding models in `app/models/`
4. Update `api_router.py` to include new routes
5. Test endpoints in Swagger UI

---

## 📝 License

This project is built as a capstone project for educational purposes.

---

## 📞 Support

For questions or issues:
1. Check the documentation in `docs/` folder
2. Visit `/docs` endpoint for interactive API testing
3. Review code comments and docstrings

---

## 🎉 Acknowledgments

Built with:
- FastAPI for the amazing framework
- SQLAlchemy for robust ORM
- Python community for excellent libraries

---

<div align="center">

**Ready to empower your team with coding skills!** 🚀

[Get Started](#-quick-start) · [View Docs](API_OVERVIEW.md) · [Test Setup](QUICK_START.md)

</div>
