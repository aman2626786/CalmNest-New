'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Star, Loader2, CheckCircle } from 'lucide-react';
import { useUserProfile } from '@/context/UserProfileContext';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
const feedbackSchema = z.object({
  rating: z.number().min(1, { message: 'Please provide a rating.' }),
  mostHelpful: z.string().optional(),
  improvement: z.string().max(1000).optional(),
  recommend: z.enum(['yes', 'no', 'maybe'], {
    required_error: 'Please select an option.',
  }),
});

const features = ['AI Chat', 'Forum', 'Resources', 'Appointments', 'Other'];
type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export function FeedbackForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { profile } = useUserProfile();
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
      mostHelpful: '',
      improvement: '',
      recommend: undefined,
    },
  });

  async function onSubmit(values: FeedbackFormValues) {
    startTransition(async () => {
      try {
        // Get user info prioritizing localStorage (most up-to-date)
        const userId = localStorage.getItem('userId') || profile?.id || 'anonymous-user';
        const userEmail = localStorage.getItem('userEmail') || profile?.email || 'anonymous@example.com';
        const userName = localStorage.getItem('userName')?.trim() || profile?.full_name?.trim() || null;
        
        // Use actual name or fallback to email-based name
        const displayName = userName || userEmail.split('@')[0] || 'Anonymous User';
        
        console.log('Feedback submission - User data:', {
          userId,
          userEmail, 
          userName,
          displayName,
          profileData: profile
        });
        
        console.log('Submitting feedback:', values);
        console.log('User info:', { userId, userEmail, userName, displayName });
        console.log('Profile data:', profile);

        const feedbackData = {
          userId: userId,
          userEmail: userEmail,
          userName: displayName,
          feedback_text: `Rating: ${values.rating}/5 stars
Most Helpful Feature: ${values.mostHelpful || 'Not specified'}
Improvement Suggestions: ${values.improvement || 'None provided'}
Would Recommend: ${values.recommend}
Submitted by: ${displayName}`,
          rating: values.rating,
          mostHelpful: values.mostHelpful,
          improvement: values.improvement,
          recommend: values.recommend
        };

        const response = await fetch('http://127.0.0.1:5001/api/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(feedbackData),
        });

        console.log('Feedback API response status:', response.status);

        if (response.ok) {
          const result = await response.json();
          console.log('Feedback submitted successfully:', result);
          setIsSubmitted(true);
        } else {
          const errorText = await response.text();
          console.error('Failed to submit feedback:', errorText);
          alert('Failed to submit feedback. Please try again.');
        }
      } catch (error) {
        console.error('An error occurred:', error);
        alert('Network error. Please check your connection and try again.');
      }
    });
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <div>
          <h2 className="text-2xl font-bold text-foreground">Thank You!</h2>
          <p className="text-muted-foreground mt-1">Your feedback has been submitted successfully.</p>
        </div>
        <Button onClick={() => setOpen(false)} className="bg-purple-600 hover:bg-purple-700">Close</Button>
      </div>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">Share Your Feedback</DialogTitle>
        <DialogDescription>
          Your insights help us improve CalmNest for everyone.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">How would you rate your overall experience?</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => field.onChange(star)}
                        className="focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
                      >
                        <Star
                          className={`h-8 w-8 cursor-pointer transition-all duration-200 hover:scale-110 ${
                            star <= field.value
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-400 hover:text-yellow-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mostHelpful"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Which feature did you find most helpful?</FormLabel>
                <FormControl>
                   <div className="grid grid-cols-2 gap-3">
                     {features.map(feature => (
                        <button
                          key={feature}
                          type="button"
                          onClick={() => field.onChange(feature)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                            field.value === feature
                              ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                              : 'border-border bg-card text-foreground hover:border-purple-400 hover:bg-purple-500/10'
                          }`}
                        >
                          {feature}
                        </button>
                     ))}
                   </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="improvement"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">How can we improve your experience?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any suggestions or ideas are welcome!"
                    className="bg-input border-border text-foreground min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recommend"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Would you recommend CalmNest to a friend?</FormLabel>
                <FormControl>
                  <div className="flex gap-4">
                    {[
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' },
                      { value: 'maybe', label: 'Maybe' }
                    ].map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => field.onChange(option.value)}
                        className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                          field.value === option.value
                            ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                            : 'border-border bg-card text-foreground hover:border-purple-400 hover:bg-purple-500/10'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending} className="w-full bg-purple-600 hover:bg-purple-700">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Feedback
          </Button>
        </form>
      </Form>
    </>
  );
}