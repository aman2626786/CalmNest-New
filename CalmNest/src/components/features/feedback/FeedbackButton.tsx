'use client';

import { useState, cloneElement, ReactElement } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { FeedbackForm } from './FeedbackForm';

export function FeedbackButton({ children }: { children: ReactElement }) {
  const [isOpen, setIsOpen] = useState(false);

  const child = cloneElement(children, {
    onClick: () => setIsOpen(true),
  });

  return (
    <>
      {child}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-700">
          <FeedbackForm setOpen={setIsOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
}