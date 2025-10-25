'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from 'lucide-react';
import { getForumPost, getReplies, createReply } from "@/app/actions";
import { ForumPost, Reply } from "@/types/index";

export default function PostDetailClientPage() {
  const params = useParams();
  const postId = params.postId as string;

  const [post, setPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newReply, setNewReply] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const [postResult, repliesResult] = await Promise.all([
        getForumPost(postId),
        getReplies(postId),
      ]);

      if (postResult.post) {
        setPost(postResult.post);
      } else {
        setError(postResult.error || "Failed to load post.");
      }

      if (repliesResult.replies) {
        setReplies(repliesResult.replies);
      } else {
        // It's okay if there are no replies, but handle error if it exists
        if(repliesResult.error) {
            console.warn("Error fetching replies:", repliesResult.error);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [postId]);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    setIsSubmitting(true);
    const result = await createReply(postId, newReply);
    setIsSubmitting(false);

    if (result.success) {
      setNewReply("");
      // Re-fetch data to show the new reply
      fetchData(); 
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-900"><Loader2 className="h-16 w-16 animate-spin text-purple-400" /></div>;
  }

  if (error) {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white">
            <Alert variant="destructive" className="max-w-lg">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button asChild variant="link" className="mt-4 text-purple-400">
                <Link href="/forum"><ArrowLeft className="mr-2 h-4 w-4"/>Back to Forum</Link>
            </Button>
        </div>
    );
  }

  if (!post) {
    return null; // Should be handled by error state
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-gray-900 text-white">
        <Button asChild variant="outline" className="mb-6 bg-gray-800 border-gray-700 hover:bg-gray-700">
            <Link href="/forum"><ArrowLeft className="mr-2 h-4 w-4"/>Back to Forum</Link>
        </Button>

        {/* Main Post */}
        <Card className="mb-8 bg-gray-800 border-gray-700">
            <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">{post.category}</Badge>
                <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
                <div className="text-sm text-gray-400">
                    By {post.authorName} &bull; {post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString() : 'some time'}
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-lg whitespace-pre-wrap">{post.content}</p>
            </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-4">Replies ({replies.length})</h2>

        {/* Replies List */}
        <div className="space-y-6">
            {replies.length > 0 ? (
                replies.map(reply => (
                    <Card key={reply.id} className="bg-gray-800 border-gray-700">
                        <CardHeader className="pb-2">
                             <div className="text-sm text-gray-400">
                                {reply.authorName} &bull; {reply.createdAt ? new Date(reply.createdAt.seconds * 1000).toLocaleDateString() : 'some time'}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap">{reply.content}</p>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <p className="text-gray-400">No Replies Yet. Be the first to respond!</p>
            )}
        </div>

        {/* Reply Form */}
        <form onSubmit={handleReplySubmit} className="mt-12">
            <h3 className="text-xl font-bold mb-4">Leave a Reply</h3>
            <Textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder="Share your thoughts and support..."
                className="min-h-[120px] bg-gray-800 border-gray-700"
            />
            <Button type="submit" disabled={isSubmitting || !newReply.trim()} className="mt-4 bg-purple-600 hover:bg-purple-700">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Reply Anonymously
            </Button>
        </form>
    </div>
  );
}