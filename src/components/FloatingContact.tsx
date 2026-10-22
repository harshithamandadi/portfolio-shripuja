/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Phone, MessageCircle, X, ShieldCheck, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingContactProps {
  isDarkMode?: boolean;
}

export default function FloatingContact({ isDarkMode }: FloatingContactProps) {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '+91 92461 55955';
  const cleanPhone = '919246155955';
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Hello Dr. Shripuja, I would like to inquire about a consultation at Calm Mind Wellness.'
  )}`;
  const callUrl = `tel:+${cleanPhone}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 select-none">
      {/* Pop-up quick dialogue card when opened or hovered */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`w-72 p-4 rounded-3xl shadow-2xl border mb-1 backdrop-blur-xl text-left ${
              isDarkMode 
                ? 'bg-neutral-900/95 border-neutral-700 text-white shadow-black/60' 
                : 'bg-white/95 border-neutral-200 text-neutral-900 shadow-neutral-900/15'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200/60 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-forest font-sans">
                  Direct Clinic Contact
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="py-3 space-y-1.5">
              <p className="text-sm font-serif font-bold text-neutral-900 dark:text-white">
                Dr. Shripuja Siddamsetty
              </p>
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-snug">
                Clinical Psychologist & Psychotherapist
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-600 dark:text-neutral-400 pt-1">
                <Clock className="w-3 h-3 text-forest" />
                <span>Mon–Sat: 10:00 AM – 7:00 PM</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-neutral-200/60 dark:border-neutral-800">
              {/* WhatsApp direct CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer group"
              >
                <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Chat on WhatsApp ({phoneNumber})</span>
              </a>

              {/* Direct Call CTA */}
              <a
                href={callUrl}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-forest hover:bg-forest-dark text-white text-xs font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer group"
              >
                <Phone className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Call Clinic ({phoneNumber})</span>
              </a>
            </div>

            <p className="text-[10px] text-center text-neutral-500 dark:text-neutral-400 pt-2 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-forest" />
              <span>Confidential & Private Medical Support</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button Stack (Always Popping on Screen) */}
      <div className="flex items-center gap-2.5">
        
        {/* 1. Quick Call Action Icon */}
        <motion.a
          id="floating-call-btn"
          href={callUrl}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="relative p-3.5 sm:p-4 rounded-full bg-forest text-white shadow-xl hover:bg-forest-dark transition-colors cursor-pointer flex items-center justify-center group"
          title={`Call Dr. Shripuja: ${phoneNumber}`}
          aria-label={`Call Dr. Shripuja at ${phoneNumber}`}
        >
          {/* Subtle pulse ring around Call icon */}
          <span className="absolute -inset-1 rounded-full bg-forest/30 animate-ping opacity-50 pointer-events-none" />
          <Phone className="w-5 h-5 transition-transform group-hover:rotate-12" />
        </motion.a>

        {/* 2. Quick WhatsApp Action Icon with Popping Pulse Ring */}
        <motion.a
          id="floating-whatsapp-btn"
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.94 }}
          animate={{
            y: [0, -4, 0],
            scale: [1, 1.04, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative p-3.5 sm:p-4 rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20ba59] transition-colors cursor-pointer flex items-center justify-center group"
          title={`WhatsApp Dr. Shripuja: ${phoneNumber}`}
          aria-label={`WhatsApp Dr. Shripuja at ${phoneNumber}`}
        >
          {/* High-visibility pulsating green ring */}
          <span className="absolute -inset-1.5 rounded-full bg-[#25D366]/40 animate-ping opacity-60 pointer-events-none" />
          
          <MessageCircle className="w-5 h-5 fill-white text-white transition-transform group-hover:scale-110" />

          {/* Unread-style notification ping dot */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white dark:border-neutral-900 flex items-center justify-center text-[8px] font-bold text-white">
            1
          </span>
        </motion.a>

        {/* 3. Info / Expand Toggle Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`hidden sm:flex items-center gap-2 py-2 px-3.5 rounded-full shadow-lg border text-xs font-semibold backdrop-blur-md transition-all cursor-pointer ${
            isDarkMode 
              ? 'bg-neutral-900/90 border-neutral-700 text-white hover:bg-neutral-800' 
              : 'bg-white/95 border-neutral-200 text-neutral-800 hover:bg-neutral-50'
          }`}
          title="Contact Dr. Shripuja"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-[11px]">{phoneNumber}</span>
        </motion.button>

      </div>
    </div>
  );
}
