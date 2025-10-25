#!/usr/bin/env python3
"""
Database Migration Script for CalmNest
Adds missing columns to existing tables
"""

import sys
from sqlalchemy import text
from app import app, db

def add_user_email_column():
    """Add user_email column to mood_groove_result table if it doesn't exist"""
    try:
        with app.app_context():
            # Check if column exists
            result = db.session.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='mood_groove_result' 
                AND column_name='user_email'
            """))
            
            if result.fetchone() is None:
                print("Adding user_email column to mood_groove_result table...")
                db.session.execute(text("""
                    ALTER TABLE mood_groove_result 
                    ADD COLUMN user_email VARCHAR(255)
                """))
                db.session.commit()
                print("✅ user_email column added successfully!")
            else:
                print("✅ user_email column already exists!")
                
    except Exception as e:
        print(f"❌ Error adding user_email column: {e}")
        db.session.rollback()
        return False
    return True

def add_email_column_to_profiles():
    """Add email column to profiles table if it doesn't exist"""
    try:
        with app.app_context():
            # Check if column exists
            result = db.session.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='profiles' 
                AND column_name='email'
            """))
            
            if result.fetchone() is None:
                print("Adding email column to profiles table...")
                db.session.execute(text("""
                    ALTER TABLE profiles 
                    ADD COLUMN email VARCHAR(255)
                """))
                db.session.commit()
                print("✅ email column added to profiles table!")
            else:
                print("✅ email column already exists in profiles table!")
                
    except Exception as e:
        print(f"❌ Error adding email column to profiles: {e}")
        db.session.rollback()
        return False
    return True

def update_existing_mood_groove_data():
    """Update existing mood_groove_result records with user_email where possible"""
    try:
        with app.app_context():
            # This is a placeholder - you might need to manually update existing records
            # or implement logic based on your specific requirements
            print("📝 Note: Existing mood_groove_result records may need manual user_email updates")
            print("   You can update them manually in the database or through the application")
            
    except Exception as e:
        print(f"❌ Error updating existing data: {e}")
        return False
    return True

def main():
    print("🚀 Starting CalmNest Database Migration...")
    print("=" * 50)
    
    success = True
    
    # Add user_email column to mood_groove_result
    if not add_user_email_column():
        success = False
    
    # Add email column to profiles
    if not add_email_column_to_profiles():
        success = False
    
    # Update existing data
    if not update_existing_mood_groove_data():
        success = False
    
    print("=" * 50)
    if success:
        print("✅ Database migration completed successfully!")
        print("🎯 You can now restart your Flask server")
    else:
        print("❌ Database migration failed!")
        print("🔧 Please check the errors above and try again")
        sys.exit(1)

if __name__ == "__main__":
    main()