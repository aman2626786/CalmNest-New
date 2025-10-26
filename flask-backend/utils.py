"""
Utility functions for Flask backend
"""
from datetime import datetime
import logging

def safe_isoformat(datetime_obj):
    """
    Safely format datetime to ISO string, handling None values
    
    Args:
        datetime_obj: datetime object or None
        
    Returns:
        str: ISO formatted datetime string or None if input is None
    """
    if datetime_obj is None:
        return None
    
    try:
        return datetime_obj.isoformat()
    except Exception as e:
        logging.warning(f"Error formatting datetime {datetime_obj}: {e}")
        return None

def safe_getattr(obj, attr, default=None):
    """
    Safely get attribute from object, handling None objects and missing attributes
    
    Args:
        obj: Object to get attribute from
        attr: Attribute name
        default: Default value if attribute doesn't exist or obj is None
        
    Returns:
        Attribute value or default
    """
    if obj is None:
        return default
    
    try:
        return getattr(obj, attr, default)
    except Exception as e:
        logging.warning(f"Error getting attribute {attr} from {obj}: {e}")
        return default

def create_error_response(message, details=None, status_code=500):
    """
    Create standardized error response
    
    Args:
        message: Error message
        details: Additional error details
        status_code: HTTP status code
        
    Returns:
        tuple: (response_dict, status_code)
    """
    response = {
        'error': message,
        'timestamp': datetime.utcnow().isoformat()
    }
    
    if details:
        response['details'] = details
        
    return response, status_code

def log_error(endpoint, error, user_id=None, additional_context=None):
    """
    Log error with context information
    
    Args:
        endpoint: API endpoint where error occurred
        error: Exception or error message
        user_id: User ID if available
        additional_context: Additional context information
    """
    context = {
        'endpoint': endpoint,
        'error': str(error),
        'user_id': user_id,
        'timestamp': datetime.utcnow().isoformat()
    }
    
    if additional_context:
        context.update(additional_context)
    
    logging.error(f"API Error: {context}")