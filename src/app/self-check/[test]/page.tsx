import TestClientPage from './client-page';

export default function TestPage() {
  return <TestClientPage />;
}

// Required for static export with dynamic routes
export async function generateStaticParams() {
  // Generate static params for available tests
  return [
    { test: 'phq9' },
    { test: 'gad7' },
  ];
}
