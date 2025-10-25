#!/usr/bin/env python3
"""
Database Setup Script for CalmNest
Creates all tables and ensures proper schema
"""

from app import app, db
from models import *

def setup_database():
    """Create all database tables"""
    try:
        with app.app_context():
            print("🚀 Setting up CalmNest database...")
            
            # Create all tables
            db.create_all()
            
            print("✅ Database tables created successfully!")
            print("📋 Created tables:")
            print("   - test_submission")
            print("   - mood_groove_result")
            print("   - chat_log")
            print("   - breathing_exercise_log")
            print("   - forum_post")
            print("   - feedback")
            print("   - user_interaction")
            print("   - facial_analysis_session")
            
            return True
            
    except Exception as e:
        print(f"❌ Error setting up database: {e}")
        return False

if __name__ == "__main__":
    if setup_database():
        print("\n🎉 Database setup completed!")
        print("💡 Now run: python migrate_database.py (if needed)")
    else:
        print("\n💥 Database setup failed!")
        exit(1)