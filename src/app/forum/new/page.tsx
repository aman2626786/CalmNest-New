'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function NewForumPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both title and content.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://127.0.0.1:5001/api/forum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'anonymous_user',
          title: title.trim(),
          content: content.trim(),
          author: author.trim() || 'Anonymous',
          category: category
        }),
      });

      if (response.ok) {
        router.push('/forum');
      } else {
        const errorText = await response.text();
        console.error('Failed to create post:', errorText);
        alert('Failed to create post. Please try again.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Network error. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/10 to-gray-900 text-foreground py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/forum" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Forum
            </Link>
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Create New Post</h1>
          </div>
          <p className="text-gray-300">
            Share your thoughts, experiences, or questions with the community in a safe and supportive environment.
          </p>
        </div>

        {/* Form */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">New Discussion</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Author Name */}
              <div className="space-y-2">
                <Label htmlFor="author" className="text-gray-300">
                  Display Name (Optional)
                </Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Leave blank to post anonymously"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
                <p className="text-sm text-gray-400">
                  You can choose to remain anonymous or use a display name.
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-300">
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="General">General Discussion</SelectItem>
                    <SelectItem value="Support">Support & Encouragement</SelectItem>
                    <SelectItem value="Resources">Resources & Tips</SelectItem>
                    <SelectItem value="Success">Success Stories</SelectItem>
                    <SelectItem value="Questions">Questions & Advice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-300">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What would you like to discuss?"
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-gray-300">
                  Content *
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your thoughts, experiences, or questions..."
                  required
                  rows={8}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 resize-none"
                />
                <p className="text-sm text-gray-400">
                  Please be respectful and supportive. Avoid sharing personal information.
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {isSubmitting ? 'Creating Post...' : 'Create Post'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/forum')}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Guidelines */}
        <Card className="mt-8 bg-blue-900/20 border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-blue-300">Community Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-200 space-y-2">
            <p>• Be respectful and supportive to all community members</p>
            <p>• Avoid sharing personal information or contact details</p>
            <p>• No medical advice - share experiences and coping strategies instead</p>
            <p>• Report inappropriate content using the report button</p>
            <p>• Remember that this is a peer support space, not professional therapy</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}