/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ClinicSettings, 
  ServiceItem, 
  ClassItem, 
  PodcastEpisode, 
  Testimonial, 
  SocialPost,
  PaymentConfig 
} from '../types';
import { 
  clinicSettings as defaultClinicSettings, 
  services as defaultServices, 
  classes as defaultClasses, 
  podcasts as defaultPodcasts, 
  testimonials as defaultTestimonials 
} from '../data/websiteData';

// Initial default social posts for Dr. Shripuja
export const defaultSocialPosts: SocialPost[] = [
  {
    id: 'insta-1',
    platform: 'instagram',
    author: 'Dr. Shripuja Siddamsetty',
    handle: '@calmmindwellness',
    avatar: '/dr-shripuja.jpg',
    caption: '5 Silent Signs of High-Functioning Anxiety you might be overlooking:\n\n1. Over-preparing and overthinking minor emails\n2. Difficulty sitting still without guilt\n3. Perfectionism masking a fear of criticism\n4. People-pleasing at the expense of your sleep\n5. Always waiting for "the other shoe to drop"\n\nRemember: Being productive doesn\'t mean you aren\'t hurting inside. You deserve rest without earning it first. 🌿✨',
    date: '2 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
    postUrl: 'https://instagram.com/calmmindwellness',
    likesCount: 1842,
    commentsCount: 94,
    tags: ['#MentalHealthMatters', '#AnxietyRelief', '#DrShripuja', '#CalmMind', '#SelfCare']
  },
  {
    id: 'linkedin-1',
    platform: 'linkedin',
    author: 'Dr. Shripuja Siddamsetty',
    handle: 'dr-shripuja-siddamsetty',
    avatar: '/dr-shripuja.jpg',
    title: 'Workplace Burnout is Not an Individual Failure — It is a Systemic Signal',
    caption: 'In my clinical practice, I regularly consult with executives and corporate leaders who blame themselves for exhaustion. "I used to handle 60-hour weeks easily," they tell me with heavy guilt.\n\nHere is what neuroscience teaches us: Chronic cortisol elevation structurally reduces prefrontal cortex connectivity while hyper-sensitizing the amygdala. Burnout is your nervous system\'s biological failsafe.\n\nOrganizations cannot yoga-break their way out of unreasonable workloads. Psychological safety begins when boundary setting is celebrated, not penalized.',
    date: '3 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
    postUrl: 'https://linkedin.com/in/dr-shripuja-siddamsetty',
    likesCount: 1240,
    commentsCount: 158,
    sharesCount: 64,
    tags: ['#Leadership', '#MentalHealthAtWork', '#BurnoutPrevention', '#Psychology']
  },
  {
    id: 'insta-2',
    platform: 'instagram',
    author: 'Dr. Shripuja Siddamsetty',
    handle: '@calmmindwellness',
    avatar: '/dr-shripuja.jpg',
    caption: 'The 5-4-3-2-1 Somatic Grounding Technique when panic begins:\n\n👀 5 things you can see\n✋ 4 things you can physically touch\n👂 3 things you can hear\n👃 2 things you can smell\n👅 1 thing you can taste\n\nSave this for when your thoughts feel too loud. Dr. Shripuja 🤍',
    date: '5 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=800',
    postUrl: 'https://instagram.com/calmmindwellness',
    likesCount: 2950,
    commentsCount: 184,
    tags: ['#GroundingExercises', '#PanicAttackHelp', '#Mindfulness', '#TherapyTips']
  },
  {
    id: 'linkedin-2',
    platform: 'linkedin',
    author: 'Dr. Shripuja Siddamsetty',
    handle: 'dr-shripuja-siddamsetty',
    avatar: '/dr-shripuja.jpg',
    title: 'Cognitive Agility in High-Stakes Decision Making: A Clinical Protocol',
    caption: 'Proud to announce the conclusion of our 6-week Executive Resilience program for senior medical and tech leadership. We integrated MBSR protocols with cognitive behavioral restructuring, resulting in a 38% decrease in self-reported decision paralysis.\n\nKey takeaway: Clarity comes after somatic regulation, never before.',
    date: '1 week ago',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    postUrl: 'https://linkedin.com/in/dr-shripuja-siddamsetty',
    likesCount: 890,
    commentsCount: 76,
    sharesCount: 32,
    tags: ['#ExecutiveCoaching', '#Resilience', '#ClinicalPsychology', '#MentalWellness']
  },
  {
    id: 'insta-3',
    platform: 'instagram',
    author: 'Dr. Shripuja Siddamsetty',
    handle: '@calmmindwellness',
    avatar: '/dr-shripuja.jpg',
    caption: '"Boundaries are not walls to keep everyone out. They are doors with locks that YOU hold the keys to."\n\nSetting a boundary doesn\'t make you selfish or unkind; it ensures you have enough energy to remain kind. What boundary do you need to honor today?',
    date: '1 week ago',
    imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=800',
    postUrl: 'https://instagram.com/calmmindwellness',
    likesCount: 3410,
    commentsCount: 220,
    tags: ['#BoundarySetting', '#SelfLove', '#EmotionalWellness', '#DrShripuja']
  },
  {
    id: 'linkedin-3',
    platform: 'linkedin',
    author: 'Dr. Shripuja Siddamsetty',
    handle: 'dr-shripuja-siddamsetty',
    avatar: '/dr-shripuja.jpg',
    title: 'Adolescent Mental Health in the Smartphone Age: Where Families Can Start',
    caption: 'During my keynote address this past weekend, I discussed the transition from observational learning to algorithmic comparison among teens. When parents replace surveillance with active, curious listening, defensive barriers collapse. The goal isn\'t perfection; it is presence.',
    date: '2 weeks ago',
    imageUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800',
    postUrl: 'https://linkedin.com/in/dr-shripuja-siddamsetty',
    likesCount: 1670,
    commentsCount: 215,
    sharesCount: 95,
    tags: ['#Parenting', '#AdolescentMentalHealth', '#DigitalWellbeing', '#Keynote']
  }
];

export const defaultPaymentConfig: PaymentConfig = {
  quickAmount1: 5000,
  quickAmount2: 7500,
  upiId: 'drshripuja@okhdfcbank',
  bankName: 'HDFC Bank Ltd, Jubilee Hills Branch',
  accountNumber: '50200088912345',
  ifscCode: 'HDFC0001824',
  accountName: 'Calm Mind Wellness — Dr. Shripuja Siddamsetty',
  razorpayKeyId: 'rzp_test_1DP5mmOlF5G5ag', // Default test key ID for demonstration
  currency: 'INR'
};

// Initial podcasts with embedded YouTube IDs
export const defaultPodcastsWithYoutube: PodcastEpisode[] = defaultPodcasts.map((pod, idx) => {
  const sampleYoutubeIds = [
    'kJQP7kiw5Fk', // Mindfulness meditation / calmness
    'inpok4MKVLM', // 5-min breathing mindfulness
    'ZToicYuvmbY', // Daily calm mindfulness session
    'MIr3RsUWrdo', // Mindfulness for anxiety relief
    'O-6f5wQXSu8', // Deep calming focus
    '1vx8iUvfyCY'  // Stress reduction guide
  ];
  return {
    ...pod,
    youtubeId: pod.youtubeId || sampleYoutubeIds[idx % sampleYoutubeIds.length]
  };
});

interface WebsiteDataContextType {
  clinicSettings: ClinicSettings;
  services: ServiceItem[];
  classes: ClassItem[];
  podcasts: PodcastEpisode[];
  socialPosts: SocialPost[];
  testimonials: Testimonial[];
  paymentConfig: PaymentConfig;
  
  // Update handlers
  updateClinicSettings: (settings: Partial<ClinicSettings>) => void;
  setServices: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
  updateService: (id: string, updated: Partial<ServiceItem>) => void;
  addService: (newService: ServiceItem) => void;
  deleteService: (id: string) => void;

  setClasses: React.Dispatch<React.SetStateAction<ClassItem[]>>;
  updateClass: (id: string, updated: Partial<ClassItem>) => void;
  addClass: (newClass: ClassItem) => void;
  deleteClass: (id: string) => void;

  setPodcasts: React.Dispatch<React.SetStateAction<PodcastEpisode[]>>;
  updatePodcast: (id: string, updated: Partial<PodcastEpisode>) => void;
  addPodcast: (newPodcast: PodcastEpisode) => void;
  deletePodcast: (id: string) => void;

  setSocialPosts: React.Dispatch<React.SetStateAction<SocialPost[]>>;
  updateSocialPost: (id: string, updated: Partial<SocialPost>) => void;
  addSocialPost: (newPost: SocialPost) => void;
  deleteSocialPost: (id: string) => void;

  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
  updatePaymentConfig: (config: Partial<PaymentConfig>) => void;

  resetToDefaults: () => void;
  exportDataJson: () => string;
  importDataJson: (json: string) => boolean;
}

const STORAGE_KEY = 'calm_mind_wellness_cms_v2';

const WebsiteDataContext = createContext<WebsiteDataContextType | undefined>(undefined);

export function WebsiteDataProvider({ children }: { children: React.ReactNode }) {
  // Load saved state or fall back to defaults
  const [clinicSettings, setClinicSettings] = useState<ClinicSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_clinic`);
      return saved ? JSON.parse(saved) : defaultClinicSettings;
    } catch {
      return defaultClinicSettings;
    }
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_services`);
      return saved ? JSON.parse(saved) : defaultServices;
    } catch {
      return defaultServices;
    }
  });

  const [classes, setClasses] = useState<ClassItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_classes`);
      return saved ? JSON.parse(saved) : defaultClasses;
    } catch {
      return defaultClasses;
    }
  });

  const [podcasts, setPodcasts] = useState<PodcastEpisode[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_podcasts`);
      return saved ? JSON.parse(saved) : defaultPodcastsWithYoutube;
    } catch {
      return defaultPodcastsWithYoutube;
    }
  });

  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_social`);
      return saved ? JSON.parse(saved) : defaultSocialPosts;
    } catch {
      return defaultSocialPosts;
    }
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_testimonials`);
      return saved ? JSON.parse(saved) : defaultTestimonials;
    } catch {
      return defaultTestimonials;
    }
  });

  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_payment`);
      return saved ? JSON.parse(saved) : defaultPaymentConfig;
    } catch {
      return defaultPaymentConfig;
    }
  });

  // Sync to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_clinic`, JSON.stringify(clinicSettings));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [clinicSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_services`, JSON.stringify(services));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_classes`, JSON.stringify(classes));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [classes]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_podcasts`, JSON.stringify(podcasts));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [podcasts]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_social`, JSON.stringify(socialPosts));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [socialPosts]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_testimonials`, JSON.stringify(testimonials));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [testimonials]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_payment`, JSON.stringify(paymentConfig));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [paymentConfig]);

  // Operations
  const updateClinicSettings = (settings: Partial<ClinicSettings>) => {
    setClinicSettings(prev => ({ ...prev, ...settings }));
  };

  const updateService = (id: string, updated: Partial<ServiceItem>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const addService = (newService: ServiceItem) => {
    setServices(prev => [newService, ...prev]);
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const updateClass = (id: string, updated: Partial<ClassItem>) => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
  };

  const addClass = (newClass: ClassItem) => {
    setClasses(prev => [newClass, ...prev]);
  };

  const deleteClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  const updatePodcast = (id: string, updated: Partial<PodcastEpisode>) => {
    setPodcasts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const addPodcast = (newPodcast: PodcastEpisode) => {
    setPodcasts(prev => [newPodcast, ...prev]);
  };

  const deletePodcast = (id: string) => {
    setPodcasts(prev => prev.filter(p => p.id !== id));
  };

  const updateSocialPost = (id: string, updated: Partial<SocialPost>) => {
    setSocialPosts(prev => prev.map(sp => sp.id === id ? { ...sp, ...updated } : sp));
  };

  const addSocialPost = (newPost: SocialPost) => {
    setSocialPosts(prev => [newPost, ...prev]);
  };

  const deleteSocialPost = (id: string) => {
    setSocialPosts(prev => prev.filter(sp => sp.id !== id));
  };

  const updatePaymentConfig = (config: Partial<PaymentConfig>) => {
    setPaymentConfig(prev => ({ ...prev, ...config }));
  };

  const resetToDefaults = () => {
    setClinicSettings(defaultClinicSettings);
    setServices(defaultServices);
    setClasses(defaultClasses);
    setPodcasts(defaultPodcastsWithYoutube);
    setSocialPosts(defaultSocialPosts);
    setTestimonials(defaultTestimonials);
    setPaymentConfig(defaultPaymentConfig);
    try {
      localStorage.removeItem(`${STORAGE_KEY}_clinic`);
      localStorage.removeItem(`${STORAGE_KEY}_services`);
      localStorage.removeItem(`${STORAGE_KEY}_classes`);
      localStorage.removeItem(`${STORAGE_KEY}_podcasts`);
      localStorage.removeItem(`${STORAGE_KEY}_social`);
      localStorage.removeItem(`${STORAGE_KEY}_testimonials`);
      localStorage.removeItem(`${STORAGE_KEY}_payment`);
    } catch {}
  };

  const exportDataJson = (): string => {
    return JSON.stringify({
      clinicSettings,
      services,
      classes,
      podcasts,
      socialPosts,
      testimonials,
      paymentConfig,
      exportedAt: new Date().toISOString()
    }, null, 2);
  };

  const importDataJson = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.clinicSettings) setClinicSettings(data.clinicSettings);
      if (Array.isArray(data.services)) setServices(data.services);
      if (Array.isArray(data.classes)) setClasses(data.classes);
      if (Array.isArray(data.podcasts)) setPodcasts(data.podcasts);
      if (Array.isArray(data.socialPosts)) setSocialPosts(data.socialPosts);
      if (Array.isArray(data.testimonials)) setTestimonials(data.testimonials);
      if (data.paymentConfig) setPaymentConfig(data.paymentConfig);
      return true;
    } catch (e) {
      console.error('Invalid JSON import:', e);
      return false;
    }
  };

  return (
    <WebsiteDataContext.Provider
      value={{
        clinicSettings,
        services,
        classes,
        podcasts,
        socialPosts,
        testimonials,
        paymentConfig,
        updateClinicSettings,
        setServices,
        updateService,
        addService,
        deleteService,
        setClasses,
        updateClass,
        addClass,
        deleteClass,
        setPodcasts,
        updatePodcast,
        addPodcast,
        deletePodcast,
        setSocialPosts,
        updateSocialPost,
        addSocialPost,
        deleteSocialPost,
        setTestimonials,
        updatePaymentConfig,
        resetToDefaults,
        exportDataJson,
        importDataJson
      }}
    >
      {children}
    </WebsiteDataContext.Provider>
  );
}

export function useWebsiteData() {
  const context = useContext(WebsiteDataContext);
  if (!context) {
    throw new Error('useWebsiteData must be used within a WebsiteDataProvider');
  }
  return context;
}
