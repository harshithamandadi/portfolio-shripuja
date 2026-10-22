/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Compass,
  ArrowUpRight,
  TrendingUp,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useWebsiteData } from '../context/WebsiteDataContext';
import { SocialPost } from '../types';

interface SocialFeedProps {
  isDarkMode: boolean;
  onPageChange?: (page: string) => void;
}

export default function SocialFeed({ isDarkMode, onPageChange }: SocialFeedProps) {
  const { socialPosts, clinicSettings } = useWebsiteData();
  const [filter, setFilter] = useState<'all' | 'instagram' | 'linkedin'>('all');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const filteredPosts = socialPosts.filter(post => {
    if (filter === 'all') return true;
    return post.platform === filter;
  });

  const toggleLike = (id: string) => {
    setLikedPosts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section id="social-feed-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
      {/* Header and Intro */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-sans uppercase font-bold tracking-widest text-forest">
              Live Social Presence
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-sage/20 text-forest border border-sage/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Instagram & LinkedIn
            </span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-serif font-bold tracking-tight ${
            isDarkMode ? 'text-white' : 'text-charcoal'
          }`}>
            Mental Health Insights & Clinical Feed
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-light mt-1.5 max-w-2xl">
            Follow Dr. Shripuja's daily psychological tips, research digests, somatic grounding exercises, and executive burnout strategies.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl glass border border-neutral-200/50 dark:border-neutral-800">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filter === 'all' 
                ? 'bg-forest text-white shadow-sm' 
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            All Posts ({socialPosts.length})
          </button>
          <button
            onClick={() => setFilter('instagram')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              filter === 'instagram' 
                ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white shadow-sm' 
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>Instagram</span>
          </button>
          <button
            onClick={() => setFilter('linkedin')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              filter === 'linkedin' 
                ? 'bg-[#0A66C2] text-white shadow-sm' 
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <LinkedInIcon className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
          </button>
        </div>
      </div>

      {/* Grid of Social Post Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredPosts.map((post) => {
            const isLiked = !!likedPosts[post.id];
            const currentLikes = post.likesCount + (isLiked ? 1 : 0);
            const isInsta = post.platform === 'instagram';

            return (
              <motion.article
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-3xl overflow-hidden border border-neutral-200/60 dark:border-neutral-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                {/* Post Top Card Header */}
                <div className="p-5 pb-3 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/80">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={post.avatar || '/dr-shripuja.jpg'} 
                        alt={post.author}
                        className="w-10 h-10 rounded-full object-cover border-2 border-sage"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] shadow-sm ${
                        isInsta 
                          ? 'bg-gradient-to-tr from-amber-500 to-rose-600' 
                          : 'bg-[#0A66C2]'
                      }`}>
                        {isInsta ? <InstagramIcon className="w-2.5 h-2.5" /> : <LinkedInIcon className="w-2.5 h-2.5" />}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className={`text-xs font-bold font-serif ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                          {post.author}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-forest" />
                      </div>
                      <span className="text-[10px] text-neutral-400 font-sans">
                        {isInsta ? post.handle : 'Clinical Psychologist & Advocate'} &bull; {post.date}
                      </span>
                    </div>
                  </div>

                  <a 
                    href={post.postUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-forest transition-colors cursor-pointer"
                    title={`View on ${isInsta ? 'Instagram' : 'LinkedIn'}`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Optional Media Image */}
                {post.imageUrl && (
                  <div className="relative overflow-hidden aspect-video bg-neutral-100 dark:bg-neutral-900">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title || 'Social post graphic'} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {isInsta ? 'Instagram' : 'LinkedIn Insight'}
                    </div>
                  </div>
                )}

                {/* Post Body & Captions */}
                <div className="p-5 flex-grow space-y-3">
                  {post.title && (
                    <h4 className={`text-sm font-bold font-serif leading-snug ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                      {post.title}
                    </h4>
                  )}
                  
                  <p className={`text-xs font-light leading-relaxed whitespace-pre-line line-clamp-4 ${
                    isDarkMode ? 'text-neutral-300' : 'text-neutral-600'
                  }`}>
                    {post.caption}
                  </p>

                  {/* Hashtags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.tags.map((tag, tIdx) => (
                        <span 
                          key={tIdx} 
                          className="text-[10px] font-mono text-forest dark:text-sage hover:underline cursor-pointer"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Engagement Bar */}
                <div className="px-5 py-3 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center gap-4">
                    {/* Like button */}
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isLiked ? 'text-rose-600 font-bold' : 'hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      <span className="text-[11px] font-mono">{currentLikes.toLocaleString()}</span>
                    </button>

                    {/* Comments */}
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-[11px] font-mono">{post.commentsCount}</span>
                    </div>

                    {/* Shares (for LinkedIn) */}
                    {post.sharesCount !== undefined && (
                      <div className="flex items-center gap-1.5">
                        <Share2 className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-mono">{post.sharesCount}</span>
                      </div>
                    )}
                  </div>

                  <a 
                    href={post.postUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-semibold text-forest dark:text-sage hover:underline flex items-center gap-1"
                  >
                    <span>Open in {isInsta ? 'App' : 'LinkedIn'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Social Follow Hub CTA */}
      <div className="mt-12 glass p-6 rounded-3xl border border-neutral-200/60 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className={`text-base font-serif font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
            Stay Connected with Dr. Shripuja
          </h4>
          <p className="text-xs text-neutral-500">
            Join over 25,000+ individuals learning clinical mindfulness and psychological wellness weekly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={clinicSettings.socialLinks.instagram}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>Follow on Instagram</span>
          </a>
          <a
            href={clinicSettings.socialLinks.linkedin}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0A66C2] text-white shadow-sm hover:bg-[#084e96] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <LinkedInIcon className="w-3.5 h-3.5" />
            <span>Connect on LinkedIn</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// Brand SVG Icons
function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );
}
