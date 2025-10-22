'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, LifeBuoy, Lightbulb, Zap } from 'lucide-react';
import { ResourceCard } from '@/components/features/resources/ResourceCard';
import resources from '@/lib/data/resources.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const categories = ['All', 'Stress', 'Anxiety', 'Mindfulness'];

export default function ResourceHubPage() {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesCategory = filter === 'All' || resource.category === filter;
      const matchesSearch = searchTerm === '' ||
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [filter, searchTerm]);

  const topRecommendations = useMemo(() => {
    return resources.slice(0, 5);
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20 px-4 bg-gray-800">
        <h1 className="text-5xl font-bold mb-4">Explore Our Resource Hub</h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          Find articles, videos, and audio guides to support your mental wellness journey.
        </p>
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search for topics like 'anxiety', 'meditation'..."
            className="w-full pl-12 pr-4 py-6 bg-gray-700 border-gray-600 rounded-full focus:ring-purple-500 focus:border-purple-500"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </div>
      </section>

      {/* Top Recommendations Carousel */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Top Recommendations</h2>
        <Carousel className="w-full max-w-6xl mx-auto">
          <CarouselContent>
            {topRecommendations.map(resource => (
              <CarouselItem key={resource.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <ResourceCard resource={resource} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-white bg-gray-800 hover:bg-gray-700" />
          <CarouselNext className="text-white bg-gray-800 hover:bg-gray-700" />
        </Carousel>
      </section>

      {/* Categories & Resources Section */}
      <section className="py-16 px-4">
        <div className="sticky top-16 bg-gray-900/80 backdrop-blur-sm py-4 z-10 mb-8">
            <div className="flex justify-center gap-2 flex-wrap">
                {categories.map(category => (
                    <Button
                        key={category}
                        variant={filter === category ? 'default' : 'outline'}
                        onClick={() => setFilter(category)}
                        className={filter === category ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
                    >
                        {category}
                    </Button>
                ))}
            </div>
        </div>

        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-16">
            <p className="text-xl">No resources found.</p>
            <p>Try adjusting your search or filter.</p>
          </div>
        )}
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gray-800">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="max-w-3xl mx-auto">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg">Are these resources free?</AccordionTrigger>
            <AccordionContent className="text-gray-300">
              Yes, all resources in our hub are completely free to access. Our goal is to make mental wellness support accessible to everyone.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg">How often are new resources added?</AccordionTrigger>
            <AccordionContent className="text-gray-300">
              We are constantly curating and adding new, high-quality resources to the hub. Check back weekly for new content!
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg">Can I suggest a resource?</AccordionTrigger>
            <AccordionContent className="text-gray-300">
              Absolutely! We welcome suggestions from our community. Please use the contact form on our website to send us a link to the resource you'd like to share.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Dive In?</h2>
            <p className="text-lg mb-8">Start exploring our resources now and take the next step on your wellness journey.</p>
            <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600">
                Explore All Resources
            </Button>
        </div>
      </section>

    </div>
  );
}