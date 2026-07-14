/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  User, 
  Users, 
  ArrowRight, 
  Award, 
  X, 
  CheckCircle,
  Timer,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { classes } from '../data/websiteData';
import { ClassItem } from '../types';

interface ClassesViewProps {
  isDarkMode: boolean;
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function ClassesView({ isDarkMode }: ClassesViewProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  
  // Registration form state
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', reason: '' });
  const [regStatus, setRegStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const categories = ['All', 'Mindfulness', 'Parenting', 'Stress Management', 'Corporate Training'];

  const filteredClasses = activeFilter === 'All' 
    ? classes 
    : classes.filter(c => c.category === activeFilter);

  // Dynamic state for countdown timers of all classes
  const [countdowns, setCountdowns] = useState<{ [key: string]: Countdown }>({});

  useEffect(() => {
    const calculateCountdowns = () => {
      const updatedCountdowns: { [key: string]: Countdown } = {};
      
      classes.forEach((c) => {
        const targetDate = new Date(c.countdownTarget).getTime();
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference > 0) {
          updatedCountdowns[c.id] = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
          };
        } else {
          updatedCountdowns[c.id] = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
      });

      setCountdowns(updatedCountdowns);
    };

    calculateCountdowns();
    const interval = setInterval(calculateCountdowns, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setRegStatus('loading');
    setTimeout(() => {
      setRegStatus('success');
    }, 1500);
  };

  const handleOpenRegistration = (c: ClassItem) => {
    setSelectedClass(c);
    setRegStatus('idle');
    setFormData({ name: '', email: '', phone: '', reason: '' });
  };

  return (
    <div id="classes-view-container" className="pt-24 pb-16">
      
      {/* 1. SECTION DESCRIPTION */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
        <span className="text-xs font-sans uppercase font-bold tracking-widest text-forest">Group Growth</span>
        <h1 className={`text-4xl sm:text-5xl font-serif font-bold tracking-tight mt-3 mb-6 ${
          isDarkMode ? 'text-white' : 'text-charcoal'
        }`}>
          Upcoming Wellness Classes & Retreats
        </h1>
        <p className={`text-base sm:text-lg font-light leading-relaxed max-w-3xl ${
          isDarkMode ? 'text-neutral-300' : 'text-neutral-600'
        }`}>
          Interactive, clinical workshops designed to help you practice stress management, active communication, and cognitive-behavioral tools alongside a supportive community.
        </p>
      </section>

      {/* 2. FILTERS CONTROL BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-neutral-200/50 dark:border-neutral-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                activeFilter === cat
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

      {/* 3. WORKSHOPS LISTING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {filteredClasses.map((item) => {
            const timer = countdowns[item.id] || { days: 0, hours: 0, minutes: 0, seconds: 0 };
            const isFilled = item.registeredCount >= item.capacity;
            const percentageFilled = Math.min((item.registeredCount / item.capacity) * 100, 100);

            return (
              <div 
                key={item.id}
                className="glass rounded-3xl overflow-hidden text-left flex flex-col justify-between transition-all hover:shadow-lg"
              >
                
                {/* Image and floating countdown bar */}
                <div className="relative aspect-video overflow-hidden border-b border-neutral-200/40 dark:border-neutral-800/40">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {/* Category overlay */}
                  <span className="absolute top-4 left-4 text-[9px] font-sans font-bold uppercase tracking-wider bg-forest/90 text-white px-3 py-1 rounded-full">
                    {item.category}
                  </span>

                  {/* High fidelity countdown timer overlay bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-neutral-950/80 backdrop-blur-sm px-6 py-3.5 flex justify-between items-center text-white">
                    <p className="text-[10px] font-sans uppercase tracking-widest text-sage font-bold flex items-center gap-1.5">
                      <Timer className="w-4.5 h-4.5 animate-[pulse_1.5s_infinite]" />
                      <span>Starts In:</span>
                    </p>
                    <div className="flex gap-4 text-center font-mono">
                      <div>
                        <span className="block text-sm font-bold leading-none">{timer.days}</span>
                        <span className="text-[8px] uppercase tracking-wider opacity-60">Days</span>
                      </div>
                      <div>
                        <span className="block text-sm font-bold leading-none">{String(timer.hours).padStart(2, '0')}</span>
                        <span className="text-[8px] uppercase tracking-wider opacity-60">Hrs</span>
                      </div>
                      <div>
                        <span className="block text-sm font-bold leading-none">{String(timer.minutes).padStart(2, '0')}</span>
                        <span className="text-[8px] uppercase tracking-wider opacity-60">Mins</span>
                      </div>
                      <div>
                        <span className="block text-sm font-bold leading-none text-sage">{String(timer.seconds).padStart(2, '0')}</span>
                        <span className="text-[8px] uppercase tracking-wider opacity-60">Secs</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details box */}
                <div className="p-8 space-y-6 flex-grow flex flex-col justify-between">
                  
                  <div className="space-y-4">
                    <h3 className={`text-xl sm:text-2xl font-serif font-bold ${
                      isDarkMode ? 'text-white' : 'text-charcoal'
                    }`}>
                      {item.title}
                    </h3>
                    
                    <p className="text-xs text-neutral-500 font-light leading-relaxed">
                      {item.description}
                    </p>

                    {/* Class facts metadata */}
                    <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                      <div className="space-y-1">
                        <span className="block text-[10px] text-neutral-500 font-sans uppercase font-semibold">Date & Time</span>
                        <p className="font-semibold flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-forest" />
                          <span>{item.date}</span>
                        </p>
                        <p className="text-neutral-500 font-light pl-5">{item.time}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="block text-[10px] text-neutral-500 font-sans uppercase font-semibold">Tuition & Fee</span>
                        <p className="font-semibold flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-forest" />
                          <span>{item.fee}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Seat indicators & Booking CTA */}
                  <div className="pt-6 border-t border-neutral-200/50 dark:border-neutral-800 space-y-4">
                    
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-sans font-bold">
                        <span className="text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          <span>Seat Capacity</span>
                        </span>
                        <span className={isFilled ? 'text-red-500' : 'text-forest'}>
                          {isFilled ? 'Class Full' : `${item.registeredCount} / ${item.capacity} Spots Booked`}
                        </span>
                      </div>
                      
                      {/* Interactive visual progress meter */}
                      <div className="h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${isFilled ? 'bg-red-500' : 'bg-sage-dark'}`}
                          style={{ width: `${percentageFilled}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center gap-4 flex-wrap pt-2">
                      <p className="text-[10px] text-neutral-500 font-sans tracking-wide">
                        Instructor: <strong className="text-forest">{item.instructor}</strong>
                      </p>
                      
                      <button
                        onClick={() => handleOpenRegistration(item)}
                        disabled={isFilled}
                        className={`px-6 py-2.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all cursor-pointer ${
                          isFilled
                            ? 'bg-neutral-200 text-neutral-400 dark:bg-neutral-800 cursor-not-allowed'
                            : 'bg-forest hover:bg-forest-dark text-white shadow hover:-translate-y-0.5'
                        }`}
                      >
                        <span>{isFilled ? 'Sold Out' : 'Register Seat'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 4. REGISTRATION MODAL FORM */}
      <AnimatePresence>
        {selectedClass && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            
            {/* Dark background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClass(null)}
              className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm"
            />

            {/* Modal Body Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="glass relative max-w-lg w-full rounded-3xl p-8 text-left z-10 shadow-2xl"
            >
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedClass(null)}
                className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>

              {regStatus !== 'success' ? (
                <form onSubmit={handleRegisterSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase bg-sage/15 text-forest px-2.5 py-1 rounded-full font-bold">
                      {selectedClass.category} Workshop
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
                      Register Seat
                    </h3>
                    <p className="text-xs text-neutral-500 font-light leading-relaxed">
                      You are reserving a seat for: <strong>{selectedClass.title}</strong> led by {selectedClass.instructor}.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-sans uppercase font-bold text-neutral-400">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Elena Vasquez"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-forest border transition-all ${
                          isDarkMode 
                            ? 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-600' 
                            : 'bg-neutral-50 border-neutral-200 text-charcoal placeholder-neutral-400'
                        }`}
                      />
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-sans uppercase font-bold text-neutral-400">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="elena@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-forest border transition-all ${
                          isDarkMode 
                            ? 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-600' 
                            : 'bg-neutral-50 border-neutral-200 text-charcoal placeholder-neutral-400'
                        }`}
                      />
                    </div>

                    {/* WhatsApp or Mobile Phone */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-sans uppercase font-bold text-neutral-400">WhatsApp / Mobile Phone</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 019-2834"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-forest border transition-all ${
                          isDarkMode 
                            ? 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-600' 
                            : 'bg-neutral-50 border-neutral-200 text-charcoal placeholder-neutral-400'
                        }`}
                      />
                    </div>

                    {/* Reason for attending */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-sans uppercase font-bold text-neutral-400">Reason for Attending (Optional)</label>
                      <textarea
                        rows={3}
                        placeholder="Looking to master coping techniques for stress or work burnout..."
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-forest border transition-all ${
                          isDarkMode 
                            ? 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-600' 
                            : 'bg-neutral-50 border-neutral-200 text-charcoal placeholder-neutral-400'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="rounded-xl p-4 bg-sage/10 text-forest border border-sage/20 text-xs font-light flex gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-sage-dark" />
                    <span>Seat reservation is free. Payment details and confirmation invoice will be coordinated via email within 24 hours.</span>
                  </div>

                  {/* Actions buttons */}
                  <div className="pt-4 border-t border-neutral-200/50 dark:border-neutral-800 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedClass(null)}
                      className="px-5 py-2.5 rounded-full text-xs font-medium hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={regStatus === 'loading'}
                      className="px-6 py-2.5 bg-forest hover:bg-forest-dark text-white font-semibold text-xs rounded-full flex items-center gap-1.5 cursor-pointer"
                    >
                      {regStatus === 'loading' ? 'Processing...' : 'Reserve My Spot &rarr;'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-forest/10 text-forest flex items-center justify-center mx-auto scale-110">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-serif text-2xl font-bold tracking-tight text-forest">
                      Reservation Requested!
                    </h4>
                    <p className="text-sm font-light text-neutral-500 max-w-md mx-auto">
                      Thank you, <strong>{formData.name}</strong>. Your seat reservation request for <strong>{selectedClass.title}</strong> has been logged.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 text-left border border-neutral-200/40 text-xs font-mono space-y-2 max-w-sm mx-auto">
                    <p className="text-neutral-500 font-sans uppercase text-[10px] tracking-wide font-bold">Registration Docket:</p>
                    <p>• Status: <strong className="text-forest">PENDING INVOICE</strong></p>
                    <p>• Class: {selectedClass.title}</p>
                    <p>• Date: {selectedClass.date}</p>
                    <p>• Tuition: {selectedClass.fee}</p>
                  </div>

                  <p className="text-xs text-neutral-500 font-light leading-relaxed max-w-sm mx-auto">
                    An email containing the diagnostic checklist, payment details, and safe session credentials has been forwarded to <strong>{formData.email}</strong>.
                  </p>

                  <button
                    onClick={() => setSelectedClass(null)}
                    className="px-6 py-3 bg-forest hover:bg-forest-dark text-white font-semibold text-xs rounded-full cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
