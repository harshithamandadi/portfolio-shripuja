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
  youtubeId?: string; // YouTube video ID for embedded in-website player
  appleUrl: string;
  image: string;
}

export interface SocialPost {
  id: string;
  platform: 'instagram' | 'linkedin';
  author: string;
  handle: string;
  avatar: string;
  title?: string; // primarily for LinkedIn articles/posts
  caption: string;
  date: string;
  imageUrl?: string;
  postUrl: string;
  likesCount: number;
  commentsCount: number;
  sharesCount?: number;
  tags: string[];
}

export interface PaymentConfig {
  quickAmount1: number;
  quickAmount2: number;
  upiId: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountName: string;
  razorpayKeyId: string;
  currency: string;
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

export interface PaymentReceipt {
  paymentId: string;
  orderId?: string;
  amount: number; // in INR
  currency: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  purpose: string;
  notes?: string;
  date: string;
  receiptNumber: string;
  status: 'captured' | 'authorized' | 'completed';
  doctorName: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  sacCode?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: 'PAID' | 'DUE' | 'PENDING' | 'OVERDUE';
  paymentMode: string;
  transactionRef?: string;
  currency: string;
  currencySymbol: string;

  // Issuer / From Company Details
  fromName: string;
  fromTitle: string;
  fromAddress1: string;
  fromAddress2: string;
  fromPhone: string;
  fromEmail: string;
  fromGstin?: string;
  fromPan?: string;
  fromRegNo?: string;
  logoUrl?: string;

  // Billed To / Client Details
  clientType: 'individual' | 'corporate';
  clientName: string;
  clientCompany?: string;
  clientContactPerson?: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  clientGstin?: string;
  patientId?: string;

  // Line items & calculations
  items: InvoiceItem[];
  taxRate: number; // percentage, e.g. 18 for 18%
  discountType: 'none' | 'percent' | 'fixed';
  discountValue: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;

  // Notes & Signatures
  clinicalNotes?: string;
  terms: string;
  bankDetails?: {
    accountName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    upiId: string;
  };
  signatureUrl?: string;
}
