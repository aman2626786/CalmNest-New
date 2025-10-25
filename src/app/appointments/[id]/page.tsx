import CounselorDetailClientPage from './client-page';
import counselors from '@/lib/data/counselors.json';

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return counselors.map((counselor) => ({
    id: counselor.id,
  }));
}

export default function CounselorDetailPage() {
  return <CounselorDetailClientPage />;
}
