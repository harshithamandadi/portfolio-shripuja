/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Check, 
  Clock, 
  HelpCircle, 
  ArrowRight, 
  User, 
  Baby, 
  Sparkles, 
  Heart, 
  Users, 
  Compass, 
  Briefcase, 
  ClipboardCheck,
  ChevronDown,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { services } from '../data/websiteData';
import { ServiceItem } from '../types';

interface ServicesViewProps {
  onPageChange: (page: string, preSelectServiceId?: string) => void;
  isDarkMode: boolean;
  preSelectedServiceId?: string;
}

export default function ServicesView({ onPageChange, isDarkMode, preSelectedServiceId }: ServicesViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<{ [key: string]: number }>({});

  const categories = ['All', 'Individual Care', 'Pediatric & Family Care', 'Youth Support', 'Relationship Wellness', 'Systemic Care', 'Professional Growth', 'Institutional Wellness', 'Diagnostic & Insights'];

  const filteredServices = activeCategory === 'All' 
    ? services 
    : services.filter(s => s.category === activeCategory);

  const getIcon = (name: string) => {
    switch (name) {
      case 'User': return <User className="w-5 h-5" />;
      case 'Baby': return <Baby className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Heart': return <Heart className="w-5 h-5" />;
      case 'Users': return <Users className="w-5 h-5" />;
      case 'Compass': return <Compass className="w-5 h-5" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5" />;
      case 'ClipboardCheck': return <ClipboardCheck className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const toggleFaq = (serviceId: string, index: number) => {
    setExpandedFaqIndex(prev => {
      const current = prev[serviceId];
      return {
        ...prev,
        [serviceId]: current === index ? -1 : index
      };
    });
  };

  const handleBookService = (serviceId: string) => {
    // Navigate to book page and pre-fill the selected service ID
    onPageChange('book', serviceId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="services-view-container" className="pt-24 pb-16">
      
      {/* 1. HERO DESCRIPTION */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
        <span className="text-xs font-sans uppercase font-bold tracking-widest text-forest">What We Treat</span>
        <h1 className={`text-4xl sm:text-5xl font-serif font-bold tracking-tight mt-3 mb-6 ${
          isDarkMode ? 'text-white' : 'text-charcoal'
        }`}>
          Therapeutic Practices & Clinical Audits
        </h1>
        <p className={`text-base sm:text-lg font-light leading-relaxed max-w-3xl ${
          isDarkMode ? 'text-neutral-300' : 'text-neutral-600'
        }`}>
          Explore our range of structured, evidence-based practices. Clicking "Book Consultation" on any specialty will automatically set your preferences in our clinical scheduling system.
        </p>
      </section>

      {/* 2. CATEGORY FILTER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-wrap items-center gap-2.5 pb-4 border-b border-neutral-200/50 dark:border-neutral-800">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`category-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-4.5 py-2 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-forest text-white shadow-sm'
                  : isDarkMode 
                    ? 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800' 
                    : 'bg-[#FCFCFA] text-neutral-600 border border-neutral-200/50 hover:bg-neutral-50 hover:text-charcoal'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 3. DYNAMIC SERVICES STACK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {filteredServices.map((service, idx) => (
          <div 
            key={service.id}
            id={`service-card-${service.id}`}
            className="glass rounded-3xl p-8 lg:p-12 transition-all relative overflow-hidden flex flex-col lg:flex-row gap-12 text-left shadow-sm hover:border-sage/40"
          >
            {/* Visual Column */}
            <div className="w-full lg:w-5/12 space-y-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sage/15 text-forest flex items-center justify-center mb-6">
                  {getIcon(service.iconName)}
                </div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-sage-dark">
                  {service.category}
                </span>
                <h3 className={`text-2xl sm:text-3xl font-serif font-bold mt-2 mb-4 ${
                  isDarkMode ? 'text-white' : 'text-charcoal'
                }`}>
                  {service.title}
                </h3>
                <p className="text-xs font-medium text-forest flex items-center gap-1.5 mb-6">
                  <Clock className="w-4 h-4 text-sage" />
                  <span>{service.duration}</span>
                </p>
              </div>

              {/* Service Thumbnail Asset */}
              <div className="rounded-2xl overflow-hidden h-[240px] border border-neutral-200/40 dark:border-neutral-800">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Information Column */}
            <div className="w-full lg:w-7/12 space-y-8">
              
              {/* Full Description */}
              <div className="space-y-3">
                <h4 className={`font-serif text-sm font-semibold uppercase tracking-wider ${isDarkMode ? 'text-neutral-200' : 'text-charcoal'}`}>
                  Overview
                </h4>
                <p className="text-xs font-light text-neutral-500 leading-relaxed">
                  {service.fullDescription}
                </p>
              </div>

              {/* Symptoms & Benefits Double Column */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Symptoms (When to consult) */}
                <div className="space-y-4">
                  <h5 className="font-serif text-xs font-bold text-red-800 dark:text-red-300 uppercase tracking-wide flex items-center gap-1.5">
                    <span>Clinical Symptoms We Target</span>
                  </h5>
                  <ul className="space-y-2.5">
                    {service.symptoms.map((sym, sIdx) => (
                      <li key={sIdx} className="flex gap-2 text-[11px] font-light leading-relaxed">
                        <span className="text-red-400 shrink-0 select-none">•</span>
                        <span className={isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}>{sym}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div className="space-y-4">
                  <h5 className="font-serif text-xs font-bold text-forest uppercase tracking-wide flex items-center gap-1.5">
                    <span>Therapeutic Milestones</span>
                  </h5>
                  <ul className="space-y-2.5">
                    {service.benefits.map((ben, bIdx) => (
                      <li key={bIdx} className="flex gap-2 text-[11px] font-light leading-relaxed">
                        <Check className="w-3.5 h-3.5 text-sage-dark shrink-0 mt-0.5" />
                        <span className={isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}>{ben}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Collapsible FAQ Section for this specific service */}
              <div className="pt-6 border-t border-neutral-200/50 dark:border-neutral-800 space-y-3">
                <h5 className={`font-serif text-xs font-bold uppercase tracking-wide flex items-center gap-2 mb-4 ${
                  isDarkMode ? 'text-neutral-200' : 'text-charcoal'
                }`}>
                  <HelpCircle className="w-4 h-4 text-sage" />
                  <span>Service FAQs</span>
                </h5>
                
                <div className="space-y-2">
                  {service.faqs.map((faq, fIdx) => {
                    const isExpanded = expandedFaqIndex[service.id] === fIdx;
                    return (
                      <div 
                        key={fIdx}
                        className={`rounded-xl border transition-all ${
                          isExpanded 
                            ? 'bg-black/5 dark:bg-white/5 border-neutral-200/50 dark:border-neutral-800' 
                            : 'bg-transparent border-transparent'
                        }`}
                      >
                        <button
                          onClick={() => toggleFaq(service.id, fIdx)}
                          className="w-full text-left px-4 py-3.5 flex justify-between items-center text-xs font-semibold focus:outline-none cursor-pointer"
                        >
                          <span className={isDarkMode ? 'text-white' : 'text-charcoal'}>{faq.question}</span>
                          <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 pt-1 text-[11px] font-light text-neutral-500 leading-relaxed border-t border-neutral-200/40 dark:border-neutral-800/40 mt-1">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Direct Booking Action Bar */}
              <div className="pt-6 border-t border-neutral-200/50 dark:border-neutral-800 flex justify-between items-center flex-wrap gap-4">
                <p className="text-[10px] text-neutral-500 font-sans tracking-wide">
                  Licensed Doctor Ph.D. Intake | Safe & Secure HIPAA Portal
                </p>
                <button
                  onClick={() => handleBookService(service.id)}
                  className="px-6 py-3 bg-sage hover:bg-sage-dark text-[#2B2B2B] font-semibold text-xs rounded-full flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow"
                >
                  <span>Book Intake Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        ))}
      </section>

      {/* 4. CALL TO ACTION FOR INQUIRIES */}
      <section className="py-20 text-center max-w-4xl mx-auto px-4 mt-16">
        <h3 className={`text-2xl font-serif font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>
          Unsure Which Therapy Best Fits Your Context?
        </h3>
        <p className="text-xs font-light text-neutral-500 max-w-lg mx-auto mb-8 leading-relaxed">
          Contact our front desk clinical coordinators. We will hold a brief, free, completely confidential 10-minute diagnostic phone check-in to guide you.
        </p>
        <button
          onClick={() => onPageChange('contact')}
          className="px-6 py-3.5 border border-forest text-forest hover:bg-forest hover:text-white rounded-full font-semibold text-xs transition-all cursor-pointer"
        >
          Consult Clinical Desk
        </button>
      </section>

    </div>
  );
}
