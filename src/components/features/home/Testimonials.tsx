'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { getFeaturedFeedback } from '@/app/actions';
import { Feedback } from '@/types/index';
import { Star, Quote, RefreshCw, MessageSquare, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { API_CONFIG } from '@/config/api';
import Link from 'next/link';

export const Testimonials = () => {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        console.log('Fetching testimonials...');
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/feedback`);
        
        if (response.ok) {
          const feedback = await response.json();
          console.log('Testimonials received:', feedback);
          setTestimonials(feedback.slice(0, 6)); // Limit to 6 testimonials
        } else {
          console.error('Failed to fetch testimonials:', response.status);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // Fallback testimonials if no real ones exist
  const fallbackTestimonials = [
    {
      id: 'fallback-1',
      feedback_text: "CalmNest has been a game-changer for my mental health journey. The self-assessment tools helped me understand my anxiety patterns better.",
      user_name: "Sarah M.",
      rating: 5
    },
    {
      id: 'fallback-2', 
      feedback_text: "The breathing exercises and mindfulness resources are exactly what I needed. I use them daily now.",
      user_name: "Michael R.",
      rating: 5
    },
    {
      id: 'fallback-3',
      feedback_text: "Having access to mental health resources 24/7 has made such a difference. The community support is incredible.",
      user_name: "Emma L.",
      rating: 4
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  return (
    <section className="py-24 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            className="flex items-center justify-center gap-2 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Users className="w-6 h-6 text-blue-400" />
            <Badge className="bg-blue-400/10 text-blue-400 border-blue-400/20">
              Community Stories
            </Badge>
          </motion.div>
          
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {t('testimonials.title')}
          </motion.h2>
          
          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {t('testimonials.subtitle')}
          </motion.p>

          {testimonials.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Testimonials
              </Button>
            </motion.div>
          )}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {loading ? (
            // Loading skeleton
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-800/50 p-8 rounded-2xl animate-pulse">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-5 h-5 bg-gray-700 rounded mr-1" />
                  ))}
                </div>
                <div className="space-y-3 mb-6">
                  <div className="h-4 bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-700 rounded w-1/2" />
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-700 rounded-full mr-3" />
                  <div className="h-4 bg-gray-700 rounded w-20" />
                </div>
              </div>
            ))
          ) : (
            displayTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-8 rounded-2xl hover:bg-gray-800/70 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-blue-400/30 mb-4" />
                
                {/* Rating */}
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < (testimonial.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                    />
                  ))}
                </div>
                
                {/* Testimonial Text */}
                <p className="text-gray-300 italic mb-6 flex-grow leading-relaxed">
                  "{testimonial.feedback_text}"
                </p>
                
                {/* User Info */}
                <div className="flex items-center mt-auto">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-sm font-semibold text-white">
                      {(testimonial.user_name || 'Anonymous').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-white">{testimonial.user_name || 'Anonymous'}</span>
                    <p className="text-sm text-gray-400">CalmNest User</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* CTA Section */}
        <motion.div
          className="text-center bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <MessageSquare className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">Share Your Story</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Your experience could inspire others on their mental wellness journey. 
            Share your feedback and help build our supportive community.
          </p>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Link href="/feedback">
              Leave Feedback
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};