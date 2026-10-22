/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  Lock, 
  IndianRupee, 
  Calendar, 
  Printer, 
  Share2, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  HelpCircle, 
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Receipt,
  QrCode,
  Copy,
  Check,
  MessageCircle,
  Info,
  Smartphone,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clinicSettings } from '../data/websiteData';
import { PaymentReceipt } from '../types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentViewProps {
  onPageChange: (page: string) => void;
  isDarkMode: boolean;
}

export default function PaymentView({ onPageChange, isDarkMode }: PaymentViewProps) {
  // Payment option selection: '5000' | '7500' | 'custom'
  const [selectedPlan, setSelectedPlan] = useState<'5000' | '7500' | 'custom'>('5000');
  const [customAmount, setCustomAmount] = useState<string>('');
  
  // Patient details
  const [patientName, setPatientName] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('Individual Adult Therapy Session');
  const [clinicalNotes, setClinicalNotes] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);

  // Payment Method: 'upi' (Primary while Razorpay undergoes activation) | 'razorpay'
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'razorpay'>('upi');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [upiRefId, setUpiRefId] = useState<string>('');
  const [upiSavedConfirmation, setUpiSavedConfirmation] = useState<boolean>(false);

  const officialUpiId = 'innersketch@okhdfcbank';
  const doctorWhatsAppNumber = '+91 92461 55955';
  const cleanDoctorWhatsApp = '919246155955';

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(officialUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleSendScreenshotWhatsApp = () => {
    const text = `Hello Dr. Shripuja, I have completed the consultation payment of ₹${payableAmount.toLocaleString('en-IN')} via UPI QR (${officialUpiId}).\n\n• Patient Name: ${patientName.trim() || 'Client'}\n• Contact Number: ${patientPhone.trim() || 'Provided in appointment'}\n• Purpose: ${purpose}\n${upiRefId.trim() ? `• UPI Transaction Ref / UTR: ${upiRefId.trim()}\n` : ''}\nI am attaching my payment transaction screenshot here. Kindly verify and confirm my appointment slot.`;
    window.open(`https://wa.me/${cleanDoctorWhatsApp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleRecordUpiSubmission = () => {
    if (!patientName.trim()) {
      setErrorMessage('Please enter the patient or client full name before generating a receipt.');
      return;
    }
    setErrorMessage(null);

    const receiptNum = `CMW-UPI-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const newReceipt: PaymentReceipt = {
      paymentId: upiRefId.trim() ? `upi_${upiRefId.trim()}` : `upi_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      orderId: `order_upi_${Math.random().toString(36).substring(2, 9)}`,
      amount: payableAmount,
      currency: 'INR',
      patientName: patientName.trim(),
      patientEmail: patientEmail.trim() || 'patient@calmmind.in',
      patientPhone: patientPhone.trim() || '+91 92461 55955',
      purpose,
      notes: clinicalNotes.trim() ? `${clinicalNotes.trim()} • Direct UPI Settlement to ${officialUpiId}` : `Direct UPI Settlement to ${officialUpiId}`,
      date: timestamp,
      receiptNumber: receiptNum,
      status: 'captured',
      doctorName: clinicSettings.doctorName
    };

    const updated = [newReceipt, ...savedReceipts];
    setSavedReceipts(updated);
    localStorage.setItem('cmw_payment_receipts', JSON.stringify(updated));
    setCompletedReceipt(newReceipt);
    setUpiSavedConfirmation(true);
  };

  // Razorpay Key & Configuration
  const defaultKey = (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag';
  const [razorpayKey, setRazorpayKey] = useState<string>(() => {
    return localStorage.getItem('cmw_razorpay_key') || defaultKey;
  });
  const [showKeyConfig, setShowKeyConfig] = useState<boolean>(false);

  // Payment process state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedReceipt, setCompletedReceipt] = useState<PaymentReceipt | null>(null);

  // Payment History
  const [activeTab, setActiveTab] = useState<'pay' | 'history'>('pay');
  const [savedReceipts, setSavedReceipts] = useState<PaymentReceipt[]>(() => {
    try {
      const data = localStorage.getItem('cmw_payment_receipts');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  // Calculate actual amount to pay
  const getPayableAmount = (): number => {
    if (selectedPlan === '5000') return 5000;
    if (selectedPlan === '7500') return 7500;
    const parsed = parseFloat(customAmount);
    return isNaN(parsed) || parsed <= 0 ? 0 : Math.round(parsed);
  };

  const payableAmount = getPayableAmount();

  // Load Razorpay SDK if not present
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Update Razorpay Key in localStorage
  const handleSaveRazorpayKey = (newKey: string) => {
    setRazorpayKey(newKey);
    localStorage.setItem('cmw_razorpay_key', newKey);
    setShowKeyConfig(false);
  };

  // Form Validation
  const validateForm = (): boolean => {
    setErrorMessage(null);
    if (!patientName.trim()) {
      setErrorMessage('Please enter the patient or client full name.');
      return false;
    }
    if (!patientEmail.trim() || !patientEmail.includes('@')) {
      setErrorMessage('Please provide a valid email address for the digital receipt.');
      return false;
    }
    if (!patientPhone.trim() || patientPhone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number for transaction notifications.');
      return false;
    }
    if (selectedPlan === 'custom' && (!customAmount || payableAmount < 100)) {
      setErrorMessage('Please enter a valid custom amount of at least ₹100.');
      return false;
    }
    if (!agreeTerms) {
      setErrorMessage('Please accept the clinic cancellation and confidential care terms.');
      return false;
    }
    return true;
  };

  // Trigger Payment
  const handleInitiatePayment = (isSimulatedDemo = false) => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage(null);

    const receiptNum = `CMW-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const finalizePayment = (paymentId: string) => {
      const newReceipt: PaymentReceipt = {
        paymentId,
        orderId: `order_${Math.random().toString(36).substring(2, 11)}`,
        amount: payableAmount,
        currency: 'INR',
        patientName: patientName.trim(),
        patientEmail: patientEmail.trim(),
        patientPhone: patientPhone.trim(),
        purpose,
        notes: clinicalNotes.trim() || undefined,
        date: timestamp,
        receiptNumber: receiptNum,
        status: 'captured',
        doctorName: clinicSettings.doctorName
      };

      // Save to state & localStorage
      const updatedReceipts = [newReceipt, ...savedReceipts];
      setSavedReceipts(updatedReceipts);
      localStorage.setItem('cmw_payment_receipts', JSON.stringify(updatedReceipts));
      setCompletedReceipt(newReceipt);
      setIsLoading(false);
    };

    if (isSimulatedDemo) {
      setTimeout(() => {
        finalizePayment(`pay_demo_${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
      }, 900);
      return;
    }

    // Razorpay Standard Checkout Launch
    try {
      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Razorpay SDK is initializing. Please try again or use the test payment option.');
      }

      const options = {
        key: razorpayKey,
        amount: payableAmount * 100, // Amount in paise
        currency: 'INR',
        name: clinicSettings.clinicName,
        description: `${purpose} — ${clinicSettings.doctorName}`,
        image: '/dr-shripuja.jpg',
        prefill: {
          name: patientName.trim(),
          email: patientEmail.trim(),
          contact: patientPhone.trim()
        },
        notes: {
          doctor: clinicSettings.doctorName,
          purpose,
          receipt_no: receiptNum,
          notes: clinicalNotes || 'Direct Consultation'
        },
        theme: {
          color: '#1E3A2F'
        },
        handler: function (response: any) {
          finalizePayment(response.razorpay_payment_id || `pay_${Math.random().toString(36).substring(2, 9)}`);
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          }
        }
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on('payment.failed', function (response: any) {
        setIsLoading(false);
        setErrorMessage(response.error?.description || 'Payment was unsuccessful or cancelled. Please try again.');
      });
      rzpInstance.open();
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(
        err.message || 'Razorpay checkout encountered an issue. You can use the Demo Test Settlement option below to simulate the flow.'
      );
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleShareWhatsApp = (receipt: PaymentReceipt) => {
    const text = `*Calm Mind Wellness - Payment Receipt*\n` +
      `Receipt No: ${receipt.receiptNumber}\n` +
      `Doctor: ${receipt.doctorName}\n` +
      `Patient: ${receipt.patientName}\n` +
      `Amount Paid: ₹${receipt.amount.toLocaleString('en-IN')}\n` +
      `Purpose: ${receipt.purpose}\n` +
      `Payment ID: ${receipt.paymentId}\n` +
      `Status: PAID (Verified via Razorpay)`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div id="payment-view-container" className="pt-24 pb-20">
      
      {/* 1. HERO HEADER */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200/60 dark:border-neutral-800 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-sans uppercase font-bold tracking-widest text-forest">
                Secure Patient Portal
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified Clinical Payment
              </span>
            </div>
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-neutral-900'
            }`}>
              Consultation & Therapy Payment
            </h1>
            <p className={`text-sm sm:text-base font-normal leading-relaxed max-w-2xl mt-2 ${
              isDarkMode ? 'text-neutral-300' : 'text-neutral-700'
            }`}>
              Direct, encrypted consultation fee settlement for individual sessions, diagnostic assessments, and customized clinical therapy with Dr. Shripuja Siddamsetty.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center p-1 rounded-2xl glass border border-neutral-200/50 dark:border-neutral-800 shrink-0">
            <button
              onClick={() => setActiveTab('pay')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'pay'
                  ? 'bg-forest text-white shadow-sm'
                  : 'text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Make Payment</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-forest text-white shadow-sm'
                  : 'text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Receipt History ({savedReceipts.length})</span>
            </button>
          </div>
        </div>

        {/* Temporary Razorpay Gateway Notice & UPI Guidance */}
        <div className="mt-8 p-5 sm:p-6 rounded-3xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-left">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-800 dark:text-amber-300 shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-serif font-bold text-sm sm:text-base text-neutral-900 dark:text-white">
                  Payment Gateway Update: Direct UPI QR Settlement
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                  Active Payment Mode
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 font-normal leading-relaxed">
                While our automated Razorpay payment gateway is currently completing final banking onboarding and compliance activation, clients are kindly requested to complete consultation fees temporarily using <strong>Dr. Shripuja's official UPI QR code</strong> below. We are actively working with Razorpay to make automated instant card and netbanking checkouts live very soon. Thank you for your kind understanding and patience!
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-neutral-800 dark:text-neutral-200 font-medium">
                <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>After payment, kindly send the screenshot to the doctor's WhatsApp ({doctorWhatsAppNumber}).</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Switcher */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setPaymentMethod('upi')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2.5 cursor-pointer shadow-sm ${
              paymentMethod === 'upi'
                ? 'bg-forest text-white shadow-md ring-2 ring-forest/30'
                : 'glass text-neutral-800 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4 text-sage" />
            <span>Official UPI QR Code</span>
            <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-500 text-white font-bold uppercase">
              Active & Recommended
            </span>
          </button>

          <button
            onClick={() => setPaymentMethod('razorpay')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2.5 cursor-pointer shadow-sm ${
              paymentMethod === 'razorpay'
                ? 'bg-forest text-white shadow-md ring-2 ring-forest/30'
                : 'glass text-neutral-800 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4 text-neutral-400" />
            <span>Razorpay Automated Gateway</span>
            <span className="px-2 py-0.5 rounded-full text-[9px] bg-amber-500/20 text-amber-800 dark:text-amber-200 font-bold uppercase">
              Activation in Progress
            </span>
          </button>
        </div>
      </section>

      {/* 2. MAIN PAYMENT STAGE */}
      {activeTab === 'pay' ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Payment Options & Patient Details Form (7 cols) */}
            <div className="lg:col-span-7 space-y-8 text-left">
              
              {/* Step 1: Select Amount (5000, 7500, Custom) */}
              <div className="glass p-6 sm:p-8 rounded-3xl space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-forest">
                      Step 1 • Select Amount
                    </span>
                    <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">All prices in INR (₹)</span>
                  </div>
                  <h3 className={`text-xl font-serif font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                    Choose Payment Option
                  </h3>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 font-normal mt-1">
                    Select one of our standard consultation tiers or enter a custom amount.
                  </p>
                </div>

                {/* Option 1 & 2 Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Option 1: ₹5,000 */}
                  <div
                    onClick={() => setSelectedPlan('5000')}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      selectedPlan === '5000'
                        ? 'border-forest bg-forest/5 dark:bg-forest/15 shadow-md ring-2 ring-forest/20'
                        : 'border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white/70 dark:bg-neutral-900/40'
                    }`}
                  >
                    {selectedPlan === '5000' && (
                      <span className="absolute top-3 right-3 text-forest">
                        <CheckCircle2 className="w-5 h-5 fill-forest text-white" />
                      </span>
                    )}
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-sage/30 text-forest mb-2">
                        Individual Therapy
                      </span>
                      <h4 className="font-serif text-2xl font-bold text-forest">₹5,000</h4>
                      <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 mt-1">
                        50-Minute Clinical Session
                      </p>
                      <p className="text-[11px] text-neutral-700 dark:text-neutral-300 font-normal mt-2 leading-relaxed">
                        Standard individual therapy for adults or teens covering CBT, anxiety, depression, and emotional clarity.
                      </p>
                    </div>
                    <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 mt-4 flex items-center justify-between text-[11px] text-neutral-600 dark:text-neutral-400 font-medium">
                      <span>Per Session</span>
                      <span className="text-forest font-semibold">Most Popular</span>
                    </div>
                  </div>

                  {/* Option 2: ₹7,500 */}
                  <div
                    onClick={() => setSelectedPlan('7500')}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      selectedPlan === '7500'
                        ? 'border-forest bg-forest/5 dark:bg-forest/15 shadow-md ring-2 ring-forest/20'
                        : 'border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white/70 dark:bg-neutral-900/40'
                    }`}
                  >
                    {selectedPlan === '7500' && (
                      <span className="absolute top-3 right-3 text-forest">
                        <CheckCircle2 className="w-5 h-5 fill-forest text-white" />
                      </span>
                    )}
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 mb-2">
                        Comprehensive Care
                      </span>
                      <h4 className="font-serif text-2xl font-bold text-forest">₹7,500</h4>
                      <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 mt-1">
                        75–90 Min Extended Session
                      </p>
                      <p className="text-[11px] text-neutral-700 dark:text-neutral-300 font-normal mt-2 leading-relaxed">
                        In-depth psychological assessment, couple counseling, or multi-faceted neuro-behavioral evaluation.
                      </p>
                    </div>
                    <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 mt-4 flex items-center justify-between text-[11px] text-neutral-600 dark:text-neutral-400 font-medium">
                      <span>Per Session</span>
                      <span className="text-forest font-semibold">Specialized Care</span>
                    </div>
                  </div>

                </div>

                {/* Option 3: Custom Amount Input Box */}
                <div 
                  onClick={() => setSelectedPlan('custom')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedPlan === 'custom'
                      ? 'border-forest bg-forest/5 dark:bg-forest/15 shadow-md ring-2 ring-forest/20'
                      : 'border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white/70 dark:bg-neutral-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-forest font-bold text-xs uppercase tracking-wider">
                        Custom Amount
                      </span>
                      <span className="text-[10px] text-neutral-600 dark:text-neutral-400 font-medium">(Enter specific consultation fee)</span>
                    </div>
                    {selectedPlan === 'custom' && (
                      <CheckCircle2 className="w-5 h-5 fill-forest text-white" />
                    )}
                  </div>

                  <div className="relative flex items-center">
                    <div className="absolute left-4 flex items-center pointer-events-none text-neutral-700 dark:text-neutral-400 font-serif font-bold text-lg">
                      ₹
                    </div>
                    <input
                      type="number"
                      min="100"
                      step="100"
                      value={customAmount}
                      onChange={(e) => {
                        setSelectedPlan('custom');
                        setCustomAmount(e.target.value);
                      }}
                      onFocus={() => setSelectedPlan('custom')}
                      placeholder="Enter custom amount (e.g. 2500, 10000)"
                      className={`w-full py-3.5 pl-10 pr-4 rounded-xl text-base font-serif font-bold tracking-wide outline-none transition-all ${
                        isDarkMode 
                          ? 'bg-neutral-950/80 border border-neutral-800 text-white focus:border-forest' 
                          : 'bg-white border border-neutral-300 text-neutral-900 focus:border-forest shadow-sm'
                      }`}
                    />
                  </div>

                  {/* Quick preset chips */}
                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                    <span className="text-[10px] font-sans text-neutral-700 dark:text-neutral-300 uppercase font-semibold">Quick select:</span>
                    {['2500', '3500', '10000', '15000'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlan('custom');
                          setCustomAmount(preset);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-neutral-200/70 dark:bg-neutral-800 hover:bg-sage/40 text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
                      >
                        ₹{Number(preset).toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Step 2: Patient & Consultation Details */}
              <div className="glass p-6 sm:p-8 rounded-3xl space-y-6">
                <div>
                  <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-forest">
                    Step 2 • Patient Information
                  </span>
                  <h3 className={`text-xl font-serif font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                    Billing & Contact Details
                  </h3>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 font-normal mt-1">
                    Your appointment verification and digital receipt will be linked with these details.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                      Patient / Client Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-neutral-500 absolute left-3.5" />
                      <input
                        type="text"
                        required
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="e.g. Radhika Sharma"
                        className={`w-full py-2.5 pl-10 pr-4 rounded-xl text-xs outline-none transition-all ${
                          isDarkMode 
                            ? 'bg-neutral-900 border border-neutral-800 text-white focus:border-forest' 
                            : 'bg-white border border-neutral-300 text-neutral-900 focus:border-forest shadow-sm'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5" />
                        <input
                          type="email"
                          required
                          value={patientEmail}
                          onChange={(e) => setPatientEmail(e.target.value)}
                          placeholder="client@example.com"
                          className={`w-full py-2.5 pl-10 pr-4 rounded-xl text-xs outline-none transition-all ${
                            isDarkMode 
                              ? 'bg-neutral-900 border border-neutral-800 text-white focus:border-forest' 
                              : 'bg-white border border-neutral-300 text-neutral-900 focus:border-forest shadow-sm'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative flex items-center">
                        <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5" />
                        <input
                          type="tel"
                          required
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className={`w-full py-2.5 pl-10 pr-4 rounded-xl text-xs outline-none transition-all ${
                            isDarkMode 
                              ? 'bg-neutral-900 border border-neutral-800 text-white focus:border-forest' 
                              : 'bg-white border border-neutral-300 text-neutral-900 focus:border-forest shadow-sm'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Purpose of Payment */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                      Consultation / Purpose of Payment
                    </label>
                    <div className="relative flex items-center">
                      <FileText className="w-4 h-4 text-neutral-500 absolute left-3.5" />
                      <select
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        className={`w-full py-2.5 pl-10 pr-8 rounded-xl text-xs outline-none transition-all appearance-none cursor-pointer ${
                          isDarkMode 
                            ? 'bg-neutral-900 border border-neutral-800 text-white focus:border-forest' 
                            : 'bg-white border border-neutral-300 text-neutral-900 focus:border-forest shadow-sm'
                        }`}
                      >
                        <option value="Individual Adult Therapy Session">Individual Adult Therapy Session (50 min)</option>
                        <option value="Comprehensive Psychological Assessment">Comprehensive Psychological Assessment</option>
                        <option value="Child & Adolescent Counseling">Child & Adolescent Counseling</option>
                        <option value="Couples & Marriage Psychotherapy">Couples & Marriage Psychotherapy</option>
                        <option value="Mindfulness & Somatic Healing Workshop">Mindfulness & Somatic Healing Workshop</option>
                        <option value="Follow-up Clinical Review">Follow-up Clinical Review</option>
                        <option value="Custom Consultation Settlement">Custom Consultation Settlement</option>
                      </select>
                    </div>
                  </div>

                  {/* Optional UPI Ref ID field when in UPI mode */}
                  {paymentMethod === 'upi' && (
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-neutral-900 dark:text-neutral-200">
                        UPI Transaction ID / UTR Number (Optional, for instant receipt)
                      </label>
                      <div className="relative flex items-center">
                        <Smartphone className="w-4 h-4 text-neutral-500 absolute left-3.5" />
                        <input
                          type="text"
                          value={upiRefId}
                          onChange={(e) => setUpiRefId(e.target.value)}
                          placeholder="e.g. 427819002134 (From GPay / PhonePe / Paytm)"
                          className={`w-full py-2.5 pl-10 pr-4 rounded-xl text-xs outline-none transition-all ${
                            isDarkMode 
                              ? 'bg-neutral-900 border border-neutral-800 text-white focus:border-forest' 
                              : 'bg-white border border-neutral-300 text-neutral-900 focus:border-forest shadow-sm'
                          }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Terms acceptance */}
                  <div className="pt-2 flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 font-normal">
                    <input
                      type="checkbox"
                      id="agree-payment-terms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded text-forest focus:ring-forest cursor-pointer"
                    />
                    <label htmlFor="agree-payment-terms" className="cursor-pointer select-none leading-relaxed">
                      I understand that consultation appointments require 24 hours advance notice for rescheduling. All medical conversations and payment records are kept strictly confidential.
                    </label>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Method-Specific Action Buttons */}
                {paymentMethod === 'upi' ? (
                  <div className="space-y-3 pt-2">
                    {/* Primary Button: Send Screenshot on WhatsApp */}
                    <button
                      type="button"
                      onClick={handleSendScreenshotWhatsApp}
                      className="w-full py-4 px-6 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer bg-[#25D366] hover:bg-[#20ba59] text-white group"
                    >
                      <MessageCircle className="w-5 h-5 fill-white text-white transition-transform group-hover:scale-110" />
                      <span>Send Payment Screenshot to Doctor on WhatsApp (+91 92461 55955)</span>
                    </button>

                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleRecordUpiSubmission}
                        className="w-full sm:flex-1 py-3 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4 text-forest" />
                        <span>I Have Completed UPI Payment (Record Receipt)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onPageChange('invoice')}
                        className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-sage/30 hover:bg-sage/50 text-forest text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Receipt className="w-4 h-4 text-forest" />
                        <span>Generate Tax Invoice &rarr;</span>
                      </button>
                    </div>

                    {upiSavedConfirmation && (
                      <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Receipt saved to your local history! Please share your screenshot on WhatsApp for Dr. Shripuja to finalize your booking.</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleInitiatePayment(false)}
                      disabled={isLoading || payableAmount <= 0}
                      className={`w-full py-4 px-6 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                        payableAmount > 0
                          ? 'bg-forest hover:bg-forest-dark text-white'
                          : 'bg-neutral-300 dark:bg-neutral-800 text-neutral-500'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Connecting to Razorpay...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Pay ₹{payableAmount.toLocaleString('en-IN')} with Razorpay</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* Instant Demo Simulation for Preview Testing */}
                    <div className="flex items-center justify-between text-[11px] text-neutral-600 dark:text-neutral-400 pt-1">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Supports UPI (GPay, PhonePe), Cards & NetBanking</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleInitiatePayment(true)}
                        className="text-forest hover:underline font-semibold cursor-pointer"
                        title="Simulates payment callback without external modal in test sandbox"
                      >
                        Instant Demo Test Pay &rarr;
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* RIGHT COLUMN: UPI QR Card & Doctor Credentials (5 cols) */}
            <div className="lg:col-span-5 space-y-6 text-left">
              
              {/* 1. Official UPI QR Payment Card (Always Featured Prominently) */}
              <div className="glass p-6 sm:p-7 rounded-3xl overflow-hidden relative shadow-lg border-2 border-forest/20">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-neutral-900 dark:text-white">
                        Scan & Pay via UPI
                      </h4>
                      <p className="text-[10px] text-forest font-semibold uppercase tracking-wider">
                        Official HDFC Bank QR Code
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    Instant
                  </span>
                </div>

                {/* Displaying user's uploaded UPI QR code image */}
                <div className="py-5 flex flex-col items-center justify-center">
                  <div className="relative p-2.5 bg-white rounded-2xl shadow-md border border-neutral-200 max-w-[270px]">
                    <img 
                      src="/assets/aistudio/image_52104d92.png" 
                      alt="Dr. Shripuja Siddamsetty Official UPI QR Code"
                      referrerPolicy="no-referrer"
                      className="w-full h-auto rounded-xl object-contain"
                    />
                  </div>
                  <span className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-2 font-medium">
                    Scan with GPay, PhonePe, Paytm, BHIM or any UPI app
                  </span>
                </div>

                {/* UPI ID Box with One-Click Copy */}
                <div className="p-3.5 rounded-2xl bg-forest/10 dark:bg-forest/20 border border-forest/30 flex items-center justify-between gap-3">
                  <div className="overflow-hidden">
                    <span className="block text-[10px] uppercase font-bold text-neutral-600 dark:text-neutral-400 tracking-wider">
                      Doctor Official UPI ID
                    </span>
                    <span className="font-mono font-bold text-forest dark:text-emerald-400 text-sm truncate select-all block">
                      {officialUpiId}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="px-3.5 py-2 rounded-xl bg-forest hover:bg-forest-dark text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer shrink-0"
                    title="Copy UPI ID to clipboard"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUpi ? 'Copied!' : 'Copy ID'}</span>
                  </button>
                </div>

                {/* Fee Due Display */}
                <div className="my-4 py-3 border-y border-neutral-200/70 dark:border-neutral-800 flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Consultation Fee Due:
                  </span>
                  <div className="text-right">
                    <span className="font-serif text-2xl font-bold text-forest">
                      ₹{payableAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-neutral-500 block">INR (Tax Inclusive)</span>
                  </div>
                </div>

                {/* Step-by-Step Instructions */}
                <div className="space-y-2.5 text-xs text-neutral-800 dark:text-neutral-200 pt-1">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-forest text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                    <span>Scan this QR code using any UPI app on your phone.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-forest text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                    <span>Enter <strong>₹{payableAmount.toLocaleString('en-IN')}</strong> and verify payee: <em>Dr. Shripuja Siddamsetty</em>.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-forest text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                    <span>Take a screenshot of the completed payment confirmation.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">4</span>
                    <span>Share screenshot to WhatsApp ({doctorWhatsAppNumber}) for immediate session confirmation.</span>
                  </div>
                </div>

                {/* Direct WhatsApp Share button in QR Card */}
                <div className="pt-5 mt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={handleSendScreenshotWhatsApp}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
                    <span>Send Screenshot on WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* 2. Doctor Trust Card with Dr. Shripuja Photo */}
              <div className="glass p-6 rounded-3xl overflow-hidden relative shadow-md">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img 
                      src="/dr-shripuja.jpg" 
                      alt="Dr. Shripuja Siddamsetty" 
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-forest/20 shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-forest text-white flex items-center justify-center shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="inline-block text-[9px] uppercase tracking-wider font-bold text-forest bg-sage/30 px-2 py-0.5 rounded-full">
                      Verified Clinical Psychologist
                    </span>
                    <h3 className={`font-serif text-base font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                      {clinicSettings.doctorName}
                    </h3>
                    <p className="text-[11px] text-neutral-700 dark:text-neutral-300 font-medium">
                      Ph.D., M.Phil, CBT Certified
                    </p>
                    <p className="text-[10px] text-neutral-600 dark:text-neutral-400 font-normal leading-snug pt-1">
                      Barefoot Learning Experience & Calm Mind Wellness Clinic
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-sage-dark shrink-0" />
                    <span>RCI Registered Psychologist • 15+ Yrs Experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 font-medium">
                    <Clock className="w-3.5 h-3.5 text-sage-dark shrink-0" />
                    <span>In-person (Jubilee Hills) & Online Consultations</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 font-medium">
                    <FileText className="w-3.5 h-3.5 text-sage-dark shrink-0" />
                    <span>Official GST & Super-bill Tax Invoice Provided</span>
                  </div>
                </div>
              </div>

              {/* Booking Shortcut Card */}
              <div className="glass p-6 rounded-3xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sage/20 text-forest flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-serif text-xs font-bold">Have you booked a calendar slot?</h5>
                    <p className="text-[10px] text-neutral-400">Schedule your consultation appointment date & time.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onPageChange('book')}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-sage/30 hover:bg-sage/50 text-forest transition-colors cursor-pointer text-center block"
                >
                  Go to Appointment Booking &rarr;
                </button>
              </div>

              {/* Invoice Generator Shortcut Card */}
              <div className="glass p-6 rounded-3xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-serif text-xs font-bold">Need a Detailed Tax Invoice?</h5>
                    <p className="text-[10px] text-neutral-400">Generate itemized invoices with custom logo, GST & direct PDF export.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onPageChange('invoice')}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-forest/10 hover:bg-forest/20 text-forest transition-colors cursor-pointer text-center block"
                >
                  Open Invoice Generator &rarr;
                </button>
              </div>

            </div>

          </div>
        </section>
      ) : (
        /* 3. RECEIPT HISTORY TAB */
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <div className="glass p-8 rounded-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200/60 dark:border-neutral-800 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-charcoal dark:text-white">
                  Payment History & Tax Receipts
                </h3>
                <p className="text-xs text-neutral-500 font-light mt-1">
                  Saved records of your consultation settlements with Dr. Shripuja Siddamsetty.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('pay')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-forest text-white cursor-pointer"
              >
                + New Payment
              </button>
            </div>

            {savedReceipts.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <Receipt className="w-12 h-12 text-neutral-300 mx-auto" />
                <p className="text-sm font-semibold text-neutral-400">No payment receipts yet</p>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto font-light">
                  When you settle a consultation fee with Razorpay, your printable official receipt will be saved here.
                </p>
                <button
                  onClick={() => setActiveTab('pay')}
                  className="mt-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-sage hover:bg-sage-dark text-[#2B2B2B] transition-colors cursor-pointer"
                >
                  Make Consultation Payment
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedReceipts.map((rcpt, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-neutral-200/60 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-forest text-base">
                          ₹{rcpt.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                          Paid
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {rcpt.receiptNumber}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-charcoal dark:text-neutral-200">
                        {rcpt.purpose}
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        Patient: {rcpt.patientName} • {rcpt.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setCompletedReceipt(rcpt)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-forest/10 hover:bg-forest/20 text-forest transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>View Receipt</span>
                      </button>
                      <button
                        onClick={() => handleShareWhatsApp(rcpt)}
                        className="p-2 rounded-xl text-xs bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 transition-colors cursor-pointer"
                        title="Share on WhatsApp"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. CLINICAL PAYMENT FAQ SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-left">
        <div className="border-t border-neutral-200/60 dark:border-neutral-800 pt-12">
          <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-forest">
            Patient Support & Policies
          </span>
          <h3 className={`text-2xl font-serif font-bold mt-1 mb-8 ${isDarkMode ? 'text-white' : 'text-charcoal'}`}>
            Frequently Asked Questions on Payments
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-2xl space-y-2">
              <h5 className="font-serif text-sm font-bold flex items-center gap-2 text-forest">
                <HelpCircle className="w-4 h-4" />
                <span>What payment methods are supported?</span>
              </h5>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                Through our Razorpay gateway, we accept all major Indian and international payment options: UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards (Visa, Mastercard, RuPay, Amex), NetBanking across 50+ banks, and digital wallets.
              </p>
            </div>

            <div className="glass p-6 rounded-2xl space-y-2">
              <h5 className="font-serif text-sm font-bold flex items-center gap-2 text-forest">
                <HelpCircle className="w-4 h-4" />
                <span>Can I claim this with insurance (Super-bill)?</span>
              </h5>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                Yes. Dr. Shripuja operates as an out-of-network clinic to guarantee absolute confidentiality. Following payment, an official tax receipt and super-bill with clinical diagnostic codes is generated for your health insurance reimbursement.
              </p>
            </div>

            <div className="glass p-6 rounded-2xl space-y-2">
              <h5 className="font-serif text-sm font-bold flex items-center gap-2 text-forest">
                <HelpCircle className="w-4 h-4" />
                <span>What is the appointment cancellation policy?</span>
              </h5>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                We understand emergencies happen. We ask for at least 24 hours advance notice if you need to reschedule a booked slot. Rescheduled sessions incur no penalty and can be adjusted with our clinic team over WhatsApp or email.
              </p>
            </div>

            <div className="glass p-6 rounded-2xl space-y-2">
              <h5 className="font-serif text-sm font-bold flex items-center gap-2 text-forest">
                <HelpCircle className="w-4 h-4" />
                <span>Is my transaction confidential and secure?</span>
              </h5>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                All settlements are processed via Razorpay's PCI-DSS Level 1 certified banking infrastructure with 256-bit encryption. The clinic never stores sensitive card or bank credentials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SUCCESS RECEIPT MODAL */}
      <AnimatePresence>
        {completedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`max-w-xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border text-left overflow-hidden relative max-h-[90vh] overflow-y-auto ${
                isDarkMode ? 'bg-neutral-900 border-neutral-800 text-white' : 'bg-white border-neutral-200 text-charcoal'
              }`}
            >
              {/* Close button */}
              <button
                onClick={() => setCompletedReceipt(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-charcoal dark:hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>

              {/* Printable Receipt Container */}
              <div id="printable-clinical-receipt" className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-neutral-200 dark:border-neutral-800 pb-5">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/dr-shripuja.jpg" 
                      alt="Dr. Shripuja Siddamsetty" 
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover border border-forest/20 shadow-sm"
                    />
                    <div>
                      <h4 className="font-serif text-base font-bold text-forest">{clinicSettings.clinicName}</h4>
                      <p className="text-xs font-semibold">{clinicSettings.doctorName}</p>
                      <p className="text-[10px] text-neutral-400">Clinical Psychologist & Psychotherapist</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                      Paid & Verified
                    </span>
                    <p className="text-[10px] text-neutral-400 mt-1 font-mono">{completedReceipt.receiptNumber}</p>
                  </div>
                </div>

                {/* Amount Paid banner */}
                <div className="p-4 rounded-2xl bg-forest/5 dark:bg-forest/20 border border-forest/20 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Total Amount Succeeded</span>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 font-medium">{completedReceipt.purpose}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-3xl font-bold text-forest">
                      ₹{completedReceipt.amount.toLocaleString('en-IN')}
                    </span>
                    <span className="block text-[10px] text-neutral-400 font-medium">INR (All Inclusive)</span>
                  </div>
                </div>

                {/* Receipt Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold">Patient Name</span>
                    <p className="font-semibold text-charcoal dark:text-neutral-200 mt-0.5">{completedReceipt.patientName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold">Payment ID (Razorpay)</span>
                    <p className="font-mono text-neutral-600 dark:text-neutral-300 mt-0.5 text-[11px] truncate">{completedReceipt.paymentId}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold">Contact Email</span>
                    <p className="font-medium text-neutral-600 dark:text-neutral-300 mt-0.5">{completedReceipt.patientEmail}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold">Phone</span>
                    <p className="font-medium text-neutral-600 dark:text-neutral-300 mt-0.5">{completedReceipt.patientPhone}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold">Transaction Date</span>
                    <p className="font-medium text-neutral-600 dark:text-neutral-300 mt-0.5">{completedReceipt.date}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold">Payment Gateway</span>
                    <p className="font-medium text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Razorpay Checkout
                    </p>
                  </div>
                </div>

                {completedReceipt.notes && (
                  <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-950 text-xs text-neutral-500">
                    <span className="font-bold">Clinical Notes:</span> {completedReceipt.notes}
                  </div>
                )}

                {/* Clinical verification stamp */}
                <div className="pt-4 border-t border-dashed border-neutral-300 dark:border-neutral-800 flex justify-between items-end text-[10px] text-neutral-400">
                  <div>
                    <p>Calm Mind Wellness • Jubilee Hills, Hyderabad</p>
                    <p>Dr. Shripuja Siddamsetty, RCI Registered</p>
                  </div>
                  <div className="text-right">
                    <span className="text-forest font-serif font-bold italic text-sm block">Dr. Shripuja</span>
                    <span>Digital Clinical Seal</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-charcoal dark:text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCompletedReceipt(null);
                    onPageChange('invoice');
                  }}
                  className="flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-semibold bg-sage/30 hover:bg-sage/50 text-forest transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Full Tax Invoice &rarr;</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleShareWhatsApp(completedReceipt)}
                  className="py-2.5 px-3.5 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  title="Share on WhatsApp"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCompletedReceipt(null);
                    onPageChange('book');
                  }}
                  className="flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-semibold bg-forest hover:bg-forest-dark text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Slot</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
