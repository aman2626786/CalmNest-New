import CounselorDetailClientPage from './client-page';
import counselors from '@/lib/data/counselors.json';

export default function CounselorDetailPage() {
  return <CounselorDetailClientPage />;
}

// Required for static export with dynamic routes
export async function generateStaticParams() {
  // Generate static params for all counselors
  return counselors.map((counselor) => ({
    id: counselor.id,
  }));
}
