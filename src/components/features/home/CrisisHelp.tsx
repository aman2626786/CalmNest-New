'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Phone, MessageCircle, Heart, Clock, Globe } from 'lucide-react';

export const CrisisHelp = () => {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-gray-900 to-red-900/10 border-y border-red-800/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="w-8 h-8 text-red-400" />
            <Badge className="bg-red-400/10 text-red-400 border-red-400/20 text-lg px-4 py-2">
              Crisis Support Available 24/7
            </Badge>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-red-300">
            {t('crisisHelp.title')}
          </h2>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('crisisHelp.description')}
          </p>
        </motion.div>

        {/* Crisis Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-red-900/20 border-red-800/30 backdrop-blur-sm hover:bg-red-900/30 transition-all duration-300 h-full">
              <CardContent className="p-8 text-center">
                <Phone className="w-12 h-12 text-red-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-white mb-4">Crisis Hotline</h3>
                <div className="text-red-300 text-4xl font-bold mb-4">988</div>
                <p className="text-gray-300 mb-6">24/7 Suicide & Crisis Lifeline</p>
                <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                  <a href="tel:988">
                    Call Now
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="bg-red-900/20 border-red-800/30 backdrop-blur-sm hover:bg-red-900/30 transition-all duration-300 h-full">
              <CardContent className="p-8 text-center">
                <MessageCircle className="w-12 h-12 text-red-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-white mb-4">Crisis Text Line</h3>
                <div className="text-red-300 text-2xl font-bold mb-4">Text HOME to 741741</div>
                <p className="text-gray-300 mb-6">24/7 Crisis Text Support</p>
                <Button asChild variant="outline" className="w-full border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                  <a href="sms:741741?body=HOME">
                    Send Text
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Card className="bg-red-900/20 border-red-800/30 backdrop-blur-sm hover:bg-red-900/30 transition-all duration-300 h-full">
              <CardContent className="p-8 text-center">
                <Globe className="w-12 h-12 text-red-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-white mb-4">Online Chat</h3>
                <div className="text-red-300 text-lg font-bold mb-4">988lifeline.org</div>
                <p className="text-gray-300 mb-6">Web-based crisis chat support</p>
                <Button asChild variant="outline" className="w-full border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                  <a href="https://988lifeline.org/" target="_blank" rel="noopener noreferrer">
                    Start Chat
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Heart className="w-8 h-8 text-pink-400" />
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4">You Are Not Alone</h3>
          <p className="text-gray-300 text-lg mb-6 max-w-3xl mx-auto">
            Remember: Seeking help is a sign of strength, not weakness. These resources are available 24/7, 
            and trained counselors are ready to listen and support you through difficult times.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/20">
              Confidential
            </Badge>
            <Badge className="bg-green-500/20 text-green-300 border-green-400/20">
              Free
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/20">
              24/7 Available
            </Badge>
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/20">
              Professional Support
            </Badge>
          </div>
        </motion.div>
      </div>
    </section>
  );
};