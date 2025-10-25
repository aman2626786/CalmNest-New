#!/usr/bin/env python3
"""
Quick script to run the comprehensive assessment migration
"""

import subprocess
import sys
import os

def run_migration():
    """Run the comprehensive assessment migration"""
    try:
        # Change to flask-backend directory
        os.chdir('flask-backend')
        
        # Run the migration script
        result = subprocess.run([sys.executable, 'migrate_comprehensive_assessment.py'], 
                              capture_output=True, text=True)
        
        print("Migration Output:")
        print(result.stdout)
        
        if result.stderr:
            print("Migration Errors:")
            print(result.stderr)
            
        return result.returncode == 0
        
    except Exception as e:
        print(f"Error running migration: {e}")
        return False

if __name__ == '__main__':
    print("🚀 Running Comprehensive Assessment Migration...")
    success = run_migration()
    
    if success:
        print("✅ Migration completed successfully!")
    else:
        print("❌ Migration failed!")
        sys.exit(1)