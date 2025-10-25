import PostDetailClientPage from './client-page';

export async function generateStaticParams(): Promise<{ postId: string }[]> {
  // Generate some sample post IDs for static export
  return [
    { postId: '1' },
    { postId: '2' },
    { postId: '3' },
  ];
}

export default function PostDetailPage() {
  return <PostDetailClientPage />;
}