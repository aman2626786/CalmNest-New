'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { getFeaturedFeedback } from '@/app/actions';
import { Feedback } from '@/types/index';
import { Star } from 'lucide-react';

export const Testimonials = () => {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      const { feedback, error } = await getFeaturedFeedback();
      if (feedback) {
        setTestimonials(feedback);
      }
      if (error) {
        console.error("Failed to fetch testimonials:", error);
      }
      setLoading(false);
    };

    fetchFeedback();
  }, []);

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">{t('testimonials.title')}</h2>
          <p className="text-xl text-gray-300">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <p>Loading testimonials...</p>
          ) : testimonials.length === 0 ? (
            <p>No testimonials yet. Be the first to leave feedback!</p>
          ) : (
            testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="bg-gray-800 p-8 rounded-xl flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < (testimonial.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-300 italic mb-4 flex-grow">{testimonial.feedback_text}</p>
                <div className="flex items-center mt-auto">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold">A</span>
                  </div>
                  <span className="font-medium">Anonymous</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};