# CalmNest - Mental Health Support Platform

## Project Structure

```
src/
├── app/                    # App router pages and layouts
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── common/           # Shared components
│   │   ├── Logo.tsx
│   │   └── Background3D.tsx
│   ├── features/         # Feature-specific components
│   │   └── home/
│   │       ├── Hero.tsx
│   │       ├── Features.tsx
│   │       ├── Testimonials.tsx
│   │       └── CrisisHelp.tsx
│   └── layout/           # Layout components
│       ├── Header.tsx
│       └── Footer.tsx
├── hooks/                # Custom React hooks
├── pages/                # Additional pages
│   ├── self-check/      # Self-check assessment
│   ├── appointments/    # Counselor appointments
│   ├── resources/       # Resource library
│   ├── forum/          # Community forum
│   └── mood-groove/    # Mood tracking
├── styles/              # Style-related files
├── utils/              # Utility functions
└── types/             # TypeScript type definitions

public/
└── images/           # Static images and assets
```

## Main Features

1. AI First-Aid Chat
   - Real-time chat support
   - Empathetic responses
   - Crisis detection

2. Confidential Appointments
   - Counselor profiles
   - Booking system
   - Privacy protection

3. Resource Hub
   - Articles
   - Videos
   - Audio guides

4. Peer Support Forum
   - Anonymous sharing
   - Community support
   - Moderated discussions

## Technology Stack

- Next.js 13+ (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Three.js (3D effects)
- GSAP (Animations)