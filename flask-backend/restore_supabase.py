#!/usr/bin/env python3
"""
Try to restore Supabase connection with different approaches
"""
import os
import sys
import psycopg2
from urllib.parse import urlparse

def try_connection_methods():
    # Original URL
    original_url = "postgresql://postgres:%2A13579%2ASharma@db.lrvmsulryjwgrqwniltm.supabase.co:5432/postgres"
    
    # Alternative URLs to try
    urls_to_try = [
        original_url,
        # Try with different SSL modes
        original_url + "?sslmode=require",
        original_url + "?sslmode=prefer", 
        original_url + "?sslmode=disable",
        # Try with connection timeout
        original_url + "?connect_timeout=30",
    ]
    
    for i, url in enumerate(urls_to_try):
        print(f"\n--- Attempt {i+1}: {url.split('?')[0]}{'?' + url.split('?')[1] if '?' in url else ''} ---")
        try:
            conn = psycopg2.connect(url)
            print("✅ SUCCESS! Connection established")
            
            # Test a simple query
            cursor = conn.cursor()
            cursor.execute("SELECT version();")
            version = cursor.fetchone()
            print(f"Database version: {version[0]}")
            
            cursor.close()
            conn.close()
            return url
            
        except Exception as e:
            print(f"❌ Failed: {e}")
    
    return None

if __name__ == '__main__':
    working_url = try_connection_methods()
    if working_url:
        print(f"\n🎉 Working URL found: {working_url}")
    else:
        print("\n😞 No working connection found")