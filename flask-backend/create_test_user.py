#!/usr/bin/env python3
"""
Quick script to create a test user profile for development
"""
import os
import sys
from datetime import datetime

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db
from models import Profile

def create_test_user():
    with app.app_context():
        # Create your original user
        users_to_create = [
            {
                'id': 'user-devesh-123',
                'email': 'devesh9667735720@gmail.com',
                'full_name': 'Devesh',
                'age': 25,
                'gender': 'Male'
            },
            {
                'id': 'test-user-123',
                'email': 'aman2626786@gmail.com',
                'full_name': 'Test User',
                'age': 25,
                'gender': 'Male'
            }
        ]
        
        created_users = []
        
        for user_data in users_to_create:
            # Check if user already exists
            existing_user = Profile.query.filter_by(email=user_data['email']).first()
            if existing_user:
                print(f"User already exists: {existing_user.email}")
                created_users.append(existing_user)
                continue
            
            # Create new user
            new_user = Profile(
                id=user_data['id'],
                email=user_data['email'],
                full_name=user_data['full_name'],
                age=user_data['age'],
                gender=user_data['gender']
            )
            
            db.session.add(new_user)
            db.session.commit()
            
            print(f"Created user: {new_user.email}")
            created_users.append(new_user)
        
        return created_users

if __name__ == '__main__':
    users = create_test_user()
    print(f"\n✅ Created {len(users)} users:")
    for user in users:
        print(f"  - ID: {user.id}")
        print(f"    Email: {user.email}")
        print(f"    Name: {user.full_name}")
        print()