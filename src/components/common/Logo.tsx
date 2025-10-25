'use client';

import Link from 'next/link';

export const Logo = () => (
  <Link href="/" className="flex items-center space-x-2">
    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
      <span className="text-white font-semibold">M</span>
    </div>
    <span className="text-xl font-semibold text-white">MindCare</span>
  </Link>
);