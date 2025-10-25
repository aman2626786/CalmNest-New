'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Heart, Brain, Mail, Phone, MapPin, Github, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const Footer = () => {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">CalmNest</h3>
                <Badge className="bg-purple-600/20 text-purple-300 border-purple-400/20 text-xs">
                  Mental Wellness Platform
                </Badge>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              Your trusted companion for mental wellness. We provide comprehensive tools, resources, 
              and community support to help you on your journey to better mental health.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Heart className="w-4 h-4 text-red-400" />
              <span className="text-gray-300">Made with care for mental wellness</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard" className="hover:text-purple-400 transition-colors flex items-center gap-2">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/self-check" className="hover:text-purple-400 transition-colors">
                  Self Assessment
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-purple-400 transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/forum" className="hover:text-purple-400 transition-colors">
                  Community Forum
                </Link>
              </li>
              <li>
                <Link href="/mood-groove" className="hover:text-purple-400 transition-colors">
                  Mood Groove
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Support & Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="hover:text-purple-400 transition-colors">
                  {t('footer.about.title')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-purple-400 transition-colors">
                  {t('footer.legal.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/crisis" className="hover:text-purple-400 transition-colors text-red-400">
                  {t('footer.emergency.helplines')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-purple-400 transition-colors">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-purple-400 transition-colors">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Emergency Section */}
        <div className="bg-red-900/20 border border-red-800/30 rounded-2xl p-6 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Phone className="w-6 h-6 text-red-400" />
            <h4 className="text-lg font-semibold text-red-300">Crisis Support</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-300 mb-2">24/7 Crisis Hotline:</p>
              <Button asChild variant="outline" size="sm" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                <a href="tel:988">Call 988</a>
              </Button>
            </div>
            <div>
              <p className="text-gray-300 mb-2">Crisis Text Line:</p>
              <Button asChild variant="outline" size="sm" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                <a href="sms:741741?body=HOME">Text HOME to 741741</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Follow us:</span>
            <div className="flex gap-3">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-purple-400">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-purple-400">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-purple-400">
                <Github className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>support@calmnest.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Available Worldwide</span>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-center md:text-left">
              {t('footer.copyright', { year: new Date().getFullYear() })}
            </p>
            <p className="text-center md:text-right text-sm">
              {t('footer.disclaimer')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};