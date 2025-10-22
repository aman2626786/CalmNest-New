'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { MessageSquarePlus } from 'lucide-react';
import { FeedbackForm } from '../../../components/features/feedback/FeedbackForm';

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg"
      >
        <MessageSquarePlus className="h-6 w-6" />
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-700">
          <FeedbackForm setOpen={setIsOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
}