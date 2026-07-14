/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, ArrowRight, Heart, HeartHandshake, ShieldAlert } from 'lucide-react';
import { clinicSettings, services } from '../data/websiteData';

interface FooterProps {
  onPageChange: (page: string) => void;
  isDarkMode: boolean;
}

export default function Footer({ onPageChange, isDarkMode }: FooterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  const handleLinkClick = (id: string) => {
    onPageChange(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      id="main-app-footer"
      className={`border-t transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-neutral-950 border-neutral-800 text-neutral-400' 
          : 'bg-[#FCFCFA] border-neutral-200 text-neutral-600'
      }`}
    >
      {/* Emergency Alert Banner */}
      <div 
        id="footer-emergency-alert-banner"
        className="bg-red-500/5 border-b border-red-500/10 py-6"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs leading-relaxed text-red-800 dark:text-red-300 font-medium">
                {clinicSettings.emergencyNotice}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand & Introduction */}
          <div className="space-y-6">
            <button 
              onClick={() => handleLinkClick('home')}
              className="flex items-center gap-2 text-left focus:outline-none group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-sage/20 flex items-center justify-center">
                <Heart className="w-4.5 h-4.5 text-forest" />
              </div>
              <div>
                <h4 className={`font-serif text-md font-bold tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-charcoal'
                }`}>
                  {clinicSettings.doctorName}
                </h4>
                <p className="text-[10px] font-sans uppercase tracking-widest text-forest font-semibold">
                  {clinicSettings.clinicName}
                </p>
              </div>
            </button>
            <p className="text-xs leading-relaxed">
              Providing modern, compassionate psychological therapies to help you navigate mental health struggles, overcome emotional blockages, and find genuine inner balance.
            </p>
            <div className="flex items-center gap-3 text-xs">
              <HeartHandshake className="w-4 h-4 text-sage-dark" />
              <span className={isDarkMode ? 'text-neutral-300' : 'text-charcoal'}>
                Clinical Excellence & Empathy
              </span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h5 className={`font-serif text-sm font-semibold mb-6 tracking-wide ${
              isDarkMode ? 'text-neutral-200' : 'text-charcoal'
            }`}>
              Practice Sections
            </h5>
            <ul className="space-y-3.5 text-xs">
              {['Home', 'About', 'Services', 'Podcasts', 'Classes', 'Contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => handleLinkClick(item.toLowerCase())}
                    className="hover:text-forest transition-colors text-left focus:outline-none cursor-pointer"
                  >
                    {item}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handleLinkClick('book')}
                  className="text-forest hover:text-forest-dark font-semibold text-left focus:outline-none cursor-pointer"
                >
                  Book Appointment &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Clinical Services Quicklinks */}
          <div>
            <h5 className={`font-serif text-sm font-semibold mb-6 tracking-wide ${
              isDarkMode ? 'text-neutral-200' : 'text-charcoal'
            }`}>
              Therapy Services
            </h5>
            <ul className="space-y-3.5 text-xs">
              {services.map((service) => (
                <li key={service.id}>
                  <button
                    onClick={() => {
                      handleLinkClick('services');
                      // Custom event or simple anchor routing can highlight this service
                      setTimeout(() => {
                        const elem = document.getElementById(`service-card-${service.id}`);
                        if (elem) elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 100);
                    }}
                    className="hover:text-forest transition-colors text-left focus:outline-none cursor-pointer"
                  >
                    {service.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Form Section */}
          <div className="space-y-6">
            <h5 className={`font-serif text-sm font-semibold tracking-wide ${
              isDarkMode ? 'text-neutral-200' : 'text-charcoal'
            }`}>
              Mental Wellness Newsletter
            </h5>
            <p className="text-xs leading-relaxed">
              Subscribe to receive weekly evidence-based mindfulness strategies, breathing tools, and upcoming workshop updates from Dr. Shripuja.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative flex items-center">
                <input
                  type="email"
                  placeholder="Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full py-3 pl-4 pr-12 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-forest border transition-all ${
                    isDarkMode 
                      ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500' 
                      : 'bg-white border-neutral-200 text-charcoal placeholder-neutral-400'
                  }`}
                  disabled={status === 'loading' || status === 'success'}
                />
                <button
                  type="submit"
                  className="absolute right-2 p-1.5 rounded-lg bg-sage hover:bg-sage-dark text-[#2B2B2B] transition-colors cursor-pointer"
                  disabled={status === 'loading' || status === 'success'}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              
              {status === 'loading' && (
                <p className="text-[11px] text-sage animate-pulse">Subscribing peacefully...</p>
              )}
              {status === 'success' && (
                <p className="text-[11px] text-forest font-semibold">Thank you! You are subscribed to Calm Mind Wellness.</p>
              )}
              {status === 'error' && (
                <p className="text-[11px] text-red-500">Please enter a valid email address.</p>
              )}
            </form>
          </div>

        </div>

        {/* Sub-Footer Meta Details */}
        <div className="mt-16 pt-8 border-t border-neutral-200/50 dark:border-neutral-800/50 flex flex-col sm:flex-row items-center justify-between gap-6 text-[11px]">
          <p>
            &copy; {new Date().getFullYear()} Dr. Shripuja Siddamsetty — Calm Mind Wellness. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-forest transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-forest transition-colors">Terms & Conditions</a>
            <span className="text-neutral-300 dark:text-neutral-800">|</span>
            <div className="flex gap-4">
              <a 
                href={clinicSettings.socialLinks.linkedin} 
                target="_blank" 
                rel="noreferrer" 
                referrerPolicy="no-referrer"
                className="hover:text-forest transition-colors"
              >
                LinkedIn
              </a>
              <a 
                href={clinicSettings.socialLinks.instagram} 
                target="_blank" 
                rel="noreferrer" 
                referrerPolicy="no-referrer"
                className="hover:text-forest transition-colors"
              >
                Instagram
              </a>
              <a 
                href={clinicSettings.socialLinks.youtube} 
                target="_blank" 
                rel="noreferrer" 
                referrerPolicy="no-referrer"
                className="hover:text-forest transition-colors"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
