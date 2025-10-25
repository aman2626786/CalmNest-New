#!/usr/bin/env python3
"""
Test script for Comprehensive Assessment API endpoints
This script tests the basic functionality of the new API endpoints
"""

import requests
import json
from datetime import datetime

# Configuration
BASE_URL = 'http://127.0.0.1:5001'
TEST_USER_ID = 'test_user_123'

def test_create_assessment():
    """Test creating a new comprehensive assessment"""
    print("🧪 Testing: Create comprehensive assessment")
    
    response = requests.post(f'{BASE_URL}/api/comprehensive-assessment', 
                           json={'userId': TEST_USER_ID})
    
    if response.status_code == 201:
        data = response.json()
        print(f"✅ Assessment created successfully")
        print(f"   Session ID: {data['session_id']}")
        print(f"   Assessment ID: {data['assessment_id']}")
        return data['session_id']
    else:
        print(f"❌ Failed to create assessment: {response.text}")
        return None

def test_get_assessment(session_id):
    """Test retrieving an assessment"""
    print(f"\n🧪 Testing: Get assessment {session_id}")
    
    response = requests.get(f'{BASE_URL}/api/comprehensive-assessment/{session_id}')
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Assessment retrieved successfully")
        print(f"   Status: {data['assessment']['status']}")
        print(f"   Current Step: {data['session']['current_step']}")
        return True
    else:
        print(f"❌ Failed to get assessment: {response.text}")
        return False

def test_update_step(session_id):
    """Test updating assessment step"""
    print(f"\n🧪 Testing: Update assessment step")
    
    response = requests.put(f'{BASE_URL}/api/comprehensive-assessment/{session_id}/step',
                          json={
                              'current_step': 'phq9',
                              'session_data': {'steps_completed': ['introduction']}
                          })
    
    if response.status_code == 200:
        print(f"✅ Step updated successfully")
        return True
    else:
        print(f"❌ Failed to update step: {response.text}")
        return False

def test_save_phq9_results(session_id):
    """Test saving PHQ-9 results"""
    print(f"\n🧪 Testing: Save PHQ-9 results")
    
    response = requests.put(f'{BASE_URL}/api/comprehensive-assessment/{session_id}/phq9',
                          json={
                              'score': 12,
                              'severity': 'Moderate',
                              'answers': [2, 1, 2, 1, 2, 1, 2, 1, 1]
                          })
    
    if response.status_code == 200:
        print(f"✅ PHQ-9 results saved successfully")
        return True
    else:
        print(f"❌ Failed to save PHQ-9 results: {response.text}")
        return False

def test_get_user_assessments():
    """Test getting all assessments for a user"""
    print(f"\n🧪 Testing: Get user assessments")
    
    response = requests.get(f'{BASE_URL}/api/comprehensive-assessment/user/{TEST_USER_ID}')
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ User assessments retrieved successfully")
        print(f"   Found {len(data)} assessments")
        return True
    else:
        print(f"❌ Failed to get user assessments: {response.text}")
        return False

def run_tests():
    """Run all API tests"""
    print("🚀 Starting Comprehensive Assessment API Tests")
    print("=" * 50)
    
    # Test 1: Create assessment
    session_id = test_create_assessment()
    if not session_id:
        print("❌ Cannot continue tests without session ID")
        return False
    
    # Test 2: Get assessment
    if not test_get_assessment(session_id):
        return False
    
    # Test 3: Update step
    if not test_update_step(session_id):
        return False
    
    # Test 4: Save PHQ-9 results
    if not test_save_phq9_results(session_id):
        return False
    
    # Test 5: Get user assessments
    if not test_get_user_assessments():
        return False
    
    print("\n" + "=" * 50)
    print("✅ All tests passed successfully!")
    return True

if __name__ == '__main__':
    try:
        success = run_tests()
        if not success:
            print("\n❌ Some tests failed. Check the Flask server is running on port 5001.")
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to Flask server. Make sure it's running on http://127.0.0.1:5001")
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")