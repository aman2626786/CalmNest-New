#!/usr/bin/env python3
"""
Try to resolve Supabase hostname and create connection
"""
import socket
import subprocess
import sys

def try_resolve_hostname():
    hostname = "db.lrvmsulryjwgrqwniltm.supabase.co"
    
    print(f"Trying to resolve: {hostname}")
    
    # Try different methods
    methods = [
        ("socket.gethostbyname", lambda: socket.gethostbyname(hostname)),
        ("socket.getaddrinfo", lambda: socket.getaddrinfo(hostname, 5432, socket.AF_INET)),
    ]
    
    for method_name, method in methods:
        try:
            result = method()
            print(f"✅ {method_name}: {result}")
            return result
        except Exception as e:
            print(f"❌ {method_name}: {e}")
    
    # Try using external DNS
    try:
        result = subprocess.run(['nslookup', hostname, '8.8.8.8'], 
                              capture_output=True, text=True, timeout=10)
        print(f"nslookup result: {result.stdout}")
    except Exception as e:
        print(f"nslookup failed: {e}")
    
    return None

if __name__ == '__main__':
    try_resolve_hostname()