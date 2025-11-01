#!/usr/bin/env python3
"""
Check current database content
"""
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db
from models import Profile, ComprehensiveAssessment, TestSubmission

def check_database():
    with app.app_context():
        print("=== DATABASE CONTENT CHECK ===\n")
        
        # Check Profiles
        profiles = Profile.query.all()
        print(f"📊 PROFILES ({len(profiles)} found):")
        for profile in profiles:
            print(f"  - ID: {profile.id}")
            print(f"    Email: {profile.email}")
            print(f"    Name: {profile.full_name}")
            print()
        
        # Check Comprehensive Assessments
        assessments = ComprehensiveAssessment.query.all()
        print(f"🧠 COMPREHENSIVE ASSESSMENTS ({len(assessments)} found):")
        for assessment in assessments:
            print(f"  - Session ID: {assessment.session_id}")
            print(f"    User ID: {assessment.user_id}")
            print(f"    PHQ-9 Score: {assessment.phq9_score}")
            print(f"    GAD-7 Score: {assessment.gad7_score}")
            print(f"    Created: {assessment.created_at}")
            print()
        
        # Check Test Submissions
        tests = TestSubmission.query.all()
        print(f"📝 TEST SUBMISSIONS ({len(tests)} found):")
        for test in tests:
            print(f"  - ID: {test.id}")
            print(f"    User ID: {test.user_id}")
            print(f"    Test Type: {test.test_type}")
            print(f"    Score: {test.score}")
            print(f"    Severity: {test.severity}")
            print(f"    Created: {test.timestamp}")
            print()
        
        if not profiles and not assessments and not tests:
            print("❌ Database is empty!")
        else:
            print("✅ Database has data")

if __name__ == '__main__':
    check_database()