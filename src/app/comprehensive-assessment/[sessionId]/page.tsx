import AssessmentSessionClientPage from './client-page';

export default function AssessmentSessionPage() {
  return <AssessmentSessionClientPage />;
}

// Required for static export with dynamic routes
export async function generateStaticParams() {
  // Return empty array for static export - pages will be generated on demand
  return [];
}