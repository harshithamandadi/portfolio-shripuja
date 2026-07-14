/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp, AlertCircle, Heart } from 'lucide-react';

// Core layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Views
import HomeView from './views/HomeView';
import AboutView from './views/AboutView';
import ServicesView from './views/ServicesView';
import PodcastsView from './views/PodcastsView';
import ClassesView from './views/ClassesView';
import BookingView from './views/BookingView';
import ContactView from './views/ContactView';

import { clinicSettings } from './data/websiteData';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [preSelectedServiceId, setPreSelectedServiceId] = useState<string | undefined>(undefined);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // 1. Hash Routing Synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validPages = ['home', 'about', 'services', 'podcasts', 'classes', 'book', 'contact'];
      
      if (hash && validPages.includes(hash)) {
        setCurrentPage(hash);
      } else {
        // Default fallback to home
        setCurrentPage('home');
        window.location.hash = 'home';
      }
    };

    // Initial load sync
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update window hash whenever page changes via clicks
  const handlePageChange = (page: string, preSelectServiceId?: string) => {
    if (preSelectServiceId) {
      setPreSelectedServiceId(preSelectServiceId);
    } else {
      setPreSelectedServiceId(undefined);
    }
    setCurrentPage(page);
    window.location.hash = page;
  };

  // 2. Dark Mode sync on document root
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // 3. Back to top trigger scroll listener
  useEffect(() => {
    const handleScrollVisibility = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScrollVisibility, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. Render Active View based on routing
  const renderActiveView = () => {
    switch (currentPage) {
      case 'home':
        return <HomeView onPageChange={handlePageChange} isDarkMode={isDarkMode} />;
      case 'about':
        return <AboutView onPageChange={handlePageChange} isDarkMode={isDarkMode} />;
      case 'services':
        return (
          <ServicesView 
            onPageChange={handlePageChange} 
            isDarkMode={isDarkMode} 
            preSelectedServiceId={preSelectedServiceId} 
          />
        );
      case 'podcasts':
        return <PodcastsView isDarkMode={isDarkMode} />;
      case 'classes':
        return <ClassesView isDarkMode={isDarkMode} />;
      case 'book':
        return (
          <BookingView 
            isDarkMode={isDarkMode} 
            preSelectedServiceId={preSelectedServiceId} 
            onClearPreSelect={() => setPreSelectedServiceId(undefined)} 
          />
        );
      case 'contact':
        return <ContactView isDarkMode={isDarkMode} />;
      default:
        return <HomeView onPageChange={handlePageChange} isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 relative ${
      isDarkMode ? 'bg-neutral-950 text-white dark' : 'bg-[#F7F5F2] text-[#2B2B2B]'
    }`}>
      
      {/* Decorative Background Blobs for Glass Theme depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="circle-blob bg-sage w-[550px] h-[550px] -top-48 -right-36 animate-float" />
        <div className="circle-blob bg-[#E3DCD2] w-[650px] h-[650px] -bottom-36 -left-36 animate-float" style={{ animationDelay: '2s' }} />
        <div className="circle-blob bg-forest/10 dark:bg-forest/5 w-[450px] h-[450px] top-1/3 left-1/4 animate-float" style={{ animationDelay: '4s' }} />
      </div>
      
      {/* 1. Header Navigation Bar */}
      <Navbar 
        currentPage={currentPage} 
        onPageChange={handlePageChange} 
        isDarkMode={isDarkMode} 
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
      />

      {/* 2. Primary Page Animation Stage */}
      <main className="flex-grow z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Footer Section */}
      <Footer onPageChange={handlePageChange} isDarkMode={isDarkMode} />

      {/* 4. Floating back to top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            id="back-to-top-fab"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-forest text-white shadow-xl hover:bg-forest-dark transition-all cursor-pointer hover:-translate-y-1"
            title="Scroll to top"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
