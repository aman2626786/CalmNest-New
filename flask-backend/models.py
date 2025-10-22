from database import db
from datetime import datetime

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
    user_email = db.Column(db.String(255), nullable=True)
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
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    is_approved = db.Column(db.Boolean, default=False) # For admin approval

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, nullable=False)
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