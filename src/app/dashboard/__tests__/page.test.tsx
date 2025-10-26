import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useAuth } from '@/context/AuthContext';
import DashboardPage from '../page';

// Mock the dependencies
jest.mock('@/context/AuthContext');
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
}));

jest.mock('jspdf', () => ({
  jsPDF: jest.fn().mockImplementation(() => ({
    setFont: jest.fn(),
    setFontSize: jest.fn(),
    text: jest.fn(),
    addPage: jest.fn(),
    save: jest.fn(),
  })),
}));

jest.mock('html2canvas', () => jest.fn());

// Mock fetch
global.fetch = jest.fn();

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('should show loading state initially', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    render(<DashboardPage />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should fetch dashboard data when component mounts with user email', async () => {
    const mockData = {
      user_profile: { full_name: 'Test User' },
      test_submissions: [],
      mood_groove_results: [],
      comprehensive_assessments: [],
      test_count: 0,
      total_sessions: 0,
      comprehensive_assessments_count: 0,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    mockUseAuth.mockReturnValue({
      user: { email: 'test@example.com' },
      loading: false,
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/dashboard/test@example.com'
      );
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should not make multiple API calls when already loading', async () => {
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({}),
      }), 100))
    );

    mockUseAuth.mockReturnValue({
      user: { email: 'test@example.com' },
      loading: false,
    });

    render(<DashboardPage />);

    // Wait a bit and verify only one call was made
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // Wait more time to ensure no additional calls
    await new Promise(resolve => setTimeout(resolve, 150));
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should handle API errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    mockUseAuth.mockReturnValue({
      user: { email: 'test@example.com' },
      loading: false,
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Error Loading Dashboard')).toBeInTheDocument();
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });

  it('should allow retry after error', async () => {
    (global.fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('API Error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user_profile: { full_name: 'Test User' },
          test_submissions: [],
          mood_groove_results: [],
          comprehensive_assessments: [],
          test_count: 0,
          total_sessions: 0,
          comprehensive_assessments_count: 0,
        }),
      });

    mockUseAuth.mockReturnValue({
      user: { email: 'test@example.com' },
      loading: false,
    });

    render(<DashboardPage />);

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Error Loading Dashboard')).toBeInTheDocument();
    });

    // Click retry button
    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);

    // Wait for successful retry
    await waitFor(() => {
      expect(screen.getByText('title')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should use fallback email when user email is not available', async () => {
    const mockData = {
      user_profile: { full_name: 'Test User' },
      test_submissions: [],
      mood_groove_results: [],
      comprehensive_assessments: [],
      test_count: 0,
      total_sessions: 0,
      comprehensive_assessments_count: 0,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
      },
      writable: true,
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5001/api/dashboard/aman2626786@gmail.com'
      );
    });
  });

  it('should transition states correctly during data fetch', async () => {
    const mockData = {
      user_profile: { full_name: 'Test User' },
      test_submissions: [],
      mood_groove_results: [],
      comprehensive_assessments: [],
      test_count: 0,
      total_sessions: 0,
      comprehensive_assessments_count: 0,
    };

    let resolvePromise: (value: any) => void;
    const fetchPromise = new Promise(resolve => {
      resolvePromise = resolve;
    });

    (global.fetch as jest.Mock).mockReturnValueOnce(fetchPromise);

    mockUseAuth.mockReturnValue({
      user: { email: 'test@example.com' },
      loading: false,
    });

    render(<DashboardPage />);

    // Should show loading initially
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Resolve the promise
    resolvePromise!({
      ok: true,
      json: async () => mockData,
    });

    // Should show content after loading
    await waitFor(() => {
      expect(screen.getByText('title')).toBeInTheDocument();
    });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});