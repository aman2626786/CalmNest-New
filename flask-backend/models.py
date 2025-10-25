from database import db
from datetime import datetime
import uuid

# This new model is the correct way to store test results.
class TestSubmission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, nullable=False)
    test_type = db.Column(db.String(50), nullable=False) # e.g., 'PHQ-9', 'GAD-7'
    score = db.Column(db.Integer, nullable=False)
    severity = db.Column(db.String(100), nullable=False) # e.g., 'Mild', 'Moderate'
    answers = db.Column(db.JSON, nullable=False) # Store all Q&As here
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class MoodGrooveResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, nullable=False)
    user_email = db.Column(db.String(255), nullable=True)  # Made nullable for backward compatibility
    dominant_mood = db.Column(db.String(100), nullable=False)
    confidence = db.Column(db.Float, nullable=False)
    depression = db.Column(db.Float, nullable=False)
    anxiety = db.Column(db.Float, nullable=False)
    expressions = db.Column(db.JSON, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class ChatLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, nullable=False)
    message = db.Column(db.Text, nullable=False)
    sender = db.Column(db.String(100), nullable=False) # 'user' or 'bot'
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class BreathingExerciseLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, nullable=False)
    exercise_name = db.Column(db.String(200), nullable=False)
    duration_seconds = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class ForumPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, nullable=False)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=True, default='General')  # Added category field
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    is_approved = db.Column(db.Boolean, default=False) # For admin approval

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, nullable=False)
    user_name = db.Column(db.String(100), nullable=True, default='Anonymous')  # Added user name field
    feedback_text = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=True) # e.g., 1-5 stars
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    is_featured = db.Column(db.Boolean, default=False) # For admin to feature

class UserInteraction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, nullable=False)
    interaction_type = db.Column(db.String(200), nullable=False) # e.g., 'page_view', 'button_click'
    details = db.Column(db.JSON, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class FacialAnalysisSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(255), nullable=False)
    session_start_time = db.Column(db.DateTime, nullable=False)
    session_end_time = db.Column(db.DateTime, nullable=False)
    total_detections = db.Column(db.Integer, nullable=False)
    dominant_mood = db.Column(db.String(100), nullable=False)
    avg_confidence = db.Column(db.Float, nullable=False)
    avg_depression = db.Column(db.Float, nullable=False)
    avg_anxiety = db.Column(db.Float, nullable=False)
    mood_distribution = db.Column(db.JSON, nullable=False)
    raw_data = db.Column(db.JSON, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class ComprehensiveAssessment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, nullable=False)
    session_id = db.Column(db.String, unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    status = db.Column(db.String(50), default='in_progress')  # in_progress, completed, abandoned
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    # Assessment Results
    phq9_score = db.Column(db.Integer, nullable=True)
    phq9_severity = db.Column(db.String(100), nullable=True)
    phq9_answers = db.Column(db.JSON, nullable=True)
    gad7_score = db.Column(db.Integer, nullable=True)
    gad7_severity = db.Column(db.String(100), nullable=True)
    gad7_answers = db.Column(db.JSON, nullable=True)
    
    # Mood Grove Results
    mood_groove_dominant_mood = db.Column(db.String(100), nullable=True)
    mood_groove_confidence = db.Column(db.Float, nullable=True)
    mood_groove_depression = db.Column(db.Float, nullable=True)
    mood_groove_anxiety = db.Column(db.Float, nullable=True)
    mood_groove_expressions = db.Column(db.JSON, nullable=True)
    
    # Additional Assessments
    resilience_score = db.Column(db.Integer, nullable=True)
    resilience_answers = db.Column(db.JSON, nullable=True)
    stress_score = db.Column(db.Integer, nullable=True)
    stress_answers = db.Column(db.JSON, nullable=True)
    sleep_quality_score = db.Column(db.Integer, nullable=True)
    sleep_quality_answers = db.Column(db.JSON, nullable=True)
    social_support_score = db.Column(db.Integer, nullable=True)
    social_support_answers = db.Column(db.JSON, nullable=True)
    
    # Generated Analysis
    overall_severity = db.Column(db.String(100), nullable=True)
    risk_level = db.Column(db.String(50), nullable=True)
    analysis_prompt = db.Column(db.Text, nullable=True)
    recommendations = db.Column(db.JSON, nullable=True)
    
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class AssessmentSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String, nullable=False)
    user_id = db.Column(db.String, nullable=False)
    current_step = db.Column(db.String(100), nullable=False)
    session_data = db.Column(db.JSON, nullable=False)  # Store progress and answers
    last_activity = db.Column(db.DateTime, default=datetime.utcnow)
    
    def update_activity(self):
        self.last_activity = datetime.utcnow()
        db.session.commit()

class Profile(db.Model):
    id = db.Column(db.String, primary_key=True)  # User ID from authentication
    email = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(255), nullable=True)
    age = db.Column(db.Integer, nullable=True)
    gender = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)