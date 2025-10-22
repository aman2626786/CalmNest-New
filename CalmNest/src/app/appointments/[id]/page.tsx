'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import counselors from '@/lib/data/counselors.json';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { saveBooking } from '@/app/actions';
import { CheckCircle } from 'lucide-react';

const bookingSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  time: z.string({
    required_error: "A time is required.",
  }),
});

type Counselor = typeof counselors[0];

export default function CounselorDetailPage() {
  const params = useParams();
  const counselorId = params.id as string;
  const counselor = counselors.find(c => c.id === counselorId) as Counselor;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
  });

  const availableDays = useMemo(() => {
    const dayMap: { [key: string]: boolean } = {};
    counselor.availability.forEach(a => {
      dayMap[a.day.toLowerCase()] = true;
    });
    return dayMap;
  }, [counselor.availability]);

  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    const dayAvailability = counselor.availability.find(a => a.day === dayOfWeek);
    return dayAvailability ? dayAvailability.slots : [];
  }, [selectedDate, counselor.availability]);

  async function onSubmit(data: z.infer<typeof bookingSchema>) {
    if (!counselor) return;
    const result = await saveBooking({
      counselorId: counselor.id,
      counselorName: counselor.name,
      date: data.date.toISOString().split('T')[0],
      time: data.time,
    });

    if (result.success) {
      setIsBookingConfirmed(true);
    } else {
      // Handle error, maybe with a toast notification
      console.error(result.error);
    }
  }

  if (!counselor) {
    return <div>Counselor not found.</div>;
  }
  
  if (isBookingConfirmed) {
    return (
      <div className="container mx-auto py-12 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold">Booking Confirmed!</h1>
        <p className="mt-2 text-lg">Your appointment with {counselor.name} is set.</p>
        <p>You will receive a confirmation email shortly (mock feature).</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="relative h-80 w-full mb-4">
            <Image
              src={counselor.imageUrl}
              alt={counselor.imageHint}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
            />
          </div>
          <h1 className="text-3xl font-bold">{counselor.name}</h1>
          <p className="text-lg text-muted-foreground">{counselor.specialty}</p>
        </div>
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-2">About</h2>
          <p className="mb-8">{counselor.description}</p>
          
          <h2 className="text-2xl font-semibold mb-4">Book a Session</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setSelectedDate(date);
                            form.resetField("time");
                          }}
                          disabled={(date) => {
                            const day = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
                            return date < new Date(new Date().setHours(0,0,0,0)) || !availableDays[day];
                          }}
                          initialFocus
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedDate}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a time slot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableSlots.map(slot => (
                            <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Booking..." : "Confirm Booking"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
