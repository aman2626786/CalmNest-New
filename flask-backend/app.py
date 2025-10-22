from flask import Flask, request, jsonify, render_template
from datetime import datetime
from flask_cors import CORS
from sqlalchemy import func
from database import db
from models import TestSubmission, MoodGrooveResult, ChatLog, BreathingExerciseLog, ForumPost, Feedback, UserInteraction, FacialAnalysisSession

app = Flask(__name__)
CORS(app) # This will allow your Next.js app to make requests to your Flask app

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:%2A13579%2ASharma@db.lrvmsulryjwgrqwniltm.supabase.co:5432/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_pre_ping': True
}

db.init_app(app)

# Create the database tables if they don't exist
with app.app_context():
    db.create_all()


@app.route('/')
def index():
    return "Welcome to the CalmNest Flask Backend!"

# --- API Endpoints ---

@app.route('/api/test-submission', methods=['POST'])
def add_test_submission():
    data = request.get_json()
    new_submission = TestSubmission(
        user_id=data['userId'],
        test_type=data['test_type'],
        score=data['score'],
        severity=data['severity'],
        answers=data['answers']
    )
    db.session.add(new_submission)
    db.session.commit()
    return jsonify({'message': 'Test submission saved successfully'}), 201

@app.route('/api/mood-groove', methods=['POST'])
def add_mood_groove_result():
    data = request.get_json()
    
    # Debug: Print received data
    print(f"Received data: {data}")
    
    # Check if required fields are present
    required_fields = ['userId', 'dominantMood', 'confidence', 'depression', 'anxiety', 'expressions']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400

    # Validate that dominantMood is not null or empty
    if not data['dominantMood'] or data['dominantMood'] == 'null':
        return jsonify({'error': 'dominantMood cannot be null or empty'}), 400

    try:
        # Create new mood groove result with data from frontend
        new_result = MoodGrooveResult(
            user_id=data['userId'],
            user_email=data.get('userEmail'),
            dominant_mood=data['dominantMood'],
            confidence=data['confidence'],
            depression=data['depression'],
            anxiety=data['anxiety'],
            expressions=data['expressions']
        )
        
        db.session.add(new_result)
        db.session.commit()
        
        return jsonify({
            'message': 'Mood groove result added successfully',
            'id': new_result.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to save mood groove result: {str(e)}'}), 500

@app.route('/api/chat', methods=['POST'])
def add_chat_log():
    data = request.get_json()
    new_log = ChatLog(
        user_id=data['userId'],
        message=data['message'],
        sender=data['sender']
    )
    db.session.add(new_log)
    db.session.commit()
    return jsonify({'message': 'Chat log added successfully'}), 201

@app.route('/api/breathing-exercise', methods=['POST'])
def add_breathing_log():
    data = request.get_json()
    
    # Debug: Print received data
    print(f"Received breathing exercise data: {data}")
    
    try:
        new_log = BreathingExerciseLog(
            user_id=data['userId'],
            exercise_name=data['exercise_name'],
            duration_seconds=data['duration_seconds']
        )
        db.session.add(new_log)
        db.session.commit()
        print(f"Breathing exercise saved successfully for user {data['userId']}")
        return jsonify({'message': 'Breathing exercise log added successfully'}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error saving breathing exercise: {str(e)}")
        return jsonify({'error': f'Failed to save breathing exercise: {str(e)}'}), 500

@app.route('/api/forum', methods=['GET', 'POST'])
def forum():
    if request.method == 'POST':
        data = request.get_json()
        new_post = ForumPost(
            user_id=data['userId'],
            title=data['title'],
            content=data['content'],
            author=data['author'],
            is_approved=True # Automatically approve new posts
        )
        db.session.add(new_post)
        db.session.commit()
        return jsonify({'message': 'Forum post created successfully'}), 201
    else:
        # Only show approved posts to everyone
        posts = ForumPost.query.filter_by(is_approved=True).all()
        return jsonify([{
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'author': post.author,
            'timestamp': post.timestamp
        } for post in posts])

@app.route('/api/feedback', methods=['POST'])
def add_feedback():
    data = request.get_json()
    new_feedback = Feedback(
        user_id=data['userId'],
        feedback_text=data['feedback_text'],
        rating=data.get('rating'),
        is_featured=True # Automatically feature new feedback
    )
    db.session.add(new_feedback)
    db.session.commit()
    return jsonify({'message': 'Feedback submitted successfully'}), 201

@app.route('/api/feedback', methods=['GET'])
def get_featured_feedback():
    feedbacks = Feedback.query.filter_by(is_featured=True).all()
    return jsonify([{
        'id': f.id,
        'feedback_text': f.feedback_text,
        'rating': f.rating,
        'timestamp': f.timestamp
    } for f in feedbacks])

@app.route('/api/interactions', methods=['POST'])
def log_interaction():
    data = request.get_json()
    new_interaction = UserInteraction(
        user_id=data['userId'],
        interaction_type=data['interaction_type'],
        details=data.get('details')
    )
    db.session.add(new_interaction)
    db.session.commit()
    return jsonify({'message': 'Interaction logged successfully'}), 201

@app.route('/api/facial-analysis', methods=['POST'])
def add_facial_analysis():
    data = request.get_json()
    
    # Debug: Print received data
    print(f"Received facial analysis data: {data}")
    
    # Check if required fields are present
    required_fields = ['userEmail', 'sessionStartTime', 'sessionEndTime', 'totalDetections', 'dominantMood', 'avgConfidence', 'avgDepression', 'avgAnxiety', 'moodDistribution', 'rawData']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400

    try:
        # Create new facial analysis session
        new_session = FacialAnalysisSession(
            user_email=data['userEmail'],
            session_start_time=datetime.fromisoformat(data['sessionStartTime'].replace('Z', '+00:00')),
            session_end_time=datetime.fromisoformat(data['sessionEndTime'].replace('Z', '+00:00')),
            total_detections=data['totalDetections'],
            dominant_mood=data['dominantMood'],
            avg_confidence=data['avgConfidence'],
            avg_depression=data['avgDepression'],
            avg_anxiety=data['avgAnxiety'],
            mood_distribution=data['moodDistribution'],
            raw_data=data['rawData']
        )
        
        db.session.add(new_session)
        db.session.commit()
        
        return jsonify({
            'message': 'Facial analysis session saved successfully',
            'id': new_session.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to save facial analysis session: {str(e)}'}), 500

@app.route('/api/mood-groove-by-email/<user_email>')
def get_mood_groove_by_email(user_email):
    mood_groove_results = MoodGrooveResult.query.filter_by(user_email=user_email).all()
    return jsonify([{
        'id': res.id,
        'user_id': res.user_id,
        'user_email': res.user_email,
        'dominant_mood': res.dominant_mood,
        'confidence': res.confidence,
        'depression': res.depression,
        'anxiety': res.anxiety,
        'expressions': res.expressions,
        'timestamp': res.timestamp.isoformat()
    } for res in mood_groove_results])

# --- Dashboard ---

@app.route('/api/dashboard/overall/<user_id>')
def dashboard_overall(user_id):
    test_submissions = TestSubmission.query.filter_by(user_id=user_id).all()
    mood_groove_results = MoodGrooveResult.query.filter_by(user_id=user_id).all()
    breathing_logs = BreathingExerciseLog.query.filter_by(user_id=user_id).all()

    test_count = len(test_submissions)

    return jsonify({
        'test_submissions': [{
            'id': sub.id,
            'user_id': sub.user_id,
            'test_type': sub.test_type,
            'score': sub.score,
            'severity': sub.severity,
            'answers': sub.answers,
            'timestamp': sub.timestamp.isoformat()
        } for sub in test_submissions],
        'mood_groove_results': [{
            'id': res.id,
            'user_id': res.user_id,
            'dominant_mood': res.dominant_mood,
            'confidence': res.confidence,
            'depression': res.depression,
            'anxiety': res.anxiety,
            'expressions': res.expressions,
            'timestamp': res.timestamp.isoformat()
        } for res in mood_groove_results],
        'breathing_exercises': [{
            'id': log.id,
            'user_id': log.user_id,
            'exercise_name': log.exercise_name,
            'duration_seconds': log.duration_seconds,
            'timestamp': log.timestamp.isoformat()
        } for log in breathing_logs],
        'test_count': test_count
    })

@app.route('/dashboard/<user_id>')
def dashboard(user_id):
    date_str = request.args.get('date')
    
    query = TestSubmission.query.filter_by(user_id=user_id)
    
    if date_str:
        try:
            # Assuming date is in YYYY-MM-DD format
            submission_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            query = query.filter(func.date(TestSubmission.timestamp) == submission_date)
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD.'}), 400

    test_submissions = query.all()
    mood_groove_results = MoodGrooveResult.query.filter_by(user_id=user_id).all()
    breathing_logs = BreathingExerciseLog.query.filter_by(user_id=user_id).all()

    test_count = len(test_submissions)

    return jsonify({
        'test_submissions': [{
            'id': sub.id,
            'user_id': sub.user_id,
            'test_type': sub.test_type,
            'score': sub.score,
            'severity': sub.severity,
            'answers': sub.answers,
            'timestamp': sub.timestamp.isoformat()
        } for sub in test_submissions],
        'mood_groove_results': [{
            'id': res.id,
            'user_id': res.user_id,
            'dominant_mood': res.dominant_mood,
            'confidence': res.confidence,
            'depression': res.depression,
            'anxiety': res.anxiety,
            'expressions': res.expressions,
            'timestamp': res.timestamp.isoformat()
        } for res in mood_groove_results],
        'breathing_exercises': [{
            'id': log.id,
            'user_id': log.user_id,
            'exercise_name': log.exercise_name,
            'duration_seconds': log.duration_seconds,
            'timestamp': log.timestamp.isoformat()
        } for log in breathing_logs],
        'test_count': test_count
    })

@app.route('/facial-analysis/<user_email>')
def facial_analysis_dashboard(user_email):
    facial_sessions = FacialAnalysisSession.query.filter_by(user_email=user_email).all()
    
    return jsonify({
        'facial_analysis_sessions': [{
            'id': session.id,
            'user_email': session.user_email,
            'session_start_time': session.session_start_time.isoformat(),
            'session_end_time': session.session_end_time.isoformat(),
            'total_detections': session.total_detections,
            'dominant_mood': session.dominant_mood,
            'avg_confidence': session.avg_confidence,
            'avg_depression': session.avg_depression,
            'avg_anxiety': session.avg_anxiety,
            'mood_distribution': session.mood_distribution,
            'raw_data': session.raw_data,
            'timestamp': session.timestamp.isoformat()
        } for session in facial_sessions],
        'total_sessions': len(facial_sessions)
    })

# --- Admin Routes (for managing forum posts and feedback) ---

@app.route('/admin/forum/pending', methods=['GET'])
def get_pending_forum_posts():
    posts = ForumPost.query.filter_by(is_approved=False).all()
    return jsonify([{'id': post.id, 'title': post.title, 'content': post.content} for post in posts])

@app.route('/admin/forum/approve/<int:post_id>', methods=['POST'])
def approve_forum_post(post_id):
    post = ForumPost.query.get(post_id)
    if post:
        post.is_approved = True
        db.session.commit()
        return jsonify({'message': 'Post approved'})
    return jsonify({'message': 'Post not found'}), 404

@app.route('/admin/feedback/feature/<int:feedback_id>', methods=['POST'])
def feature_feedback(feedback_id):
    feedback = Feedback.query.get(feedback_id)
    if feedback:
        feedback.is_featured = True
        db.session.commit()
        return jsonify({'message': 'Feedback featured'})
    return jsonify({'message': 'Feedback not found'}), 404


@app.route('/dev/reset-db')
def reset_db():
    # This is a temporary development route to reset the entire database.
    # It will delete all data in all tables.
    with app.app_context():
        db.drop_all()
        db.create_all()
    return "Database has been reset."


if __name__ == '__main__':
    app.run(debug=True, port=5001)