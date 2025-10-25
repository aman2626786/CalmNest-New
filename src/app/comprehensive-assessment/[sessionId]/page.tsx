import AssessmentSessionClientPage from './client-page';

export async function generateStaticParams() {
  // Generate some sample session IDs for static export
  return [
    { sessionId: '1' },
    { sessionId: '2' },
    { sessionId: '3' },
  ];
}

export default function AssessmentSessionPage() {
  return <AssessmentSessionClientPage />;
}