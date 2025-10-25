#!/usr/bin/env python3
"""
Migration script to add ComprehensiveAssessment and AssessmentSession tables
Run this script to update the database with new tables for comprehensive assessment system
"""

from app import app, db
from models import ComprehensiveAssessment, AssessmentSession

def migrate_database():
    """Create new tables for comprehensive assessment system"""
    with app.app_context():
        try:
            # Create the new tables
            db.create_all()
            print("✅ Successfully created ComprehensiveAssessment and AssessmentSession tables")
            
            # Verify tables were created
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            
            if 'comprehensive_assessment' in tables:
                print("✅ ComprehensiveAssessment table created successfully")
            else:
                print("❌ ComprehensiveAssessment table not found")
                
            if 'assessment_session' in tables:
                print("✅ AssessmentSession table created successfully")
            else:
                print("❌ AssessmentSession table not found")
                
            print("\n📊 Current database tables:")
            for table in sorted(tables):
                print(f"  - {table}")
                
        except Exception as e:
            print(f"❌ Migration failed: {str(e)}")
            return False
            
    return True

if __name__ == '__main__':
    print("🚀 Starting database migration for Comprehensive Assessment System...")
    success = migrate_database()
    
    if success:
        print("\n✅ Migration completed successfully!")
        print("You can now use the comprehensive assessment API endpoints.")
    else:
        print("\n❌ Migration failed. Please check the error messages above.")