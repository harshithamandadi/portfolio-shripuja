/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, PhoneCall, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clinicSettings } from '../data/websiteData';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Navbar({ currentPage, onPageChange, isDarkMode, onToggleDarkMode }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Is Scrolled logic for header style changes
      setIsScrolled(window.scrollY > 20);

      // Scroll progress indicator
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Podcasts', id: 'podcasts' },
    { name: 'Classes', id: 'classes' },
    { name: 'Contact', id: 'contact' },
  ];

  const handleLinkClick = (id: string) => {
    onPageChange(id);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      id="main-nav-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass shadow-md border-b border-white/10 dark:border-white/5' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      {/* Scroll Progress Bar */}
      <div 
        id="scroll-progress-indicator"
        className="h-[3px] bg-sage origin-left transition-all duration-100"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Brand Block */}
          <button 
            id="navbar-brand-logo"
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center transition-transform duration-500 group-hover:rotate-12">
              <Heart className="w-5 h-5 text-forest" />
            </div>
            <div>
              <span className={`block font-serif text-lg font-bold tracking-tight ${
                isDarkMode ? 'text-white' : 'text-charcoal'
              }`}>
                {clinicSettings.doctorName}
              </span>
              <span className="block text-[11px] font-sans uppercase tracking-widest text-forest font-semibold">
                {clinicSettings.clinicName}
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav id="desktop-navigation-links" className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleLinkClick(link.id)}
                  className={`relative py-2 text-sm font-medium tracking-wide transition-colors focus:outline-none cursor-pointer ${
                    isActive 
                      ? 'text-forest font-semibold' 
                      : isDarkMode ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-charcoal'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-sage"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons Panel */}
          <div id="navbar-actions-panel" className="hidden md:flex items-center gap-4">
            {/* Quick Contact Shortlink */}
            <a 
              href={`tel:${clinicSettings.phone}`}
              id="navbar-phone-action"
              className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full transition-all border ${
                isDarkMode 
                  ? 'border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800' 
                  : 'border-neutral-200 text-neutral-600 hover:text-charcoal hover:bg-neutral-100'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 text-sage-dark" />
              <span>Call Doctor</span>
            </a>

            {/* Aesthetic Theme Controller */}
            <button
              id="navbar-theme-toggle"
              onClick={onToggleDarkMode}
              className={`p-2 rounded-full transition-all focus:outline-none cursor-pointer ${
                isDarkMode 
                  ? 'text-yellow-400 hover:bg-neutral-800' 
                  : 'text-neutral-500 hover:bg-neutral-100 hover:text-charcoal'
              }`}
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* High-Impact Booking CTA */}
            <button
              id="navbar-booking-cta"
              onClick={() => handleLinkClick('book')}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm hover:shadow hover:-translate-y-0.5 cursor-pointer ${
                currentPage === 'book'
                  ? 'bg-forest text-white'
                  : 'bg-sage hover:bg-sage-dark text-[#2B2B2B]'
              }`}
            >
              Book Appointment
            </button>
          </div>

          {/* Mobile Navigation Controls */}
          <div className="flex md:hidden items-center gap-2">
            {/* Dark mode button for mobile */}
            <button
              id="navbar-theme-toggle-mobile"
              onClick={onToggleDarkMode}
              className={`p-2 rounded-full transition-all focus:outline-none cursor-pointer ${
                isDarkMode ? 'text-yellow-400' : 'text-neutral-500'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              id="navbar-mobile-menu-trigger"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-full transition-all focus:outline-none cursor-pointer ${
                isDarkMode ? 'text-white hover:bg-neutral-800' : 'text-charcoal hover:bg-neutral-100'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-navigation-overlay"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className={`md:hidden border-b ${
              isDarkMode 
                ? 'bg-neutral-950 border-neutral-800 text-white' 
                : 'bg-[#FCFCFA] border-neutral-200 text-charcoal'
            }`}
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {navLinks.map((link) => {
                const isActive = currentPage === link.id;
                return (
                  <button
                    key={link.id}
                    id={`nav-link-mobile-${link.id}`}
                    onClick={() => handleLinkClick(link.id)}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive 
                        ? 'bg-sage/10 text-forest font-semibold pl-6 border-l-4 border-sage' 
                        : isDarkMode ? 'hover:bg-neutral-900 text-neutral-300' : 'hover:bg-neutral-50 text-neutral-600'
                    }`}
                  >
                    {link.name}
                  </button>
                );
              })}
              
              <div className="pt-4 border-t border-neutral-200/50 dark:border-neutral-800 px-4 flex flex-col gap-3">
                <a 
                  href={`tel:${clinicSettings.phone}`}
                  className="flex items-center justify-center gap-3 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl font-medium text-sm"
                >
                  <PhoneCall className="w-4 h-4 text-forest" />
                  <span>Call {clinicSettings.phone}</span>
                </a>
                
                <button
                  id="navbar-mobile-booking-cta"
                  onClick={() => handleLinkClick('book')}
                  className="w-full py-3 bg-sage hover:bg-sage-dark text-[#2B2B2B] text-center font-semibold text-sm rounded-xl shadow-sm cursor-pointer"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}
