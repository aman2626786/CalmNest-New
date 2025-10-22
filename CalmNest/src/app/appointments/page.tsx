'use client';

import counselors from '@/lib/data/counselors.json';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function AppointmentsPage() {
  const { t } = useTranslation('appointments');

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-8">{t('title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {counselors.map((counselor) => (
          <Card key={counselor.id} className="flex flex-col">
            <CardHeader>
              <div className="relative h-48 w-full">
                <Image
                  src={counselor.imageUrl}
                  alt={counselor.imageHint}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardTitle>{t(`counselors.${counselor.id}.name`)}</CardTitle>
              <p className="text-sm text-muted-foreground">{t(`counselors.${counselor.id}.specialty`)}</p>
              <p className="mt-2 text-sm">{t(`counselors.${counselor.id}.description`).substring(0, 100)}...</p>
            </CardContent>
            <CardFooter>
              <Link href={`/appointments/${counselor.id}`} passHref>
                <Button className="w-full">{t('viewProfileAndBook')}</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}