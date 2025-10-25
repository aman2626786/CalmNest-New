import PostDetailClientPage from './client-page';

export async function generateStaticParams(): Promise<{ postId: string }[]> {
  return [];
}

export default function PostDetailPage() {
  return <PostDetailClientPage />;
}