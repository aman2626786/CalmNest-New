import CounselorDetailClientPage from './client-page';
import counselors from '@/lib/data/counselors.json';

// Removed dynamic export for static export compatibility

export async function generateStaticParams() {
  return counselors.map((counselor) => ({
    id: counselor.id,
  }));
}

export default function CounselorDetailPage() {
  return <CounselorDetailClientPage />;
}
