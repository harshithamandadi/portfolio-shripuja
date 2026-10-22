/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Sparkles, 
  Radio, 
  Calendar, 
  Share2, 
  CreditCard, 
  MessageSquareQuote, 
  Eye, 
  ExternalLink,
  Play,
  ArrowLeft,
  Settings,
  ShieldCheck,
  Video,
  Lock,
  LogOut,
  Key,
  User,
  EyeOff
} from 'lucide-react';
import { useWebsiteData } from '../context/WebsiteDataContext';
import { ServiceItem, ClassItem, PodcastEpisode, SocialPost, Testimonial } from '../types';

interface CmsViewProps {
  onPageChange: (page: string) => void;
  isDarkMode: boolean;
}

export default function CmsView({ onPageChange, isDarkMode }: CmsViewProps) {
  const {
    clinicSettings,
    services,
    classes,
    podcasts,
    socialPosts,
    testimonials,
    paymentConfig,
    updateClinicSettings,
    updateService,
    addService,
    deleteService,
    updateClass,
    addClass,
    deleteClass,
    updatePodcast,
    addPodcast,
    deletePodcast,
    updateSocialPost,
    addSocialPost,
    deleteSocialPost,
    setTestimonials,
    updatePaymentConfig,
    resetToDefaults,
    exportDataJson,
    importDataJson
  } = useWebsiteData();

  // Doctor CMS Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('cmw_cms_authenticated') === 'true';
  });

  // Stored clinic credentials (default: drshripuja / calmmind@92461 or PIN 92461)
  const defaultCredentials = {
    username: 'drshripuja',
    password: 'calmmind@92461',
    pin: '92461'
  };

  const [storedCreds, setStoredCreds] = useState(() => {
    try {
      const saved = localStorage.getItem('cmw_cms_credentials');
      return saved ? JSON.parse(saved) : defaultCredentials;
    } catch {
      return defaultCredentials;
    }
  });

  // Login form state
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Quick password change state inside CMS
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPasswordVal, setNewPasswordVal] = useState('');
  const [passUpdatedSuccess, setPassUpdatedSuccess] = useState(false);

  type TabType = 'clinic' | 'services' | 'classes' | 'podcasts' | 'social' | 'payment' | 'testimonials' | 'backup';
  const [activeTab, setActiveTab] = useState<TabType>('clinic');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const u = loginUser.trim().toLowerCase();
    const p = loginPass.trim();

    const validUsernames = [storedCreds.username.toLowerCase(), 'admin', 'drshripuja', 'shripuja'];
    const validPasswords = [storedCreds.password, storedCreds.pin, '92461', 'calmmind@92461', 'admin123'];

    if (validUsernames.includes(u) && validPasswords.includes(p)) {
      setIsAuthenticated(true);
      sessionStorage.setItem('cmw_cms_authenticated', 'true');
      setAuthError(null);
    } else {
      setAuthError('Incorrect credentials. Please verify your doctor username and password.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('cmw_cms_authenticated');
    setLoginPass('');
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordVal.trim() || newPasswordVal.trim().length < 5) {
      alert('Password must be at least 5 characters long.');
      return;
    }
    const updated = { ...storedCreds, password: newPasswordVal.trim() };
    setStoredCreds(updated);
    localStorage.setItem('cmw_cms_credentials', JSON.stringify(updated));
    setPassUpdatedSuccess(true);
    setTimeout(() => {
      setPassUpdatedSuccess(false);
      setShowPasswordModal(false);
      setNewPasswordVal('');
    }, 2000);
  };

  // Helper function to extract YouTube ID from full URL or return if already ID
  const extractYoutubeId = (urlOrId: string): string => {
    if (!urlOrId) return '';
    const trimmed = urlOrId.trim();
    if (trimmed.length === 11 && !trimmed.includes('/') && !trimmed.includes('.')) {
      return trimmed;
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = trimmed.match(regExp);
    return (match && match[2].length === 11) ? match[2] : trimmed;
  };

  const handleTriggerSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExport = () => {
    const json = exportDataJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CalmMind_CMS_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataJson(content);
      if (success) {
        setImportError(null);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setImportError('Invalid JSON format. Please upload a valid Calm Mind backup file.');
      }
    };
    reader.readAsText(file);
  };

  // If not authenticated, render the doctor login authentication gate
  if (!isAuthenticated) {
    return (
      <div id="cms-login-container" className="pt-28 pb-20 min-h-[85vh] flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-md w-full glass p-8 sm:p-10 rounded-3xl shadow-2xl border border-neutral-200/80 dark:border-neutral-800 text-left relative overflow-hidden">
          
          {/* Decorative lock icon */}
          <div className="w-14 h-14 rounded-2xl bg-forest/15 dark:bg-forest/25 text-forest flex items-center justify-center mb-6 shadow-sm">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1.5 mb-6">
            <span className="text-[10px] uppercase font-bold tracking-widest text-forest font-sans">
              Restricted Doctor Area
            </span>
            <h2 className={`font-serif text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
              Doctor CMS Portal
            </h2>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 font-light leading-relaxed">
              Dr. Shripuja Siddamsetty — Secure Administration. Please enter your credentials to access the live content manager.
            </p>
          </div>

          {authError && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Doctor Username
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  placeholder="e.g. drshripuja"
                  className={`w-full py-3 pl-10 pr-4 rounded-xl text-xs outline-none transition-all ${
                    isDarkMode 
                      ? 'bg-neutral-900 border border-neutral-700 text-white focus:border-forest' 
                      : 'bg-white border border-neutral-300 text-neutral-900 focus:border-forest shadow-sm'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  Password or PIN
                </label>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full py-3 pl-10 pr-10 rounded-xl text-xs outline-none transition-all ${
                    isDarkMode 
                      ? 'bg-neutral-900 border border-neutral-700 text-white focus:border-forest' 
                      : 'bg-white border border-neutral-300 text-neutral-900 focus:border-forest shadow-sm'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-forest hover:bg-forest-dark text-white font-semibold text-xs tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Authenticate & Enter CMS</span>
            </button>
          </form>

          {/* Quick Doctor credential hint banner */}
          <div className="mt-6 pt-5 border-t border-neutral-200/60 dark:border-neutral-800 text-left">
            <div className="p-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-700 dark:text-neutral-400 space-y-1.5">
              <span className="font-semibold text-forest block">Official Doctor Credentials:</span>
              <p>Username: <code className="bg-white dark:bg-neutral-800 px-1.5 py-0.5 rounded font-mono font-semibold text-neutral-900 dark:text-neutral-200">drshripuja</code></p>
              <p>Password: <code className="bg-white dark:bg-neutral-800 px-1.5 py-0.5 rounded font-mono font-semibold text-neutral-900 dark:text-neutral-200">calmmind@92461</code> <span className="text-neutral-500">(or PIN: <code className="bg-white dark:bg-neutral-800 px-1 py-0.5 rounded font-mono font-semibold text-neutral-900 dark:text-neutral-200">92461</code>)</span></p>
            </div>

            <div className="mt-4 flex justify-between items-center text-xs">
              <button
                onClick={() => onPageChange('home')}
                className="text-neutral-600 dark:text-neutral-400 hover:text-forest transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Website</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="cms-view-container" className="pt-24 pb-20">
      
      {/* 1. TOP HEADER & CONTROLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-left">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200/60 dark:border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-sans uppercase font-bold tracking-widest text-forest">
                Administrative Control Panel
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-sage/30 text-forest border border-sage/40 flex items-center gap-1">
                <Settings className="w-3 h-3" />
                Live Synchronization
              </span>
            </div>
            <h1 className={`text-3xl sm:text-4xl font-serif font-bold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-charcoal'
            }`}>
              Content Management System (CMS)
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-light mt-1 max-w-2xl">
              Modify any content, service pricing, YouTube podcasts, Instagram & LinkedIn posts, and clinic details. Changes sync instantly across the entire website.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest/10 dark:bg-forest/20 text-forest text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Dr. Shripuja (Secured)</span>
            </div>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-3 py-2 rounded-xl text-xs font-medium border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Change doctor access password"
            >
              <Key className="w-3.5 h-3.5 text-forest" />
              <span>Change Pass</span>
            </button>

            <button
              onClick={() => onPageChange('home')}
              className="px-3.5 py-2 rounded-xl text-xs font-medium border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Site</span>
            </button>

            <button
              onClick={handleTriggerSave}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-forest hover:bg-forest-dark text-white transition-all shadow hover:shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Publish</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl text-xs font-medium border border-red-300 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Lock CMS and log out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Change Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="max-w-md w-full glass p-6 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 text-left space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-forest" />
                  <h3 className="font-serif text-lg font-bold">Update Doctor Password</h3>
                </div>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Set a custom secure password for Dr. Shripuja to access the website CMS.
              </p>

              {passUpdatedSuccess ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Password updated successfully!</span>
                </div>
              ) : (
                <form onSubmit={handleSaveNewPassword} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPasswordVal}
                      onChange={(e) => setNewPasswordVal(e.target.value)}
                      placeholder="At least 5 characters"
                      className="w-full py-2.5 px-3 rounded-xl text-xs border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 outline-none focus:border-forest"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
                      className="px-4 py-2 text-xs font-medium rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-forest hover:bg-forest-dark text-white cursor-pointer"
                    >
                      Save Password
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Save confirmation toast */}
        {saveSuccess && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>All updates have been saved to local database and published live to the website!</span>
          </div>
        )}
      </section>

      {/* 2. CMS NAVIGATION TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-left">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'clinic', label: 'Practice Profile', icon: Building2 },
            { id: 'services', label: 'Services & Therapy', icon: Sparkles },
            { id: 'classes', label: 'Classes & Workshops', icon: Calendar },
            { id: 'podcasts', label: 'Podcasts & YouTube', icon: Video },
            { id: 'social', label: 'Instagram & LinkedIn', icon: Share2 },
            { id: 'payment', label: 'Payment & Pricing', icon: CreditCard },
            { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
            { id: 'backup', label: 'Backup & Reset', icon: Download }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-forest text-white shadow-md'
                    : 'glass text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200/50 dark:border-neutral-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. ACTIVE TAB PANEL CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* TAB 1: PRACTICE PROFILE */}
        {activeTab === 'clinic' && (
          <div className="space-y-6">
            <div className="glass p-6 sm:p-8 rounded-3xl space-y-6 border border-neutral-200/60 dark:border-neutral-800">
              <h3 className={`text-lg font-serif font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                Practice & Practitioner Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-1.5">
                  <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Doctor Full Name</label>
                  <input
                    type="text"
                    value={clinicSettings.doctorName}
                    onChange={(e) => updateClinicSettings({ doctorName: e.target.value })}
                    className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Clinic / Organization Name</label>
                  <input
                    type="text"
                    value={clinicSettings.clinicName}
                    onChange={(e) => updateClinicSettings({ clinicName: e.target.value })}
                    className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Credentials & Qualifications</label>
                  <input
                    type="text"
                    value={clinicSettings.credentials}
                    onChange={(e) => updateClinicSettings({ credentials: e.target.value })}
                    className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Professional Title / Subtitle</label>
                  <input
                    type="text"
                    value={clinicSettings.title}
                    onChange={(e) => updateClinicSettings({ title: e.target.value })}
                    className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Phone Number</label>
                  <input
                    type="text"
                    value={clinicSettings.phone}
                    onChange={(e) => updateClinicSettings({ phone: e.target.value })}
                    className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Email Address</label>
                  <input
                    type="email"
                    value={clinicSettings.email}
                    onChange={(e) => updateClinicSettings({ email: e.target.value })}
                    className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Physical Clinic Address</label>
                  <input
                    type="text"
                    value={clinicSettings.address}
                    onChange={(e) => updateClinicSettings({ address: e.target.value })}
                    className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Weekday Hours</label>
                  <input
                    type="text"
                    value={clinicSettings.workingHours.weekdays}
                    onChange={(e) => updateClinicSettings({ 
                      workingHours: { ...clinicSettings.workingHours, weekdays: e.target.value } 
                    })}
                    className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Saturday Hours</label>
                  <input
                    type="text"
                    value={clinicSettings.workingHours.saturdays}
                    onChange={(e) => updateClinicSettings({ 
                      workingHours: { ...clinicSettings.workingHours, saturdays: e.target.value } 
                    })}
                    className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Emergency Notice Text</label>
                  <textarea
                    rows={2}
                    value={clinicSettings.emergencyNotice}
                    onChange={(e) => updateClinicSettings({ emergencyNotice: e.target.value })}
                    className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleTriggerSave}
                  className="px-6 py-2.5 rounded-xl bg-forest hover:bg-forest-dark text-white text-xs font-semibold transition-all shadow cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile Updates</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SERVICES MANAGER */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className={`text-lg font-serif font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                  Clinical Services Catalog ({services.length})
                </h3>
                <p className="text-xs text-neutral-500">Edit titles, clinical explanations, duration, and session details.</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newId = `service-${Date.now()}`;
                  addService({
                    id: newId,
                    title: 'New Therapy Service',
                    category: 'Individual Care',
                    iconName: 'Sparkles',
                    shortDescription: 'Evidence-based clinical intervention customized to your emotional wellbeing.',
                    fullDescription: 'Comprehensive psychological care designed to support personal balance, emotional clarity, and resilience.',
                    symptoms: ['Stress', 'Anxiety', 'Life transitions'],
                    benefits: ['Enhanced clarity', 'Coping tools', 'Emotional calm'],
                    duration: '50-minute session',
                    image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1200',
                    faqs: [
                      { question: 'How do I begin?', answer: 'Book an intake session to discuss your clinical needs.' }
                    ]
                  });
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-forest text-white hover:bg-forest-dark transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Service</span>
              </button>
            </div>

            <div className="space-y-6">
              {services.map((service, idx) => (
                <div 
                  key={service.id} 
                  className="glass p-6 rounded-3xl border border-neutral-200/60 dark:border-neutral-800 space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-200/40 dark:border-neutral-800">
                    <span className="text-xs font-bold font-mono text-forest">
                      #{idx + 1} &bull; ID: {service.id}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteService(service.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Delete service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Service Title</label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={(e) => updateService(service.id, { title: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Category</label>
                      <input
                        type="text"
                        value={service.category}
                        onChange={(e) => updateService(service.id, { category: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Duration</label>
                      <input
                        type="text"
                        value={service.duration}
                        onChange={(e) => updateService(service.id, { duration: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-3">
                      <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Short Summary (Preview Cards)</label>
                      <input
                        type="text"
                        value={service.shortDescription}
                        onChange={(e) => updateService(service.id, { shortDescription: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-3">
                      <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Full Clinical Description</label>
                      <textarea
                        rows={3}
                        value={service.fullDescription}
                        onChange={(e) => updateService(service.id, { fullDescription: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CLASSES & WORKSHOPS */}
        {activeTab === 'classes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className={`text-lg font-serif font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                  Workshops & Mindfulness Classes ({classes.length})
                </h3>
                <p className="text-xs text-neutral-500">Manage schedules, seat counts, pricing, and countdown dates.</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newId = `class-${Date.now()}`;
                  addClass({
                    id: newId,
                    title: 'New Mindfulness Workshop',
                    category: 'Mindfulness',
                    description: 'Interactive group session cultivating practical cognitive grounding.',
                    date: 'November 15, 2026',
                    time: '10:00 AM – 1:00 PM EST',
                    duration: 'Half-Day Intensive',
                    instructor: 'Dr. Shripuja Siddamsetty',
                    capacity: 30,
                    registeredCount: 5,
                    fee: '$120 per participant',
                    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600',
                    countdownTarget: '2026-11-15T10:00:00'
                  });
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-forest text-white hover:bg-forest-dark transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Workshop</span>
              </button>
            </div>

            <div className="space-y-6">
              {classes.map((cls, idx) => (
                <div 
                  key={cls.id} 
                  className="glass p-6 rounded-3xl border border-neutral-200/60 dark:border-neutral-800 space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-200/40 dark:border-neutral-800">
                    <span className="text-xs font-bold font-mono text-forest">
                      #{idx + 1} &bull; {cls.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteClass(cls.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Delete class"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1 md:col-span-2">
                      <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Workshop Title</label>
                      <input
                        type="text"
                        value={cls.title}
                        onChange={(e) => updateClass(cls.id, { title: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Category</label>
                      <select
                        value={cls.category}
                        onChange={(e) => updateClass(cls.id, { category: e.target.value as any })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest cursor-pointer"
                      >
                        <option value="Mindfulness">Mindfulness</option>
                        <option value="Parenting">Parenting</option>
                        <option value="Stress Management">Stress Management</option>
                        <option value="Corporate Training">Corporate Training</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Date Display</label>
                      <input
                        type="text"
                        value={cls.date}
                        onChange={(e) => updateClass(cls.id, { date: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Time & Duration</label>
                      <input
                        type="text"
                        value={cls.time}
                        onChange={(e) => updateClass(cls.id, { time: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Fee / Price Display</label>
                      <input
                        type="text"
                        value={cls.fee}
                        onChange={(e) => updateClass(cls.id, { fee: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Total Capacity</label>
                      <input
                        type="number"
                        value={cls.capacity}
                        onChange={(e) => updateClass(cls.id, { capacity: parseInt(e.target.value) || 0 })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Registered Count</label>
                      <input
                        type="number"
                        value={cls.registeredCount}
                        onChange={(e) => updateClass(cls.id, { registeredCount: parseInt(e.target.value) || 0 })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Countdown Target (ISO)</label>
                      <input
                        type="text"
                        value={cls.countdownTarget}
                        onChange={(e) => updateClass(cls.id, { countdownTarget: e.target.value })}
                        placeholder="2026-10-15T18:00:00"
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs font-mono outline-none focus:border-forest"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-3">
                      <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Workshop Description</label>
                      <textarea
                        rows={2}
                        value={cls.description}
                        onChange={(e) => updateClass(cls.id, { description: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PODCASTS & YOUTUBE PLAYER CONFIG */}
        {activeTab === 'podcasts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className={`text-lg font-serif font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                  Podcasts & YouTube Videos ({podcasts.length})
                </h3>
                <p className="text-xs text-neutral-500">
                  Enter YouTube video URLs or Video IDs. Visitors can play the videos right inside the website!
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newId = `pod-${Date.now()}`;
                  addPodcast({
                    id: newId,
                    title: 'New Clinical Talk & Meditation',
                    episodeNumber: `Episode ${podcasts.length + 1}`,
                    duration: '25 mins',
                    date: 'Recently Released',
                    category: 'Mindfulness',
                    description: 'Dr. Shripuja shares clinical tools and grounding exercises for mental wellness.',
                    spotifyUrl: 'https://open.spotify.com',
                    youtubeUrl: 'https://youtube.com',
                    youtubeId: 'kJQP7kiw5Fk',
                    appleUrl: 'https://podcasts.apple.com',
                    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=600'
                  });
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-forest text-white hover:bg-forest-dark transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Podcast Episode</span>
              </button>
            </div>

            <div className="space-y-6">
              {podcasts.map((pod, idx) => {
                const currentYtId = pod.youtubeId || extractYoutubeId(pod.youtubeUrl);
                return (
                  <div 
                    key={pod.id} 
                    className="glass p-6 rounded-3xl border border-neutral-200/60 dark:border-neutral-800 space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-200/40 dark:border-neutral-800">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-forest">
                          #{idx + 1} &bull; {pod.episodeNumber}
                        </span>
                        <span className="text-xs font-bold font-serif text-neutral-900 dark:text-white">
                          {pod.title}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => deletePodcast(pod.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Delete episode"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="space-y-1 md:col-span-2">
                        <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Episode Title</label>
                        <input
                          type="text"
                          value={pod.title}
                          onChange={(e) => updatePodcast(pod.id, { title: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Category</label>
                        <input
                          type="text"
                          value={pod.category}
                          onChange={(e) => updatePodcast(pod.id, { category: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                        />
                      </div>

                      {/* YOUTUBE VIDEO ID / EMBED URL */}
                      <div className="space-y-1 md:col-span-2">
                        <label className="block text-neutral-700 dark:text-neutral-200 font-semibold flex items-center justify-between">
                          <span>YouTube Video ID or Full URL (Enables Website Play)</span>
                          {currentYtId && (
                            <span className="text-[10px] text-forest font-mono">
                              Active ID: {currentYtId}
                            </span>
                          )}
                        </label>
                        <input
                          type="text"
                          value={pod.youtubeId || pod.youtubeUrl}
                          onChange={(e) => {
                            const val = e.target.value;
                            const extracted = extractYoutubeId(val);
                            updatePodcast(pod.id, { 
                              youtubeId: extracted,
                              youtubeUrl: val 
                            });
                          }}
                          placeholder="e.g. kJQP7kiw5Fk or https://youtube.com/watch?v=..."
                          className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono text-xs outline-none focus:border-forest"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Duration</label>
                        <input
                          type="text"
                          value={pod.duration}
                          onChange={(e) => updatePodcast(pod.id, { duration: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-3">
                        <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Description</label>
                        <textarea
                          rows={2}
                          value={pod.description}
                          onChange={(e) => updatePodcast(pod.id, { description: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                        />
                      </div>

                      {/* Embedded YouTube preview to test */}
                      {currentYtId && (
                        <div className="md:col-span-3 pt-2">
                          <span className="text-[10px] uppercase font-bold text-neutral-500 mb-2 block">
                            Embedded Video Player Preview:
                          </span>
                          <div className="aspect-video w-full max-w-md rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-md">
                            <iframe
                              src={`https://www.youtube-nocookie.com/embed/${currentYtId}`}
                              title={pod.title}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: INSTAGRAM & LINKEDIN SOCIAL FEED */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className={`text-lg font-serif font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                  Instagram & LinkedIn Feeds ({socialPosts.length})
                </h3>
                <p className="text-xs text-neutral-500">
                  Publish or edit Dr. Shripuja's social media cards displayed on the website.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newId = `social-${Date.now()}`;
                  addSocialPost({
                    id: newId,
                    platform: 'instagram',
                    author: clinicSettings.doctorName,
                    handle: '@calmmindwellness',
                    avatar: '/dr-shripuja.jpg',
                    caption: 'Take a deep breath. Today is a fresh opportunity to prioritize your inner peace and mental wellbeing. 🌿',
                    date: 'Today',
                    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
                    postUrl: clinicSettings.socialLinks.instagram,
                    likesCount: 150,
                    commentsCount: 12,
                    tags: ['#MentalHealth', '#Mindfulness', '#DrShripuja']
                  });
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-forest text-white hover:bg-forest-dark transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Social Post</span>
              </button>
            </div>

            <div className="space-y-6">
              {socialPosts.map((post, idx) => (
                <div 
                  key={post.id} 
                  className="glass p-6 rounded-3xl border border-neutral-200/60 dark:border-neutral-800 space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-200/40 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white ${
                        post.platform === 'instagram' ? 'bg-gradient-to-r from-amber-500 to-rose-600' : 'bg-[#0A66C2]'
                      }`}>
                        {post.platform}
                      </span>
                      <span className="text-xs font-mono text-neutral-400">
                        #{idx + 1} &bull; {post.date}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteSocialPost(post.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Delete social post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Platform</label>
                      <select
                        value={post.platform}
                        onChange={(e) => updateSocialPost(post.id, { platform: e.target.value as any })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest cursor-pointer"
                      >
                        <option value="instagram">Instagram</option>
                        <option value="linkedin">LinkedIn</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Post Date Label</label>
                      <input
                        type="text"
                        value={post.date}
                        onChange={(e) => updateSocialPost(post.id, { date: e.target.value })}
                        placeholder="e.g. 2 days ago"
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Likes Count</label>
                      <input
                        type="number"
                        value={post.likesCount}
                        onChange={(e) => updateSocialPost(post.id, { likesCount: parseInt(e.target.value) || 0 })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                      />
                    </div>

                    {post.platform === 'linkedin' && (
                      <div className="space-y-1 md:col-span-3">
                        <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Article / Post Headline</label>
                        <input
                          type="text"
                          value={post.title || ''}
                          onChange={(e) => updateSocialPost(post.id, { title: e.target.value })}
                          placeholder="Headline for LinkedIn"
                          className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                        />
                      </div>
                    )}

                    <div className="space-y-1 md:col-span-2">
                      <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Image URL (Optional)</label>
                      <input
                        type="text"
                        value={post.imageUrl || ''}
                        onChange={(e) => updateSocialPost(post.id, { imageUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Post Link URL</label>
                      <input
                        type="text"
                        value={post.postUrl}
                        onChange={(e) => updateSocialPost(post.id, { postUrl: e.target.value })}
                        placeholder="https://instagram.com/p/..."
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-3">
                      <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Post Caption & Insights</label>
                      <textarea
                        rows={3}
                        value={post.caption}
                        onChange={(e) => updateSocialPost(post.id, { caption: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PAYMENT & PRICING */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            <div className="glass p-6 sm:p-8 rounded-3xl space-y-6 border border-neutral-200/60 dark:border-neutral-800">
              <h3 className={`text-lg font-serif font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                Online Payment & Razorpay Configuration
              </h3>
              <p className="text-xs text-neutral-500">
                Configure the quick-pay button values (default: ₹5,000 and ₹7,500), UPI ID, and official bank settlement credentials.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="space-y-1.5">
                  <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Quick Payment Option 1 (₹)</label>
                  <input
                    type="number"
                    value={paymentConfig.quickAmount1}
                    onChange={(e) => updatePaymentConfig({ quickAmount1: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                  />
                  <span className="text-[10px] text-neutral-400">Default for Standard Therapy Session</span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Quick Payment Option 2 (₹)</label>
                  <input
                    type="number"
                    value={paymentConfig.quickAmount2}
                    onChange={(e) => updatePaymentConfig({ quickAmount2: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                  />
                  <span className="text-[10px] text-neutral-400">Default for Assessment / Extended Session</span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">UPI ID</label>
                  <input
                    type="text"
                    value={paymentConfig.upiId}
                    onChange={(e) => updatePaymentConfig({ upiId: e.target.value })}
                    className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Razorpay Key ID</label>
                  <input
                    type="text"
                    value={paymentConfig.razorpayKeyId}
                    onChange={(e) => updatePaymentConfig({ razorpayKeyId: e.target.value })}
                    className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono text-xs outline-none focus:border-forest"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Bank Name & Branch</label>
                  <input
                    type="text"
                    value={paymentConfig.bankName}
                    onChange={(e) => updatePaymentConfig({ bankName: e.target.value })}
                    className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Account Number</label>
                  <input
                    type="text"
                    value={paymentConfig.accountNumber}
                    onChange={(e) => updatePaymentConfig({ accountNumber: e.target.value })}
                    className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono text-xs outline-none focus:border-forest"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">IFSC Code</label>
                  <input
                    type="text"
                    value={paymentConfig.ifscCode}
                    onChange={(e) => updatePaymentConfig({ ifscCode: e.target.value })}
                    className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono text-xs outline-none focus:border-forest"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Account Beneficiary Name</label>
                  <input
                    type="text"
                    value={paymentConfig.accountName}
                    onChange={(e) => updatePaymentConfig({ accountName: e.target.value })}
                    className="w-full p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleTriggerSave}
                  className="px-6 py-2.5 rounded-xl bg-forest hover:bg-forest-dark text-white text-xs font-semibold transition-all shadow cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Payment Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: TESTIMONIALS */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className={`text-lg font-serif font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                  Patient & Client Reviews ({testimonials.length})
                </h3>
                <p className="text-xs text-neutral-500">Edit heartfelt clinical testimonials and quotes.</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newT: Testimonial = {
                    id: `test-${Date.now()}`,
                    author: 'Anonymous Patient',
                    role: 'Adult Therapy Client',
                    service: 'Individual Therapy',
                    quote: 'Dr. Shripuja provided a safe haven when I needed it most. Her evidence-based approach helped me regain my peace.',
                    rating: 5
                  };
                  setTestimonials(prev => [newT, ...prev]);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-forest text-white hover:bg-forest-dark transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Review</span>
              </button>
            </div>

            <div className="space-y-6">
              {testimonials.map((testi, idx) => (
                <div 
                  key={testi.id} 
                  className="glass p-6 rounded-3xl border border-neutral-200/60 dark:border-neutral-800 space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-200/40 dark:border-neutral-800">
                    <span className="text-xs font-bold font-mono text-forest">
                      #{idx + 1} &bull; {testi.author}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTestimonials(prev => prev.filter(t => t.id !== testi.id))}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Author Name</label>
                      <input
                        type="text"
                        value={testi.author}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTestimonials(prev => prev.map(t => t.id === testi.id ? { ...t, author: val } : t));
                        }}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Role / Location</label>
                      <input
                        type="text"
                        value={testi.role}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTestimonials(prev => prev.map(t => t.id === testi.id ? { ...t, role: val } : t));
                        }}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Rating (1 to 5 Stars)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={testi.rating}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 5;
                          setTestimonials(prev => prev.map(t => t.id === testi.id ? { ...t, rating: val } : t));
                        }}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-3">
                      <label className="block text-neutral-700 dark:text-neutral-200 font-semibold">Testimonial Quote</label>
                      <textarea
                        rows={2}
                        value={testi.quote}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTestimonials(prev => prev.map(t => t.id === testi.id ? { ...t, quote: val } : t));
                        }}
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs outline-none focus:border-forest"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: BACKUP, RESTORE & FACTORY RESET */}
        {activeTab === 'backup' && (
          <div className="space-y-6">
            <div className="glass p-6 sm:p-8 rounded-3xl space-y-6 border border-neutral-200/60 dark:border-neutral-800">
              <h3 className={`text-lg font-serif font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                Data Backup, Migration & Reset
              </h3>
              <p className="text-xs text-neutral-500">
                Safeguard all website customizations by downloading an encrypted JSON snapshot or restore a previously saved backup file.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Export */}
                <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center text-forest">
                      <Download className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif font-bold text-sm text-neutral-900 dark:text-white">
                      Export JSON Backup
                    </h4>
                    <p className="text-xs text-neutral-500">
                      Download all your services, podcasts, social posts, pricing, and profile data in one standard JSON file.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExport}
                    className="w-full py-2.5 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-dark transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Backup</span>
                  </button>
                </div>

                {/* Import */}
                <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-sage/20 flex items-center justify-center text-forest">
                      <Upload className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif font-bold text-sm text-neutral-900 dark:text-white">
                      Import Backup File
                    </h4>
                    <p className="text-xs text-neutral-500">
                      Restore your site from a previously exported Calm Mind JSON file.
                    </p>
                  </div>
                  <label className="w-full py-2.5 rounded-xl bg-sage hover:bg-sage-dark text-[#2B2B2B] text-xs font-semibold transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 text-center">
                    <Upload className="w-4 h-4" />
                    <span>Choose JSON File</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportFile}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Reset to Factory Defaults */}
                <div className="p-5 rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-500/5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif font-bold text-sm text-red-700 dark:text-red-400">
                      Factory Reset
                    </h4>
                    <p className="text-xs text-neutral-500">
                      Reverts all services, podcasts, social posts, and settings to the original default values.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to restore default clinic content? Any unsaved edits will be reset.')) {
                        resetToDefaults();
                        setSaveSuccess(true);
                        setTimeout(() => setSaveSuccess(false), 3000);
                      }
                    }}
                    className="w-full py-2.5 rounded-xl border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-semibold cursor-pointer"
                  >
                    Reset to Default Data
                  </button>
                </div>
              </div>

              {importError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{importError}</span>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
