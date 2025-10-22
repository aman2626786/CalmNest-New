'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Star, Loader2, CheckCircle } from 'lucide-react';

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
        const response = await fetch('http://127.0.0.1:5001/api/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // Combine all form values into a single feedback_text string for simplicity
          // or you can adjust your backend to accept all these fields individually.
          body: JSON.stringify({
            feedback_text: `Rating: ${values.rating}, Most Helpful: ${values.mostHelpful}, Improvement: ${values.improvement}, Recommend: ${values.recommend}`,
            rating: values.rating
          }),
        });

        if (response.ok) {
          setIsSubmitted(true);
        } else {
          // Handle server errors (e.g., show a toast notification)
          console.error('Failed to submit feedback');
        }
      } catch (error) {
        // Handle network errors
        console.error('An error occurred:', error);
      }
    });
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <div>
          <h2 className="text-2xl font-bold">Thank You!</h2>
          <p className="text-gray-400 mt-1">Your feedback has been submitted successfully.</p>
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
                <FormLabel>How would you rate your overall experience?</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`h-8 w-8 cursor-pointer transition-colors ${
                          star <= field.value
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-600'
                        }`}
                        onClick={() => field.onChange(star)}
                      />
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
                <FormLabel>Which feature did you find most helpful?</FormLabel>
                <FormControl>
                   <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-wrap gap-4">
                     {features.map(feature => (
                        <FormItem key={feature} className="flex items-center space-x-2">
                            <FormControl>
                                <RadioGroupItem value={feature} id={feature} />
                            </FormControl>
                            <FormLabel htmlFor={feature} className="font-normal">{feature}</FormLabel>
                        </FormItem>
                     ))}
                   </RadioGroup>
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
                <FormLabel>How can we improve your experience?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any suggestions or ideas are welcome!"
                    className="bg-gray-800 border-gray-700 min-h-[100px]"
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
                <FormLabel>Would you recommend CalmNest to a friend?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-6">
                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="yes" id="rec-yes" /></FormControl><FormLabel htmlFor="rec-yes" className="font-normal">Yes</FormLabel></FormItem>
                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="no" id="rec-no" /></FormControl><FormLabel htmlFor="rec-no" className="font-normal">No</FormLabel></FormItem>
                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="maybe" id="rec-maybe" /></FormControl><FormLabel htmlFor="rec-maybe" className="font-normal">Maybe</FormLabel></FormItem>
                  </RadioGroup>
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