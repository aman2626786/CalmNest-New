import PostDetailClientPage from './client-page';

// Required for static export with dynamic routes
export async function generateStaticParams() {
  // Return empty array for static export - pages will be generated on demand
  return [];
}

export default function PostDetailPage() {
  return <PostDetailClientPage />;
}