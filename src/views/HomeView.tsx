/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ArrowRight, 
  Calendar, 
  Award, 
  Heart, 
  Users, 
  Sparkles, 
  BookOpen, 
  Clock, 
  ArrowUpRight, 
  Play, 
  Compass, 
  ChevronRight,
  ShieldCheck,
  Smile,
  UserCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { clinicSettings, services, podcasts, classes, testimonials } from '../data/websiteData';

interface HomeViewProps {
  onPageChange: (page: string) => void;
  isDarkMode: boolean;
}

export default function HomeView({ onPageChange, isDarkMode }: HomeViewProps) {
  
  // Choose first 3 services for Home preview
  const featuredServices = services.slice(0, 3);
  
  // Choose first 2 podcasts for Home preview
  const featuredPodcasts = podcasts.slice(0, 2);

  // Choose first class for preview
  const featuredClass = classes[0];

  const journeySteps = [
    {
      num: "01",
      title: "Intake & Assessment",
      subtitle: "First Session",
      desc: "A warm, 50-minute clinical conversation where we discuss your current emotional state, establish trust, and define your personal healing goals."
    },
    {
      num: "02",
      title: "Evidence-Based Framework",
      subtitle: "Custom Diagnostics",
      desc: "Combining CBT, somatic grounding, or diagnostic assessments to create an objective, practical treatment protocol unique to you."
    },
    {
      num: "03",
      title: "Active Skill Building",
      subtitle: "Collaborative Practice",
      desc: "Acquiring real-world cognitive tools, emotional regulations, and healthy relational boundaries during interactive weekly sessions."
    },
    {
      num: "04",
      title: "Resilient Autonomy",
      subtitle: "Sustainable Self-Agency",
      desc: "Graduating from structured therapy equipped with high self-compassion, cognitive flexibility, and a deep emotional anchor for the future."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div id="home-view-container" className="pt-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center px-4 sm:px-6 lg:px-8">
        {/* Soft Organic Background Gradients */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-1/4 w-[50vw] h-[50vw] rounded-full bg-sage/10 blur-[120px] dark:bg-sage/5 animate-float" />
          <div className="absolute bottom-1/4 -right-1/4 w-[40vw] h-[40vw] rounded-full bg-forest/5 blur-[100px] dark:bg-forest/2" />
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12">
          
          {/* Hero Text content */}
          <div className="lg:col-span-7 space-y-8 z-10 text-left">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage/15 dark:bg-sage/10 text-forest font-sans text-xs font-semibold tracking-wider uppercase"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Founder of Calm Mind Wellness</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className={`text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-[1.12] ${
                isDarkMode ? 'text-white' : 'text-charcoal'
              }`}
            >
              Compassionate Care <br />
              <span className="text-forest">for Your Mental</span> <br />
              Well-being
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className={`text-base sm:text-lg leading-relaxed max-w-xl font-light ${
                isDarkMode ? 'text-neutral-300' : 'text-neutral-600'
              }`}
            >
              Dr. Shripuja Siddamsetty provides evidence-based, clinical psychotherapy with high empathy. Helping adults, teenagers, and couples cultivate psychological resilience, heal from chronic stress, and discover mental clarity.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <button
                onClick={() => onPageChange('book')}
                className="px-8 py-4 bg-forest hover:bg-forest-dark text-white rounded-full font-semibold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-center cursor-pointer"
              >
                Book Appointment
              </button>
              
              <button
                onClick={() => onPageChange('services')}
                className={`px-8 py-4 rounded-full font-semibold text-sm transition-all text-center flex items-center justify-center gap-2 border cursor-pointer ${
                  isDarkMode 
                    ? 'border-neutral-700 hover:bg-neutral-800 text-white' 
                    : 'border-neutral-300 hover:bg-white text-neutral-700'
                }`}
              >
                <span>Explore Services</span>
                <ArrowRight className="w-4 h-4 text-sage-dark" />
              </button>
            </motion.div>

            {/* Clinical Trust Credentials */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="pt-6 grid grid-cols-3 gap-6 border-t border-neutral-300/30 dark:border-neutral-800"
            >
              <div>
                <span className={`block text-xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>15+</span>
                <span className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold font-sans">Years Practice</span>
              </div>
              <div>
                <span className={`block text-xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>4,500+</span>
                <span className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold font-sans">Patients Helped</span>
              </div>
              <div>
                <span className={`block text-xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>100%</span>
                <span className="block text-[10px] uppercase tracking-widest text-neutral-500 font-semibold font-sans">Confidential</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Portrait Visual (Premium mockup) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative z-10 mx-auto w-full max-w-sm lg:max-w-none"
          >
            {/* Elegant Background Frame Accent */}
            <div className="absolute -inset-2 rounded-[2.5rem] border border-sage/30 bg-sage/5 transform rotate-3 -z-10" />
            
            <div className={`relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 ${
              isDarkMode ? 'border-neutral-800' : 'border-white'
            }`}>
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
                alt="Dr. Shripuja Siddamsetty - Clinical Psychologist" 
                referrerPolicy="no-referrer"
                className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700"
              />
              {/* Overlapping Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md shadow-lg border border-white/20">
                <p className="text-xs font-serif font-bold text-forest">Dr. Shripuja Siddamsetty, Ph.D.</p>
                <p className="text-[10px] text-neutral-500 font-medium">Licensed Clinical Psychologist & Founder</p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. ABOUT PREVIEW SECTION */}
      <section className={`py-24 border-y ${
        isDarkMode ? 'bg-neutral-950 border-neutral-900' : 'bg-white border-neutral-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* About Preview Illustration/Asset */}
            <div className="lg:col-span-5 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-sage/10 blur-[60px] pointer-events-none" />
              <img 
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800" 
                alt="Tranquil wellness representation" 
                referrerPolicy="no-referrer"
                className="w-full h-[320px] object-cover rounded-[2rem] shadow-md border border-neutral-200/50 dark:border-neutral-800"
              />
              <div className="absolute -bottom-6 -right-6 p-6 rounded-2xl bg-sage/20 text-forest border border-sage/30 max-w-[200px] hidden sm:block">
                <p className="font-serif text-3xl font-bold leading-none">15+</p>
                <p className="text-xs font-sans mt-2 font-medium">Years of academic and clinical excellence</p>
              </div>
            </div>

            {/* About Preview Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <span className="text-xs font-sans uppercase font-bold tracking-widest text-forest">
                Meet Your Therapist
              </span>
              <h2 className={`text-3xl sm:text-4xl font-serif font-bold tracking-tight ${
                isDarkMode ? 'text-white' : 'text-charcoal'
              }`}>
                Deeply Rooted in Science, Guided by Human Empathy
              </h2>
              <p className={`text-sm leading-relaxed font-light ${
                isDarkMode ? 'text-neutral-300' : 'text-neutral-600'
              }`}>
                I believe mental wellness is not merely the absence of distress, but the cultivation of active psychological agility, alignment, and self-compassion. For over 15 years, my mission has been to dismantle toxic emotional loops, bridging advanced clinical diagnostics with intuitive healing spaces.
              </p>
              <p className={`text-sm leading-relaxed font-light ${
                isDarkMode ? 'text-neutral-300' : 'text-neutral-600'
              }`}>
                We work collaboratively to understand your mind's unique architecture, building structured somatic, cognitive, and boundary toolkits that foster sustainable peace and restoration.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => onPageChange('about')}
                  className="inline-flex items-center gap-2 font-semibold text-xs uppercase tracking-wider text-forest hover:text-forest-dark focus:outline-none cursor-pointer group"
                >
                  <span>Read My Full Biography</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. EXPERTISE GRID (SERVICES PREVIEW) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-sans uppercase font-bold tracking-widest text-forest">Clinical Focus</span>
          <h2 className={`text-3xl sm:text-4xl font-serif font-bold tracking-tight ${
            isDarkMode ? 'text-white' : 'text-charcoal'
          }`}>
            Empathetic, Aligned Specialties
          </h2>
          <p className={`text-sm font-light ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Explore our specialized categories, carefully adapted to support individuals, couples, and organizations seeking healthy transformations.
          </p>
        </div>

        {/* Feature Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredServices.map((service, idx) => (
            <div 
              key={service.id}
              id={`service-card-${service.id}`}
              className="glass p-8 rounded-3xl text-left transition-all hover:shadow-lg hover:-translate-y-1 relative group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-sage/15 flex items-center justify-center text-forest mb-6 group-hover:bg-sage/25 transition-colors">
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-sans uppercase tracking-widest text-sage-dark font-bold">
                  {service.category}
                </span>
                <h3 className={`text-xl font-serif font-bold mt-2 mb-3 ${
                  isDarkMode ? 'text-white' : 'text-charcoal'
                }`}>
                  {service.title}
                </h3>
                <p className={`text-xs leading-relaxed font-light mb-6 ${
                  isDarkMode ? 'text-neutral-400' : 'text-neutral-500'
                }`}>
                  {service.shortDescription}
                </p>
              </div>
              <div>
                <button
                  onClick={() => {
                    onPageChange('services');
                    setTimeout(() => {
                      const el = document.getElementById(`service-card-${service.id}`);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-forest-dark group-hover:gap-2.5 transition-all cursor-pointer"
                >
                  <span>Learn more</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => onPageChange('services')}
            className={`px-6 py-3 rounded-full text-xs font-semibold tracking-wider uppercase border transition-all hover:bg-forest hover:text-white cursor-pointer ${
              isDarkMode 
                ? 'border-neutral-700 text-neutral-300 hover:border-neutral-500' 
                : 'border-neutral-300 text-neutral-600 hover:border-neutral-400'
            }`}
          >
            Explore All 8 Practice Areas
          </button>
        </div>
      </section>

      {/* 4. WHY CHOOSE DR. SHRIPUJA (CORE PRINCIPLES) */}
      <section className={`py-24 border-y ${
        isDarkMode ? 'bg-neutral-900/40 border-neutral-800' : 'bg-sage/5 border-sage/10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Block */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <span className="text-xs font-sans uppercase font-bold tracking-widest text-forest">The Calm Mind Standard</span>
              <h2 className={`text-3xl sm:text-4xl font-serif font-bold tracking-tight leading-tight ${
                isDarkMode ? 'text-white' : 'text-charcoal'
              }`}>
                A Clinical Philosophy Built on Deep Trust
              </h2>
              <p className={`text-sm font-light leading-relaxed ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Seeking psychological support requires immense courage. Our practice is intentionally designed around safety, medical excellence, and restorative comfort.
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-forest/10 flex items-center justify-center shrink-0 text-forest mt-0.5">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                  <p className="text-xs font-medium">100% HIPAA-compliant, completely confidential workflows</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-forest/10 flex items-center justify-center shrink-0 text-forest mt-0.5">
                    <UserCheck className="w-3 h-3" />
                  </div>
                  <p className="text-xs font-medium">Licensed Clinical Doctorate guidance, never coached analogs</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-forest/10 flex items-center justify-center shrink-0 text-forest mt-0.5">
                    <Smile className="w-3 h-3" />
                  </div>
                  <p className="text-xs font-medium">Warm, low-stimulus clinic physical & digital environments</p>
                </div>
              </div>
            </div>

            {/* Right Blocks (Bento Style Grid) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="glass p-6 rounded-2xl text-left">
                <div className="w-10 h-10 rounded-xl bg-sage/10 text-forest flex items-center justify-center mb-4">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-bold mb-2">Evidence-Based Treatment</h4>
                <p className="text-xs font-light leading-relaxed text-neutral-500">
                  Every recommendation is rooted in verified neuroscience, Cognitive Behavioral Therapy, and systemic clinical research.
                </p>
              </div>

              <div className="glass p-6 rounded-2xl text-left">
                <div className="w-10 h-10 rounded-xl bg-sage/10 text-forest flex items-center justify-center mb-4">
                  <Heart className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-bold mb-2">Empathetic Matching</h4>
                <p className="text-xs font-light leading-relaxed text-neutral-500">
                  No cookie-cutter counseling templates. We carefully listen to your unique rhythm, matching therapeutic style with your core character.
                </p>
              </div>

              <div className="glass p-6 rounded-2xl text-left">
                <div className="w-10 h-10 rounded-xl bg-sage/10 text-forest flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-bold mb-2">Systemic Integration</h4>
                <p className="text-xs font-light leading-relaxed text-neutral-500">
                  Addressing emotional blockages within context, actively reviewing family dynamics, professional burnout, and social elements.
                </p>
              </div>

              <div className="glass p-6 rounded-2xl text-left">
                <div className="w-10 h-10 rounded-xl bg-sage/10 text-forest flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-bold mb-2">Ongoing Diagnostics</h4>
                <p className="text-xs font-light leading-relaxed text-neutral-500">
                  Regular, collaborative goal reviews to measure therapy's concrete success and adjust coping frameworks in real time.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. PATIENT JOURNEY TIMELINE */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-sans uppercase font-bold tracking-widest text-forest">The Timeline</span>
          <h2 className={`text-3xl sm:text-4xl font-serif font-bold tracking-tight ${
            isDarkMode ? 'text-white' : 'text-charcoal'
          }`}>
            Your Clinical Healing Journey
          </h2>
          <p className={`text-sm font-light ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
            A clear, gentle roadmap demonstrating exactly what to expect from your very first consultation to long-term resilient autonomy.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {journeySteps.map((step, idx) => (
            <div 
              key={idx}
              className="text-left relative space-y-4 p-4 rounded-2xl transition-all hover:bg-sage/5"
            >
              {/* Big step number */}
              <div className="flex justify-between items-baseline">
                <span className="font-mono text-4xl sm:text-5xl font-extrabold text-sage/40">
                  {step.num}
                </span>
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-forest bg-sage/10 px-2.5 py-1 rounded-full">
                  {step.subtitle}
                </span>
              </div>
              <h3 className={`text-lg font-serif font-bold ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>
                {step.title}
              </h3>
              <p className="text-xs leading-relaxed text-neutral-500 font-light">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIALS (THERAPEUTIC SUCCESSES) */}
      <section className={`py-24 ${
        isDarkMode ? 'bg-neutral-950' : 'bg-neutral-100/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-sans uppercase font-bold tracking-widest text-forest">Patient Voices</span>
          <h2 className={`text-3xl sm:text-4xl font-serif font-bold tracking-tight mt-4 mb-16 ${
            isDarkMode ? 'text-white' : 'text-charcoal'
          }`}>
            Restored Alignment & Peace
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto text-left">
            {testimonials.map((test) => (
              <div 
                key={test.id}
                className="glass p-8 rounded-3xl flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex gap-1 mb-6 text-amber-500">
                    {Array.from({ length: test.rating }).map((_, i) => (
                      <span key={i} className="text-base">★</span>
                    ))}
                  </div>
                  <p className={`text-sm italic leading-relaxed font-light mb-6 ${
                    isDarkMode ? 'text-neutral-300' : 'text-neutral-600'
                  }`}>
                    "{test.quote}"
                  </p>
                </div>
                <div className="border-t border-neutral-200/50 dark:border-neutral-800 pt-4 flex justify-between items-center">
                  <div>
                    <h5 className={`font-serif text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>
                      {test.author}
                    </h5>
                    <p className="text-[10px] text-neutral-500 font-sans tracking-wide">
                      {test.role}
                    </p>
                  </div>
                  <span className="text-[10px] font-sans bg-sage/10 text-forest px-3 py-1 rounded-full font-medium">
                    {test.service}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FEATURED PODCASTS & CLASSES PREVIEW */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Podcasts Preview Column */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs font-sans uppercase font-bold tracking-widest text-forest">Media Outreach</span>
                <h3 className={`text-2xl font-serif font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>
                  Mental Wellness Podcasts
                </h3>
              </div>
              <button
                onClick={() => onPageChange('podcasts')}
                className="text-xs font-semibold text-forest hover:text-forest-dark flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              {featuredPodcasts.map((pod) => (
                <div 
                  key={pod.id}
                  className="glass p-6 rounded-2xl flex flex-col sm:flex-row gap-6 items-center hover:shadow-md transition-all"
                >
                  <img 
                    src={pod.image} 
                    alt={pod.title} 
                    referrerPolicy="no-referrer"
                    className="w-24 h-24 object-cover rounded-xl shrink-0 border border-neutral-200/50"
                  />
                  <div className="space-y-2 flex-grow text-center sm:text-left">
                    <span className="text-[9px] font-mono bg-sage/10 text-forest px-2 py-0.5 rounded-full font-bold">
                      {pod.episodeNumber} &bull; {pod.duration}
                    </span>
                    <h4 className={`font-serif text-sm font-bold ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>
                      {pod.title}
                    </h4>
                    <p className="text-xs text-neutral-500 font-light line-clamp-2">
                      {pod.description}
                    </p>
                    <button
                      onClick={() => onPageChange('podcasts')}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-forest cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current text-sage-dark" />
                      <span>Listen Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Classes/Workshops Preview Column */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs font-sans uppercase font-bold tracking-widest text-forest">Interactive Growth</span>
                <h3 className={`text-2xl font-serif font-bold mt-2 ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>
                  Upcoming Workshops
                </h3>
              </div>
              <button
                onClick={() => onPageChange('classes')}
                className="text-xs font-semibold text-forest hover:text-forest-dark flex items-center gap-1 cursor-pointer"
              >
                <span>All Classes</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Featured Class Card */}
            <div className="glass p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between h-full max-h-[380px] shadow-md">
              <div className="space-y-4">
                <span className="text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-sage/10 text-forest font-semibold">
                  {featuredClass.category} &bull; Opening Soon
                </span>
                <h4 className={`font-serif text-lg font-bold leading-snug ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>
                  {featuredClass.title}
                </h4>
                <p className={`text-xs font-light leading-relaxed ${isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}`}>
                  {featuredClass.description}
                </p>
                <div className={`space-y-2 pt-2 text-xs ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-forest" />
                    <span>{featuredClass.date}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-forest" />
                    <span>{featuredClass.time} ({featuredClass.duration})</span>
                  </p>
                </div>
              </div>

              <div className="pt-6 flex justify-between items-center border-t border-neutral-200/50 dark:border-neutral-800/80 mt-4">
                <span className="text-xs font-semibold text-forest">
                  Instructor: Dr. Shripuja
                </span>
                <button
                  onClick={() => onPageChange('classes')}
                  className="px-4 py-2 bg-sage hover:bg-sage-dark text-[#2B2B2B] font-semibold text-xs rounded-full transition-all cursor-pointer"
                >
                  Join Workshop &rarr;
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. MENTAL WELLNESS QUOTE BLOCK */}
      <section className={`py-24 border-y ${
        isDarkMode ? 'bg-neutral-950 border-neutral-900' : 'bg-[#FCFCFA] border-neutral-200/40'
      }`}>
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <Heart className="w-8 h-8 text-forest/40 mx-auto" />
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl italic text-forest font-light leading-relaxed">
            "Your mind deserves the exact same tenderness, care, and patient integrity that you so generously extend to the rest of the world."
          </h2>
          <div className="w-16 h-0.5 bg-sage mx-auto" />
          <p className="font-sans text-[11px] uppercase tracking-widest text-neutral-500 font-semibold">
            Dr. Shripuja Siddamsetty — Founder
          </p>
        </div>
      </section>

      {/* 9. FINAL HIGH-IMPACT CALL TO ACTION */}
      <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        {/* Soft floating circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-sage/5 blur-3xl pointer-events-none" />
        
        <div className="glass max-w-5xl mx-auto rounded-[3rem] p-12 lg:p-16 text-center space-y-8 relative z-10 shadow-xl">
          <span className="text-xs font-sans uppercase font-bold tracking-widest text-forest">
            Begin Your Healing
          </span>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight ${
            isDarkMode ? 'text-white' : 'text-charcoal'
          }`}>
            Ready to Take Your First Peaceful Step?
          </h2>
          <p className={`text-sm sm:text-base font-light max-w-2xl mx-auto leading-relaxed ${
            isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            Explore our clinic's availability, choose between virtual or premium on-site therapy consultations, and safely secure your appointment in under three minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onPageChange('book')}
              className="px-8 py-4 bg-forest hover:bg-forest-dark text-white font-semibold text-sm rounded-full shadow-md hover:-translate-y-0.5 transition-all w-full sm:w-auto cursor-pointer"
            >
              Book Consultation Now
            </button>
            <button
              onClick={() => onPageChange('contact')}
              className={`px-8 py-4 rounded-full font-semibold text-sm transition-all border w-full sm:w-auto cursor-pointer ${
                isDarkMode 
                  ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800' 
                  : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              Contact Clinic Desk
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
