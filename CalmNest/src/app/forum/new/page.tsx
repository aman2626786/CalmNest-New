'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from 'next/navigation';

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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        const response = await fetch('http://127.0.0.1:5001/api/forum', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: values.title,
                content: values.content,
                author: 'Anonymous' // Hardcoded author
            }),
        });

        if (response.ok) {
            router.push('/forum');
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message || 'Failed to create post'}`);
        }
    } catch (error) {
        console.error("Failed to submit forum post:", error);
        alert('An unexpected error occurred.');
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-6">Create a New Post</h1>

        <Alert className="mb-8 bg-gray-800 border-yellow-500/50">
            <Terminal className="h-4 w-4" />
            <AlertTitle className="text-yellow-400">Community Guidelines</AlertTitle>
            <AlertDescription className="text-gray-300">
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
                            <FormLabel className="text-lg">Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter a descriptive title for your post" {...field} className="bg-gray-800 border-gray-700"/>
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
                            <FormLabel className="text-lg">Category</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="bg-gray-800 border-gray-700">
                                        <SelectValue placeholder="Select a category that best fits your post" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-gray-800 text-white">
                                    <SelectItem value="General">General</SelectItem>
                                    <SelectItem value="Anxiety">Anxiety</SelectItem>
                                    <SelectItem value="Depression">Depression</SelectItem>
                                    <SelectItem value="Stress">Stress</SelectItem>
                                    <SelectItem value="Relationships">Relationships</SelectItem>
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
                            <FormLabel className="text-lg">Your Message</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Share your thoughts, feelings, or questions. Remember to be kind and respectful."
                                    className="min-h-[200px] bg-gray-800 border-gray-700"
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
  );
}
