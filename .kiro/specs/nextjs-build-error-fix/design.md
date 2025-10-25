# Design Document

## Overview

The build error occurs because Next.js 13+ App Router has strict rules about metadata exports. Client components (marked with "use client") cannot export metadata, as metadata must be statically analyzable at build time. The solution involves restructuring the layout to separate server-side metadata handling from client-side functionality.

## Architecture

The current architecture has a single layout component trying to handle both server-side metadata and client-side functionality. We need to split this into:

1. **Server Layout Component**: Handles metadata export and basic HTML structure
2. **Client Layout Wrapper**: Handles all client-side providers and interactive functionality

## Components and Interfaces

### Current Structure
```
layout.tsx (Client Component)
├── metadata export ❌ (Not allowed)
├── Client-side providers
├── Theme management
└── Session management
```

### Proposed Structure
```
layout.tsx (Server Component)
├── metadata export ✅
├── Basic HTML structure
└── ClientLayoutWrapper (Client Component)
    ├── Client-side providers
    ├── Theme management
    └── Session management
```

### Component Responsibilities

#### Root Layout (Server Component)
- Export metadata for SEO
- Provide basic HTML structure
- Import and render ClientLayoutWrapper
- Handle font loading (Inter font)

#### ClientLayoutWrapper (Client Component)
- Manage all React context providers
- Handle theme switching
- Manage session state
- Initialize Voiceflow widget
- Provide header component

## Data Models

### Metadata Structure
```typescript
export const metadata = {
  title: 'CalmNest - Your Mental Wellness Journey',
  description: 'A Safe Digital Space for Students to Prioritize their Mental Well-being.',
}
```

### Props Interface
```typescript
interface RootLayoutProps {
  children: React.ReactNode;
}

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}
```

## Error Handling

### Build-time Error Prevention
- Ensure metadata is only exported from server components
- Validate that client components don't attempt metadata exports
- Maintain proper component hierarchy

### Runtime Error Handling
- Preserve existing error boundaries
- Maintain graceful fallbacks for client-side features
- Ensure theme and session providers handle initialization errors

## Testing Strategy

### Build Verification
- Verify successful Next.js build process
- Confirm no compilation errors
- Validate metadata is properly exported

### Functionality Testing
- Test theme switching functionality
- Verify session management works
- Confirm all context providers initialize correctly
- Test Voiceflow widget loading

### Integration Testing
- Verify page metadata appears correctly in browser
- Test that all existing functionality remains intact
- Confirm responsive design and styling work properly

## Implementation Approach

1. **Create ClientLayoutWrapper Component**
   - Move all client-side logic from layout.tsx
   - Include all providers and context management
   - Handle Voiceflow script initialization

2. **Refactor Root Layout**
   - Remove "use client" directive
   - Keep metadata export
   - Import and use ClientLayoutWrapper
   - Maintain basic HTML structure

3. **Preserve Functionality**
   - Ensure all existing features work
   - Maintain styling and theme support
   - Keep session management intact

## Migration Considerations

- No breaking changes to existing pages
- All context providers remain available
- Theme switching continues to work
- Session management preserved
- Voiceflow integration maintained