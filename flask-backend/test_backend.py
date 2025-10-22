#!/usr/bin/env python3
"""
Simple test script to verify backend functionality
"""

import requests
import json

BASE_URL = "http://localhost:5001"

def test_backend():
    print("🧪 Testing CalmNest Backend...")
    
    # Test 1: Check if backend is running
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("✅ Backend is running")
            print(f"   Response: {response.text}")
        else:
            print(f"❌ Backend returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Make sure it's running on port 5001")
        return False
    
    # Test 2: Test mood groove endpoint
    print("\n🧪 Testing Mood Groove endpoint...")
    test_mood_data = {
        "userId": "test-user-123",
        "dominantMood": "happy",
        "confidence": 0.85,
        "depression": 10.5,
        "anxiety": 15.2,
        "expressions": {
            "happy": 0.85,
            "neutral": 0.10,
            "sad": 0.05
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/mood-groove",
            headers={"Content-Type": "application/json"},
            data=json.dumps(test_mood_data)
        )
        
        if response.status_code == 201:
            print("✅ Mood Groove endpoint working")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Mood Groove endpoint failed with status {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Error testing Mood Groove: {e}")
    
    # Test 3: Test dashboard endpoint
    print("\n🧪 Testing Dashboard endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/dashboard/test-user-123")
        if response.status_code == 200:
            print("✅ Dashboard endpoint working")
            data = response.json()
            print(f"   Found {len(data.get('test_submissions', []))} test submissions")
            print(f"   Found {len(data.get('mood_groove_results', []))} mood groove results")
        else:
            print(f"❌ Dashboard endpoint failed with status {response.status_code}")
    except Exception as e:
        print(f"❌ Error testing Dashboard: {e}")
    
    print("\n🎉 Backend testing completed!")
    return True

if __name__ == "__main__":
    test_backend()
