/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  iconName: string; // Lucide icon name string for dynamic rendering
  shortDescription: string;
  fullDescription: string;
  symptoms: string[];
  benefits: string[];
  duration: string;
  image: string;
  faqs: ServiceFAQ[];
}

export interface PodcastEpisode {
  id: string;
  title: string;
  episodeNumber: string;
  duration: string;
  date: string;
  category: string;
  description: string;
  spotifyUrl: string;
  youtubeUrl: string;
  appleUrl: string;
  image: string;
}

export interface ClassItem {
  id: string;
  title: string;
  category: 'Mindfulness' | 'Parenting' | 'Stress Management' | 'Corporate Training';
  description: string;
  date: string;
  time: string;
  duration: string;
  instructor: string;
  capacity: number;
  registeredCount: number;
  fee: string;
  image: string;
  countdownTarget: string; // ISO timestamp for the countdown timer
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  service: string;
  rating: number;
}

export interface ClinicSettings {
  clinicName: string;
  doctorName: string;
  credentials: string;
  title: string;
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  workingHours: {
    weekdays: string;
    saturdays: string;
    sundays: string;
  };
  socialLinks: {
    instagram: string;
    linkedin: string;
    youtube: string;
    spotify: string;
  };
  emergencyNotice: string;
}

export interface FutureBlogItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  image: string;
  readTime: string;
}
