#!/usr/bin/env python3
"""
Feedback Migration Script - Add user_name column
"""

import sys
from sqlalchemy import text
from app import app, db

def add_user_name_column():
    """Add user_name column to feedback table if it doesn't exist"""
    try:
        with app.app_context():
            # Check if column exists
            result = db.session.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='feedback' 
                AND column_name='user_name'
            """))
            
            if result.fetchone() is None:
                print("Adding user_name column to feedback table...")
                db.session.execute(text("""
                    ALTER TABLE feedback 
                    ADD COLUMN user_name VARCHAR(100) DEFAULT 'Anonymous'
                """))
                
                # Update existing feedback to have 'Anonymous' user_name
                db.session.execute(text("""
                    UPDATE feedback 
                    SET user_name = 'Anonymous' 
                    WHERE user_name IS NULL
                """))
                
                db.session.commit()
                print("✅ user_name column added successfully!")
            else:
                print("✅ user_name column already exists!")
                
    except Exception as e:
        print(f"❌ Error adding user_name column: {e}")
        db.session.rollback()
        return False
    return True

def main():
    print("🚀 Starting Feedback Migration...")
    print("=" * 50)
    
    if add_user_name_column():
        print("=" * 50)
        print("✅ Feedback migration completed successfully!")
        print("🎯 You can now restart your Flask server")
    else:
        print("=" * 50)
        print("❌ Feedback migration failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()