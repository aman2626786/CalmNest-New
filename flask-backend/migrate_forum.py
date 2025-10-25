#!/usr/bin/env python3
"""
Forum Migration Script - Add category column
"""

import sys
from sqlalchemy import text
from app import app, db

def add_category_column():
    """Add category column to forum_post table if it doesn't exist"""
    try:
        with app.app_context():
            # Check if column exists
            result = db.session.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='forum_post' 
                AND column_name='category'
            """))
            
            if result.fetchone() is None:
                print("Adding category column to forum_post table...")
                db.session.execute(text("""
                    ALTER TABLE forum_post 
                    ADD COLUMN category VARCHAR(50) DEFAULT 'General'
                """))
                
                # Update existing posts to have 'General' category
                db.session.execute(text("""
                    UPDATE forum_post 
                    SET category = 'General' 
                    WHERE category IS NULL
                """))
                
                db.session.commit()
                print("✅ category column added successfully!")
            else:
                print("✅ category column already exists!")
                
    except Exception as e:
        print(f"❌ Error adding category column: {e}")
        db.session.rollback()
        return False
    return True

def main():
    print("🚀 Starting Forum Migration...")
    print("=" * 50)
    
    if add_category_column():
        print("=" * 50)
        print("✅ Forum migration completed successfully!")
        print("🎯 You can now restart your Flask server")
    else:
        print("=" * 50)
        print("❌ Forum migration failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()