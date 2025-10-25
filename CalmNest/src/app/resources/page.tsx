'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, LifeBuoy, Lightbulb, Zap, Heart, Brain, Moon, Smile, Phone, MessageCircle, Shield } from 'lucide-react';
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

const categories = ['All', 'Stress', 'Anxiety', 'Mindfulness', 'Sleep', 'Depression', 'Motivation', 'Self-Care'];

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
      <section className="relative text-center py-24 px-4 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop)',
          }}
        >
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Brain className="w-8 h-8 text-purple-400" />
            <Badge className="bg-purple-600/20 text-purple-300 border-purple-400">
              Mental Wellness Hub
            </Badge>
          </div>
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Explore Our Resource Hub
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Discover curated articles, guided videos, and calming audio content designed to support your mental wellness journey. 
            From stress relief to mindfulness practices, find the resources that resonate with you.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="search"
              placeholder="Search for topics like 'anxiety', 'meditation', 'sleep'..."
              className="w-full pl-14 pr-6 py-4 text-lg bg-white/10 backdrop-blur-md border-white/20 rounded-2xl focus:ring-purple-500 focus:border-purple-400 text-white placeholder:text-gray-300"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 min-w-[120px]">
              <div className="text-2xl font-bold text-purple-300">{resources.length}+</div>
              <div className="text-sm text-gray-300">Resources</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 min-w-[120px]">
              <div className="text-2xl font-bold text-purple-300">{categories.length - 1}</div>
              <div className="text-sm text-gray-300">Categories</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 min-w-[120px]">
              <div className="text-2xl font-bold text-purple-300">24/7</div>
              <div className="text-sm text-gray-300">Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Recommendations Carousel */}
      <section className="relative py-16 px-4 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full bg-repeat"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1558022285-10534fa75a83?q=80&w=1935&auto=format&fit=crop)',
              backgroundSize: '400px 300px',
            }}
          />
        </div>
        
        <div className="relative z-10">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <LifeBuoy className="w-8 h-8 text-indigo-400" />
              <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-400/20">
                Curated for You
              </Badge>
            </div>
            <h2 className="text-4xl font-bold mb-4">Top Recommendations</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Handpicked resources based on effectiveness and user feedback
            </p>
          </div>
          
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
            <CarouselPrevious className="text-white bg-gray-800/80 hover:bg-gray-700 backdrop-blur-sm border border-gray-600" />
            <CarouselNext className="text-white bg-gray-800/80 hover:bg-gray-700 backdrop-blur-sm border border-gray-600" />
          </Carousel>
        </div>
      </section>

      {/* Categories & Resources Section */}
      <section className="relative py-16 px-4">
        {/* Subtle Background */}
        <div className="absolute inset-0 opacity-3">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1586322354912-b4a7f2c71063?q=80&w=1974&auto=format&fit=crop)',
            }}
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="w-8 h-8 text-purple-400" />
              <Badge className="bg-purple-600/20 text-purple-300 border-purple-400/20">
                Organized Content
              </Badge>
            </div>
            <h2 className="text-4xl font-bold mb-4">Browse by Category</h2>
            <p className="text-gray-300 text-lg">Find resources tailored to your specific needs</p>
          </div>
          
          <div className="sticky top-16 bg-gray-900/90 backdrop-blur-md py-6 z-10 mb-12 rounded-2xl border border-gray-800">
            <div className="flex justify-center gap-3 flex-wrap px-4">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={filter === category ? 'default' : 'outline'}
                  onClick={() => setFilter(category)}
                  className={`transition-all duration-300 ${
                    filter === category 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/25' 
                      : 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-purple-500 hover:text-purple-300'
                  }`}
                >
                  {category}
                  {filter === category && (
                    <Badge className="ml-2 bg-white/20 text-white text-xs">
                      {filter === 'All' ? resources.length : filteredResources.length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {filteredResources.length > 0 ? (
            <>
              <div className="text-center mb-8">
                <p className="text-gray-400">
                  Showing {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'}
                  {filter !== 'All' && ` in ${filter}`}
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredResources.map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400 py-20">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-2xl font-semibold mb-2">No resources found</p>
              <p className="text-lg mb-6">
                {searchTerm 
                  ? `No results for "${searchTerm}" in ${filter === 'All' ? 'any category' : filter}`
                  : `No resources available in ${filter}`
                }
              </p>
              <div className="flex gap-4 justify-center">
                {searchTerm && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchTerm('')}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Clear Search
                  </Button>
                )}
                {filter !== 'All' && (
                  <Button 
                    variant="outline" 
                    onClick={() => setFilter('All')}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    View All Categories
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Daily Wellness Tips */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/85 via-indigo-900/80 to-gray-900/85" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Lightbulb className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4 text-white">Daily Wellness Tips</h2>
            <p className="text-gray-200 text-lg">Simple practices you can incorporate into your daily routine</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/15 transition-all duration-300 group">
              <CardHeader className="relative">
                <div 
                  className="absolute inset-0 bg-cover bg-center rounded-t-lg opacity-20 group-hover:opacity-30 transition-opacity"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop)',
                  }}
                />
                <div className="relative z-10">
                  <Heart className="w-8 h-8 text-red-400 mb-2" />
                  <CardTitle className="text-white">Practice Gratitude</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-gray-200">Write down 3 things you're grateful for each morning to start your day with positivity.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/15 transition-all duration-300 group">
              <CardHeader className="relative">
                <div 
                  className="absolute inset-0 bg-cover bg-center rounded-t-lg opacity-20 group-hover:opacity-30 transition-opacity"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop)',
                  }}
                />
                <div className="relative z-10">
                  <Moon className="w-8 h-8 text-blue-400 mb-2" />
                  <CardTitle className="text-white">Mindful Breathing</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-gray-200">Take 5 deep breaths whenever you feel overwhelmed. Focus on the sensation of breathing.</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/15 transition-all duration-300 group">
              <CardHeader className="relative">
                <div 
                  className="absolute inset-0 bg-cover bg-center rounded-t-lg opacity-20 group-hover:opacity-30 transition-opacity"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop)',
                  }}
                />
                <div className="relative z-10">
                  <Smile className="w-8 h-8 text-green-400 mb-2" />
                  <CardTitle className="text-white">Connect with Others</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-gray-200">Reach out to a friend or family member. Social connections are vital for mental health.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Crisis Support Section */}
      <section className="relative py-20 px-4 border-y border-red-800/20 overflow-hidden">
        {/* Background with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2031&auto=format&fit=crop)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 via-gray-900/85 to-red-900/90" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="bg-red-500/20 backdrop-blur-sm rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-16 h-16 text-red-400" />
          </div>
          <h2 className="text-4xl font-bold mb-6 text-red-200">Need Immediate Support?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            If you're experiencing a mental health crisis or having thoughts of self-harm, please reach out for immediate help.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white/10 border-red-400/30 backdrop-blur-md hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="bg-red-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-red-300" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Crisis Hotline</h3>
                <p className="text-red-200 text-4xl font-bold mb-4">988</p>
                <p className="text-gray-200">24/7 Suicide & Crisis Lifeline</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 border-red-400/30 backdrop-blur-md hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="bg-red-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-red-300" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Crisis Text Line</h3>
                <p className="text-red-200 text-2xl font-bold mb-4">Text HOME to 741741</p>
                <p className="text-gray-200">24/7 Crisis Text Support</p>
              </CardContent>
            </Card>
          </div>
          
          <p className="text-sm text-gray-400">
            Remember: You are not alone, and seeking help is a sign of strength, not weakness.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=2070&auto=format&fit=crop)',
          }}
        >
          <div className="absolute inset-0 bg-gray-900/90" />
        </div>
        
        <div className="relative z-10">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <LifeBuoy className="w-8 h-8 text-blue-400" />
              <Badge className="bg-blue-600/20 text-blue-300 border-blue-400/20">
                Get Answers
              </Badge>
            </div>
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-300 text-lg">Find answers to common questions about our resources</p>
          </div>
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
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg">How do I know if a resource is right for me?</AccordionTrigger>
            <AccordionContent className="text-gray-300">
              Each resource includes a detailed description and category tags. Start with topics that resonate with your current needs, and don't hesitate to explore different types of content.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-lg">Can I access these resources offline?</AccordionTrigger>
            <AccordionContent className="text-gray-300">
              While most resources require an internet connection, many articles can be bookmarked for later reading. We recommend saving your favorites for easy access.
            </AccordionContent>
          </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4">
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 rounded-3xl p-12 text-center max-w-5xl mx-auto">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-30 translate-y-30"></div>
          </div>
          
          <div className="relative z-10">
            <Zap className="w-16 h-16 text-yellow-300 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Wellness Journey?</h2>
            <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto leading-relaxed">
              Join thousands who have found peace, clarity, and strength through our curated resources. 
              Your mental wellness journey starts with a single step.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-purple-600 transition-all duration-300"
                onClick={() => setFilter('All')}
              >
                Explore All Resources
              </Button>
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-purple-50 transition-all duration-300"
                onClick={() => setFilter('Mindfulness')}
              >
                Start with Mindfulness
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}