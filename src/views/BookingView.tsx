/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Info, 
  AlertCircle,
  FileText,
  CreditCard,
  Lock,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { services, clinicSettings } from '../data/websiteData';

interface BookingViewProps {
  isDarkMode: boolean;
  preSelectedServiceId?: string;
  onClearPreSelect?: () => void;
}

export default function BookingView({ isDarkMode, preSelectedServiceId, onClearPreSelect }: BookingViewProps) {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Selection States
  const [selectedService, setSelectedService] = useState<string>('');
  const [consultType, setConsultType] = useState<'video' | 'in-person'>('video');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  
  // Patient details state
  const [patientDetails, setPatientDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    reason: '',
    isFirstTime: true,
    acceptTerms: false
  });

  // Handle pre-selected service ID
  useEffect(() => {
    if (preSelectedServiceId) {
      const exists = services.find(s => s.id === preSelectedServiceId);
      if (exists) {
        setSelectedService(preSelectedServiceId);
        setCurrentStep(2); // Skip Step 1 to make booking faster!
      }
    }
  }, [preSelectedServiceId]);

  // Generate calendar days for the next 10 clinical days (excluding Sundays)
  const generateClinicalDays = () => {
    const days = [];
    const today = new Date();
    
    // Add 10 working days
    let added = 0;
    let index = 1; // start from tomorrow
    while (added < 10) {
      const nextDay = new Date();
      nextDay.setDate(today.getDate() + index);
      
      // 0 is Sunday, which is closed
      if (nextDay.getDay() !== 0) {
        days.push(nextDay);
        added++;
      }
      index++;
    }
    return days;
  };

  const clinicalDays = generateClinicalDays();

  const timeSlots = [
    { id: "ts-1", time: "09:00 AM", period: "Morning" },
    { id: "ts-2", time: "10:30 AM", period: "Morning" },
    { id: "ts-3", time: "11:45 AM", period: "Morning" },
    { id: "ts-4", time: "01:30 PM", period: "Afternoon" },
    { id: "ts-5", time: "03:00 PM", period: "Afternoon" },
    { id: "ts-6", time: "04:30 PM", period: "Afternoon" },
    { id: "ts-7", time: "06:00 PM", period: "Evening" }
  ];

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedService) return;
    if (currentStep === 2 && (!selectedDate || !selectedTimeSlot)) return;
    if (currentStep === 3 && (!patientDetails.firstName || !patientDetails.lastName || !patientDetails.email || !patientDetails.phone)) return;
    
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    if (currentStep === 2 && preSelectedServiceId) {
      // If they preselected, clicking back should let them clear it and select other service
      if (onClearPreSelect) onClearPreSelect();
      setSelectedService('');
    }
    setCurrentStep(prev => prev - 1);
  };

  const handleResetBooking = () => {
    if (onClearPreSelect) onClearPreSelect();
    setSelectedService('');
    setSelectedDate('');
    setSelectedTimeSlot('');
    setPatientDetails({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      reason: '',
      isFirstTime: true,
      acceptTerms: false
    });
    setCurrentStep(1);
  };

  const stepNames = ["Service", "Schedule", "Intake", "Checkout", "Confirmed"];

  return (
    <div id="booking-view-container" className="pt-24 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. PROGRESS BAR INDICATION */}
      <section className="mb-12">
        <div className="flex justify-between items-center text-xs text-neutral-400 select-none">
          {stepNames.map((name, idx) => {
            const stepNum = idx + 1;
            const isCompleted = currentStep > stepNum;
            const isActive = currentStep === stepNum;
            
            return (
              <div key={idx} className="flex flex-col items-center flex-1 relative last:flex-none">
                
                {/* Horizontal progress bar joiner */}
                {idx < stepNames.length - 1 && (
                  <div className={`absolute top-4 left-1/2 right-[-50%] h-[2px] -z-10 ${
                    currentStep > stepNum ? 'bg-forest' : 'bg-neutral-200 dark:bg-neutral-800'
                  }`} />
                )}

                <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center font-semibold text-xs transition-all ${
                  isCompleted 
                    ? 'bg-forest text-white' 
                    : isActive 
                      ? 'bg-sage text-[#2B2B2B] ring-4 ring-sage/20' 
                      : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                }`}>
                  {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
                </div>
                <span className={`mt-2 hidden sm:inline text-[10px] font-sans font-bold uppercase tracking-wider ${
                  isActive ? 'text-forest font-bold' : 'text-neutral-500'
                }`}>
                  {name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. DYNAMIC SLIDING CONTAINER */}
      <div className="glass rounded-3xl p-8 sm:p-12 text-left shadow-md">

        <AnimatePresence mode="wait">
          
          {/* STEP 1: SERVICE CATEGORY & MEDIUM SELECTION */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -15, opacity: 0 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold tracking-widest text-forest font-sans">Step 1 of 4</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">Select Therapy Practice</h2>
                <p className="text-xs text-neutral-500 font-light">Choose the clinical practice area that corresponds with your current mental wellness needs.</p>
              </div>

              {/* Grid of services */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((item) => {
                  const isSelected = selectedService === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedService(item.id)}
                      className={`p-5 rounded-2xl border text-left flex justify-between items-center transition-all focus:outline-none cursor-pointer hover:border-sage ${
                        isSelected 
                          ? 'border-forest bg-sage/5 dark:bg-sage/10' 
                          : 'border-neutral-200/60 dark:border-neutral-800 bg-transparent'
                      }`}
                    >
                      <div className="space-y-1 pr-4">
                        <p className={`font-serif text-sm font-bold ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>
                          {item.title}
                        </p>
                        <p className="text-[10px] text-neutral-500 font-light font-sans line-clamp-1">{item.shortDescription}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-forest bg-forest text-white' : 'border-neutral-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation button */}
              <div className="pt-6 border-t border-neutral-200/50 dark:border-neutral-800 flex justify-end">
                <button
                  onClick={handleNextStep}
                  disabled={!selectedService}
                  className={`px-8 py-3.5 rounded-full font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedService
                      ? 'bg-forest hover:bg-forest-dark text-white shadow hover:-translate-y-0.5'
                      : 'bg-neutral-200 text-neutral-400 dark:bg-neutral-800 cursor-not-allowed'
                  }`}
                >
                  <span>Continue to Calendar</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: CALENDAR DAY & TIMING MATRIX */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -15, opacity: 0 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold tracking-widest text-forest font-sans">Step 2 of 4</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">Schedule Your Intake</h2>
                <p className="text-xs text-neutral-500 font-light">Select your preferred consultation medium, clinical day, and available time-slot.</p>
              </div>

              {/* Consultation Format Options */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setConsultType('video')}
                  className={`p-4 rounded-xl border text-center transition-all focus:outline-none cursor-pointer hover:border-sage ${
                    consultType === 'video' 
                      ? 'border-forest bg-sage/5 dark:bg-sage/10 font-semibold text-forest' 
                      : 'border-neutral-200/60 dark:border-neutral-800 bg-transparent text-neutral-500'
                  }`}
                >
                  <p className="text-sm font-serif">Secure Video Consultation</p>
                  <p className="text-[10px] opacity-75 font-sans mt-0.5">HIPAA telehealth from your space</p>
                </button>
                
                <button
                  onClick={() => setConsultType('in-person')}
                  className={`p-4 rounded-xl border text-center transition-all focus:outline-none cursor-pointer hover:border-sage ${
                    consultType === 'in-person' 
                      ? 'border-forest bg-sage/5 dark:bg-sage/10 font-semibold text-forest' 
                      : 'border-neutral-200/60 dark:border-neutral-800 bg-transparent text-neutral-500'
                  }`}
                >
                  <p className="text-sm font-serif">On-Site Clinic Consultation</p>
                  <p className="text-[10px] opacity-75 font-sans mt-0.5">Premium office at Metro City</p>
                </button>
              </div>

              {/* Date Matrix Scroller */}
              <div className="space-y-2">
                <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400">Available Practice Days</label>
                <div className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-thin">
                  {clinicalDays.map((day, idx) => {
                    const dayString = day.toDateString();
                    const isSelected = selectedDate === dayString;
                    const dateNum = day.getDate();
                    const dayName = day.toLocaleDateString('en-US', { weekday: 'short' });
                    const monthName = day.toLocaleDateString('en-US', { month: 'short' });

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedDate(dayString)}
                        className={`p-3.5 rounded-xl border flex flex-col items-center shrink-0 min-w-[75px] transition-all cursor-pointer hover:border-sage ${
                          isSelected
                            ? 'border-forest bg-forest text-white shadow-sm scale-102'
                            : 'border-neutral-200/60 dark:border-neutral-800 text-neutral-500'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold tracking-wider opacity-85">{dayName}</span>
                        <span className="font-serif text-lg font-bold leading-none my-1">{dateNum}</span>
                        <span className="text-[10px] font-medium opacity-85">{monthName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slot Selector */}
              <div className="space-y-3">
                <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400">Available Time Blocks</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot.time;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`p-3.5 rounded-xl border text-center transition-all focus:outline-none cursor-pointer hover:border-sage ${
                          isSelected
                            ? 'border-forest bg-sage/5 dark:bg-sage/10 text-forest font-bold shadow-sm'
                            : 'border-neutral-200/60 dark:border-neutral-800 text-neutral-500'
                        }`}
                      >
                        <p className="text-xs font-semibold">{slot.time}</p>
                        <p className="text-[9px] text-neutral-400 font-light mt-0.5">{slot.period}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-6 border-t border-neutral-200/50 dark:border-neutral-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-3 border border-neutral-200 dark:border-neutral-800 rounded-full font-semibold text-xs flex items-center gap-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                
                <button
                  onClick={handleNextStep}
                  disabled={!selectedDate || !selectedTimeSlot}
                  className={`px-8 py-3.5 rounded-full font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    selectedDate && selectedTimeSlot
                      ? 'bg-forest hover:bg-forest-dark text-white shadow hover:-translate-y-0.5'
                      : 'bg-neutral-200 text-neutral-400 dark:bg-neutral-800 cursor-not-allowed'
                  }`}
                >
                  <span>Continue to Intake</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: INTAKE & PERSONAL DIAGNOSTICS */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ x: 15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -15, opacity: 0 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold tracking-widest text-forest font-sans">Step 3 of 4</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">Personal Details</h2>
                <p className="text-xs text-neutral-500 font-light">Kindly furnish contact credentials and outline what prompts your visit for Dr. Shripuja's reference.</p>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Elena"
                    value={patientDetails.firstName}
                    onChange={(e) => setPatientDetails({ ...patientDetails, firstName: e.target.value })}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-forest border transition-all ${
                      isDarkMode 
                        ? 'bg-neutral-950 border-neutral-800 text-white' 
                        : 'bg-neutral-50 border-neutral-200 text-charcoal'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Vasquez"
                    value={patientDetails.lastName}
                    onChange={(e) => setPatientDetails({ ...patientDetails, lastName: e.target.value })}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-forest border transition-all ${
                      isDarkMode 
                        ? 'bg-neutral-950 border-neutral-800 text-white' 
                        : 'bg-neutral-50 border-neutral-200 text-charcoal'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="elena@example.com"
                    value={patientDetails.email}
                    onChange={(e) => setPatientDetails({ ...patientDetails, email: e.target.value })}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-forest border transition-all ${
                      isDarkMode 
                        ? 'bg-neutral-950 border-neutral-800 text-white' 
                        : 'bg-neutral-50 border-neutral-200 text-charcoal'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 019-2834"
                    value={patientDetails.phone}
                    onChange={(e) => setPatientDetails({ ...patientDetails, phone: e.target.value })}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-forest border transition-all ${
                      isDarkMode 
                        ? 'bg-neutral-950 border-neutral-800 text-white' 
                        : 'bg-neutral-50 border-neutral-200 text-charcoal'
                    }`}
                  />
                </div>
              </div>

              {/* Consultation history */}
              <div className="space-y-2">
                <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400">Have you consulted Dr. Shripuja previously?</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setPatientDetails({ ...patientDetails, isFirstTime: true })}
                    className={`px-5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      patientDetails.isFirstTime 
                        ? 'border-forest bg-sage/10 text-forest' 
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-500'
                    }`}
                  >
                    Yes, I am a new patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setPatientDetails({ ...patientDetails, isFirstTime: false })}
                    className={`px-5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      !patientDetails.isFirstTime 
                        ? 'border-forest bg-sage/10 text-forest' 
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-500'
                    }`}
                  >
                    No, I am a returning patient
                  </button>
                </div>
              </div>

              {/* Reason for consultation */}
              <div className="space-y-1">
                <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400">Reason for Consultation (Confidential)</label>
                <textarea
                  rows={4}
                  placeholder="Kindly outline current challenges (e.g., career burnout, high-functioning anxiety, couples conflict, or childhood developmental testing)..."
                  value={patientDetails.reason}
                  onChange={(e) => setPatientDetails({ ...patientDetails, reason: e.target.value })}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-forest border transition-all ${
                    isDarkMode 
                      ? 'bg-neutral-950 border-neutral-800 text-white' 
                      : 'bg-neutral-50 border-neutral-200 text-charcoal'
                  }`}
                />
              </div>

              {/* Terms of confidentiality */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="booking-terms-check"
                  checked={patientDetails.acceptTerms}
                  onChange={(e) => setPatientDetails({ ...patientDetails, acceptTerms: e.target.checked })}
                  className="w-4 h-4 rounded border-neutral-300 text-forest focus:ring-forest mt-0.5 cursor-pointer"
                />
                <label htmlFor="booking-terms-check" className="text-[11px] font-light text-neutral-500 leading-relaxed cursor-pointer select-none">
                  I explicitly acknowledge and accept that my details are encrypted, kept strictly confidential under HIPAA, and that I agree to Calm Mind Wellness's <a href="#privacy" className="text-forest hover:underline">Privacy Policies</a> and standard 24-hour rescheduling agreements.
                </label>
              </div>

              {/* Action buttons */}
              <div className="pt-6 border-t border-neutral-200/50 dark:border-neutral-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-3 border border-neutral-200 dark:border-neutral-800 rounded-full font-semibold text-xs flex items-center gap-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                
                <button
                  onClick={handleNextStep}
                  disabled={!patientDetails.firstName || !patientDetails.lastName || !patientDetails.email || !patientDetails.phone || !patientDetails.acceptTerms}
                  className={`px-8 py-3.5 rounded-full font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    patientDetails.firstName && patientDetails.lastName && patientDetails.email && patientDetails.phone && patientDetails.acceptTerms
                      ? 'bg-forest hover:bg-forest-dark text-white shadow hover:-translate-y-0.5'
                      : 'bg-neutral-200 text-neutral-400 dark:bg-neutral-800 cursor-not-allowed'
                  }`}
                >
                  <span>Verify checkout</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: PAYMENT CHECKOUT REPRESENTATION */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ x: 15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -15, opacity: 0 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold tracking-widest text-forest font-sans">Step 4 of 4</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">Consultation Checkout</h2>
                <p className="text-xs text-neutral-500 font-light font-sans">A completely safe, offline-first settlement checkpoint. No funds will be charged during this demo.</p>
              </div>

              {/* Details Summary Ticket */}
              <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-neutral-500">
                <div className="space-y-2">
                  <p className="font-sans uppercase text-[10px] tracking-wider font-bold">Selected Practice:</p>
                  <p className={`font-serif text-sm font-bold ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>
                    {services.find(s => s.id === selectedService)?.title || "Adult Individual Therapy"}
                  </p>
                  <p className="font-sans uppercase text-[10px] tracking-wider font-bold pt-2">Consultation Medium:</p>
                  <p className="font-medium capitalize text-forest">{consultType} Consultation</p>
                </div>

                <div className="space-y-2">
                  <p className="font-sans uppercase text-[10px] tracking-wider font-bold">Scheduled Timeline:</p>
                  <p className="font-semibold flex items-center gap-1.5 text-charcoal dark:text-neutral-200">
                    <Calendar className="w-4 h-4 text-forest" />
                    <span>{selectedDate}</span>
                  </p>
                  <p className="font-semibold flex items-center gap-1.5 text-charcoal dark:text-neutral-200">
                    <Clock className="w-4 h-4 text-forest" />
                    <span>{selectedTimeSlot} (50-min slot)</span>
                  </p>
                </div>
              </div>

              {/* Out-Of-Network and Super-bill guidelines */}
              <div className="p-4 rounded-xl bg-sage/10 border border-sage/20 text-xs font-light space-y-2 text-neutral-600 dark:text-neutral-300">
                <div className="flex gap-2 items-center text-forest font-semibold">
                  <Info className="w-4.5 h-4.5 text-sage-dark" />
                  <span>Out-Of-Network Insurance Super-bill</span>
                </div>
                <p className="leading-relaxed pl-6">
                  Dr. Shripuja Siddamsetty operates as an out-of-network clinic to guarantee absolute patient-records confidentiality. Following session completion, a certified super-bill is provided for standard insurance claims.
                </p>
              </div>

              {/* Secure Booking Form */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold flex items-center gap-1 text-forest">
                    <Lock className="w-3.5 h-3.5" />
                    <span>HIPAA Compliant Secure Settlement</span>
                  </span>
                  <span className="text-neutral-400 font-sans uppercase text-[10px] font-bold">Pre-authorized Fee: $0.00</span>
                </div>
                
                {/* Credit card fields */}
                <div className="p-6 rounded-2xl border border-neutral-200/50 dark:border-neutral-800 space-y-4 bg-black/5 dark:bg-white/5">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400">Cardholder Name</label>
                    <input
                      type="text"
                      disabled
                      value={`${patientDetails.firstName} ${patientDetails.lastName}`}
                      className="w-full py-2.5 px-4 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/50 text-neutral-400 cursor-not-allowed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400">Card Number</label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          disabled
                          value="••••  ••••  ••••  4242"
                          className="w-full py-2.5 pl-4 pr-10 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/50 text-neutral-400 cursor-not-allowed"
                        />
                        <CreditCard className="absolute right-3 w-4 h-4 text-neutral-400" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-400">Exp & CVV</label>
                      <input
                        type="text"
                        disabled
                        value="12 / 29 (•••)"
                        className="w-full py-2.5 px-4 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/50 text-neutral-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-6 border-t border-neutral-200/50 dark:border-neutral-800 flex justify-between items-center">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-3 border border-neutral-200 dark:border-neutral-800 rounded-full font-semibold text-xs flex items-center gap-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                
                <button
                  onClick={handleNextStep}
                  className="px-8 py-4 bg-forest hover:bg-forest-dark text-white font-semibold text-xs rounded-full flex items-center gap-2 transition-all cursor-pointer shadow hover:-translate-y-0.5"
                >
                  <span>Confirm & Complete Appointment</span>
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* SUCCESS SCREEN */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12 space-y-8"
            >
              <div className="w-20 h-20 rounded-full bg-forest/10 text-forest flex items-center justify-center mx-auto scale-110 border border-forest/25">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase font-bold tracking-widest text-forest font-sans">Booking Complete</span>
                <h2 className="font-serif text-3xl font-bold tracking-tight text-forest">Your Session is Reserved!</h2>
                <p className="text-xs text-neutral-500 font-light max-w-md mx-auto">
                  Thank you, <strong>{patientDetails.firstName}</strong>. Dr. Shripuja has logged your intake. A clinician calendar event has been dispatched.
                </p>
              </div>

              {/* High Fidelity Visual Ticket */}
              <div className="glass p-8 rounded-[2rem] max-w-md mx-auto text-left relative overflow-hidden shadow-sm bg-[#FCFCFA]/80 dark:bg-neutral-900/80">
                
                {/* Visual circle notches for ticket styling */}
                <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-[#FCFCFA]/80 dark:bg-neutral-900/80 border-r border-neutral-200/50 dark:border-neutral-800 -translate-y-1/2" />
                <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-[#FCFCFA]/80 dark:bg-neutral-900/80 border-l border-neutral-200/50 dark:border-neutral-800 -translate-y-1/2" />

                <div className="space-y-4">
                  <div className="flex justify-between items-start border-b border-dashed border-neutral-300 dark:border-neutral-800 pb-4">
                    <div>
                      <span className="block text-[8px] uppercase font-bold tracking-widest text-neutral-400 font-sans">Patient Intake:</span>
                      <h4 className="font-serif text-sm font-bold text-neutral-800 dark:text-neutral-100">
                        {patientDetails.firstName} {patientDetails.lastName}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="block text-[8px] uppercase font-bold tracking-widest text-neutral-400 font-sans">Format:</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-forest bg-sage/15 px-2.5 py-1 rounded-full">{consultType}</span>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <span className="block text-[8px] uppercase font-bold tracking-widest text-neutral-400 font-sans">Practice Specialty:</span>
                      <p className="font-serif font-bold text-neutral-800 dark:text-neutral-100">
                        {services.find(s => s.id === selectedService)?.title || "Adult Individual Therapy"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-neutral-200/40 dark:border-neutral-800/40 pt-3">
                      <div>
                        <span className="block text-[8px] uppercase font-bold tracking-widest text-neutral-400 font-sans">Intake Date:</span>
                        <p className="font-semibold text-neutral-800 dark:text-neutral-100">{selectedDate}</p>
                      </div>
                      <div>
                        <span className="block text-[8px] uppercase font-bold tracking-widest text-neutral-400 font-sans">Time Slot:</span>
                        <p className="font-semibold text-neutral-800 dark:text-neutral-100">{selectedTimeSlot}</p>
                      </div>
                    </div>

                    <div className="border-t border-neutral-200/40 dark:border-neutral-800/40 pt-3">
                      <span className="block text-[8px] uppercase font-bold tracking-widest text-neutral-400 font-sans">Clinic Location Desk:</span>
                      <p className="text-[10px] text-neutral-500 leading-relaxed font-light">
                        {consultType === 'video' 
                          ? "Encrypted telehealth portal links will be transmitted 15 minutes before slot." 
                          : clinicSettings.address}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Complete Action Button */}
              <div className="pt-6 border-t border-neutral-200/50 dark:border-neutral-800 max-w-sm mx-auto space-y-4">
                <p className="text-[10px] text-neutral-500 font-sans leading-relaxed">
                  Confirmation credentials and receipt bills have been dispatched to <strong>{patientDetails.email}</strong>. Kindly dial {clinicSettings.phone} for immediate assistance.
                </p>
                <button
                  onClick={handleResetBooking}
                  className="w-full py-3.5 bg-forest hover:bg-forest-dark text-white font-semibold text-xs rounded-full shadow cursor-pointer"
                >
                  Book Another Appointment
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </div>

    </div>
  );
}
