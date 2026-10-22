/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
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
  Share2,
  ChevronDown,
  ChevronUp,
  Instagram,
  Linkedin,
  Heart,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useWebsiteData } from '../context/WebsiteDataContext';
import { PodcastEpisode } from '../types';

interface PodcastsViewProps {
  isDarkMode: boolean;
}

export default function PodcastsView({ isDarkMode }: PodcastsViewProps) {
  const { podcasts, socialPosts } = useWebsiteData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Active playing episode in the main theater (defaults to episode 1)
  const [activeEpisode, setActiveEpisode] = useState<PodcastEpisode>(podcasts[0]);
  
  // Per-card inline video expansion map (episode ID -> boolean)
  const [inlineVideoOpen, setInlineVideoOpen] = useState<{ [key: string]: boolean }>({});

  // Audio player state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioEpisode, setAudioEpisode] = useState<PodcastEpisode | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(35);
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null);

  const theaterRef = useRef<HTMLDivElement>(null);

  const categories = ['All', 'Teen Digital Health', 'Anxiety', 'Relationships', 'Neuroscience', 'Self-Growth', 'Parenting'];

  const filteredEpisodes = podcasts.filter(episode => {
    const matchesSearch = episode.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          episode.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || episode.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getYoutubeId = (episode: PodcastEpisode): string => {
    if (episode.youtubeId) return episode.youtubeId;
    if (episode.youtubeUrl) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = episode.youtubeUrl.match(regExp);
      if (match && match[2].length === 11) return match[2];
    }
    return 'kJQP7kiw5Fk'; // fallback high quality mindfulness talk
  };

  const handleSelectTheaterEpisode = (episode: PodcastEpisode, shouldScroll = true) => {
    setActiveEpisode(episode);
    setIsPlayingAudio(false);
    if (shouldScroll && theaterRef.current) {
      const yOffset = -90; // offset for sticky navbar
      const y = theaterRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const toggleInlineCardVideo = (episodeId: string) => {
    setInlineVideoOpen(prev => ({
      ...prev,
      [episodeId]: !prev[episodeId]
    }));
  };

  const handlePlayAudio = (episode: PodcastEpisode) => {
    setAudioEpisode(episode);
    setIsPlayingAudio(true);
    setPlaybackProgress(Math.floor(Math.random() * 25) + 10);
  };

  const handleShare = (episode: PodcastEpisode) => {
    const shareText = `Watch "${episode.title}" by Dr. Shripuja Siddamsetty on Calm Mind Wellness: https://youtube.com/watch?v=${getYoutubeId(episode)}`;
    if (navigator.share) {
      navigator.share({
        title: episode.title,
        text: shareText,
        url: `https://youtube.com/watch?v=${getYoutubeId(episode)}`
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedShareId(episode.id);
      setTimeout(() => setCopiedShareId(null), 2500);
    }
  };

  return (
    <div id="podcasts-view-container" className="pt-24 pb-20 w-full overflow-x-hidden">
      
      {/* 1. HERO TITLE & EXPOSITION */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
        <div className="flex flex-wrap items-center gap-2 mb-2.5">
          <span className="text-xs font-sans uppercase font-bold tracking-widest text-forest">Digital Outreach & Media</span>
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-red-600/10 text-red-600 dark:text-red-400 border border-red-500/20 flex items-center gap-1.5 shadow-xs">
            <YouTubeIcon className="w-3.5 h-3.5" />
            Direct In-Website Playback
          </span>
        </div>
        <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight mt-1 mb-4 ${
          isDarkMode ? 'text-white' : 'text-neutral-900'
        }`}>
          The Calm Mind Video Series & Podcasts
        </h1>
        <p className={`text-base sm:text-lg font-normal leading-relaxed max-w-3xl ${
          isDarkMode ? 'text-neutral-300' : 'text-neutral-800'
        }`}>
          Watch Dr. Shripuja Siddamsetty's clinical talks, keynotes, and mental wellness discussions directly on this page without opening external windows or modals.
        </p>
      </section>

      {/* 2. DEDICATED IN-WEBSITE VIDEO THEATER (NO POPUPS, NO WINDOWS, ZERO OVERLAP) */}
      <section ref={theaterRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="glass rounded-3xl p-6 sm:p-8 lg:p-10 border border-neutral-200/80 dark:border-neutral-800 shadow-xl text-left transition-all">
          
          {/* Header Bar above Theater Video */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-neutral-200/70 dark:border-neutral-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-forest text-white uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  Now Playing In Website
                </span>
                <span className="text-[11px] font-mono bg-sage/20 text-forest dark:text-sage px-2.5 py-0.5 rounded-full font-bold">
                  {activeEpisode.category}
                </span>
                <span className={`text-xs font-semibold ${isDarkMode ? 'text-neutral-400' : 'text-neutral-700'}`}>
                  {activeEpisode.episodeNumber}
                </span>
              </div>
              <h2 className={`text-xl sm:text-2xl lg:text-3xl font-serif font-bold tracking-tight mt-2 ${
                isDarkMode ? 'text-white' : 'text-neutral-900'
              }`}>
                {activeEpisode.title}
              </h2>
              <p className="text-xs font-semibold text-forest flex items-center gap-2">
                <span>Dr. Shripuja Siddamsetty</span>
                <span>&bull;</span>
                <span className="text-neutral-600 dark:text-neutral-400 font-normal">Council for Digital Safety and Wellbeing & Calm Mind Wellness</span>
              </p>
            </div>

            {/* Quick Share / Switch buttons */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => handleShare(activeEpisode)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  copiedShareId === activeEpisode.id
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : isDarkMode
                      ? 'bg-neutral-800 text-neutral-200 border-neutral-700 hover:bg-neutral-700'
                      : 'bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-100 shadow-xs'
                }`}
                title="Share episode link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedShareId === activeEpisode.id ? 'Copied Link!' : 'Share'}</span>
              </button>

              <a
                href={`https://www.youtube.com/watch?v=${getYoutubeId(activeEpisode)}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border border-red-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Open directly on YouTube"
              >
                <YouTubeIcon className="w-3.5 h-3.5" />
                <span>YouTube</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>

          {/* Embedded YouTube Iframe (Responsive 16:9, contained, ZERO OVERFLOW) */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-neutral-950 shadow-2xl border border-neutral-300/80 dark:border-neutral-800">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${getYoutubeId(activeEpisode)}?rel=0&modestbranding=1`}
              title={activeEpisode.title}
              className="w-full h-full border-0 absolute inset-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Episode Info & Clinical Takeaways below video */}
          <div className="mt-6 pt-6 border-t border-neutral-200/70 dark:border-neutral-800 flex flex-col lg:flex-row justify-between gap-8">
            <div className="space-y-3 lg:w-8/12">
              <h3 className={`text-sm font-sans uppercase font-bold tracking-wider ${
                isDarkMode ? 'text-neutral-300' : 'text-neutral-800'
              }`}>
                Clinical Synopsis & Focus Area
              </h3>
              <p className={`text-sm font-normal leading-relaxed ${
                isDarkMode ? 'text-neutral-200' : 'text-neutral-800'
              }`}>
                {activeEpisode.description}
              </p>
            </div>

            {/* Episode Quick Stats */}
            <div className="lg:w-4/12 space-y-3 bg-neutral-50 dark:bg-neutral-900/60 p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 text-xs">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-500 block">Session Dossier</span>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                  <span className="text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-forest" />
                    <span>Duration:</span>
                  </span>
                  <strong className="font-semibold">{activeEpisode.duration}</strong>
                </div>
                <div className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                  <span className="text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-forest" />
                    <span>Published:</span>
                  </span>
                  <strong className="font-semibold">{activeEpisode.date}</strong>
                </div>
                <div className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                  <span className="text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-forest" />
                    <span>Delivery:</span>
                  </span>
                  <span className="text-forest font-semibold">1080p Full HD</span>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex gap-2">
                <button
                  onClick={() => handlePlayAudio(activeEpisode)}
                  className="w-full py-2 bg-sage hover:bg-sage-dark text-[#2B2B2B] font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-forest" />
                  <span>Switch to Audio</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Episode Switcher Bar (Carousel / Up Next) */}
          <div className="mt-8 pt-6 border-t border-neutral-200/70 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-sans uppercase font-bold tracking-wider text-forest">
                Select Another Episode to Play Above
              </span>
              <span className="text-[11px] text-neutral-600 dark:text-neutral-400">
                Click any title to load instantly
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {podcasts.map((ep) => {
                const isActive = ep.id === activeEpisode.id;
                return (
                  <button
                    key={`theater-nav-${ep.id}`}
                    onClick={() => handleSelectTheaterEpisode(ep, false)}
                    className={`p-3.5 rounded-2xl text-left transition-all flex items-center gap-3 cursor-pointer border ${
                      isActive
                        ? 'bg-forest/10 border-forest text-forest shadow-xs'
                        : isDarkMode
                          ? 'bg-neutral-900/50 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
                          : 'bg-white hover:bg-neutral-100 border-neutral-200/80 text-neutral-800 shadow-2xs'
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                      <img 
                        src={ep.image} 
                        alt={ep.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-forest/80 flex items-center justify-center text-white">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      )}
                    </div>
                    <div className="truncate flex-grow">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-500">
                        <span>{ep.episodeNumber}</span>
                        <span>&bull;</span>
                        <span>{ep.duration}</span>
                      </div>
                      <p className={`text-xs font-semibold truncate ${isActive ? 'text-forest font-bold' : ''}`}>
                        {ep.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 3. SEARCH & CATEGORY FILTERING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-neutral-200/70 dark:border-neutral-800/70">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input 
              type="text" 
              placeholder="Search talks, anxiety, burnout..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full text-xs glass border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/90 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-forest"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-forest text-white shadow-xs'
                    : 'glass text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white border border-neutral-300/80 dark:border-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 4. EPISODES GRID (WITH PLAY ON TOP THEATER + INLINE CARD PLAY OPTIONS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        {filteredEpisodes.length === 0 ? (
          <div className="py-20 text-center glass rounded-3xl p-8 border border-neutral-200/70 dark:border-neutral-800">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              No podcast episodes found matching "{searchQuery}" in "{activeCategory}".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEpisodes.map((episode) => {
              const isInlineOpen = inlineVideoOpen[episode.id];
              const isCurrentlyInTheater = episode.id === activeEpisode.id;
              const ytId = getYoutubeId(episode);

              return (
                <div 
                  key={episode.id}
                  className={`glass rounded-3xl overflow-hidden text-left flex flex-col justify-between transition-all hover:shadow-xl border ${
                    isCurrentlyInTheater 
                      ? 'border-forest/60 ring-1 ring-forest/30' 
                      : 'border-neutral-200/80 dark:border-neutral-800'
                  }`}
                >
                  {/* Top Media: Either Image or Inline Expanded Video Player */}
                  {isInlineOpen ? (
                    <div className="relative aspect-video w-full bg-black border-b border-neutral-200/40 dark:border-neutral-800/40">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
                        title={episode.title}
                        className="w-full h-full border-0 absolute inset-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <button
                        onClick={() => toggleInlineCardVideo(episode.id)}
                        className="absolute top-2 right-2 bg-neutral-900/90 text-white p-1.5 rounded-full hover:bg-neutral-800 transition-colors z-10 cursor-pointer"
                        title="Collapse inline player"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative aspect-video overflow-hidden border-b border-neutral-200/40 dark:border-neutral-800/40 group">
                      <img 
                        src={episode.image} 
                        alt={episode.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Floating category badge */}
                      <span className="absolute top-3 left-3 text-[9px] font-mono font-bold uppercase bg-neutral-950/85 text-sage px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                        {episode.category}
                      </span>

                      {/* YouTube badge */}
                      <span className="absolute top-3 right-3 text-[9px] font-bold uppercase bg-red-600 text-white px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1 shadow-xs">
                        <YouTubeIcon className="w-2.5 h-2.5" />
                        <span>YouTube</span>
                      </span>
                      
                      {/* Hover play prompt */}
                      <button
                        onClick={() => handleSelectTheaterEpisode(episode)}
                        className="absolute inset-0 bg-neutral-950/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <div className="w-14 h-14 rounded-full bg-red-600 text-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-current ml-0.5" />
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Card Body Info */}
                  <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-neutral-600 dark:text-neutral-400 font-sans uppercase tracking-widest font-bold">
                        <span>{episode.episodeNumber}</span>
                        <span>{episode.duration} &bull; {episode.date}</span>
                      </div>
                      
                      <h4 className={`font-serif text-base font-bold line-clamp-2 ${
                        isDarkMode ? 'text-white' : 'text-neutral-900'
                      }`}>
                        {episode.title}
                      </h4>
                      
                      <p className="text-xs text-neutral-700 dark:text-neutral-300 font-normal line-clamp-3 leading-relaxed">
                        {episode.description}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 border-t border-neutral-200/60 dark:border-neutral-800 space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        {/* Play on Main Player (Top) */}
                        <button
                          onClick={() => handleSelectTheaterEpisode(episode)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isCurrentlyInTheater
                              ? 'bg-forest text-white'
                              : 'bg-forest/10 hover:bg-forest text-forest hover:text-white'
                          }`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{isCurrentlyInTheater ? 'Playing Above' : 'Play on Screen'}</span>
                        </button>

                        {/* Inline Watch Toggle */}
                        <button
                          onClick={() => toggleInlineCardVideo(episode.id)}
                          className="px-3 py-2 rounded-xl text-xs font-semibold bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <YouTubeIcon className="w-3 h-3" />
                          <span>{isInlineOpen ? 'Close Player' : 'Watch Here'}</span>
                        </button>

                        {/* Audio Trigger */}
                        <button
                          onClick={() => handlePlayAudio(episode)}
                          className="p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-forest transition-colors cursor-pointer"
                          title="Listen to audio"
                        >
                          <Disc className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. INSTAGRAM & LINKEDIN CLINICAL UPDATES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="glass rounded-3xl p-8 lg:p-12 border border-neutral-200/80 dark:border-neutral-800 shadow-lg text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-200/70 dark:border-neutral-800">
            <div>
              <span className="text-xs font-sans uppercase font-bold tracking-widest text-forest">Social Insights</span>
              <h3 className={`text-2xl sm:text-3xl font-serif font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                Instagram & LinkedIn Post Feed
              </h3>
              <p className="text-xs text-neutral-700 dark:text-neutral-300 font-normal mt-1">
                Latest updates, diagnostic infographics, and mental health notes shared directly by Dr. Shripuja.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-pink-600 border border-pink-500/20 flex items-center gap-1.5 hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all cursor-pointer"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>@calmmindwellness</span>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-2 rounded-full text-xs font-semibold bg-blue-600/10 text-blue-600 border border-blue-500/20 flex items-center gap-1.5 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn Articles</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {socialPosts.slice(0, 3).map((post) => (
              <div 
                key={post.id}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                  isDarkMode 
                    ? 'bg-neutral-900/60 border-neutral-800 text-neutral-200' 
                    : 'bg-white border-neutral-200/80 text-neutral-800 shadow-2xs'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center font-bold text-xs">
                        Dr
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-white">{post.author}</h4>
                        <p className="text-[10px] text-neutral-500">{post.date}</p>
                      </div>
                    </div>
                    {post.platform === 'instagram' ? (
                      <Instagram className="w-4 h-4 text-pink-500" />
                    ) : (
                      <Linkedin className="w-4 h-4 text-blue-600" />
                    )}
                  </div>

                  {post.imageUrl && (
                    <div className="rounded-xl overflow-hidden aspect-video border border-neutral-200/60 dark:border-neutral-800">
                      <img 
                        src={post.imageUrl} 
                        alt="Post media" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <p className="text-xs text-neutral-700 dark:text-neutral-300 font-normal line-clamp-4 leading-relaxed whitespace-pre-line">
                    {post.caption}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 mt-4">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500/20" />
                      <span>{post.likesCount}</span>
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <MessageCircle className="w-3.5 h-3.5 text-forest" />
                      <span>{post.commentsCount}</span>
                    </span>
                  </div>

                  <a 
                    href={post.postUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-semibold text-forest hover:underline flex items-center gap-1"
                  >
                    <span>View Post</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. BOTTOM AUDIO PLAYER DRAWER (Only appears when audio is triggered) */}
      <AnimatePresence>
        {audioEpisode && isPlayingAudio && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 120 }}
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-300 dark:border-neutral-800 py-3.5 px-6 shadow-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl"
          >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Left: Episode info */}
              <div className="flex items-center gap-4 text-left w-full md:w-4/12">
                <div className="relative shrink-0">
                  <img 
                    src={audioEpisode.image} 
                    alt={audioEpisode.title} 
                    referrerPolicy="no-referrer"
                    className={`w-11 h-11 rounded-xl object-cover ${isPlayingAudio ? 'animate-[spin_10s_linear_infinite]' : ''}`}
                  />
                  <Disc className="absolute -bottom-1 -right-1 w-4 h-4 text-forest fill-white dark:fill-neutral-900" />
                </div>
                <div className="truncate">
                  <h5 className="font-serif text-xs font-bold truncate text-neutral-900 dark:text-white">
                    {audioEpisode.title}
                  </h5>
                  <p className="text-[10px] text-neutral-600 dark:text-neutral-400 font-sans uppercase font-bold mt-0.5">
                    {audioEpisode.episodeNumber} &bull; Dr. Shripuja Siddamsetty
                  </p>
                </div>
              </div>

              {/* Middle: Audio wave & controls */}
              <div className="flex flex-col items-center gap-1.5 w-full md:w-5/12">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-9 h-9 rounded-full bg-forest text-white flex items-center justify-center hover:scale-105 transition-all focus:outline-none cursor-pointer shadow-xs"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  <div className="flex gap-1 items-end h-3.5 w-16 select-none">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-[2px] bg-forest dark:bg-sage rounded-full transition-all duration-300 ${
                          isPlayingAudio ? 'animate-[pulse_1s_ease-in-out_infinite]' : 'h-1'
                        }`}
                        style={{ 
                          height: isPlayingAudio ? `${Math.floor(Math.random() * 10) + 3}px` : '3px',
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => handleSelectTheaterEpisode(audioEpisode)}
                    className="px-3 py-1 rounded-full text-[10px] font-semibold bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <YouTubeIcon className="w-3 h-3" />
                    <span>Watch Video</span>
                  </button>
                </div>

                <div className="flex items-center gap-2.5 w-full text-[10px] text-neutral-600 dark:text-neutral-400 select-none">
                  <span>08:12</span>
                  <div className="h-1 bg-neutral-300 dark:bg-neutral-800 rounded-full flex-grow relative overflow-hidden cursor-pointer">
                    <div 
                      className="h-full bg-forest dark:bg-sage transition-all duration-500" 
                      style={{ width: `${playbackProgress}%` }}
                    />
                  </div>
                  <span>{audioEpisode.duration}</span>
                </div>
              </div>

              {/* Right: Volume & Close */}
              <div className="flex items-center justify-end gap-3 w-full md:w-3/12">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-neutral-600 dark:text-neutral-400 hover:text-forest transition-colors focus:outline-none cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    setIsPlayingAudio(false);
                    setAudioEpisode(null);
                  }}
                  className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors focus:outline-none cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. PLATFORMS EXTERNAL CHANNELS */}
      <section className="py-12 text-center max-w-4xl mx-auto px-4 border-t border-neutral-200/70 dark:border-neutral-800/70 mt-8">
        <h3 className={`text-xl font-serif font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
          Follow Dr. Shripuja Across Premium Channels
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <a 
            href="https://spotify.com" 
            target="_blank" 
            rel="noreferrer" 
            referrerPolicy="no-referrer"
            className="flex items-center gap-2 text-xs font-semibold px-5 py-3 border border-neutral-300 dark:border-neutral-800 rounded-2xl hover:bg-sage/10 transition-colors shadow-2xs text-neutral-800 dark:text-neutral-200"
          >
            <Radio className="w-4 h-4 text-emerald-500" />
            <span>Listen on Spotify</span>
          </a>
          <a 
            href="https://podcasts.apple.com" 
            target="_blank" 
            rel="noreferrer" 
            referrerPolicy="no-referrer"
            className="flex items-center gap-2 text-xs font-semibold px-5 py-3 border border-neutral-300 dark:border-neutral-800 rounded-2xl hover:bg-sage/10 transition-colors shadow-2xs text-neutral-800 dark:text-neutral-200"
          >
            <Radio className="w-4 h-4 text-purple-500" />
            <span>Apple Podcasts</span>
          </a>
          <a 
            href="https://youtube.com" 
            target="_blank" 
            rel="noreferrer" 
            referrerPolicy="no-referrer"
            className="flex items-center gap-2 text-xs font-semibold px-5 py-3 border border-neutral-300 dark:border-neutral-800 rounded-2xl hover:bg-red-500/10 transition-colors shadow-2xs text-red-600 dark:text-red-400"
          >
            <YouTubeIcon className="w-4 h-4" />
            <span>YouTube Channel</span>
          </a>
        </div>
      </section>

    </div>
  );
}

function YouTubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}
