# Comprehensive Assessment API Documentation

This document describes the API endpoints for the Comprehensive Mental Health Assessment System.

## Database Models

### ComprehensiveAssessment
Stores the complete assessment results for a user session.

**Fields:**
- `id`: Primary key
- `user_id`: User identifier
- `session_id`: Unique session identifier (UUID)
- `status`: Assessment status (`in_progress`, `completed`, `abandoned`)
- `started_at`: Assessment start timestamp
- `completed_at`: Assessment completion timestamp
- Assessment scores and results for PHQ-9, GAD-7, Mood Grove, and additional assessments
- `analysis_prompt`: Generated analysis text for chatbot interaction

### AssessmentSession
Manages session state and progress tracking.

**Fields:**
- `session_id`: Links to ComprehensiveAssessment
- `current_step`: Current assessment step
- `session_data`: JSON data for progress and temporary answers
- `last_activity`: Last activity timestamp

## API Endpoints

### 1. Create Assessment
**POST** `/api/comprehensive-assessment`

Creates a new comprehensive assessment session.

**Request Body:**
```json
{
  "userId": "string"
}
```

**Response:**
```json
{
  "message": "Comprehensive assessment created successfully",
  "session_id": "uuid-string",
  "assessment_id": 123
}
```

### 2. Get Assessment
**GET** `/api/comprehensive-assessment/{session_id}`

Retrieves assessment data and session state.

**Response:**
```json
{
  "assessment": {
    "id": 123,
    "session_id": "uuid-string",
    "user_id": "string",
    "status": "in_progress",
    "started_at": "2024-01-01T00:00:00",
    "phq9_score": 12,
    "phq9_severity": "Moderate",
    // ... other assessment results
  },
  "session": {
    "current_step": "phq9",
    "session_data": {},
    "last_activity": "2024-01-01T00:00:00"
  }
}
```

### 3. Update Assessment Step
**PUT** `/api/comprehensive-assessment/{session_id}/step`

Updates current step and saves progress.

**Request Body:**
```json
{
  "current_step": "string",
  "session_data": {}
}
```

### 4. Save PHQ-9 Results
**PUT** `/api/comprehensive-assessment/{session_id}/phq9`

Saves PHQ-9 assessment results.

**Request Body:**
```json
{
  "score": 12,
  "severity": "Moderate",
  "answers": [2, 1, 2, 1, 2, 1, 2, 1, 1]
}
```

### 5. Save GAD-7 Results
**PUT** `/api/comprehensive-assessment/{session_id}/gad7`

Saves GAD-7 assessment results.

**Request Body:**
```json
{
  "score": 8,
  "severity": "Mild",
  "answers": [1, 1, 2, 1, 1, 1, 1]
}
```

### 6. Save Mood Grove Results
**PUT** `/api/comprehensive-assessment/{session_id}/mood-groove`

Saves Mood Grove facial analysis results.

**Request Body:**
```json
{
  "dominantMood": "happy",
  "confidence": 0.85,
  "depression": 0.2,
  "anxiety": 0.3,
  "expressions": {}
}
```

### 7. Save Additional Assessments
**PUT** `/api/comprehensive-assessment/{session_id}/additional`

Saves results from additional assessment modules.

**Request Body:**
```json
{
  "resilience": {
    "score": 18,
    "answers": [3, 3, 3, 3, 3, 3]
  },
  "stress": {
    "score": 8,
    "answers": [2, 2, 2, 2]
  },
  "sleep_quality": {
    "score": 6,
    "answers": [2, 2, 2]
  },
  "social_support": {
    "score": 9,
    "answers": [3, 3, 3]
  }
}
```

### 8. Complete Assessment
**PUT** `/api/comprehensive-assessment/{session_id}/complete`

Marks assessment as completed and saves final analysis.

**Request Body:**
```json
{
  "overall_severity": "Moderate",
  "risk_level": "Medium",
  "analysis_prompt": "Generated analysis text...",
  "recommendations": []
}
```

### 9. Get User Assessments
**GET** `/api/comprehensive-assessment/user/{user_id}`

Retrieves all assessments for a specific user.

**Response:**
```json
[
  {
    "id": 123,
    "session_id": "uuid-string",
    "status": "completed",
    "started_at": "2024-01-01T00:00:00",
    "completed_at": "2024-01-01T00:20:00",
    "overall_severity": "Moderate",
    "risk_level": "Medium",
    "phq9_score": 12,
    "gad7_score": 8,
    "mood_groove_dominant_mood": "happy"
  }
]
```

## Assessment Flow Steps

1. **introduction** - User consent and overview
2. **phq9** - PHQ-9 depression assessment
3. **gad7** - GAD-7 anxiety assessment
4. **mood-groove** - Facial emotion analysis
5. **additional** - Resilience, stress, sleep, social support
6. **results** - Analysis generation and presentation

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `404` - Not found
- `500` - Server error

Error responses include a descriptive message:
```json
{
  "error": "Description of the error"
}
```

## Migration

Run the migration script to create the new database tables:

```bash
cd flask-backend
python migrate_comprehensive_assessment.py
```

## Testing

Test the API endpoints:

```bash
cd flask-backend
python test_comprehensive_assessment_api.py
```