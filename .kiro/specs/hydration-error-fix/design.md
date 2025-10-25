# Design Document

## Overview

The hydration error occurs due to a mismatch between server-side rendered content and client-side rendered content in the CalmNest application. The issue is specifically related to i18next translation loading where the server renders one text value ("Quick Relief Exercises") while the client renders a different value ("Breathing & Sleep Techniques") from the translation files.

The root cause is that i18next translations are not properly synchronized between server and client rendering, leading to different text content being displayed during the initial render versus after hydration.

## Architecture

### Current Architecture Issues

1. **Asynchronous Translation Loading**: i18next loads translations asynchronously via HTTP backend, causing timing differences between server and client
2. **Translation State Mismatch**: Server-side rendering may use fallback values or cached translations that differ from client-side loaded translations
3. **Component Rendering Before Translation Ready**: React components render before i18next has fully loaded and initialized translations

### Proposed Architecture

1. **Synchronous Translation Loading**: Ensure translations are loaded synchronously during server-side rendering
2. **Translation State Synchronization**: Implement proper state management to ensure server and client use identical translation values
3. **Conditional Rendering**: Use React patterns to prevent rendering translated content until translations are fully loaded

## Components and Interfaces

### 1. Translation Loading Strategy

**Current Implementation:**
```typescript
// i18n.ts - Asynchronous loading with HTTP backend
i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
```

**Proposed Implementation:**
- Implement server-side translation preloading
- Use static imports for critical translations
- Add translation readiness checks before rendering

### 2. Component Rendering Pattern

**Current Pattern:**
```typescript
// Direct translation usage without readiness check
const { t } = useTranslation('exercises');
return <h1>{t('title')}</h1>
```

**Proposed Pattern:**
```typescript
// Conditional rendering with translation readiness
const { t, ready } = useTranslation('exercises');
if (!ready) return <h1>Breathing & Sleep Techniques</h1>; // Static fallback
return <h1>{t('title')}</h1>
```

### 3. Server-Side Rendering Enhancement

**Implementation Strategy:**
- Pre-load critical translations during build time
- Implement translation state hydration
- Use Next.js static generation for translated content

## Data Models

### Translation State Model

```typescript
interface TranslationState {
  isReady: boolean;
  language: string;
  namespace: string;
  fallbackValues: Record<string, string>;
}

interface TranslationConfig {
  staticTranslations: Record<string, Record<string, string>>;
  criticalKeys: string[];
  fallbackStrategy: 'static' | 'skeleton' | 'hide';
}
```

### Component Props Model

```typescript
interface TranslatedComponentProps {
  translationKey: string;
  fallbackText?: string;
  namespace?: string;
  skipHydrationCheck?: boolean;
}
```

## Error Handling

### 1. Translation Loading Failures

**Strategy**: Implement graceful degradation with static fallbacks
- Use static text values for critical UI elements
- Log translation loading errors for monitoring
- Provide user feedback for translation issues

### 2. Hydration Mismatch Detection

**Strategy**: Implement hydration-safe rendering patterns
- Use `useEffect` for client-only content
- Implement `suppressHydrationWarning` for acceptable mismatches
- Add development-time hydration mismatch detection

### 3. Language Detection Issues

**Strategy**: Consistent language detection across server and client
- Use consistent language detection order
- Implement server-side language detection
- Cache language preferences properly

## Testing Strategy

### 1. Hydration Testing

**Approach**: Automated hydration mismatch detection
- Unit tests for translation loading states
- Integration tests for server-client rendering consistency
- E2E tests for language switching scenarios

**Test Cases:**
- Server renders with default language
- Client hydrates with same language
- Language switching maintains consistency
- Translation loading failure scenarios

### 2. Translation Consistency Testing

**Approach**: Cross-environment translation validation
- Compare server and client rendered output
- Validate translation key coverage
- Test fallback behavior

**Test Cases:**
- All translation keys have values
- Fallback text matches expected content
- Missing translation handling
- Language detection consistency

### 3. Performance Testing

**Approach**: Measure translation loading impact
- Bundle size analysis for static translations
- Loading time comparison for different strategies
- Memory usage for translation caching

**Metrics:**
- Time to first contentful paint
- Translation loading duration
- Bundle size impact
- Memory usage patterns

## Implementation Phases

### Phase 1: Immediate Fix (Hydration Error Resolution)
- Implement static fallback for critical text content
- Add translation readiness checks
- Use `suppressHydrationWarning` for acceptable mismatches

### Phase 2: Translation Loading Optimization
- Implement server-side translation preloading
- Add static translation imports for critical content
- Optimize i18next configuration for SSR

### Phase 3: Long-term Improvements
- Implement comprehensive translation state management
- Add development tools for hydration debugging
- Optimize bundle size and loading performance

## Technical Decisions and Rationales

### Decision 1: Static Fallbacks vs Dynamic Loading
**Choice**: Use static fallbacks for critical UI elements
**Rationale**: Ensures consistent rendering and prevents hydration errors while maintaining translation functionality for non-critical content

### Decision 2: Conditional Rendering vs Suppression
**Choice**: Implement conditional rendering with readiness checks
**Rationale**: Provides better user experience and maintains accessibility while preventing hydration mismatches

### Decision 3: Server-Side Translation Strategy
**Choice**: Pre-load critical translations during build time
**Rationale**: Ensures server and client have identical translation data, eliminating the root cause of hydration mismatches

### Decision 4: Backward Compatibility
**Choice**: Maintain existing i18next setup with enhancements
**Rationale**: Minimizes breaking changes while fixing the hydration issue and improving overall translation reliability