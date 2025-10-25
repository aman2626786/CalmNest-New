import { render, screen } from '@testing-library/react'
import ClientLayoutWrapper from '../ClientLayoutWrapper'

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
  },
}))

// Mock Next.js Script component
jest.mock('next/script', () => {
  return function MockScript({ children, ...props }: any) {
    return <div data-testid="mock-script" {...props}>{children}</div>
  }
})

// Mock the context providers and components
jest.mock('@/components/I18nProvider', () => {
  return function MockI18nProvider({ children }: { children: React.ReactNode }) {
    return <div data-testid="i18n-provider">{children}</div>
  }
})

jest.mock('@/context/MoodContext', () => ({
  MoodProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mood-provider">{children}</div>
  ),
}))

jest.mock('@/context/ResultsContext', () => ({
  ResultsProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="results-provider">{children}</div>
  ),
}))

jest.mock('@/context/UserProfileContext', () => ({
  UserProfileProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="user-profile-provider">{children}</div>
  ),
}))

jest.mock('@/components/VoiceflowContextUpdater', () => {
  return function MockVoiceflowContextUpdater() {
    return <div data-testid="voiceflow-context-updater" />
  }
})

jest.mock('@/components/layout/Header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}))

jest.mock('@/components/ThemeProvider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}))

describe('ClientLayoutWrapper', () => {
  it('renders children correctly', () => {
    render(
      <ClientLayoutWrapper>
        <div data-testid="test-child">Test Content</div>
      </ClientLayoutWrapper>
    )

    expect(screen.getByTestId('test-child')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders all required providers', () => {
    render(
      <ClientLayoutWrapper>
        <div>Test Content</div>
      </ClientLayoutWrapper>
    )

    expect(screen.getByTestId('theme-provider')).toBeInTheDocument()
    expect(screen.getByTestId('i18n-provider')).toBeInTheDocument()
    expect(screen.getByTestId('mood-provider')).toBeInTheDocument()
    expect(screen.getByTestId('results-provider')).toBeInTheDocument()
    expect(screen.getByTestId('user-profile-provider')).toBeInTheDocument()
  })

  it('renders header and voiceflow components', () => {
    render(
      <ClientLayoutWrapper>
        <div>Test Content</div>
      </ClientLayoutWrapper>
    )

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('voiceflow-context-updater')).toBeInTheDocument()
  })

  it('includes voiceflow script', () => {
    render(
      <ClientLayoutWrapper>
        <div>Test Content</div>
      </ClientLayoutWrapper>
    )

    expect(screen.getByTestId('mock-script')).toBeInTheDocument()
  })

  it('wraps content in main element with correct styling', () => {
    render(
      <ClientLayoutWrapper>
        <div data-testid="test-content">Test Content</div>
      </ClientLayoutWrapper>
    )

    const mainElement = screen.getByRole('main')
    expect(mainElement).toBeInTheDocument()
    expect(mainElement).toHaveClass('pt-20')
    expect(screen.getByTestId('test-content')).toBeInTheDocument()
  })
})