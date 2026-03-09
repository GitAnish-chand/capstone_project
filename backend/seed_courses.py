"""
Seed script to populate database with Full Stack Web Development course with YouTube videos
Organized by sections: HTML & CSS, JavaScript, and Frontend
"""

from sqlalchemy.orm import Session
from app.core.database import engine, Base
from app.models.course import Course
from app.models.module import Module
from app.models.user import User
from app.core.security import hash_password

def seed_database():
    """Create tables and populate with sample data"""
    
    # Create tables
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if course already exists
        existing_course = db.query(Course).filter(
            Course.title == "Full Stack Web Development"
        ).first()
        
        if existing_course:
            print("Course 'Full Stack Web Development' already exists. Skipping...")
            return
        
        print("Seeding Full Stack Web Development course with YouTube videos...")
        
        # Create Full Stack Web Development Course
        course = Course(
            title="Full Stack Web Development",
            description="Complete web development bootcamp covering HTML, CSS, JavaScript, and modern frontend frameworks. Learn by watching hands-on video tutorials.",
            category="Web Development",
            is_active=True
        )
        
        db.add(course)
        db.commit()
        db.refresh(course)
        
        print(f"Created course: {course.title} (ID: {course.id})")
        
        # Section 1: HTML & CSS Fundamentals
        html_css_modules = [
            {
                "title": "Introduction to HTML - What is HTML?",
                "content": "https://www.youtube.com/watch?v=qz0adGYMOaA",
                "order": 1,
                "duration_minutes": 8,
                "description": "Learn the basics of HTML and how web pages are structured"
            },
            {
                "title": "HTML Forms and Input Elements",
                "content": "https://www.youtube.com/watch?v=fNcJuPIZ2WE",
                "order": 2,
                "duration_minutes": 12,
                "description": "Master HTML forms, input types, and form validation"
            },
            {
                "title": "CSS Basics - Styling Your Website",
                "content": "https://www.youtube.com/watch?v=nVAXLj9mMkU",
                "order": 3,
                "duration_minutes": 15,
                "description": "Introduction to CSS selectors, colors, fonts, and styling"
            },
            {
                "title": "CSS Flexbox Layout Tutorial",
                "content": "https://www.youtube.com/watch?v=fYq5BXgI4Ac",
                "order": 4,
                "duration_minutes": 20,
                "description": "Learn Flexbox for creating responsive layouts"
            },
            {
                "title": "CSS Grid Complete Guide",
                "content": "https://www.youtube.com/watch?v=t6t6O5Z7dKY",
                "order": 5,
                "duration_minutes": 25,
                "description": "Master CSS Grid for complex layouts"
            },
            {
                "title": "Responsive Web Design Tutorial",
                "content": "https://www.youtube.com/watch?v=srvUrASNj0s",
                "order": 6,
                "duration_minutes": 18,
                "description": "Make your websites mobile-friendly with responsive design"
            }
        ]
        
        # Section 2: JavaScript Programming
        javascript_modules = [
            {
                "title": "JavaScript Basics - Variables and Data Types",
                "content": "https://www.youtube.com/watch?v=W6NZfCO5SIk",
                "order": 7,
                "duration_minutes": 15,
                "description": "Learn JavaScript fundamentals including variables, data types, and operators"
            },
            {
                "title": "JavaScript Functions and Scope",
                "content": "https://www.youtube.com/watch?v=xUI5Tsl2JpY",
                "order": 8,
                "duration_minutes": 20,
                "description": "Understanding functions, arrow functions, and scope in JavaScript"
            },
            {
                "title": "JavaScript Arrays and Objects",
                "content": "https://www.youtube.com/watch?v=oigfaZ5ApsM",
                "order": 9,
                "duration_minutes": 18,
                "description": "Working with arrays and objects in JavaScript"
            },
            {
                "title": "DOM Manipulation with JavaScript",
                "content": "https://www.youtube.com/watch?v=y17RuWkWdn8",
                "order": 10,
                "duration_minutes": 22,
                "description": "Learn to manipulate the DOM and create interactive web pages"
            },
            {
                "title": "JavaScript Events and Event Listeners",
                "content": "https://www.youtube.com/watch?v=XF1_MlZ5l6M",
                "order": 11,
                "duration_minutes": 16,
                "description": "Handle user interactions with events and event listeners"
            },
            {
                "title": "Async JavaScript - Promises and Async/Await",
                "content": "https://www.youtube.com/watch?v=ZYb_ZU8LNxs",
                "order": 12,
                "duration_minutes": 25,
                "description": "Master asynchronous JavaScript with promises and async/await"
            },
            {
                "title": "Fetch API and AJAX",
                "content": "https://www.youtube.com/watch?v=cuEtnrL9-H0",
                "order": 13,
                "duration_minutes": 20,
                "description": "Learn to make API calls using Fetch API"
            }
        ]
        
        # Section 3: Frontend Development
        frontend_modules = [
            {
                "title": "Introduction to React JS",
                "content": "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
                "order": 14,
                "duration_minutes": 30,
                "description": "Getting started with React and component-based architecture"
            },
            {
                "title": "React Components and Props",
                "content": "https://www.youtube.com/watch?v=Dyl3DzG8CFw",
                "order": 15,
                "duration_minutes": 25,
                "description": "Building reusable components with props"
            },
            {
                "title": "React State and Hooks",
                "content": "https://www.youtube.com/watch?v=O6P8GRuwqpA",
                "order": 16,
                "duration_minutes": 28,
                "description": "Managing state with useState and other React hooks"
            },
            {
                "title": "React useEffect Hook Explained",
                "content": "https://www.youtube.com/watch?v=KlyXnmrShX0",
                "order": 17,
                "duration_minutes": 22,
                "description": "Side effects in React with useEffect hook"
            },
            {
                "title": "React Router Tutorial",
                "content": "https://www.youtube.com/watch?v=oTIJunBa6MA",
                "order": 18,
                "duration_minutes": 26,
                "description": "Client-side routing in React applications"
            },
            {
                "title": "State Management with Context API",
                "content": "https://www.youtube.com/watch?v=35lXWvCuMks",
                "order": 19,
                "duration_minutes": 24,
                "description": "Global state management without Redux"
            },
            {
                "title": "Building a Complete React Project",
                "content": "https://www.youtube.com/watch?v=SqcY0GlETPk",
                "order": 20,
                "duration_minutes": 45,
                "description": "Put it all together by building a complete React application"
            }
        ]
        
        # Create modules for HTML & CSS section
        print("\nCreating HTML & CSS modules...")
        for module_data in html_css_modules:
            module = Module(
                course_id=course.id,
                title=module_data["title"],
                content=module_data["content"],
                order=module_data["order"],
                duration_minutes=module_data["duration_minutes"]
            )
            db.add(module)
            print(f"  Added: {module.title}")
        
        # Create modules for JavaScript section
        print("\nCreating JavaScript modules...")
        for module_data in javascript_modules:
            module = Module(
                course_id=course.id,
                title=module_data["title"],
                content=module_data["content"],
                order=module_data["order"],
                duration_minutes=module_data["duration_minutes"]
            )
            db.add(module)
            print(f"  Added: {module.title}")
        
        # Create modules for Frontend section
        print("\nCreating Frontend modules...")
        for module_data in frontend_modules:
            module = Module(
                course_id=course.id,
                title=module_data["title"],
                content=module_data["content"],
                order=module_data["order"],
                duration_minutes=module_data["duration_minutes"]
            )
            db.add(module)
            print(f"  Added: {module.title}")
        
        db.commit()
        
        total_modules = len(html_css_modules) + len(javascript_modules) + len(frontend_modules)
        print(f"\n✅ Successfully created {total_modules} video modules!")
        print(f"   - HTML & CSS: {len(html_css_modules)} videos")
        print(f"   - JavaScript: {len(javascript_modules)} videos")
        print(f"   - Frontend (React): {len(frontend_modules)} videos")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    from app.core.database import SessionLocal
    
    print("=" * 60)
    print("Full Stack Web Development Course Seeder")
    print("=" * 60)
    print("\nThis script will add a complete web development course with:")
    print("  📚 Section 1: HTML & CSS (6 videos)")
    print("  💻 Section 2: JavaScript (7 videos)")
    print("  ⚛️  Section 3: Frontend/React (7 videos)")
    print("\nTotal: 20 YouTube video tutorials\n")
    print("=" * 60)
    
    confirm = input("\nDo you want to proceed? (yes/no): ").strip().lower()
    if confirm == 'yes':
        seed_database()
        print("\n🎉 Database seeding completed successfully!")
    else:
        print("\n❌ Seeding cancelled.")
