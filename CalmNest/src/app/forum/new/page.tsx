'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/context/UserProfileContext';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Loader2 } from "lucide-react";
import { createForumPost } from "@/app/actions";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }).max(150),
  category: z.string({ required_error: "Please select a category." }),
  content: z.string().min(20, { message: "Content must be at least 20 characters." }).max(5000),
});

export default function NewPostPage() {
  const router = useRouter();
  const { profile } = useUserProfile();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        // Get user session for proper data saving (prioritize localStorage)
        const userEmail = localStorage.getItem('userEmail') || profile?.email || 'anonymous@example.com';
        const userId = localStorage.getItem('userId') || profile?.id || 'anonymous-user';
        const userName = localStorage.getItem('userName')?.trim() || profile?.full_name?.trim() || null;
        
        // Use actual name or fallback to email-based name
        const displayName = userName || userEmail.split('@')[0] || 'Anonymous';
        
        console.log('Submitting forum post:', {
            title: values.title,
            category: values.category,
            content: values.content,
            userId: userId,
            userEmail: userEmail,
            userName: displayName
        });
        console.log('Profile data:', profile);

        const response = await fetch('http://127.0.0.1:5001/api/forum', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                title: values.title,
                content: values.content,
                author: displayName, // Use actual name instead of Anonymous
                category: values.category
            }),
        });

        console.log('Forum API response status:', response.status);

        if (response.ok) {
            const result = await response.json();
            console.log('Forum post created successfully:', result);
            alert('Post created successfully!');
            router.push('/forum');
        } else {
            const errorText = await response.text();
            console.error('Forum API error:', errorText);
            alert(`Error: ${errorText || 'Failed to create post'}`);
        }
    } catch (error) {
        console.error("Failed to submit forum post:", error);
        alert(`Network error: ${error instanceof Error ? error.message : 'An unexpected error occurred.'}`);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/10 to-gray-900">
      <div className="max-w-4xl mx-auto p-4 md:p-8 text-foreground">
        <h1 className="text-4xl font-bold mb-6 text-foreground">Create a New Post</h1>

        <Alert className="mb-8 bg-card border-yellow-500/50">
            <Terminal className="h-4 w-4" />
            <AlertTitle className="text-yellow-400">Community Guidelines</AlertTitle>
            <AlertDescription className="text-muted-foreground">
                Be respectful and supportive. No personal attacks or harassment. Keep discussions focused on mental health and wellness. All posts are anonymous.
            </AlertDescription>
        </Alert>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-lg text-foreground">Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter a descriptive title for your post" {...field} className="bg-input border-border text-foreground"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-lg text-foreground">Category</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="bg-input border-border text-foreground">
                                        <SelectValue placeholder="Select a category that best fits your post" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-popover border-border text-popover-foreground">
                                    <SelectItem value="General" className="text-foreground hover:bg-accent focus:bg-accent focus:text-accent-foreground">General</SelectItem>
                                    <SelectItem value="Anxiety" className="text-foreground hover:bg-accent focus:bg-accent focus:text-accent-foreground">Anxiety</SelectItem>
                                    <SelectItem value="Depression" className="text-foreground hover:bg-accent focus:bg-accent focus:text-accent-foreground">Depression</SelectItem>
                                    <SelectItem value="Stress" className="text-foreground hover:bg-accent focus:bg-accent focus:text-accent-foreground">Stress</SelectItem>
                                    <SelectItem value="Relationships" className="text-foreground hover:bg-accent focus:bg-accent focus:text-accent-foreground">Relationships</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-lg text-foreground">Your Message</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Share your thoughts, feelings, or questions. Remember to be kind and respectful."
                                    className="min-h-[200px] bg-input border-border text-foreground"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting} className="bg-purple-600 hover:bg-purple-700">
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Anonymously
                </Button>
            </form>
        </Form>
      </div>
    </div>
  );
}
