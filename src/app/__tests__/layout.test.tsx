import { render, screen } from '@testing-library/react'
import RootLayout, { metadata } from '../layout'

// Mock the ClientLayoutWrapper
jest.mock('@/components/layout/ClientLayoutWrapper', () => {
  return function MockClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    return <div data-testid="client-layout-wrapper">{children}</div>
  }
})

describe('RootLayout', () => {
  it('renders children within ClientLayoutWrapper', () => {
    render(
      <RootLayout>
        <div data-testid="test-child">Test Content</div>
      </RootLayout>
    )

    expect(screen.getByTestId('client-layout-wrapper')).toBeInTheDocument()
    expect(screen.getByTestId('test-child')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders html and body elements with correct attributes', () => {
    const { container } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )

    const htmlElement = container.querySelector('html')
    const bodyElement = container.querySelector('body')

    expect(htmlElement).toHaveAttribute('lang', 'en')
    expect(htmlElement).toHaveAttribute('suppressHydrationWarning')
    expect(bodyElement).toHaveClass('bg-white', 'dark:bg-gray-900', 'text-gray-900', 'dark:text-gray-100')
  })
})

describe('Metadata Export', () => {
  it('exports correct metadata', () => {
    expect(metadata).toEqual({
      title: 'CalmNest - Your Mental Wellness Journey',
      description: 'A Safe Digital Space for Students to Prioritize their Mental Well-being.',
    })
  })

  it('metadata has required properties', () => {
    expect(metadata).toHaveProperty('title')
    expect(metadata).toHaveProperty('description')
    expect(typeof metadata.title).toBe('string')
    expect(typeof metadata.description).toBe('string')
  })
})