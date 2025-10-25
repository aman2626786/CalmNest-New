import CounselorDetailClientPage from './client-page';
import counselors from '@/lib/data/counselors.json';

export async function generateStaticParams() {
  return counselors.map((counselor) => ({
    id: counselor.id,
  }));
}

export default function CounselorDetailPage() {
  return <CounselorDetailClientPage />;
}
