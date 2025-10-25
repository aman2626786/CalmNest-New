# Design Document

## Overview

The Comprehensive Mental Health Assessment System is a unified platform that integrates multiple validated assessment tools (PHQ-9, GAD-7, Mood Grove) with additional techniques to provide users with a holistic mental health evaluation. The system will be accessible from the home page and guide users through a structured assessment path, culminating in a personalized analysis prompt for chatbot interaction.

## Architecture

### Frontend Architecture
- **Framework**: Next.js 14 with TypeScript
- **UI Components**: Radix UI with Tailwind CSS (existing design system)
- **State Management**: React Context API for assessment state
- **Navigation**: Multi-step wizard with progress tracking
- **Responsive Design**: Mobile-first approach with desktop optimization

### Backend Architecture
- **API Layer**: Flask backend with PostgreSQL database (existing infrastructure)
- **Data Models**: New assessment models extending existing database schema
- **Authentication**: Supabase integration (existing auth system)
- **Data Storage**: Secure user-associated assessment data

### Integration Points
- **Existing Systems**: PHQ-9/GAD-7 (self-check), Mood Grove facial analysis
- **New Components**: Assessment orchestrator, analysis generator, progress tracker
- **Database**: Extension of existing models with new comprehensive assessment tables

## Components and Interfaces

### 1. Assessment Entry Point
**Location**: Home page Hero component
- **Component**: `ComprehensiveAssessmentButton`
- **Functionality**: Prominent call-to-action button
- **Design**: Matches existing design system with distinct visual identity

### 2. Assessment Orchestrator
**Component**: `AssessmentOrchestrator`
- **Route**: `/comprehensive-assessment`
- **Functionality**: 
  - Multi-step wizard interface
  - Progress tracking and state management
  - Navigation between assessment modules
  - Session persistence and recovery

### 3. Assessment Modules

#### PHQ-9 Integration Module
- **Component**: `PHQ9AssessmentModule`
- **Integration**: Reuse existing PHQ-9 implementation from `/self-check/phq9`
- **Modifications**: Embedded mode for seamless integration

#### GAD-7 Integration Module
- **Component**: `GAD7AssessmentModule`
- **Integration**: Reuse existing GAD-7 implementation from `/self-check/gad7`
- **Modifications**: Embedded mode for seamless integration

#### Mood Grove Integration Module
- **Component**: `MoodGroveAssessmentModule`
- **Integration**: Simplified version of existing Mood Grove system
- **Functionality**: 
  - 2-3 minute facial analysis session
  - Real-time emotion detection
  - Automated session completion

#### Additional Assessment Techniques Module
- **Component**: `AdditionalAssessmentsModule`
- **Techniques**:
  - Brief Resilience Scale (BRS) - 6 questions
  - Perceived Stress Scale (PSS-4) - 4 questions
  - Sleep Quality Index - 3 questions
  - Social Support Assessment - 3 questions

### 4. Analysis Generator
**Component**: `AnalysisGenerator`
- **Functionality**:
  - Aggregate results from all assessment modules
  - Generate comprehensive analysis prompt
  - Provide severity interpretations
  - Create actionable recommendations

### 5. Results Presentation
**Component**: `ComprehensiveResults`
- **Features**:
  - Visual results dashboard
  - Downloadable analysis prompt
  - Copy-to-clipboard functionality
  - Integration links to chatbot

## Data Models

### ComprehensiveAssessment Model
```python
class ComprehensiveAssessment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, nullable=False)
    session_id = db.Column(db.String, unique=True, nullable=False)
    status = db.Column(db.String(50), default='in_progress')  # in_progress, completed, abandoned
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    # Assessment Results
    phq9_score = db.Column(db.Integer, nullable=True)
    phq9_severity = db.Column(db.String(100), nullable=True)
    gad7_score = db.Column(db.Integer, nullable=True)
    gad7_severity = db.Column(db.String(100), nullable=True)
    
    # Mood Grove Results
    mood_groove_dominant_mood = db.Column(db.String(100), nullable=True)
    mood_groove_confidence = db.Column(db.Float, nullable=True)
    mood_groove_depression = db.Column(db.Float, nullable=True)
    mood_groove_anxiety = db.Column(db.Float, nullable=True)
    
    # Additional Assessments
    resilience_score = db.Column(db.Integer, nullable=True)
    stress_score = db.Column(db.Integer, nullable=True)
    sleep_quality_score = db.Column(db.Integer, nullable=True)
    social_support_score = db.Column(db.Integer, nullable=True)
    
    # Generated Analysis
    overall_severity = db.Column(db.String(100), nullable=True)
    analysis_prompt = db.Column(db.Text, nullable=True)
    recommendations = db.Column(db.JSON, nullable=True)
    
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
```

### AssessmentSession Model
```python
class AssessmentSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String, nullable=False)
    user_id = db.Column(db.String, nullable=False)
    current_step = db.Column(db.String(100), nullable=False)
    session_data = db.Column(db.JSON, nullable=False)  # Store progress and answers
    last_activity = db.Column(db.DateTime, default=datetime.utcnow)
```

## Assessment Flow Design

### Step 1: Introduction and Consent
- **Duration**: 1-2 minutes
- **Content**: 
  - Assessment overview and expected duration (15-20 minutes)
  - Privacy and data usage information
  - Informed consent for assessment
  - Option to save progress and return later

### Step 2: PHQ-9 Depression Assessment
- **Duration**: 3-4 minutes
- **Integration**: Embedded existing PHQ-9 component
- **Scoring**: Standard PHQ-9 scoring (0-27 scale)

### Step 3: GAD-7 Anxiety Assessment
- **Duration**: 2-3 minutes
- **Integration**: Embedded existing GAD-7 component
- **Scoring**: Standard GAD-7 scoring (0-21 scale)

### Step 4: Mood Grove Facial Analysis
- **Duration**: 3-4 minutes
- **Process**:
  - Camera permission and setup
  - 2-3 minute guided facial analysis session
  - Automatic emotion detection and scoring
  - Real-time feedback during analysis

### Step 5: Additional Assessments
- **Duration**: 4-5 minutes
- **Components**:
  - Brief Resilience Scale (6 questions)
  - Perceived Stress Scale (4 questions)
  - Sleep Quality Assessment (3 questions)
  - Social Support Assessment (3 questions)

### Step 6: Results and Analysis Generation
- **Duration**: 2-3 minutes
- **Process**:
  - Aggregate all assessment scores
  - Generate comprehensive analysis
  - Create personalized chatbot prompt
  - Present results dashboard

## Analysis Prompt Generation

### Prompt Template Structure
```
COMPREHENSIVE MENTAL HEALTH ASSESSMENT RESULTS

Assessment Date: [DATE]
Assessment Duration: [DURATION]

=== DEPRESSION ASSESSMENT (PHQ-9) ===
Score: [SCORE]/27
Severity Level: [SEVERITY]
Key Symptoms: [TOP_SYMPTOMS]

=== ANXIETY ASSESSMENT (GAD-7) ===
Score: [SCORE]/21
Severity Level: [SEVERITY]
Key Symptoms: [TOP_SYMPTOMS]

=== MOOD ANALYSIS (Mood Grove) ===
Dominant Emotion: [EMOTION]
Confidence Level: [CONFIDENCE]%
Depression Indicators: [DEPRESSION_SCORE]%
Anxiety Indicators: [ANXIETY_SCORE]%

=== ADDITIONAL FACTORS ===
Resilience Level: [RESILIENCE_LEVEL]
Stress Level: [STRESS_LEVEL]
Sleep Quality: [SLEEP_QUALITY]
Social Support: [SOCIAL_SUPPORT]

=== OVERALL ASSESSMENT ===
Primary Concerns: [PRIMARY_CONCERNS]
Risk Level: [RISK_LEVEL]
Recommended Focus Areas: [FOCUS_AREAS]

=== GUIDANCE REQUEST ===
Based on these results, please provide:
1. Personalized coping strategies for my specific symptom profile
2. Immediate self-care recommendations I can implement today
3. Long-term wellness plan suggestions
4. Warning signs to monitor
5. Professional help recommendations if appropriate

Please tailor your response to my specific scores and symptom patterns shown above.
```

## Error Handling

### Assessment Interruption
- **Auto-save**: Progress saved every 30 seconds
- **Session Recovery**: Users can resume from last completed step
- **Timeout Handling**: 30-minute session timeout with recovery option

### Technical Failures
- **Camera Issues**: Fallback to self-reported mood assessment
- **Network Issues**: Offline capability for questionnaire portions
- **Data Validation**: Client and server-side validation for all inputs

### Privacy and Security
- **Data Encryption**: All assessment data encrypted at rest and in transit
- **User Control**: Users can delete assessment data at any time
- **Anonymization**: Option to generate anonymous analysis prompts

## Testing Strategy

### Unit Testing
- **Assessment Components**: Individual module testing
- **Data Models**: Database model validation
- **Analysis Generation**: Prompt generation accuracy

### Integration Testing
- **Assessment Flow**: End-to-end assessment completion
- **Data Persistence**: Session management and recovery
- **API Integration**: Backend service integration

### User Experience Testing
- **Usability**: Assessment flow intuitive navigation
- **Performance**: Page load times and responsiveness
- **Accessibility**: Screen reader compatibility and keyboard navigation

### Security Testing
- **Data Protection**: Assessment data security validation
- **Authentication**: User session management
- **Privacy Compliance**: Data handling compliance verification

## Performance Considerations

### Frontend Optimization
- **Code Splitting**: Lazy load assessment modules
- **Caching**: Cache assessment questions and static content
- **Progressive Loading**: Load next step while user completes current step

### Backend Optimization
- **Database Indexing**: Optimize queries for user assessment data
- **API Caching**: Cache assessment templates and scoring algorithms
- **Session Management**: Efficient session data storage and retrieval

### Mobile Optimization
- **Responsive Design**: Optimized for mobile assessment completion
- **Touch Interactions**: Mobile-friendly input methods
- **Camera Integration**: Optimized mobile camera usage for Mood Grove

## Accessibility Features

### Visual Accessibility
- **High Contrast**: Support for high contrast mode
- **Font Scaling**: Responsive text sizing
- **Color Independence**: Information not dependent on color alone

### Motor Accessibility
- **Keyboard Navigation**: Full keyboard accessibility
- **Touch Targets**: Appropriate touch target sizes
- **Voice Input**: Support for voice input where applicable

### Cognitive Accessibility
- **Clear Instructions**: Simple, clear assessment instructions
- **Progress Indicators**: Clear progress and completion status
- **Help Text**: Contextual help for complex questions