/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  Clock, 
  Calendar, 
  Disc,
  X,
  Radio,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { podcasts } from '../data/websiteData';
import { PodcastEpisode } from '../types';

interface PodcastsViewProps {
  isDarkMode: boolean;
}

export default function PodcastsView({ isDarkMode }: PodcastsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(35); // simulated percent

  const categories = ['All', 'Anxiety', 'Relationships', 'Neuroscience', 'Self-Growth', 'Parenting'];

  const filteredEpisodes = podcasts.filter(episode => {
    const matchesSearch = episode.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          episode.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || episode.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredEpisode = podcasts[0]; // Newest is featured

  const handlePlayClick = (episode: PodcastEpisode) => {
    setSelectedEpisode(episode);
    setIsPlaying(true);
    setPlaybackProgress(Math.floor(Math.random() * 20) + 10); // start at random early progress
  };

  return (
    <div id="podcasts-view-container" className="pt-24 pb-16">
      
      {/* 1. HERO EXPOSITION */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
        <span className="text-xs font-sans uppercase font-bold tracking-widest text-forest">Digital Outreach</span>
        <h1 className={`text-4xl sm:text-5xl font-serif font-bold tracking-tight mt-3 mb-6 ${
          isDarkMode ? 'text-white' : 'text-charcoal'
        }`}>
          The Calm Mind Podcast
        </h1>
        <p className={`text-base sm:text-lg font-light leading-relaxed max-w-3xl ${
          isDarkMode ? 'text-neutral-300' : 'text-neutral-600'
        }`}>
          Weekly evidence-based discussions led by Dr. Shripuja Siddamsetty. Bridging clinical diagnostics, cognitive sciences, and daily mindfulness routines to support your mental wellness.
        </p>
      </section>

      {/* 2. FEATURED EPISODE HERO BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="glass rounded-3xl overflow-hidden p-8 lg:p-12 relative flex flex-col lg:flex-row gap-12 items-center text-left shadow-lg">
          
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 dark:bg-sage/5 rounded-full blur-2xl pointer-events-none" />

          {/* Album visual */}
          <div className="w-full lg:w-4/12 relative group max-w-xs shrink-0">
            <img 
              src={featuredEpisode.image} 
              alt={featuredEpisode.title} 
              referrerPolicy="no-referrer"
              className="w-full aspect-square object-cover rounded-2xl shadow-md border border-white/15"
            />
            <button
              onClick={() => handlePlayClick(featuredEpisode)}
              className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-sage flex items-center justify-center text-[#2B2B2B]">
                <Play className="w-6 h-6 fill-current ml-1" />
              </div>
            </button>
          </div>

          {/* Episode metadata details */}
          <div className="w-full lg:w-8/12 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-sage/15 text-forest font-bold">
                Featured Episode
              </span>
              <span className={`text-[11px] font-medium flex items-center gap-1 ${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                <Clock className="w-3.5 h-3.5 text-forest" />
                <span>{featuredEpisode.duration}</span>
              </span>
              <span className={`text-[11px] font-medium flex items-center gap-1 ${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                <Calendar className="w-3.5 h-3.5 text-forest" />
                <span>{featuredEpisode.date}</span>
              </span>
            </div>

            <h3 className={`text-2xl sm:text-3xl font-serif font-bold tracking-tight leading-snug ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>
              {featuredEpisode.title}
            </h3>

            <p className={`text-xs sm:text-sm font-light leading-relaxed ${
              isDarkMode ? 'text-neutral-300' : 'text-neutral-600'
            }`}>
              {featuredEpisode.description}
            </p>

            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 justify-between">
              <button
                onClick={() => handlePlayClick(featuredEpisode)}
                className="px-6 py-3 bg-sage hover:bg-sage-dark text-[#2B2B2B] font-semibold text-xs rounded-full flex items-center gap-2 transition-all cursor-pointer shadow hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4 fill-current text-forest-dark" />
                <span>Simulate Clinical Audio</span>
              </button>

              <div className="flex items-center gap-4">
                <a 
                  href={featuredEpisode.spotifyUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  referrerPolicy="no-referrer"
                  className="p-2 rounded-full border border-white/15 hover:bg-white/10 transition-colors cursor-pointer"
                  title="Follow on Spotify"
                >
                  <ExternalLink className="w-4 h-4 text-sage" />
                </a>
                <span className="text-xs opacity-75 hidden sm:inline">Also on Spotify, Apple, & YouTube</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SEARCH & FILTER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Filters rail */}
          <div className="md:col-span-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-forest text-white'
                    : isDarkMode 
                      ? 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800' 
                      : 'bg-[#FCFCFA] text-neutral-600 border border-neutral-200/50 hover:bg-neutral-50 hover:text-charcoal'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="md:col-span-4 relative flex items-center">
            <input
              type="text"
              placeholder="Search episode archive..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full py-2.5 pl-10 pr-4 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-forest border transition-all ${
                isDarkMode 
                  ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500' 
                  : 'bg-white border-neutral-200 text-charcoal placeholder-neutral-400'
              }`}
            />
            <Search className="absolute left-3 w-4 h-4 text-neutral-400" />
          </div>

        </div>
      </section>

      {/* 4. EPISODES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {filteredEpisodes.length === 0 ? (
          <div className="text-center py-20">
            <Radio className="w-12 h-12 text-neutral-300 dark:text-neutral-800 mx-auto mb-4" />
            <p className="text-sm font-light text-neutral-500">
              No podcast episodes found matching "{searchQuery}" in "{activeCategory}".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEpisodes.map((episode) => (
              <div 
                key={episode.id}
                className="glass rounded-2xl overflow-hidden text-left flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                {/* Media thumbnail card */}
                <div className="relative aspect-video overflow-hidden border-b border-neutral-200/40 dark:border-neutral-800/40">
                  <img 
                    src={episode.image} 
                    alt={episode.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {/* Floating category badge */}
                  <span className="absolute top-3 left-3 text-[8px] font-mono font-bold uppercase bg-neutral-950/85 text-sage px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {episode.category}
                  </span>
                  
                  {/* Interactive Play overlay button */}
                  <button
                    onClick={() => handlePlayClick(episode)}
                    className="absolute inset-0 bg-neutral-950/25 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-forest hover:scale-105 transition-transform">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </button>
                </div>

                {/* Info block */}
                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-[10px] text-neutral-500 font-sans uppercase tracking-widest font-semibold flex items-center justify-between">
                      <span>{episode.episodeNumber}</span>
                      <span>{episode.duration} &bull; {episode.date}</span>
                    </p>
                    <h4 className={`font-serif text-base font-bold line-clamp-1 ${
                      isDarkMode ? 'text-white' : 'text-charcoal'
                    }`}>
                      {episode.title}
                    </h4>
                    <p className="text-xs text-neutral-500 font-light line-clamp-3 leading-relaxed">
                      {episode.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-200/50 dark:border-neutral-800 flex justify-between items-center">
                    <button
                      onClick={() => handlePlayClick(episode)}
                      className="text-xs font-semibold text-forest hover:text-forest-dark flex items-center gap-1 focus:outline-none cursor-pointer"
                    >
                      <span>Simulate Audio</span>
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                    
                    <div className="flex gap-2">
                      <a 
                        href={episode.spotifyUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        referrerPolicy="no-referrer"
                        className="p-1.5 rounded-md hover:bg-sage/10 transition-colors cursor-pointer text-neutral-400 hover:text-forest"
                        title="Spotify"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </section>

      {/* 5. SIMULATED INTERACTIVE AUDIO PLAYER (DRAWER) */}
      <AnimatePresence>
        {selectedEpisode && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 120 }}
            className="glass fixed bottom-0 left-0 right-0 z-50 border-t py-4 px-6 shadow-2xl"
          >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Left Column: Playing episode info */}
              <div className="flex items-center gap-4 text-left w-full md:w-3/12">
                <div className="relative shrink-0">
                  <img 
                    src={selectedEpisode.image} 
                    alt={selectedEpisode.title} 
                    referrerPolicy="no-referrer"
                    className={`w-12 h-12 rounded-lg object-cover ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`}
                  />
                  <Disc className="absolute -bottom-1.5 -right-1.5 w-5 h-5 text-forest fill-white dark:fill-neutral-900" />
                </div>
                <div className="truncate">
                  <h5 className="font-serif text-xs font-bold truncate">
                    {selectedEpisode.title}
                  </h5>
                  <p className="text-[10px] text-neutral-500 font-sans uppercase font-bold mt-0.5">
                    {selectedEpisode.episodeNumber} &bull; Dr. Shripuja
                  </p>
                </div>
              </div>

              {/* Middle Column: Player Controls */}
              <div className="flex flex-col items-center gap-2 w-full md:w-6/12">
                <div className="flex items-center gap-4">
                  {/* Play/Pause Button */}
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center hover:scale-105 transition-all focus:outline-none cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>

                  {/* Sound Equalizer Simulation Wave */}
                  <div className="flex gap-1 items-end h-4 w-20 select-none">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-[2.5px] bg-sage-dark rounded-full transition-all duration-300 ${
                          isPlaying ? 'animate-[pulse_1s_ease-in-out_infinite]' : 'h-1'
                        }`}
                        style={{ 
                          height: isPlaying ? `${Math.floor(Math.random() * 12) + 4}px` : '4px',
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Progress bar timeline */}
                <div className="flex items-center gap-2.5 w-full text-[10px] text-neutral-400 select-none">
                  <span>08:12</span>
                  <div className="h-1 bg-neutral-300 dark:bg-neutral-800 rounded-full flex-grow relative overflow-hidden cursor-pointer">
                    <div 
                      className="h-full bg-sage-dark transition-all duration-500" 
                      style={{ width: `${playbackProgress}%` }}
                    />
                  </div>
                  <span>{selectedEpisode.duration}</span>
                </div>
              </div>

              {/* Right Column: Volume, Close buttons */}
              <div className="flex items-center justify-end gap-4 w-full md:w-3/12">
                {/* Volume Button */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-neutral-500 hover:text-forest transition-colors focus:outline-none cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
                </button>

                <span className="text-[10px] font-sans font-bold bg-sage/20 text-forest px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Listening
                </span>

                {/* Close player drawer */}
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setSelectedEpisode(null);
                  }}
                  className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-400 hover:text-charcoal transition-colors focus:outline-none cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. PLATFORM DIRECT LINKS */}
      <section className="py-16 text-center max-w-4xl mx-auto px-4 border-t border-neutral-200/50 dark:border-neutral-800/50 mt-16">
        <h3 className={`text-xl font-serif font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>
          Follow Dr. Shripuja Across Premium Platforms
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a 
            href="https://spotify.com" 
            target="_blank" 
            rel="noreferrer" 
            referrerPolicy="no-referrer"
            className="flex items-center gap-2 text-xs font-semibold px-5 py-3 border border-neutral-200/50 dark:border-neutral-800 rounded-xl hover:bg-sage/10 transition-colors"
          >
            <Radio className="w-4 h-4 text-emerald-500" />
            <span>Listen on Spotify</span>
          </a>
          <a 
            href="https://podcasts.apple.com" 
            target="_blank" 
            rel="noreferrer" 
            referrerPolicy="no-referrer"
            className="flex items-center gap-2 text-xs font-semibold px-5 py-3 border border-neutral-200/50 dark:border-neutral-800 rounded-xl hover:bg-sage/10 transition-colors"
          >
            <Radio className="w-4 h-4 text-purple-500" />
            <span>Apple Podcasts</span>
          </a>
          <a 
            href="https://youtube.com" 
            target="_blank" 
            rel="noreferrer" 
            referrerPolicy="no-referrer"
            className="flex items-center gap-2 text-xs font-semibold px-5 py-3 border border-neutral-200/50 dark:border-neutral-800 rounded-xl hover:bg-sage/10 transition-colors"
          >
            <Radio className="w-4 h-4 text-red-500" />
            <span>YouTube Audio Channel</span>
          </a>
        </div>
      </section>

    </div>
  );
}
