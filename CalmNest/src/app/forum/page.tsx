'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, MessageSquare, Shield, Users } from 'lucide-react';
import { getForumPosts } from "@/app/actions";
import { ForumPost } from "@/types/index";
import { useTranslation } from 'react-i18next';

export default function ForumPage() {
  const { t } = useTranslation('forum');
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await getForumPosts();
        if (result.posts) {
          setPosts(result.posts);
        } else if (result.error) {
          setError(result.error);
        }
      } catch (err) {
        setError(t('error'));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [t]);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20 px-4 bg-gray-800">
        <h1 className="text-5xl font-bold mb-4">{t('title')}</h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          {t('subtitle')}
        </p>
        <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
          <Link href="/forum/new">{t('newPost')}</Link>
        </Button>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
            <div className="p-6 bg-gray-800 rounded-lg">
                <Shield className="h-12 w-12 mx-auto mb-4 text-purple-400"/>
                <h3 className="text-xl font-bold mb-2">{t('features.anonymous.title')}</h3>
                <p className="text-gray-400">{t('features.anonymous.description')}</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg">
                <Users className="h-12 w-12 mx-auto mb-4 text-purple-400"/>
                <h3 className="text-xl font-bold mb-2">{t('features.community.title')}</h3>
                <p className="text-gray-400">{t('features.community.description')}</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-purple-400"/>
                <h3 className="text-xl font-bold mb-2">{t('features.constructive.title')}</h3>
                <p className="text-gray-400">{t('features.constructive.description')}</p>
            </div>
        </div>
      </section>

      {/* Post List */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">{t('recentDiscussions')}</h2>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            <p className="text-xl">{t('noPosts.title')}</p>
            <p>{t('noPosts.subtitle')}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <Card key={post.id} className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl">
                    <Link href={`/forum/${post.id}`} className="hover:text-purple-400">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <div className="flex items-center text-sm text-gray-400 gap-4">
                    <span>{post.authorName}</span>
                    <span>
                      {post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString() : 'some time'}
                    </span>
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 line-clamp-2">{post.content}</p>
                </CardContent>
                <CardFooter>
                    <div className="flex items-center text-sm text-gray-400">
                        <MessageSquare className="h-4 w-4 mr-2"/>
                        {post.replyCount} {post.replyCount === 1 ? t('reply') : t('replies')}
                    </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}