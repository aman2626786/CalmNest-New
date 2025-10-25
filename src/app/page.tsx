'use client';

import { Hero } from '@/components/features/home/Hero';
import { Features } from '@/components/features/home/Features';
import { Testimonials } from '@/components/features/home/Testimonials';
import { CrisisHelp } from '@/components/features/home/CrisisHelp';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      <Hero />
      <Features />
      <Testimonials />
      <CrisisHelp />
      <Footer />
    </main>
  );
}