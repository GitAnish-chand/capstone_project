import os

# --------- FOLDERS ----------
folders = [
    "backend/app/core",
    "backend/app/models",
    "backend/app/schemas",
    "backend/app/services",
    "backend/app/ai",
    "backend/app/utils",
    "backend/app/tests",
    "backend/app/api/v1/auth",
    "backend/app/api/v1/users",
    "backend/app/api/v1/courses",
    "backend/app/api/v1/enrollments",
    "backend/app/api/v1/learning",
    "backend/app/api/v1/chatbot",
    "backend/app/api/v1/reports",
    "backend/migrations"
]

# --------- FILES ----------
files = [
    # root
    "backend/requirements.txt",
    "backend/Dockerfile",
    "backend/README.md",
    "backend/.env",

    # app
    "backend/app/main.py",

    # core
    "backend/app/core/config.py",
    "backend/app/core/security.py",
    "backend/app/core/database.py",
    "backend/app/core/logging.py",

    # api
    "backend/app/api/v1/api_router.py",

    # auth
    "backend/app/api/v1/auth/routes.py",
    "backend/app/api/v1/auth/schemas.py",
    "backend/app/api/v1/auth/service.py",

    # users
    "backend/app/api/v1/users/routes.py",
    "backend/app/api/v1/users/schemas.py",
    "backend/app/api/v1/users/service.py",

    # courses
    "backend/app/api/v1/courses/routes.py",
    "backend/app/api/v1/courses/schemas.py",
    "backend/app/api/v1/courses/service.py",

    # enrollments
    "backend/app/api/v1/enrollments/routes.py",
    "backend/app/api/v1/enrollments/schemas.py",
    "backend/app/api/v1/enrollments/service.py",

    # learning
    "backend/app/api/v1/learning/routes.py",
    "backend/app/api/v1/learning/schemas.py",
    "backend/app/api/v1/learning/service.py",

    # chatbot
    "backend/app/api/v1/chatbot/routes.py",
    "backend/app/api/v1/chatbot/schemas.py",
    "backend/app/api/v1/chatbot/service.py",
    "backend/app/api/v1/chatbot/prompts.py",

    # reports
    "backend/app/api/v1/reports/routes.py",
    "backend/app/api/v1/reports/schemas.py",
    "backend/app/api/v1/reports/service.py",

    # models
    "backend/app/models/user.py",
    "backend/app/models/course.py",
    "backend/app/models/enrollment.py",
    "backend/app/models/quiz.py",
    "backend/app/models/progress.py",
    "backend/app/models/report.py",

    # services
    "backend/app/services/auth_service.py",
    "backend/app/services/course_service.py",
    "backend/app/services/chatbot_service.py",
    "backend/app/services/report_service.py",

    # ai
    "backend/app/ai/llm_client.py",
    "backend/app/ai/embeddings.py",
    "backend/app/ai/vector_store.py",
    "backend/app/ai/document_loader.py",

    # utils
    "backend/app/utils/file_upload.py",
    "backend/app/utils/pagination.py",
    "backend/app/utils/validators.py",

    # tests
    "backend/app/tests/test_auth.py",
    "backend/app/tests/test_courses.py",
    "backend/app/tests/test_chatbot.py",
]

# --------- CREATE FOLDERS ----------
for folder in folders:
    os.makedirs(folder, exist_ok=True)

# --------- CREATE FILES ----------
for file in files:
    os.makedirs(os.path.dirname(file), exist_ok=True)
    open(file, "a").close()

# --------- CREATE __init__.py ----------
for folder in folders:
    init_file = os.path.join(folder, "__init__.py")
    open(init_file, "a").close()

print("✅ Backend folder + files structure created successfully")




