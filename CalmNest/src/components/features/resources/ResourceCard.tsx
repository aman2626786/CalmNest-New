'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, Mic, BookOpen, PauseCircle } from 'lucide-react';

// Define the Resource type
interface Resource {
  id: string;
  type: 'video' | 'audio' | 'article';
  category: string;
  title: string;
  description: string;
  source: string;
  url: string;
  imageUrl: string;
  imageHint: string;
}

interface ResourceCardProps {
  resource: Resource;
}

const TypeIcon = ({ type }: { type: Resource['type'] }) => {
  const iconProps = { className: 'w-5 h-5 mr-2' };
  switch (type) {
    case 'video':
      return <PlayCircle {...iconProps} />;
    case 'audio':
      return <Mic {...iconProps} />;
    case 'article':
      return <BookOpen {...iconProps} />;
    default:
      return null;
  }
};

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);

  // Simulate progress for demonstration
  if (isPlaying) {
    setTimeout(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 5));
    }, 500);
  }

  return (
    <div className="mt-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <PauseCircle className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
        </Button>
        <div className="w-full">
          <Progress value={progress} className="w-full" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{isPlaying ? '0:45' : '0:00'}</span>
            <span>5:00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ResourceCard = ({ resource }: ResourceCardProps) => {
  return (
    <Card className="flex flex-col h-full bg-gray-800 border-gray-700 text-white overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out">
      <CardHeader className="relative p-0">
        <div className="relative h-48 w-full">
          <Image
            src={resource.imageUrl}
            alt={resource.imageHint}
            fill
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <Badge className="absolute top-2 left-2 bg-primary/80 backdrop-blur-sm">
            <TypeIcon type={resource.type} />
            {resource.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-lg font-bold mb-2 line-clamp-2">{resource.title}</CardTitle>
        <p className="text-sm text-gray-300 line-clamp-3">{resource.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        {resource.type === 'video' && (
          <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
              Watch Now
            </a>
          </Button>
        )}
        {resource.type === 'article' && (
          <Button asChild variant="link" className="w-full text-purple-400 hover:text-purple-300">
             <a href={resource.url} target="_blank" rel="noopener noreferrer">
              Read More
            </a>
          </Button>
        )}
        {resource.type === 'audio' && <AudioPlayer />}
      </CardFooter>
    </Card>
  );
};
