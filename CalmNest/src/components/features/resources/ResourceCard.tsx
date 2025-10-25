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
    <Card className="group flex flex-col h-full bg-gray-800/50 backdrop-blur-sm border-gray-700 text-white overflow-hidden transform hover:-translate-y-3 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 ease-out">
      <CardHeader className="relative p-0">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={resource.imageUrl}
            alt={resource.imageHint}
            fill
            style={{ objectFit: 'cover' }}
            className="group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/10 transition-colors duration-300" />
          
          <Badge className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur-md border border-gray-600 text-white">
            <TypeIcon type={resource.type} />
            {resource.category}
          </Badge>
          
          {/* Source badge */}
          <Badge variant="outline" className="absolute top-3 right-3 bg-white/10 backdrop-blur-md border-white/20 text-white text-xs">
            {resource.source}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow p-6">
        <CardTitle className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors duration-300">
          {resource.title}
        </CardTitle>
        <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed">
          {resource.description}
        </p>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 mt-auto">
        {resource.type === 'video' && (
          <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              <PlayCircle className="w-4 h-4" />
              Watch Now
            </a>
          </Button>
        )}
        {resource.type === 'article' && (
          <Button asChild variant="outline" className="w-full border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition-all duration-300">
             <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4" />
              Read Article
            </a>
          </Button>
        )}
        {resource.type === 'audio' && <AudioPlayer />}
      </CardFooter>
    </Card>
  );
};
