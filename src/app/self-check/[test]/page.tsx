import TestClientPage from './client-page';

export async function generateStaticParams() {
  return [
    { test: 'phq9' },
    { test: 'gad7' },
  ];
}

export default function TestPage() {
  return <TestClientPage />;
}
