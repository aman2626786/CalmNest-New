'use client';

import { CheckCircle as CheckCircleIcon } from 'lucide-react';

export const CheckCircle = ({ className = '', ...props }) => {
  return <CheckCircleIcon className={className} {...props} />;
};
