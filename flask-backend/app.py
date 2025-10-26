from flask import Flask, request, jsonify, render_template
from datetime import datetime
from flask_cors import CORS
from sqlalchemy import func
from database import db
from models import TestSubmission, MoodGrooveResult, ChatLog, BreathingExerciseLog, ForumPost, Feedback, UserInteraction, FacialAnalysisSession, ComprehensiveAssessment, AssessmentSession, Profile

app = Flask(__name__)

# CORS Configuration for production
import os
allowed_origins = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000').split(',')
CORS(app, origins=allowed_origins)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:%2A13579%2ASharma@db.lrvmsulryjwgrqwniltm.supabase.co:5432/postgres')
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
        
        # Debug logging
        print(f"Forum POST data received: {data}")
        
        # Validate required fields
        if not data.get('userId') or not data.get('title') or not data.get('content'):
            return jsonify({'error': 'Missing required fields: userId, title, content'}), 400
        
        try:
            new_post = ForumPost(
                user_id=data['userId'],
                title=data['title'],
                content=data['content'],
                author=data.get('author', 'Anonymous'),
                category=data.get('category', 'General'),
                is_approved=True # Automatically approve new posts
            )
            db.session.add(new_post)
            db.session.commit()
            
            print(f"Forum post created successfully with ID: {new_post.id}")
            return jsonify({
                'message': 'Forum post created successfully',
                'id': new_post.id
            }), 201
            
        except Exception as e:
            db.session.rollback()
            print(f"Error creating forum post: {str(e)}")
            return jsonify({'error': f'Failed to create forum post: {str(e)}'}), 500
    else:
        # Only show approved posts to everyone
        try:
            posts = ForumPost.query.filter_by(is_approved=True).order_by(ForumPost.timestamp.desc()).all()
            return jsonify([{
                'id': post.id,
                'title': post.title,
                'content': post.content,
                'author': post.author,
                'category': getattr(post, 'category', 'General'),  # Handle missing category gracefully
                'timestamp': post.timestamp.isoformat(),
                'replyCount': 0  # Placeholder for reply count
            } for post in posts])
        except Exception as e:
            print(f"Error fetching forum posts: {str(e)}")
            return jsonify({'error': f'Failed to fetch forum posts: {str(e)}'}), 500

@app.route('/api/feedback', methods=['POST'])
def add_feedback():
    data = request.get_json()
    
    # Debug logging
    print(f"Feedback POST data received: {data}")
    
    try:
        new_feedback = Feedback(
            user_id=data['userId'],
            user_name=data.get('userName', 'Anonymous'),
            feedback_text=data['feedback_text'],
            rating=data.get('rating'),
            is_featured=True # Automatically feature new feedback
        )
        db.session.add(new_feedback)
        db.session.commit()
        
        print(f"Feedback created successfully with ID: {new_feedback.id}")
        return jsonify({
            'message': 'Feedback submitted successfully',
            'id': new_feedback.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error creating feedback: {str(e)}")
        return jsonify({'error': f'Failed to submit feedback: {str(e)}'}), 500

@app.route('/api/feedback', methods=['GET'])
def get_featured_feedback():
    feedbacks = Feedback.query.filter_by(is_featured=True).order_by(Feedback.timestamp.desc()).all()
    return jsonify([{
        'id': f.id,
        'user_name': getattr(f, 'user_name', 'Anonymous'),
        'feedback_text': f.feedback_text,
        'rating': f.rating,
        'timestamp': f.timestamp.isoformat()
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

@app.route('/api/mood-groove', methods=['POST'])
def save_mood_groove_result():
    data = request.get_json()
    
    try:
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
        
        return jsonify({'message': 'Mood groove result saved successfully'}), 201
    except Exception as e:
        print(f"Error saving mood groove result: {e}")
        return jsonify({'error': 'Failed to save mood groove result'}), 500

@app.route('/api/mood-groove/history/<user_id>', methods=['GET'])
def get_mood_groove_history(user_id):
    try:
        results = MoodGrooveResult.query.filter_by(user_id=user_id).order_by(MoodGrooveResult.timestamp.desc()).limit(50).all()
        
        return jsonify([{
            'id': result.id,
            'dominant_mood': result.dominant_mood,
            'confidence': result.confidence,
            'depression': result.depression,
            'anxiety': result.anxiety,
            'expressions': result.expressions,
            'created_at': result.timestamp.isoformat()
        } for result in results])
    except Exception as e:
        print(f"Error fetching mood groove history: {e}")
        return jsonify({'error': 'Failed to fetch mood groove history'}), 500

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

@app.route('/api/dashboard/unified/<user_id>/<user_email>')
def unified_dashboard(user_id, user_email):
    """Unified dashboard endpoint that fetches all user data by both ID and email"""
    try:
        print(f"Unified Dashboard: Fetching data for user_id={user_id}, user_email={user_email}")
        
        # Fetch test submissions by user_id
        test_submissions = TestSubmission.query.filter_by(user_id=user_id).all()
        print(f"Found {len(test_submissions)} test submissions")
        
        # Fetch mood groove results by user_id (safer approach)
        mood_groove_results_by_id = MoodGrooveResult.query.filter_by(user_id=user_id).all()
        print(f"Found {len(mood_groove_results_by_id)} mood groove results by ID")
        
        # Try to fetch by email if column exists, otherwise skip
        mood_groove_results_by_email = []
        try:
            mood_groove_results_by_email = MoodGrooveResult.query.filter_by(user_email=user_email).all()
            print(f"Found {len(mood_groove_results_by_email)} mood groove results by email")
        except Exception as e:
            print(f"Warning: Could not fetch mood groove by email (column may not exist): {e}")
        
        # Combine and deduplicate mood groove results
        all_mood_results = {}
        for result in mood_groove_results_by_id + mood_groove_results_by_email:
            all_mood_results[result.id] = result
        
        # Fetch breathing exercises by user_id
        breathing_logs = BreathingExerciseLog.query.filter_by(user_id=user_id).all()
        print(f"Found {len(breathing_logs)} breathing exercises")
        
        # Fetch facial analysis by user_email
        facial_sessions = FacialAnalysisSession.query.filter_by(user_email=user_email).all()
        print(f"Found {len(facial_sessions)} facial analysis sessions")
        
        # Fetch comprehensive assessments by user_id
        comprehensive_assessments = ComprehensiveAssessment.query.filter_by(user_id=user_id).all()
        print(f"Found {len(comprehensive_assessments)} comprehensive assessments")
        
        # Fetch user profile
        user_profile = Profile.query.filter_by(id=user_id).first()
        print(f"Found profile: {user_profile.full_name if user_profile else 'None'}")

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
                'user_email': res.user_email,
                'dominant_mood': res.dominant_mood,
                'confidence': res.confidence,
                'depression': res.depression,
                'anxiety': res.anxiety,
                'expressions': res.expressions,
                'timestamp': res.timestamp.isoformat()
            } for res in all_mood_results.values()],
            'breathing_exercises': [{
                'id': log.id,
                'user_id': log.user_id,
                'exercise_name': log.exercise_name,
                'duration_seconds': log.duration_seconds,
                'timestamp': log.timestamp.isoformat()
            } for log in breathing_logs],
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
            'comprehensive_assessments': [{
                'id': assessment.id,
                'session_id': assessment.session_id,
                'status': assessment.status,
                'started_at': assessment.started_at.isoformat(),
                'completed_at': assessment.completed_at.isoformat() if assessment.completed_at else None,
                'phq9_score': assessment.phq9_score,
                'phq9_severity': assessment.phq9_severity,
                'gad7_score': assessment.gad7_score,
                'gad7_severity': assessment.gad7_severity,
                'mood_groove_dominant_mood': assessment.mood_groove_dominant_mood,
                'mood_groove_confidence': assessment.mood_groove_confidence,
                'mood_groove_depression': assessment.mood_groove_depression,
                'mood_groove_anxiety': assessment.mood_groove_anxiety,
                'resilience_score': assessment.resilience_score,
                'stress_score': assessment.stress_score,
                'sleep_quality_score': assessment.sleep_quality_score,
                'social_support_score': assessment.social_support_score,
                'overall_severity': assessment.overall_severity,
                'risk_level': assessment.risk_level,
                'analysis_prompt': assessment.analysis_prompt,
                'timestamp': assessment.timestamp.isoformat()
            } for assessment in comprehensive_assessments],
            'test_count': len(test_submissions),
            'total_sessions': len(facial_sessions),
            'comprehensive_assessments_count': len(comprehensive_assessments),
            'user_profile': {
                'id': user_profile.id,
                'email': user_profile.email,
                'full_name': user_profile.full_name,
                'age': user_profile.age,
                'gender': user_profile.gender,
                'updated_at': user_profile.updated_at.isoformat()
            } if user_profile else None
        })
    except Exception as e:
        return jsonify({'error': f'Failed to fetch unified dashboard data: {str(e)}'}), 500

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
    
    # Safely fetch mood groove results
    try:
        mood_groove_results = MoodGrooveResult.query.filter_by(user_id=user_id).all()
    except Exception as e:
        print(f"Error fetching mood groove results: {e}")
        mood_groove_results = []
    
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

# --- Comprehensive Assessment API Endpoints ---

@app.route('/api/comprehensive-assessment', methods=['POST'])
def create_comprehensive_assessment():
    """Create a new comprehensive assessment session"""
    data = request.get_json()
    
    try:
        new_assessment = ComprehensiveAssessment(
            user_id=data['userId']
        )
        db.session.add(new_assessment)
        db.session.commit()
        
        # Create initial session data
        session_data = AssessmentSession(
            session_id=new_assessment.session_id,
            user_id=data['userId'],
            current_step='introduction',
            session_data={'started': True, 'steps_completed': []}
        )
        db.session.add(session_data)
        db.session.commit()
        
        return jsonify({
            'message': 'Comprehensive assessment created successfully',
            'session_id': new_assessment.session_id,
            'assessment_id': new_assessment.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create comprehensive assessment: {str(e)}'}), 500

@app.route('/api/comprehensive-assessment/<session_id>', methods=['GET'])
def get_comprehensive_assessment(session_id):
    """Get comprehensive assessment by session ID"""
    try:
        assessment = ComprehensiveAssessment.query.filter_by(session_id=session_id).first()
        if not assessment:
            return jsonify({'error': 'Assessment not found'}), 404
            
        session_data = AssessmentSession.query.filter_by(session_id=session_id).first()
        
        return jsonify({
            'assessment': {
                'id': assessment.id,
                'session_id': assessment.session_id,
                'user_id': assessment.user_id,
                'status': assessment.status,
                'started_at': assessment.started_at.isoformat(),
                'completed_at': assessment.completed_at.isoformat() if assessment.completed_at else None,
                'phq9_score': assessment.phq9_score,
                'phq9_severity': assessment.phq9_severity,
                'gad7_score': assessment.gad7_score,
                'gad7_severity': assessment.gad7_severity,
                'mood_groove_dominant_mood': assessment.mood_groove_dominant_mood,
                'mood_groove_confidence': assessment.mood_groove_confidence,
                'resilience_score': assessment.resilience_score,
                'stress_score': assessment.stress_score,
                'sleep_quality_score': assessment.sleep_quality_score,
                'social_support_score': assessment.social_support_score,
                'overall_severity': assessment.overall_severity,
                'risk_level': assessment.risk_level,
                'analysis_prompt': assessment.analysis_prompt
            },
            'session': {
                'current_step': session_data.current_step if session_data else 'introduction',
                'session_data': session_data.session_data if session_data else {},
                'last_activity': session_data.last_activity.isoformat() if session_data else None
            }
        })
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch assessment: {str(e)}'}), 500

@app.route('/api/comprehensive-assessment/<session_id>/step', methods=['PUT'])
def update_assessment_step(session_id):
    """Update current step and save progress"""
    data = request.get_json()
    
    # Debug logging
    print(f"Updating step for session {session_id}")
    print(f"Received data: {data}")
    
    try:
        session_data = AssessmentSession.query.filter_by(session_id=session_id).first()
        if not session_data:
            print(f"Session not found: {session_id}")
            return jsonify({'error': 'Session not found'}), 404
            
        # Update session data
        old_step = session_data.current_step
        old_data = session_data.session_data
        
        session_data.current_step = data.get('current_step', session_data.current_step)
        session_data.session_data = data.get('session_data', session_data.session_data)
        session_data.last_activity = datetime.utcnow()
        
        print(f"Updated step from '{old_step}' to '{session_data.current_step}'")
        print(f"Updated session data: {session_data.session_data}")
        
        # Commit the changes
        db.session.commit()
        print("Changes committed successfully")
        
        return jsonify({'message': 'Step updated successfully'})
        
    except Exception as e:
        db.session.rollback()
        print(f"Error updating step: {str(e)}")
        return jsonify({'error': f'Failed to update step: {str(e)}'}), 500

@app.route('/api/comprehensive-assessment/<session_id>/phq9', methods=['PUT'])
def save_phq9_results(session_id):
    """Save PHQ-9 assessment results"""
    data = request.get_json()
    
    # Debug logging
    print(f"Saving PHQ-9 results for session {session_id}")
    print(f"PHQ-9 data: {data}")
    
    try:
        assessment = ComprehensiveAssessment.query.filter_by(session_id=session_id).first()
        if not assessment:
            print(f"Assessment not found for session: {session_id}")
            return jsonify({'error': 'Assessment not found'}), 404
            
        assessment.phq9_score = data['score']
        assessment.phq9_severity = data['severity']
        assessment.phq9_answers = data['answers']
        
        print(f"PHQ-9 saved: score={assessment.phq9_score}, severity={assessment.phq9_severity}")
        
        db.session.commit()
        print("PHQ-9 results committed successfully")
        return jsonify({'message': 'PHQ-9 results saved successfully'})
        
    except Exception as e:
        db.session.rollback()
        print(f"Error saving PHQ-9: {str(e)}")
        return jsonify({'error': f'Failed to save PHQ-9 results: {str(e)}'}), 500

@app.route('/api/comprehensive-assessment/<session_id>/gad7', methods=['PUT'])
def save_gad7_results(session_id):
    """Save GAD-7 assessment results"""
    data = request.get_json()
    
    # Debug logging
    print(f"Saving GAD-7 results for session {session_id}")
    print(f"GAD-7 data: {data}")
    
    try:
        assessment = ComprehensiveAssessment.query.filter_by(session_id=session_id).first()
        if not assessment:
            print(f"Assessment not found for session: {session_id}")
            return jsonify({'error': 'Assessment not found'}), 404
            
        assessment.gad7_score = data['score']
        assessment.gad7_severity = data['severity']
        assessment.gad7_answers = data['answers']
        
        print(f"GAD-7 saved: score={assessment.gad7_score}, severity={assessment.gad7_severity}")
        
        db.session.commit()
        print("GAD-7 results committed successfully")
        return jsonify({'message': 'GAD-7 results saved successfully'})
        
    except Exception as e:
        db.session.rollback()
        print(f"Error saving GAD-7: {str(e)}")
        return jsonify({'error': f'Failed to save GAD-7 results: {str(e)}'}), 500

@app.route('/api/comprehensive-assessment/<session_id>/mood-groove', methods=['PUT'])
def save_mood_groove_results(session_id):
    """Save Mood Grove assessment results"""
    data = request.get_json()
    
    # Debug logging
    print(f"Saving Mood Grove results for session {session_id}")
    print(f"Mood Grove data: {data}")
    
    try:
        assessment = ComprehensiveAssessment.query.filter_by(session_id=session_id).first()
        if not assessment:
            print(f"Assessment not found for session: {session_id}")
            return jsonify({'error': 'Assessment not found'}), 404
            
        assessment.mood_groove_dominant_mood = data['dominantMood']
        assessment.mood_groove_confidence = data['confidence']
        assessment.mood_groove_depression = data['depression']
        assessment.mood_groove_anxiety = data['anxiety']
        assessment.mood_groove_expressions = data['expressions']
        
        print(f"Mood Grove saved: mood={assessment.mood_groove_dominant_mood}, confidence={assessment.mood_groove_confidence}")
        
        db.session.commit()
        print("Mood Grove results committed successfully")
        return jsonify({'message': 'Mood Grove results saved successfully'})
        
    except Exception as e:
        db.session.rollback()
        print(f"Error saving Mood Grove: {str(e)}")
        return jsonify({'error': f'Failed to save Mood Grove results: {str(e)}'}), 500

@app.route('/api/comprehensive-assessment/<session_id>/additional', methods=['PUT'])
def save_additional_assessments(session_id):
    """Save additional assessment results (resilience, stress, sleep, social support)"""
    data = request.get_json()
    
    # Debug logging
    print(f"Saving additional assessments for session {session_id}")
    print(f"Additional assessments data: {data}")
    
    try:
        assessment = ComprehensiveAssessment.query.filter_by(session_id=session_id).first()
        if not assessment:
            print(f"Assessment not found for session: {session_id}")
            return jsonify({'error': 'Assessment not found'}), 404
            
        # Save resilience results
        if 'resilience' in data:
            assessment.resilience_score = data['resilience']['score']
            assessment.resilience_answers = data['resilience']['answers']
            print(f"Resilience saved: score={assessment.resilience_score}")
            
        # Save stress results
        if 'stress' in data:
            assessment.stress_score = data['stress']['score']
            assessment.stress_answers = data['stress']['answers']
            print(f"Stress saved: score={assessment.stress_score}")
            
        # Save sleep quality results
        if 'sleep_quality' in data:
            assessment.sleep_quality_score = data['sleep_quality']['score']
            assessment.sleep_quality_answers = data['sleep_quality']['answers']
            print(f"Sleep quality saved: score={assessment.sleep_quality_score}")
            
        # Save social support results
        if 'social_support' in data:
            assessment.social_support_score = data['social_support']['score']
            assessment.social_support_answers = data['social_support']['answers']
            print(f"Social support saved: score={assessment.social_support_score}")
        
        db.session.commit()
        print("Additional assessment results committed successfully")
        return jsonify({'message': 'Additional assessment results saved successfully'})
        
    except Exception as e:
        db.session.rollback()
        print(f"Error saving additional assessments: {str(e)}")
        return jsonify({'error': f'Failed to save additional assessment results: {str(e)}'}), 500

@app.route('/api/comprehensive-assessment/<session_id>/complete', methods=['PUT'])
def complete_assessment(session_id):
    """Complete assessment and generate analysis"""
    data = request.get_json()
    
    try:
        assessment = ComprehensiveAssessment.query.filter_by(session_id=session_id).first()
        if not assessment:
            return jsonify({'error': 'Assessment not found'}), 404
            
        assessment.status = 'completed'
        assessment.completed_at = datetime.utcnow()
        assessment.overall_severity = data.get('overall_severity')
        assessment.risk_level = data.get('risk_level')
        assessment.analysis_prompt = data.get('analysis_prompt')
        assessment.recommendations = data.get('recommendations')
        
        db.session.commit()
        return jsonify({'message': 'Assessment completed successfully'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to complete assessment: {str(e)}'}), 500

@app.route('/api/comprehensive-assessment/user/<user_id>', methods=['GET'])
def get_user_assessments(user_id):
    """Get all comprehensive assessments for a user"""
    try:
        assessments = ComprehensiveAssessment.query.filter_by(user_id=user_id).order_by(ComprehensiveAssessment.timestamp.desc()).all()
        
        return jsonify([{
            'id': assessment.id,
            'session_id': assessment.session_id,
            'status': assessment.status,
            'started_at': assessment.started_at.isoformat(),
            'completed_at': assessment.completed_at.isoformat() if assessment.completed_at else None,
            'overall_severity': assessment.overall_severity,
            'risk_level': assessment.risk_level,
            'phq9_score': assessment.phq9_score,
            'gad7_score': assessment.gad7_score,
            'mood_groove_dominant_mood': assessment.mood_groove_dominant_mood
        } for assessment in assessments])
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch user assessments: {str(e)}'}), 500

# --- Profile API Endpoints ---

@app.route('/api/profile/<user_id>', methods=['GET'])
def get_profile(user_id):
    """Get user profile by user ID"""
    try:
        profile = Profile.query.filter_by(id=user_id).first()
        
        if profile:
            return jsonify({
                'id': profile.id,
                'email': profile.email,
                'full_name': profile.full_name,
                'age': profile.age,
                'gender': profile.gender,
                'created_at': profile.created_at.isoformat(),
                'updated_at': profile.updated_at.isoformat()
            })
        else:
            return jsonify({'error': 'Profile not found'}), 404
            
    except Exception as e:
        return jsonify({'error': f'Failed to fetch profile: {str(e)}'}), 500

@app.route('/api/profile', methods=['POST'])
def create_profile():
    """Create a new user profile"""
    data = request.get_json()
    
    # Debug logging
    print(f"Creating profile with data: {data}")
    
    try:
        # Check if profile already exists
        existing_profile = Profile.query.filter_by(id=data['id']).first()
        if existing_profile:
            return jsonify({'error': 'Profile already exists'}), 409
            
        new_profile = Profile(
            id=data['id'],
            email=data['email'],
            full_name=data.get('full_name'),
            age=data.get('age'),
            gender=data.get('gender')
        )
        
        db.session.add(new_profile)
        db.session.commit()
        
        print(f"Profile created successfully for user: {data['id']}")
        return jsonify({
            'message': 'Profile created successfully',
            'profile': {
                'id': new_profile.id,
                'email': new_profile.email,
                'full_name': new_profile.full_name,
                'age': new_profile.age,
                'gender': new_profile.gender
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error creating profile: {str(e)}")
        return jsonify({'error': f'Failed to create profile: {str(e)}'}), 500

@app.route('/api/profile/email/<email>', methods=['GET'])
def get_profile_by_email(email):
    """Get user profile by email"""
    try:
        profile = Profile.query.filter_by(email=email).first()
        
        if profile:
            return jsonify({
                'id': profile.id,
                'email': profile.email,
                'full_name': profile.full_name,
                'age': profile.age,
                'gender': profile.gender,
                'created_at': profile.created_at.isoformat(),
                'updated_at': profile.updated_at.isoformat()
            })
        else:
            return jsonify({'error': 'Profile not found'}), 404
            
    except Exception as e:
        return jsonify({'error': f'Failed to fetch profile: {str(e)}'}), 500

@app.route('/api/profile/<user_id>', methods=['DELETE'])
def delete_profile(user_id):
    """Delete user profile by user ID"""
    try:
        profile = Profile.query.filter_by(id=user_id).first()
        
        if profile:
            db.session.delete(profile)
            db.session.commit()
            print(f"Profile deleted successfully for user: {user_id}")
            return jsonify({'message': 'Profile deleted successfully'}), 200
        else:
            return jsonify({'error': 'Profile not found'}), 404
            
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting profile: {str(e)}")
        return jsonify({'error': f'Failed to delete profile: {str(e)}'}), 500

@app.route('/api/profile/<user_id>', methods=['PUT'])
def update_profile(user_id):
    """Update user profile"""
    data = request.get_json()
    
    # Debug logging
    print(f"Updating profile for user {user_id} with data: {data}")
    
    try:
        profile = Profile.query.filter_by(id=user_id).first()
        
        if not profile:
            # Create new profile if it doesn't exist
            profile = Profile(
                id=user_id,
                email=data.get('email', ''),
                full_name=data.get('full_name'),
                age=data.get('age'),
                gender=data.get('gender')
            )
            db.session.add(profile)
            print(f"Created new profile for user: {user_id}")
        else:
            # Update existing profile
            if 'full_name' in data:
                profile.full_name = data['full_name']
            if 'age' in data:
                profile.age = data['age']
            if 'gender' in data:
                profile.gender = data['gender']
            if 'email' in data:
                profile.email = data['email']
            profile.updated_at = datetime.utcnow()
            print(f"Updated existing profile for user: {user_id}")
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'profile': {
                'id': profile.id,
                'email': profile.email,
                'full_name': profile.full_name,
                'age': profile.age,
                'gender': profile.gender,
                'updated_at': profile.updated_at.isoformat()
            }
        })
        
    except Exception as e:
        db.session.rollback()
        print(f"Error updating profile: {str(e)}")
        return jsonify({'error': f'Failed to update profile: {str(e)}'}), 500

# --- Database Debug Routes ---

@app.route('/api/debug/tables', methods=['GET'])
def debug_tables():
    """Debug endpoint to check database tables and columns"""
    try:
        from sqlalchemy import inspect
        inspector = inspect(db.engine)
        
        tables_info = {}
        for table_name in inspector.get_table_names():
            columns = inspector.get_columns(table_name)
            tables_info[table_name] = [col['name'] for col in columns]
        
        return jsonify({
            'tables': tables_info,
            'profile_table_exists': 'profile' in tables_info
        })
    except Exception as e:
        return jsonify({'error': f'Failed to inspect database: {str(e)}'}), 500

@app.route('/api/debug/recreate-tables', methods=['POST'])
def recreate_tables():
    """Recreate all database tables (DANGER: This will delete all data!)"""
    try:
        print("Dropping all tables...")
        db.drop_all()
        print("Creating all tables...")
        db.create_all()
        print("Tables recreated successfully")
        return jsonify({'message': 'All tables recreated successfully'})
    except Exception as e:
        print(f"Error recreating tables: {str(e)}")
        return jsonify({'error': f'Failed to recreate tables: {str(e)}'}), 500

@app.route('/api/debug/drop-old-profiles', methods=['POST'])
def drop_old_profiles():
    """Drop the old 'profiles' table to avoid conflicts"""
    try:
        # Execute raw SQL to drop the old profiles table
        with db.engine.connect() as connection:
            connection.execute(db.text('DROP TABLE IF EXISTS profiles CASCADE;'))
            connection.commit()
        print("Old 'profiles' table dropped successfully")
        return jsonify({'message': 'Old profiles table dropped successfully'})
    except Exception as e:
        print(f"Error dropping old profiles table: {str(e)}")
        return jsonify({'error': f'Failed to drop old profiles table: {str(e)}'}), 500

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
    port = int(os.getenv('PORT', 5001))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug, port=port, host='0.0.0.0')