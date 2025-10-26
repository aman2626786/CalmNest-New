# Dashboard Fix Design Document

## Overview

This design addresses the critical issues preventing the dashboard from functioning properly. The main problems are: (1) translation keys not resolving to actual text, (2) API calls failing due to incorrect URL construction, (3) middleware conflicts with static export, and (4) empty dashboard despite backend data availability.

## Architecture

The fix involves three main layers:

1. **Frontend Layer**: Dashboard component, translation system, and API client
2. **Configuration Layer**: Next.js configuration and middleware setup
3. **Backend Layer**: Flask API endpoints (already functional)

## Components and Interfaces

### 1. Translation System Fix

**Problem**: The dashboard is using `useTranslation('dashboard')` but the translation namespace isn't properly loaded.

**Solution**: 
- Ensure the dashboard namespace is included in the i18n configuration
- Add proper namespace loading in the dashboard component
- Verify translation files are accessible

**Interface Changes**:
```typescript
// In dashboard component
const { t } = useTranslation(['dashboard', 'common']);

// In i18n.ts - ensure dashboard namespace is included
ns: ['common', 'translation', 'phq9', 'gad7', 'suggestions', 'appointments', 'resources', 'exercises', 'forum', 'dashboard']
```

### 2. API Client Fix

**Problem**: API calls are failing with URLs like `/dashboard/undefined/api/dashboard/aman2626786@gmail.com`

**Current Issue Analysis**:
- The URL construction is incorrect
- `process.env.NEXT_PUBLIC_API_URL` appears to be undefined or incorrectly set
- The API endpoint structure doesn't match the backend routes

**Solution**:
- Fix the API URL construction in the dashboard component
- Ensure environment variables are properly configured
- Match the frontend API calls to the actual backend endpoints

**Backend Endpoint Available**: `/api/dashboard/<user_email>`

**Frontend Fix**:
```typescript
// Current (broken):
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/${user.email}`);

// Fixed:
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const response = await fetch(`${apiUrl}/api/dashboard/${user.email}`);
```

### 3. Middleware Configuration Fix

**Problem**: Next.js is trying to use middleware with `output: export` configuration, which is incompatible.

**Solution**: 
- Remove or conditionally disable middleware when using static export
- Or remove the static export configuration if middleware is needed

**Configuration Changes**:
```javascript
// Option 1: Remove static export (recommended)
// Remove: output: 'export'

// Option 2: Conditional middleware
// In middleware.ts - add condition to skip middleware for static export
```

### 4. Environment Configuration

**Problem**: `NEXT_PUBLIC_API_URL` is not properly set, causing undefined in API URLs.

**Solution**:
- Set proper environment variables in `.env.local`
- Provide fallback values in the code
- Ensure the Flask backend URL is correctly configured

**Environment Setup**:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Data Models

The dashboard expects the following data structure from the backend:

```typescript
interface DashboardData {
  test_submissions: TestSubmission[];
  mood_groove_results: MoodGrooveResult[];
  breathing_exercises: BreathingExercise[];
  comprehensive_assessments: ComprehensiveAssessment[];
  facial_analysis_sessions: FacialAnalysisSession[];
  test_count: number;
  comprehensive_assessments_count: number;
  total_sessions: number;
  user_profile: UserProfile | null;
}
```

The backend endpoint `/api/dashboard/<user_email>` already returns data in this format.

## Error Handling

### Translation Errors
- Fallback to English text if translation keys fail to resolve
- Log missing translation keys for debugging
- Provide default text for critical UI elements

### API Errors
- Display user-friendly error messages instead of empty charts
- Implement retry logic for failed API calls
- Show loading states during data fetching
- Handle cases where user has no data

### Configuration Errors
- Provide fallback API URLs if environment variables are missing
- Graceful degradation when backend is unavailable
- Clear error messages for configuration issues

## Testing Strategy

### Unit Tests
- Test translation key resolution
- Test API URL construction with various environment configurations
- Test error handling for failed API calls
- Test data processing functions

### Integration Tests
- Test full dashboard loading flow
- Test API integration with backend
- Test translation system integration
- Test error scenarios (no data, API failures)

### Manual Testing
- Verify dashboard loads without translation keys showing
- Confirm all charts populate with actual data
- Test with users who have different amounts of data
- Verify error states display properly

## Implementation Priority

1. **High Priority**: Fix API URL construction and environment configuration
2. **High Priority**: Fix translation namespace loading
3. **Medium Priority**: Fix middleware configuration conflicts
4. **Low Priority**: Enhance error handling and loading states

## Dependencies

- Existing Flask backend API endpoints (already functional)
- i18next translation system (already configured)
- User authentication context (already functional)
- Chart.js/Recharts for data visualization (already installed)

## Rollback Plan

If issues arise during implementation:
1. Revert API URL changes and use hardcoded localhost URLs temporarily
2. Revert translation changes and use hardcoded English text
3. Disable middleware entirely if conflicts persist
4. Use mock data for dashboard if API integration fails