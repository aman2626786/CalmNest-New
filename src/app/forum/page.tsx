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
import { FAQ } from '@/components/common/FAQ';

export default function ForumPage() {
  const { t } = useTranslation('forum');
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('Fetching forum posts...');
        
        // Direct API call instead of using actions
        const response = await fetch('http://127.0.0.1:5001/api/forum');
        console.log('Forum API response status:', response.status);
        
        if (response.ok) {
          const posts = await response.json();
          console.log('Forum posts received:', posts.length);
          setPosts(posts);
        } else {
          const errorText = await response.text();
          console.error('Forum API error:', errorText);
          setError('Failed to load forum posts. Please try again later.');
        }
      } catch (err) {
        console.error('Forum fetch error:', err);
        setError('Network error. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [t]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/10 to-gray-900 text-foreground">
      {/* Hero Section */}
      <section className="relative text-center py-20 px-4 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2069&auto=format&fit=crop)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-purple-900/70 to-gray-900/85" />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Users className="w-12 h-12 text-purple-400" />
            <Badge className="bg-purple-600/20 text-purple-300 border-purple-400/20 text-lg px-4 py-2">
              Safe Community Space
            </Badge>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">{t('title', 'Peer Support Forum')}</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            {t('subtitle', 'A safe and anonymous space to share, connect, and support one another.')}
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg">
            <Link href="/forum/new" className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {t('newPost', 'Create a New Post')}
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
            <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-colors">
                <Shield className="h-12 w-12 mx-auto mb-4 text-purple-400"/>
                <h3 className="text-xl font-bold mb-2 text-white">{t('features.anonymous.title', 'Anonymous Sharing')}</h3>
                <p className="text-gray-300">{t('features.anonymous.description', 'Your identity is always protected. Share openly without fear of judgment.')}</p>
            </div>
            <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-colors">
                <Users className="h-12 w-12 mx-auto mb-4 text-purple-400"/>
                <h3 className="text-xl font-bold mb-2 text-white">{t('features.community.title', 'Community Support')}</h3>
                <p className="text-gray-300">{t('features.community.description', 'Connect with peers who understand what you\'re going through.')}</p>
            </div>
            <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-colors">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-purple-400"/>
                <h3 className="text-xl font-bold mb-2 text-white">{t('features.constructive.title', 'Constructive Conversations')}</h3>
                <p className="text-gray-300">{t('features.constructive.description', 'Engage in helpful and supportive discussions, moderated for safety.')}</p>
            </div>
        </div>
      </section>

      {/* Post List */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-foreground">{t('recentDiscussions', 'Recent Discussions')}</h2>
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
          <div className="text-center text-muted-foreground py-16">
            <p className="text-xl">{t('noPosts.title', 'No posts yet.')}</p>
            <p>{t('noPosts.subtitle', 'Be the first to start a conversation!')}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <Card key={post.id} className="bg-card/80 backdrop-blur-sm border-border hover:border-purple-500 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">
                    <Link href={`/forum/${post.id}`} className="hover:text-purple-400">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground gap-4">
                    <span>{post.author || 'Anonymous'}</span>
                    <span>
                      {post.timestamp ? new Date(post.timestamp).toLocaleDateString() : 'Recently'}
                    </span>
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                      {post.category || 'General'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground line-clamp-2">{post.content}</p>
                </CardContent>
                <CardFooter>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4 mr-2"/>
                        {post.replyCount || 0} {(post.replyCount || 0) === 1 ? 'reply' : 'replies'}
                    </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* FAQ Section */}
      <FAQ 
        title="Community Forum FAQ"
        faqs={[
          {
            question: "Is the forum completely anonymous?",
            answer: "Yes, you can choose to post anonymously or use a display name. We prioritize your privacy and never share personal information without your consent."
          },
          {
            question: "What topics can I discuss in the forum?",
            answer: "You can discuss mental health experiences, coping strategies, recovery journeys, and seek support. Please keep discussions respectful and avoid giving medical advice."
          },
          {
            question: "Are posts moderated?",
            answer: "Yes, all posts are reviewed to ensure they follow community guidelines. We maintain a safe, supportive environment for all members."
          },
          {
            question: "Can I delete my posts?",
            answer: "Yes, you can edit or delete your posts at any time. Simply go to your post and use the edit or delete options."
          },
          {
            question: "How do I report inappropriate content?",
            answer: "If you see content that violates our guidelines, please report it using the report button on the post. Our moderation team will review it promptly."
          },
          {
            question: "Can I get professional help through the forum?",
            answer: "While our community provides peer support, the forum is not a substitute for professional mental health care. For crisis situations, please contact emergency services or a mental health professional."
          }
        ]}
        className="mt-16"
      />
    </div>
  );
}