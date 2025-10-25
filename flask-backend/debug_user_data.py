#!/usr/bin/env python3
"""
Debug script to check user data in database
"""

from app import app, db
from models import TestSubmission, MoodGrooveResult, BreathingExerciseLog, FacialAnalysisSession

def debug_user_data():
    """Check what data exists for the user"""
    with app.app_context():
        user_email = "devesh9667735720@gmail.com"
        
        print(f"🔍 Debugging data for user: {user_email}")
        print("=" * 60)
        
        # Check test submissions by email (need to find user_id first)
        print("\n📋 Test Submissions:")
        test_submissions = TestSubmission.query.all()
        user_tests = []
        for test in test_submissions:
            print(f"   ID: {test.id}, User ID: {test.user_id}, Test: {test.test_type}, Score: {test.score}")
            # You might need to match by some other criteria
            user_tests.append(test)
        
        print(f"\n📊 Total Test Submissions in DB: {len(test_submissions)}")
        
        # Check mood groove results
        print("\n🎭 Mood Groove Results:")
        mood_results = MoodGrooveResult.query.all()
        for mood in mood_results:
            user_email_in_db = getattr(mood, 'user_email', 'N/A')
            print(f"   ID: {mood.id}, User ID: {mood.user_id}, Email: {user_email_in_db}, Mood: {mood.dominant_mood}")
        
        print(f"\n📊 Total Mood Groove Results in DB: {len(mood_results)}")
        
        # Check breathing exercises
        print("\n🫁 Breathing Exercises:")
        breathing_logs = BreathingExerciseLog.query.all()
        for breath in breathing_logs:
            print(f"   ID: {breath.id}, User ID: {breath.user_id}, Exercise: {breath.exercise_name}")
        
        print(f"\n📊 Total Breathing Exercises in DB: {len(breathing_logs)}")
        
        # Check facial analysis
        print("\n😊 Facial Analysis Sessions:")
        facial_sessions = FacialAnalysisSession.query.all()
        for session in facial_sessions:
            print(f"   ID: {session.id}, Email: {session.user_email}, Mood: {session.dominant_mood}")
        
        print(f"\n📊 Total Facial Analysis Sessions in DB: {len(facial_sessions)}")
        
        print("\n" + "=" * 60)
        print("🎯 Summary:")
        print(f"   Test Submissions: {len(test_submissions)}")
        print(f"   Mood Groove Results: {len(mood_results)}")
        print(f"   Breathing Exercises: {len(breathing_logs)}")
        print(f"   Facial Analysis: {len(facial_sessions)}")
        
        # Try to find user ID for the email
        print(f"\n🔍 Looking for user ID matching email: {user_email}")
        for test in test_submissions:
            print(f"   Test User ID: {test.user_id}")
        
        return test_submissions, mood_results, breathing_logs, facial_sessions

if __name__ == "__main__":
    debug_user_data()