# Design Document

## Overview

The comprehensive assessment feature has a complete implementation but contains a critical bug in the authentication system usage. The main issue is in the `client-page.tsx` file where `useSession()` is being called instead of `useAuth()` from the application's AuthContext. This causes the component to fail during runtime, preventing users from accessing their assessment sessions.

## Architecture

The comprehensive assessment system follows a multi-step wizard pattern with the following architecture:

### Current Architecture
- **Landing Page** (`/comprehensive-assessment/page.tsx`): Introduction and assessment start
- **Session Page** (`/comprehensive-assessment/[sessionId]/page.tsx`): Static params generator
- **Client Page** (`/comprehensive-assessment/[sessionId]/client-page.tsx`): Main assessment flow logic
- **Assessment Components**: Individual assessment modules (PHQ-9, GAD-7, etc.)
- **Backend API**: Flask endpoints for session management and data persistence

### Authentication Flow
- Uses `useAuth()` hook from `@/context/AuthContext` throughout the application
- Provides user session data, loading states, and authentication status
- Handles redirects for unauthenticated users

## Components and Interfaces

### Fixed Authentication Integration
The client page component needs to:
- Import and use `useAuth()` instead of `useSession()`
- Access user data via `user` property from auth context
- Handle loading states properly with the `loading` property
- Maintain existing redirect logic for unauthenticated users

### Assessment Flow Components
The existing assessment components should remain unchanged:
- `PHQ9Component`: Depression screening questionnaire
- `GAD7Component`: Anxiety assessment questionnaire  
- `MoodGroveComponent`: AI-powered facial emotion analysis
- `AdditionalAssessmentsComponent`: Resilience, stress, and sleep assessments

### State Management
- Session state management through backend API calls
- Assessment results aggregation in component state
- Progress tracking through step indices
- Final analysis generation and display

## Data Models

### Assessment Session Data
```typescript
interface AssessmentData {
  assessment: {
    id: number;
    session_id: string;
    user_id: string;
    status: string;
    started_at: string;
    completed_at: string | null;
  };
  session: {
    current_step: string;
    session_data: any;
    last_activity: string | null;
  };
}
```

### Assessment Results
```typescript
interface AssessmentResults {
  phq9?: PHQ9Results;
  gad7?: GAD7Results;
  moodGrove?: MoodGroveResults;
  additional?: AdditionalAssessmentResults;
}
```

## Error Handling

### Authentication Errors
- Proper error handling for missing authentication context
- Graceful fallback to login redirect when user is not authenticated
- Loading state management during authentication checks

### API Communication
- Network error handling for backend communication failures
- User-friendly error messages for connection issues
- Retry mechanisms for failed API calls

### Component Error Boundaries
- Maintain existing error handling in assessment components
- Ensure assessment progress is not lost due to component errors
- Provide clear feedback when assessment steps fail

## Testing Strategy

### Unit Testing
- Test authentication hook integration
- Verify proper user data access and loading states
- Test error handling scenarios for authentication failures

### Integration Testing
- Test complete assessment flow from start to finish
- Verify session management and progress saving
- Test analysis generation and result display

### User Acceptance Testing
- Verify users can complete assessments without errors
- Test assessment session persistence and resume functionality
- Validate analysis prompt generation and copying functionality

## Implementation Approach

### Phase 1: Authentication Fix
1. Replace `useSession()` with `useAuth()` in client-page.tsx
2. Update user data access patterns to match AuthContext interface
3. Test authentication flow and redirects

### Phase 2: Verification and Testing
1. Test complete assessment flow end-to-end
2. Verify all assessment components load and function properly
3. Test analysis generation and result display
4. Validate session management and progress saving

### Phase 3: Error Handling Enhancement
1. Improve error messages for better user experience
2. Add loading states where needed
3. Ensure graceful degradation for network issues

## Security Considerations

- Maintain existing authentication requirements
- Ensure assessment data is properly associated with authenticated users
- Preserve existing privacy and data protection measures
- Maintain secure session management practices