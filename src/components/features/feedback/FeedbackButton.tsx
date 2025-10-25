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
        <DialogContent className="bg-background text-foreground border-border max-w-2xl">
          <FeedbackForm setOpen={setIsOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
}