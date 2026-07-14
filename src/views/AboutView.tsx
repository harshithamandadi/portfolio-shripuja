/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Compass, 
  GraduationCap, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  FileText,
  UserCheck,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';
import { clinicSettings } from '../data/websiteData';

interface AboutViewProps {
  onPageChange: (page: string) => void;
  isDarkMode: boolean;
}

export default function AboutView({ onPageChange, isDarkMode }: AboutViewProps) {
  
  const treatmentPhilosophies = [
    {
      title: "Evidence-Based Rigor",
      desc: "Every therapeutic intervention is strictly supported by randomized clinical trials, verified neuroscience, and Cognitive Behavioral (CBT) or Acceptance and Commitment (ACT) research frameworks."
    },
    {
      title: "Systemic Perspective",
      desc: "Individuals do not exist in vacuums. We evaluate emotional struggles as elements of active systems, including family dynamics, professional expectations, and cultural conditions."
    },
    {
      title: "Somatic Integration",
      desc: "Anxiety and trauma are physically stored in the body. We integrate vagus-nerve regulation, 4-7-8 breathing, and sensory anchoring to heal the physical nervous system Alongside cognitive thoughts."
    },
    {
      title: "Radical Self-Compassion",
      desc: "True cognitive resilience begins with dismantling extreme self-criticism. We help patients practice gentle, clinical self-acceptance as the foundation for durable behavioral pivots."
    }
  ];

  const credentialsList = [
    { degree: "Ph.D. in Clinical Psychology", institution: "Metropolitan University of Medical Sciences", year: "2015" },
    { degree: "M.Phil in Medical and Social Psychology", institution: "National Institute of Mental Health", year: "2011" },
    { degree: "Master of Science in Counseling Psychology", institution: "State Wellness Academy", year: "2009" }
  ];

  const certifications = [
    "Certified Cognitive Behavioral Therapist (Academy of CBT, USA)",
    "Certified Emotionally Focused Couples Therapist (EFT Consortium)",
    "Gottman Method Relationship Practitioner (Levels 1 & 2)",
    "Advanced Mindfulness-Based Stress Reduction Coach (MBSR Alliance)",
    "Somatic Experiencing practitioner (SEP training track)"
  ];

  const experienceTimeline = [
    {
      period: "2021 – Present",
      role: "Founder & Lead Clinical Psychologist",
      org: "Calm Mind Wellness Clinic",
      desc: "Established a premium, low-stimulus clinic integrating individual psychotherapy, pediatric support, marriage counseling, and institutional corporate audits."
    },
    {
      period: "2016 – 2021",
      role: "Senior Consultant Psychotherapist",
      org: "St. Jude Hospital Mental Health Division",
      desc: "Supervised high-risk adult trauma rehabilitation, guided clinical psychology interns, and coordinated the institution's cognitive diagnostics laboratory."
    },
    {
      period: "2012 – 2016",
      role: "Clinical Psychologist & Researcher",
      org: "State Cognitive Behavioral Institute",
      desc: "Conducted clinical trials on treatment models for high-functioning panic disorder and compiled 12 peer-reviewed research papers on adolescent screen burnout."
    },
    {
      period: "2009 – 2012",
      role: "Junior Resident Psychotherapist",
      org: "Child & Family Care Neuropsychiatric Center",
      desc: "Delivered play therapies, child developmental consultations, and parent de-escalation coaching under clinical academic supervisors."
    }
  ];

  const professionalMemberships = [
    "Fellow Member of the American Psychological Association (APA)",
    "Executive Board Member of the Clinical Psychology Coalition",
    "Active Registered Member of the International Society for CBT",
    "Advisory Psychologist to the Youth Mental Health Initiative"
  ];

  const galleryImages = [
    { url: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=600", title: "Dr. Shripuja's Consultation Chair" },
    { url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600", title: "Mindfulness Circle Setup" },
    { url: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80&w=600", title: "A Peaceful, Natural Lobby" },
    { url: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=600", title: "Diagnostic Testing Tools" }
  ];

  return (
    <div id="about-view-container" className="pt-24 pb-16">
      
      {/* 1. HEADER SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
        <span className="text-xs font-sans uppercase font-bold tracking-widest text-forest">Biography</span>
        <h1 className={`text-4xl sm:text-5xl font-serif font-bold tracking-tight mt-3 mb-6 ${
          isDarkMode ? 'text-white' : 'text-charcoal'
        }`}>
          Meet Dr. Shripuja Siddamsetty
        </h1>
        <p className={`text-base sm:text-lg font-light leading-relaxed max-w-3xl ${
          isDarkMode ? 'text-neutral-300' : 'text-neutral-600'
        }`}>
          A licensed clinical psychologist with a Doctorate in Psychotherapy and over 15 years of dedicated practice bridging advanced neuroscience with compassionate human healing.
        </p>
      </section>

      {/* 2. BIOGRAPHY DETAILS & ASYMMETRIC TEXT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-8">
        
        {/* Left Side: Photo Portrait & Credentials */}
        <div className="lg:col-span-5 space-y-8">
          <div className={`rounded-[2rem] overflow-hidden shadow-md border ${
            isDarkMode ? 'border-neutral-800' : 'border-neutral-200/50'
          }`}>
            <img 
              src="https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=600" 
              alt="Dr. Shripuja Siddamsetty" 
              referrerPolicy="no-referrer"
              className="w-full h-[400px] object-cover"
            />
          </div>

          <div className="glass p-6 rounded-2xl">
            <h4 className="font-serif text-sm font-semibold text-forest uppercase tracking-wider mb-4 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>Academic Foundation</span>
            </h4>
            <div className="space-y-4">
              {credentialsList.map((cred, idx) => (
                <div key={idx} className="text-xs border-b border-neutral-200/50 dark:border-neutral-800 last:border-0 pb-3 last:pb-0">
                  <p className={`font-serif font-bold ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>{cred.degree}</p>
                  <p className="text-neutral-500 font-light mt-0.5">{cred.institution} ({cred.year})</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Extensive Narrative Bio */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <h3 className={`text-2xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>
            My Therapeutic Philosophy & Integrity
          </h3>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 font-light">
            Therapy is not about 'fixing' a broken machine. It is a profoundly brave, highly structured dialogue between two humans. Over my 15 years in medical hospitals, neuropsychiatric clinics, and private practice, I have witnessed that sustained healing occurs when we respect both the clinical science of the brain and the emotional complexity of our stories.
          </p>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 font-light">
            My approach is collaborative and direct yet deeply gentle. Having received my Ph.D. in Clinical Psychology, I spent years investigating how anxiety loops alter neural pathways and how targeted Cognitive Behavioral Therapy (CBT) combined with somatic mindfulness can trigger actual physiological recovery.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
            <div className="glass p-6 rounded-2xl">
              <span className="text-xs uppercase font-bold tracking-widest text-forest">The Mission</span>
              <h5 className="font-serif text-base font-bold mt-2 mb-1">Our Core Mission</h5>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-light mt-2">
                To deliver a secure, modern clinical environment that restores mental alignment, empowers emotional self-agency, and dismantles intergenerational toxic cycles.
              </p>
            </div>

            <div className="glass p-6 rounded-2xl">
              <span className="text-xs uppercase font-bold tracking-widest text-forest">The Vision</span>
              <h5 className="font-serif text-base font-bold mt-2 mb-1">Our Vision</h5>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-light mt-2">
                A world where seeking psychological assessment or clinical care is treated with absolute respect, empathy, and is free of social judgment.
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 font-light pt-4">
            Whether you are navigating executive burnout as a corporate professional, seeking guidance for relationship fractures, or exploring support for a child, I provide a space where you will feel deeply understood, clinically safe, and equipped to flourish.
          </p>
        </div>

      </section>

      {/* 3. TREATMENT PHILOSOPHY */}
      <section className={`py-20 border-y my-16 ${
        isDarkMode ? 'bg-neutral-900/50 border-neutral-800' : 'bg-[#FCFCFA] border-neutral-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-sans uppercase font-bold tracking-widest text-forest">Methodology</span>
            <h2 className={`text-3xl font-serif font-bold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-charcoal'
            }`}>
              Four Core Pillars of Treatment
            </h2>
            <p className="text-xs font-light text-neutral-500">
              Dr. Shripuja's therapeutic method blends advanced scientific insights with real-world somatic exercises.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {treatmentPhilosophies.map((phil, idx) => (
              <div key={idx} className="glass p-6 rounded-2xl text-left space-y-3 hover:shadow-md transition-all">
                <div className="w-8 h-8 rounded-lg bg-sage/20 text-forest flex items-center justify-center font-bold font-mono">
                  0{idx + 1}
                </div>
                <h4 className={`font-serif text-sm font-bold ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>
                  {phil.title}
                </h4>
                <p className="text-xs font-light text-neutral-500 leading-relaxed">
                  {phil.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CLINICAL CERTIFICATIONS & MEMBERSHIPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Certifications Block */}
        <div className="glass p-8 rounded-3xl text-left">
          <h3 className={`text-xl font-serif font-bold mb-6 flex items-center gap-3 ${
            isDarkMode ? 'text-white' : 'text-charcoal'
          }`}>
            <Award className="w-5.5 h-5.5 text-forest" />
            <span>Clinical Certifications</span>
          </h3>
          <ul className="space-y-4">
            {certifications.map((cert, idx) => (
              <li key={idx} className="flex gap-3 text-xs font-light">
                <CheckCircle2 className="w-4 h-4 text-sage-dark shrink-0 mt-0.5" />
                <span className={isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}>{cert}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Memberships Block */}
        <div className="glass p-8 rounded-3xl text-left">
          <h3 className={`text-xl font-serif font-bold mb-6 flex items-center gap-3 ${
            isDarkMode ? 'text-white' : 'text-charcoal'
          }`}>
            <ShieldCheck className="w-5.5 h-5.5 text-forest" />
            <span>Professional Memberships</span>
          </h3>
          <ul className="space-y-4">
            {professionalMemberships.map((member, idx) => (
              <li key={idx} className="flex gap-3 text-xs font-light">
                <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                <span className={isDarkMode ? 'text-neutral-300' : 'text-neutral-600'}>{member}</span>
              </li>
            ))}
          </ul>
        </div>

      </section>

      {/* 5. EXPERIENCE TIMELINE */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-sans uppercase font-bold tracking-widest text-forest">Experience</span>
          <h2 className={`text-3xl font-serif font-bold tracking-tight ${
            isDarkMode ? 'text-white' : 'text-charcoal'
          }`}>
            Professional Journey
          </h2>
          <p className="text-xs font-light text-neutral-500">
            Over a decade of leadership and dedicated research across top psychiatric and clinical settings.
          </p>
        </div>

        {/* Timeline Line Visual */}
        <div className="relative border-l border-sage/40 ml-4 md:ml-32 space-y-12">
          {experienceTimeline.map((item, idx) => (
            <div key={idx} className="relative pl-8 group">
              
              {/* Dot indicator */}
              <div className="absolute -left-[9px] top-1 w-4.5 h-4.5 rounded-full bg-white border-4 border-forest dark:bg-neutral-950 transition-transform group-hover:scale-125" />
              
              {/* Left period block (hidden on mobile, positioned absolute on desktop) */}
              <div className="hidden md:block absolute -left-36 top-0 w-28 text-right font-mono text-xs font-bold text-forest">
                {item.period}
              </div>

              {/* Mobile display of period */}
              <span className="block md:hidden font-mono text-xs font-bold text-forest mb-1">
                {item.period}
              </span>

              <h4 className={`font-serif text-base font-bold ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>
                {item.role}
              </h4>
              <p className="text-xs font-semibold text-sage-dark mb-2">
                {item.org}
              </p>
              <p className="text-xs font-light text-neutral-500 leading-relaxed">
                {item.desc}
              </p>

            </div>
          ))}
        </div>
      </section>

      {/* 6. PHOTO GALLERY */}
      <section className={`py-20 border-t ${
        isDarkMode ? 'bg-neutral-950 border-neutral-900' : 'bg-neutral-100/30 border-neutral-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-sans uppercase font-bold tracking-widest text-forest">Our Spaces</span>
          <h2 className={`text-3xl font-serif font-bold tracking-tight mt-4 mb-16 ${
            isDarkMode ? 'text-white' : 'text-charcoal'
          }`}>
            A Low-Stimulus Healing Environment
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryImages.map((img, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-2xl aspect-4/3 shadow-sm">
                <img 
                  src={img.url} 
                  alt={img.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 text-left">
                  <p className="text-white font-serif text-xs font-bold tracking-wide">
                    {img.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA BLOCK */}
      <section className="py-16 text-center max-w-4xl mx-auto px-4">
        <h3 className={`text-2xl font-serif font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>
          Ready to Consult with Dr. Shripuja?
        </h3>
        <p className="text-xs font-light text-neutral-500 max-w-xl mx-auto mb-8 leading-relaxed">
          Book an in-person session in Metro City or a private Telehealth session from any location.
        </p>
        <button
          onClick={() => onPageChange('book')}
          className="px-8 py-3.5 bg-forest hover:bg-forest-dark text-white font-semibold text-xs rounded-full shadow cursor-pointer"
        >
          Schedule My Intake Session
        </button>
      </section>

    </div>
  );
}
