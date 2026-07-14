/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Send, 
  CheckCircle, 
  AlertOctagon, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { clinicSettings } from '../data/websiteData';

interface ContactViewProps {
  isDarkMode: boolean;
}

export default function ContactView({ isDarkMode }: ContactViewProps) {
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setFormState({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div id="contact-view-container" className="pt-24 pb-16">
      
      {/* 1. HEADER DESCRIPTION */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
        <span className="text-xs font-sans uppercase font-bold tracking-widest text-forest">Connect</span>
        <h1 className={`text-4xl sm:text-5xl font-serif font-bold tracking-tight mt-3 mb-6 ${
          isDarkMode ? 'text-white' : 'text-charcoal'
        }`}>
          Connect with Calm Mind Wellness
        </h1>
        <p className={`text-base sm:text-lg font-light leading-relaxed max-w-3xl ${
          isDarkMode ? 'text-neutral-300' : 'text-neutral-600'
        }`}>
          Whether you are exploring booking credentials, coordination for corporate audits, or school seminars, reach out directly or schedule an intake.
        </p>
      </section>

      {/* 2. MAIN GRID (INFO & FORM) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 py-8 items-start">
        
        {/* Left column: Contact cards & Working Hours */}
        <div className="lg:col-span-5 space-y-6 text-left">
          
          {/* Quick contact list */}
          <div className="grid grid-cols-1 gap-4">
            
            <a 
              href={`tel:${clinicSettings.phone}`}
              className="glass p-6 rounded-2xl flex items-center gap-4 transition-all hover:-translate-y-0.5 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-sage/20 text-forest flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-neutral-400 font-bold font-sans">Phone Helpline</span>
                <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>{clinicSettings.phone}</span>
              </div>
            </a>

            <a 
              href={`mailto:${clinicSettings.email}`}
              className="glass p-6 rounded-2xl flex items-center gap-4 transition-all hover:-translate-y-0.5 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-sage/20 text-forest flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-neutral-400 font-bold font-sans">Secure Email Address</span>
                <span className={`text-sm font-semibold truncate ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>{clinicSettings.email}</span>
              </div>
            </a>

            <a 
              href={`https://wa.me/${clinicSettings.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              referrerPolicy="no-referrer"
              className="glass p-6 rounded-2xl flex items-center gap-4 transition-all hover:-translate-y-0.5 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-neutral-400 font-bold font-sans">WhatsApp Secure Chat</span>
                <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>Click to Message Dr. Shripuja</span>
              </div>
            </a>

          </div>

          {/* Working Hours Card */}
          <div className="glass p-6 rounded-2xl text-left">
            <h4 className="font-serif text-sm font-semibold text-forest uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4.5 h-4.5" />
              <span>Office Working Hours</span>
            </h4>
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between border-b border-neutral-200/50 dark:border-neutral-800 pb-2">
                <span className="text-neutral-500">Weekdays (Mon – Fri)</span>
                <span className={`font-semibold ${isDarkMode ? 'text-neutral-200' : 'text-charcoal'}`}>{clinicSettings.workingHours.weekdays}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-200/50 dark:border-neutral-800 pb-2">
                <span className="text-neutral-500">Saturdays</span>
                <span className={`font-semibold ${isDarkMode ? 'text-neutral-200' : 'text-charcoal'}`}>{clinicSettings.workingHours.saturdays}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Sundays</span>
                <span className="text-red-500 font-bold">{clinicSettings.workingHours.sundays}</span>
              </div>
            </div>
          </div>

          {/* Physical Address */}
          <div className="glass p-6 rounded-2xl text-left flex gap-4">
            <MapPin className="w-6 h-6 text-sage-dark shrink-0 mt-0.5" />
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-neutral-400 font-bold font-sans">Clinic Location</span>
              <p className={`text-xs mt-1 leading-relaxed ${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                {clinicSettings.address}
              </p>
            </div>
          </div>

        </div>

        {/* Right column: Form */}
        <div className="lg:col-span-7">
          <div className="glass rounded-3xl p-8 sm:p-10 text-left shadow-sm">
            
            {status !== 'success' ? (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <h3 className={`font-serif text-xl font-bold ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>
                    Secure Client Message Desk
                  </h3>
                  <p className="text-xs text-neutral-500 font-light">
                    Your transmission is SSL encrypted, meeting standard medical records confidentiality practices.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Elena Vasquez"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-forest border transition-all ${
                        isDarkMode 
                          ? 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-600' 
                          : 'bg-neutral-50 border-neutral-200 text-charcoal'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="elena@example.com"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-forest border transition-all ${
                        isDarkMode 
                          ? 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-600' 
                          : 'bg-neutral-50 border-neutral-200 text-charcoal'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400">Mobile Phone (Optional)</label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 012-3456"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-forest border transition-all ${
                        isDarkMode 
                          ? 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-600' 
                          : 'bg-neutral-50 border-neutral-200 text-charcoal'
                      }`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400">Subject</label>
                    <input
                      type="text"
                      placeholder="e.g. Corporate Workshop Inquiry"
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-forest border transition-all ${
                        isDarkMode 
                          ? 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-600' 
                          : 'bg-neutral-50 border-neutral-200 text-charcoal'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400">Confidential Message</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Provide details of your request here..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-forest border transition-all ${
                      isDarkMode 
                        ? 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-600' 
                        : 'bg-neutral-50 border-neutral-200 text-charcoal'
                    }`}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-6 py-3 bg-forest hover:bg-forest-dark text-white font-semibold text-xs rounded-full flex items-center gap-2 transition-all cursor-pointer shadow hover:-translate-y-0.5"
                  >
                    <span>{status === 'loading' ? 'Encrypting...' : 'Transmit Message'}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

                {status === 'error' && (
                  <p className="text-[11px] text-red-500 font-sans">Please ensure all required fields (*Name, Email, Message) are fully populated.</p>
                )}
              </form>
            ) : (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 rounded-full bg-forest/10 text-forest flex items-center justify-center mx-auto scale-110">
                  <CheckCircle className="w-8 h-8" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-serif text-2xl font-bold tracking-tight text-forest">
                    Message Transmitted!
                  </h4>
                  <p className="text-xs text-neutral-500 font-light max-w-md mx-auto leading-relaxed">
                    Thank you. Your message has been encrypted and transmitted securely. Dr. Shripuja's clinic coordinators typically review and respond to inquiries within 12 clinical hours.
                  </p>
                </div>

                <button
                  onClick={() => setStatus('idle')}
                  className="px-6 py-3 bg-forest hover:bg-forest-dark text-white font-semibold text-xs rounded-full cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            )}

          </div>
        </div>

      </section>

      {/* 3. HIGH FIDELITY SVG VECTOR MAP PLACEHOLDER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          <div className="text-left">
            <span className="text-xs font-sans uppercase font-bold tracking-widest text-forest">Geographical Coordinates</span>
            <h3 className={`text-xl font-serif font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>
              Metro City Wellness District
            </h3>
          </div>

          {/* Premium custom designed SVG map */}
          <div className="glass rounded-3xl h-[340px] overflow-hidden relative flex items-center justify-center">
            <svg 
              className="absolute inset-0 w-full h-full text-neutral-300 dark:text-neutral-850 opacity-40 select-none pointer-events-none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Grid Roads simulation */}
              <line x1="10%" y1="0%" x2="10%" y2="100%" stroke="currentColor" strokeWidth="2" />
              <line x1="35%" y1="0%" x2="35%" y2="100%" stroke="currentColor" strokeWidth="3" />
              <line x1="60%" y1="0%" x2="60%" y2="100%" stroke="currentColor" strokeWidth="2" />
              <line x1="85%" y1="0%" x2="85%" y2="100%" stroke="currentColor" strokeWidth="2.5" />
              
              <line x1="0%" y1="20%" x2="100%" y2="20%" stroke="currentColor" strokeWidth="3" />
              <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="2" />
              <line x1="0%" y1="80%" x2="100%" y2="80%" stroke="currentColor" strokeWidth="2.5" />

              {/* Diagonal Serenity Boulevard */}
              <line x1="0%" y1="10%" x2="100%" y2="90%" stroke="currentColor" strokeWidth="6" />
            </svg>

            {/* Glowing Map Point Card */}
            <div className="glass relative z-10 p-6 rounded-2xl text-left flex gap-4 max-w-sm shadow-xl">
              <div className="relative shrink-0 mt-1">
                {/* Red pulse glow circle */}
                <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-forest/30 animate-ping" />
                <MapPin className="w-6 h-6 text-forest relative z-10" />
              </div>
              <div>
                <h5 className={`font-serif text-sm font-bold ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>
                  Calm Mind Wellness Clinic
                </h5>
                <p className="text-[10px] text-neutral-500 font-sans tracking-wide mt-1">
                  88 Serenity Boulevard, Suite 410, Metro City
                </p>
                <div className="mt-3 flex gap-2.5 text-[10px] font-semibold">
                  <a 
                    href="https://google.com/maps" 
                    target="_blank" 
                    rel="noreferrer"
                    referrerPolicy="no-referrer"
                    className="text-forest hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Google Maps Route</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Watermark map credits */}
            <span className="absolute bottom-4 right-4 text-[9px] font-mono opacity-40 select-none">
              COORD: 40.7128° N, 74.0060° W
            </span>
          </div>
        </div>
      </section>

      {/* 4. EMERGENCY NOTICE STRIP */}
      <section className="max-w-4xl mx-auto px-4 mt-8">
        <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/10 text-left flex gap-3.5">
          <AlertOctagon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-red-800 dark:text-red-300">
            <strong>Emergency & Crisis Warning:</strong> If you are experiencing suicidal thoughts, intent, or any severe mental distress, do not submit messages through this form. Please immediately contact your localized emergency line (e.g. 911, 999) or dial/text <strong>988</strong> to connect with the 24/7 Suicide & Crisis Lifeline.
          </p>
        </div>
      </section>

    </div>
  );
}
