"""
Quick verification script to confirm YouTube videos are properly loaded in the database
"""

from app.core.database import SessionLocal
from app.models.course import Course
from app.models.module import Module

def verify_videos():
    db = SessionLocal()
    
    try:
        # Find the Full Stack Web Development course
        course = db.query(Course).filter(
            Course.title == "Full Stack Web Development"
        ).first()
        
        if not course:
            print("❌ Course 'Full Stack Web Development' not found!")
            return
        
        print("=" * 80)
        print(f"✅ Course Found: {course.title}")
        print(f"   Category: {course.category}")
        print(f"   Description: {course.description[:100]}...")
        print("=" * 80)
        
        # Get all modules (videos) for this course
        modules = db.query(Module).filter(
            Module.course_id == course.id
        ).order_by(Module.order).all()
        
        print(f"\n📹 Total Videos Loaded: {len(modules)}\n")
        
        if len(modules) == 0:
            print("❌ No videos found!")
            return
        
        # Group by sections
        current_section = ""
        html_css_count = 0
        javascript_count = 0
        frontend_count = 0
        
        for module in modules:
            # Determine section
            if module.order <= 6:
                section = "HTML & CSS"
                html_css_count += 1
            elif module.order <= 13:
                section = "JavaScript"
                javascript_count += 1
            else:
                section = "Frontend (React)"
                frontend_count += 1
            
            if section != current_section:
                current_section = section
                print(f"\n{'='*80}")
                print(f"📚 SECTION: {section}")
                print(f"{'='*80}\n")
            
            # Verify YouTube URL format
            if "youtube.com" in module.content or "youtu.be" in module.content:
                status = "✅"
            else:
                status = "⚠️  (Not a YouTube URL)"
            
            print(f"  {module.order:2d}. {status} {module.title}")
            print(f"       ⏱️  {module.duration_minutes} min | 🔗 {module.content}")
            print()
        
        print("=" * 80)
        print("📊 SUMMARY:")
        print(f"   • HTML & CSS: {html_css_count} videos")
        print(f"   • JavaScript: {javascript_count} videos")
        print(f"   • Frontend/React: {frontend_count} videos")
        print(f"   • TOTAL: {len(modules)} videos")
        print("=" * 80)
        
        # Check if all URLs are valid
        all_youtube = all(
            "youtube.com" in m.content or "youtu.be" in m.content 
            for m in modules
        )
        
        if all_youtube:
            print("\n✅ All videos have valid YouTube URLs!")
        else:
            print("\n⚠️  Some videos may not have YouTube URLs")
        
        print("\n✅ Verification Complete!")
        print("=" * 80)
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("\n🔍 Verifying Full Stack Web Development Course Videos...\n")
    verify_videos()
