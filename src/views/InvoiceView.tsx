/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Download, 
  Printer, 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  CheckCircle2, 
  FileText, 
  Building2, 
  User, 
  Calendar, 
  CreditCard, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  Copy, 
  ArrowLeft,
  Eye,
  Sliders,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useWebsiteData } from '../context/WebsiteDataContext';
import { InvoiceData, InvoiceItem } from '../types';

interface InvoiceViewProps {
  onPageChange: (page: string) => void;
  isDarkMode: boolean;
}

export default function InvoiceView({ onPageChange, isDarkMode }: InvoiceViewProps) {
  const { clinicSettings } = useWebsiteData();
  // Mobile / Desktop View Mode: 'split' on desktop, 'edit' | 'preview' on mobile
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Logo state (Data URL or pre-existing image)
  const [logoPreview, setLogoPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const invoicePrintRef = useRef<HTMLDivElement>(null);

  // Initial Invoice Data State
  const today = new Date().toISOString().split('T')[0];
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    invoiceDate: today,
    dueDate: today,
    status: 'PAID',
    paymentMode: 'Razorpay Online (UPI/Cards)',
    transactionRef: `pay_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    currency: 'INR',
    currencySymbol: '₹',

    // Issuer (From)
    fromName: `${clinicSettings.clinicName}`,
    fromTitle: `${clinicSettings.doctorName}, Ph.D. — Clinical Psychologist`,
    fromAddress1: 'Suite 410, Green Meadows Wellness Center',
    fromAddress2: '88 Serenity Boulevard, Jubilee Hills, Hyderabad - 500033',
    fromPhone: clinicSettings.phone,
    fromEmail: clinicSettings.email,
    fromGstin: '36AAAAA0000A1Z5',
    fromPan: 'ABCDE1234F',
    fromRegNo: 'RCI CRR: A48912',
    logoUrl: '',

    // Client (Billed To)
    clientType: 'individual',
    clientName: 'Aditi Verma',
    clientCompany: '',
    clientContactPerson: '',
    clientEmail: 'aditi.verma@example.com',
    clientPhone: '+91 98765 43210',
    clientAddress: 'Flat 302, Palm Springs Residency, Banjara Hills, Hyderabad',
    clientGstin: '',
    patientId: 'PT-8942',

    // Line items
    items: [
      {
        id: 'item-1',
        description: 'Individual Adult Psychotherapy Session (50 Min)',
        sacCode: '999312',
        quantity: 1,
        unitPrice: 5000,
        total: 5000
      }
    ],

    // Calculations
    taxRate: 0, // 0% default for healthcare clinical therapy under SAC 999312
    discountType: 'none',
    discountValue: 0,
    subtotal: 5000,
    taxAmount: 0,
    discountAmount: 0,
    grandTotal: 5000,

    // Notes
    clinicalNotes: 'Evidence-based psychotherapy consultation focusing on Cognitive Behavioral Therapy (CBT) and anxiety regulation. Eligible for Out-Of-Network health insurance super-bill reimbursement.',
    terms: 'Payment is non-refundable once session is delivered. Appointments rescheduled with less than 24-hour notice are subject to clinic policy.',
    bankDetails: {
      accountName: 'Calm Mind Wellness Clinic',
      bankName: 'HDFC Bank, Jubilee Hills Branch',
      accountNumber: '50200084920194',
      ifscCode: 'HDFC0001234',
      upiId: 'calmmind@hdfcbank'
    }
  });

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert('File size exceeds 4MB. Please upload a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setLogoPreview(reader.result);
          setInvoice(prev => ({ ...prev, logoUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview('');
    setInvoice(prev => ({ ...prev, logoUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Recalculate Totals whenever items, tax, or discount change
  const recalculateInvoice = (
    items: InvoiceItem[], 
    taxRate: number, 
    discountType: 'none' | 'percent' | 'fixed', 
    discountValue: number
  ) => {
    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    
    let discountAmount = 0;
    if (discountType === 'percent') {
      discountAmount = (subtotal * (discountValue || 0)) / 100;
    } else if (discountType === 'fixed') {
      discountAmount = discountValue || 0;
    }
    discountAmount = Math.min(discountAmount, subtotal);

    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const taxAmount = (taxableAmount * (taxRate || 0)) / 100;
    const grandTotal = Math.round(taxableAmount + taxAmount);

    return { subtotal, discountAmount, taxAmount, grandTotal };
  };

  // Update item in table
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...invoice.items];
    const targetItem = { ...updatedItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'unitPrice') {
      const qty = field === 'quantity' ? parseFloat(value) || 0 : targetItem.quantity;
      const price = field === 'unitPrice' ? parseFloat(value) || 0 : targetItem.unitPrice;
      targetItem.total = qty * price;
    }

    updatedItems[index] = targetItem;
    const { subtotal, discountAmount, taxAmount, grandTotal } = recalculateInvoice(
      updatedItems, 
      invoice.taxRate, 
      invoice.discountType, 
      invoice.discountValue
    );

    setInvoice(prev => ({
      ...prev,
      items: updatedItems,
      subtotal,
      discountAmount,
      taxAmount,
      grandTotal
    }));
  };

  // Add new item row
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: 'Follow-up Clinical Psychotherapy (50 Min)',
      sacCode: '999312',
      quantity: 1,
      unitPrice: 5000,
      total: 5000
    };
    const updatedItems = [...invoice.items, newItem];
    const { subtotal, discountAmount, taxAmount, grandTotal } = recalculateInvoice(
      updatedItems, 
      invoice.taxRate, 
      invoice.discountType, 
      invoice.discountValue
    );
    setInvoice(prev => ({
      ...prev,
      items: updatedItems,
      subtotal,
      discountAmount,
      taxAmount,
      grandTotal
    }));
  };

  // Remove item row
  const handleRemoveItem = (index: number) => {
    if (invoice.items.length <= 1) return;
    const updatedItems = invoice.items.filter((_, idx) => idx !== index);
    const { subtotal, discountAmount, taxAmount, grandTotal } = recalculateInvoice(
      updatedItems, 
      invoice.taxRate, 
      invoice.discountType, 
      invoice.discountValue
    );
    setInvoice(prev => ({
      ...prev,
      items: updatedItems,
      subtotal,
      discountAmount,
      taxAmount,
      grandTotal
    }));
  };

  // Update Tax Rate
  const handleTaxRateChange = (rate: number) => {
    const { subtotal, discountAmount, taxAmount, grandTotal } = recalculateInvoice(
      invoice.items, 
      rate, 
      invoice.discountType, 
      invoice.discountValue
    );
    setInvoice(prev => ({
      ...prev,
      taxRate: rate,
      subtotal,
      discountAmount,
      taxAmount,
      grandTotal
    }));
  };

  // Update Discount
  const handleDiscountChange = (type: 'none' | 'percent' | 'fixed', val: number) => {
    const { subtotal, discountAmount, taxAmount, grandTotal } = recalculateInvoice(
      invoice.items, 
      invoice.taxRate, 
      type, 
      val
    );
    setInvoice(prev => ({
      ...prev,
      discountType: type,
      discountValue: val,
      subtotal,
      discountAmount,
      taxAmount,
      grandTotal
    }));
  };

  // Currency helper
  const handleCurrencyChange = (curr: string) => {
    let symbol = '₹';
    if (curr === 'USD') symbol = '$';
    if (curr === 'EUR') symbol = '€';
    if (curr === 'GBP') symbol = '£';
    setInvoice(prev => ({ ...prev, currency: curr, currencySymbol: symbol }));
  };

  // Pre-fill Template Options
  const handleLoadTemplate = (type: 'standard5000' | 'assessment7500' | 'corporate') => {
    if (type === 'standard5000') {
      const items: InvoiceItem[] = [
        {
          id: 'item-std',
          description: 'Adult Individual Psychotherapy Consultation (50 min)',
          sacCode: '999312',
          quantity: 1,
          unitPrice: 5000,
          total: 5000
        }
      ];
      const { subtotal, discountAmount, taxAmount, grandTotal } = recalculateInvoice(items, 0, 'none', 0);
      setInvoice(prev => ({
        ...prev,
        clientType: 'individual',
        clientName: 'Priya Sundaram',
        clientEmail: 'priya.sundaram@example.com',
        clientPhone: '+91 98450 12345',
        clientAddress: 'Road No 36, Jubilee Hills, Hyderabad',
        items,
        taxRate: 0,
        subtotal,
        discountAmount,
        taxAmount,
        grandTotal,
        clinicalNotes: 'Intake and assessment session covering cognitive reframing, sleep hygiene, and stress inoculation.'
      }));
    } else if (type === 'assessment7500') {
      const items: InvoiceItem[] = [
        {
          id: 'item-assess',
          description: 'Comprehensive Neuro-Psychological & Personality Assessment with Written Clinical Report',
          sacCode: '999312',
          quantity: 1,
          unitPrice: 7500,
          total: 7500
        }
      ];
      const { subtotal, discountAmount, taxAmount, grandTotal } = recalculateInvoice(items, 0, 'none', 0);
      setInvoice(prev => ({
        ...prev,
        clientType: 'individual',
        clientName: 'Karthik & Sneha Rao',
        clientEmail: 'karthik.rao@example.com',
        clientPhone: '+91 99887 76655',
        clientAddress: 'Plot 12, Kavuri Hills, Madhapur, Hyderabad',
        items,
        taxRate: 0,
        subtotal,
        discountAmount,
        taxAmount,
        grandTotal,
        clinicalNotes: 'Specialized 90-minute clinical couples assessment and diagnostic profile analysis.'
      }));
    } else if (type === 'corporate') {
      const items: InvoiceItem[] = [
        {
          id: 'item-corp-1',
          description: 'Executive Stress & Burnout Prevention Workshop (Full Day Masterclass)',
          sacCode: '998311',
          quantity: 1,
          unitPrice: 35000,
          total: 35000
        },
        {
          id: 'item-corp-2',
          description: 'Employee Mental Health 1-on-1 Counseling Retainer (5 Sessions)',
          sacCode: '999312',
          quantity: 5,
          unitPrice: 4500,
          total: 22500
        }
      ];
      const { subtotal, discountAmount, taxAmount, grandTotal } = recalculateInvoice(items, 18, 'none', 0);
      setInvoice(prev => ({
        ...prev,
        clientType: 'corporate',
        clientName: 'Infosys Leadership Wellness Group',
        clientCompany: 'Infosys Limited',
        clientContactPerson: 'Vikram Joshi (HR Director)',
        clientEmail: 'vikram.joshi@company.com',
        clientPhone: '+91 80 2852 0261',
        clientAddress: 'Electronics City, Hosur Road, Bengaluru, Karnataka 560100',
        clientGstin: '29AAACI1234F1Z8',
        items,
        taxRate: 18, // 18% GST for corporate training
        subtotal,
        discountAmount,
        taxAmount,
        grandTotal,
        clinicalNotes: 'Corporate psychological wellness training series and employee assistance program (EAP).'
      }));
    }
  };

  // Convert Number to English Words (for invoice total)
  const numberToWords = (num: number): string => {
    if (num === 0) return 'Zero';
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const inWords = (n: number): string => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
      if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + inWords(n % 100) : '');
      if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
      if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
      return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
    };
    
    return inWords(num);
  };

  // DIRECT PDF DOWNLOAD FUNCTION
  const handleDownloadPdf = async () => {
    if (!invoicePrintRef.current) return;
    setIsGeneratingPdf(true);
    setDownloadSuccess(false);

    try {
      // Capture element with html2canvas
      const element = invoicePrintRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // 2x for retina sharpness
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${invoice.invoiceNumber}.pdf`);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Error generating PDF:', err);
      // Fallback: trigger standard browser print dialog which allows "Save as PDF"
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Direct Browser Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="invoice-view-container" className="pt-24 pb-20">
      
      {/* 1. HEADER SECTION & TOOLBAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-left">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200/60 dark:border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-sans uppercase font-bold tracking-widest text-forest">
                Clinical Billing & Tax Invoices
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-sage/30 text-forest border border-sage/40 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Direct PDF Export
              </span>
            </div>
            <h1 className={`text-3xl sm:text-4xl font-serif font-bold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-charcoal'
            }`}>
              Invoice Generator
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-light mt-1 max-w-2xl">
              Fill in client information, provider/company credentials, itemized services, upload custom branding logo, and download your official printable tax invoice directly.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Toggle for Mobile */}
            <div className="flex lg:hidden p-1 rounded-xl glass border border-neutral-200/50 dark:border-neutral-800">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  activeTab === 'edit' ? 'bg-forest text-white' : 'text-neutral-500'
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  activeTab === 'preview' ? 'bg-forest text-white' : 'text-neutral-500'
                }`}
              >
                Preview
              </button>
            </div>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-2 ${
                isDarkMode 
                  ? 'border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800' 
                  : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 shadow-sm'
              }`}
              title="Print via browser or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-forest" />
              <span>Print</span>
            </button>

            {/* DIRECT PDF DOWNLOAD BUTTON (Primary Call to Action) */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-5 py-2.5 bg-forest hover:bg-forest-dark text-white rounded-xl text-xs font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Direct Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Template Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-4 text-xs">
          <span className="text-[10px] font-sans uppercase font-bold text-neutral-400">
            Quick Fill Templates:
          </span>
          <button
            onClick={() => handleLoadTemplate('standard5000')}
            className="px-3 py-1 rounded-lg text-xs font-medium bg-neutral-100 hover:bg-sage/30 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 transition-colors cursor-pointer"
          >
            Individual Therapy (₹5,000)
          </button>
          <button
            onClick={() => handleLoadTemplate('assessment7500')}
            className="px-3 py-1 rounded-lg text-xs font-medium bg-neutral-100 hover:bg-sage/30 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 transition-colors cursor-pointer"
          >
            Assessment / Couples (₹7,500)
          </button>
          <button
            onClick={() => handleLoadTemplate('corporate')}
            className="px-3 py-1 rounded-lg text-xs font-medium bg-neutral-100 hover:bg-sage/30 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 transition-colors cursor-pointer"
          >
            Corporate Retainer (B2B + GST)
          </button>
        </div>

        {downloadSuccess && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Invoice downloaded successfully as <strong>Invoice_{invoice.invoiceNumber}.pdf</strong>!</span>
          </div>
        )}
      </section>

      {/* 2. SPLIT LAYOUT: FORM EDITOR (LEFT) + LIVE A4 INVOICE SHEET (RIGHT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ============================================================== */}
          {/* LEFT COLUMN: INVOICE CONFIGURATION FORM (5 cols)             */}
          {/* ============================================================== */}
          <div className={`lg:col-span-5 space-y-6 text-left ${
            activeTab === 'preview' ? 'hidden lg:block' : 'block'
          }`}>
            
            {/* 1. LOGO UPLOAD CARD */}
            <div className="glass p-5 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-forest flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Invoice Branding & Logo</span>
                </span>
                {logoPreview && (
                  <button
                    onClick={handleRemoveLogo}
                    className="text-[10px] text-red-500 hover:underline cursor-pointer"
                  >
                    Remove Logo
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Logo Thumbnail preview */}
                <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center overflow-hidden shrink-0 relative group">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Invoice Logo" 
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-neutral-400" />
                  )}
                </div>

                <div className="space-y-2 flex-grow">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="invoice-logo-upload"
                  />
                  <label
                    htmlFor="invoice-logo-upload"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-forest text-white hover:bg-forest-dark transition-all cursor-pointer shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Custom Logo</span>
                  </label>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <label
                      htmlFor="invoice-logo-upload"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-forest text-white hover:bg-forest-dark transition-all cursor-pointer shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Custom Logo</span>
                    </label>
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="px-3 py-2 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                    Upload clinic or organization logo (PNG, JPG, SVG, WebP up to 4MB).
                  </p>
                </div>
              </div>
            </div>

            {/* 2. INVOICE META (Number, Dates, Status, Currency) */}
            <div className="glass p-5 rounded-3xl space-y-4">
              <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-forest">
                Invoice Details & Status
              </span>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200">Invoice Number</label>
                  <input
                    type="text"
                    value={invoice.invoiceNumber}
                    onChange={(e) => setInvoice(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono text-xs outline-none focus:border-forest"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200">Payment Status</label>
                  <select
                    value={invoice.status}
                    onChange={(e) => setInvoice(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs outline-none focus:border-forest cursor-pointer"
                  >
                    <option value="PAID">PAID</option>
                    <option value="DUE">DUE</option>
                    <option value="PENDING">PENDING</option>
                    <option value="OVERDUE">OVERDUE</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200">Invoice Date</label>
                  <input
                    type="date"
                    value={invoice.invoiceDate}
                    onChange={(e) => setInvoice(prev => ({ ...prev, invoiceDate: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs outline-none focus:border-forest"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200">Due Date</label>
                  <input
                    type="date"
                    value={invoice.dueDate}
                    onChange={(e) => setInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs outline-none focus:border-forest"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200">Payment Mode</label>
                  <input
                    type="text"
                    value={invoice.paymentMode}
                    onChange={(e) => setInvoice(prev => ({ ...prev, paymentMode: e.target.value }))}
                    placeholder="e.g. Razorpay, Bank Transfer"
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs outline-none focus:border-forest placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200">Currency</label>
                  <select
                    value={invoice.currency}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs outline-none focus:border-forest cursor-pointer"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. INVOICE RECEIVED FROM (ISSUER / COMPANY DETAILS) */}
            <div className="glass p-5 rounded-3xl space-y-4">
              <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-forest flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>Invoice Received From (Company / Clinic)</span>
              </span>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200">Company / Clinic / Doctor Name</label>
                  <input
                    type="text"
                    value={invoice.fromName}
                    onChange={(e) => setInvoice(prev => ({ ...prev, fromName: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs outline-none focus:border-forest"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200">Practitioner Role / Credentials</label>
                  <input
                    type="text"
                    value={invoice.fromTitle}
                    onChange={(e) => setInvoice(prev => ({ ...prev, fromTitle: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs outline-none focus:border-forest"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200">Address Line 1</label>
                    <input
                      type="text"
                      value={invoice.fromAddress1}
                      onChange={(e) => setInvoice(prev => ({ ...prev, fromAddress1: e.target.value }))}
                      className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs outline-none focus:border-forest"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200">Address Line 2 (City, PIN)</label>
                    <input
                      type="text"
                      value={invoice.fromAddress2}
                      onChange={(e) => setInvoice(prev => ({ ...prev, fromAddress2: e.target.value }))}
                      className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs outline-none focus:border-forest"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200">Phone</label>
                    <input
                      type="text"
                      value={invoice.fromPhone}
                      onChange={(e) => setInvoice(prev => ({ ...prev, fromPhone: e.target.value }))}
                      className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs outline-none focus:border-forest"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200">Email</label>
                    <input
                      type="email"
                      value={invoice.fromEmail}
                      onChange={(e) => setInvoice(prev => ({ ...prev, fromEmail: e.target.value }))}
                      className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs outline-none focus:border-forest"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200">GSTIN / Tax ID</label>
                    <input
                      type="text"
                      value={invoice.fromGstin || ''}
                      onChange={(e) => setInvoice(prev => ({ ...prev, fromGstin: e.target.value }))}
                      placeholder="e.g. 36AAAAA0000A1Z5"
                      className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs outline-none focus:border-forest placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200">Registration / RCI No.</label>
                    <input
                      type="text"
                      value={invoice.fromRegNo || ''}
                      onChange={(e) => setInvoice(prev => ({ ...prev, fromRegNo: e.target.value }))}
                      placeholder="e.g. RCI CRR: A48912"
                      className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs outline-none focus:border-forest placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. CLIENT DETAILS (BILLED TO) */}
            <div className="glass p-5 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-forest flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Billed To (Client / Patient Details)</span>
                </span>
                
                {/* Client Type Toggle */}
                <div className="flex text-[10px] font-semibold border rounded-lg overflow-hidden border-neutral-300 dark:border-neutral-700">
                  <button
                    type="button"
                    onClick={() => setInvoice(prev => ({ ...prev, clientType: 'individual' }))}
                    className={`px-2.5 py-1 ${
                      invoice.clientType === 'individual' ? 'bg-forest text-white' : 'text-neutral-500 dark:text-neutral-400'
                    }`}
                  >
                    Patient
                  </button>
                  <button
                    type="button"
                    onClick={() => setInvoice(prev => ({ ...prev, clientType: 'corporate' }))}
                    className={`px-2.5 py-1 ${
                      invoice.clientType === 'corporate' ? 'bg-forest text-white' : 'text-neutral-500 dark:text-neutral-400'
                    }`}
                  >
                    Corporate
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200">
                    {invoice.clientType === 'corporate' ? 'Company / Organization Name' : 'Patient / Client Full Name'}
                  </label>
                  <input
                    type="text"
                    value={invoice.clientName}
                    onChange={(e) => setInvoice(prev => ({ ...prev, clientName: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs outline-none focus:border-forest"
                  />
                </div>

                {invoice.clientType === 'corporate' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200">Contact Person</label>
                      <input
                        type="text"
                        value={invoice.clientContactPerson || ''}
                        onChange={(e) => setInvoice(prev => ({ ...prev, clientContactPerson: e.target.value }))}
                        placeholder="e.g. HR Manager / Dept Head"
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs outline-none focus:border-forest placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200">Client GSTIN / Tax ID</label>
                      <input
                        type="text"
                        value={invoice.clientGstin || ''}
                        onChange={(e) => setInvoice(prev => ({ ...prev, clientGstin: e.target.value }))}
                        placeholder="e.g. 29AAACI1234F1Z8"
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs outline-none focus:border-forest placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200">Client Email</label>
                    <input
                      type="email"
                      value={invoice.clientEmail}
                      onChange={(e) => setInvoice(prev => ({ ...prev, clientEmail: e.target.value }))}
                      className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs outline-none focus:border-forest"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200">Client Phone</label>
                    <input
                      type="text"
                      value={invoice.clientPhone}
                      onChange={(e) => setInvoice(prev => ({ ...prev, clientPhone: e.target.value }))}
                      className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs outline-none focus:border-forest"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200">Client Address</label>
                  <input
                    type="text"
                    value={invoice.clientAddress}
                    onChange={(e) => setInvoice(prev => ({ ...prev, clientAddress: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs outline-none focus:border-forest"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200">Patient / Case Reference ID</label>
                  <input
                    type="text"
                    value={invoice.patientId || ''}
                    onChange={(e) => setInvoice(prev => ({ ...prev, patientId: e.target.value }))}
                    placeholder="e.g. PT-8942"
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs outline-none focus:border-forest font-mono placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                  />
                </div>
              </div>
            </div>

            {/* 5. ITEMIZED SERVICES / LINE ITEMS */}
            <div className="glass p-5 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-forest">
                  Itemized Services & Rates
                </span>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-forest/10 text-forest hover:bg-forest/20 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Line</span>
                </button>
              </div>

              <div className="space-y-3">
                {invoice.items.map((item, idx) => (
                  <div 
                    key={item.id} 
                    className="p-3.5 rounded-2xl border border-neutral-300/80 dark:border-neutral-700 bg-white dark:bg-neutral-900 space-y-2 text-xs shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[10px] text-forest dark:text-sage font-sans uppercase">
                        Item #{idx + 1}
                      </span>
                      {invoice.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-200">
                        Service Description
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                        placeholder="Service description"
                        className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs outline-none focus:border-forest font-medium placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-200">SAC Code</label>
                        <input
                          type="text"
                          value={item.sacCode || ''}
                          onChange={(e) => handleItemChange(idx, 'sacCode', e.target.value)}
                          placeholder="999312"
                          className="w-full p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs font-mono placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-200">Qty / Sessions</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-full p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-200">Rate ({invoice.currencySymbol})</label>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                          className="w-full p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs font-bold"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tax & Discount controls */}
              <div className="pt-3 border-t border-neutral-200/50 dark:border-neutral-800 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200 mb-1">GST / Tax Rate</label>
                    <select
                      value={invoice.taxRate}
                      onChange={(e) => handleTaxRateChange(parseFloat(e.target.value) || 0)}
                      className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs outline-none cursor-pointer focus:border-forest"
                    >
                      <option value="0">0% (Exempt - Healthcare Services)</option>
                      <option value="5">5% GST</option>
                      <option value="12">12% GST</option>
                      <option value="18">18% GST (Corporate Training)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-200 mb-1">Discount</label>
                    <div className="flex gap-1.5">
                      <select
                        value={invoice.discountType}
                        onChange={(e) => handleDiscountChange(e.target.value as any, invoice.discountValue)}
                        className="w-24 p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs outline-none cursor-pointer focus:border-forest"
                      >
                        <option value="none">None</option>
                        <option value="percent">% Off</option>
                        <option value="fixed">Fixed</option>
                      </select>
                      {invoice.discountType !== 'none' && (
                        <input
                          type="number"
                          min="0"
                          value={invoice.discountValue}
                          onChange={(e) => handleDiscountChange(invoice.discountType, parseFloat(e.target.value) || 0)}
                          placeholder="Amount"
                          className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs outline-none focus:border-forest"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. CLINICAL NOTES & SUPERBILL */}
            <div className="glass p-5 rounded-3xl space-y-3 text-xs">
              <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-forest">
                Clinical Diagnosis & Insurance Notes
              </span>
              <textarea
                rows={3}
                value={invoice.clinicalNotes || ''}
                onChange={(e) => setInvoice(prev => ({ ...prev, clinicalNotes: e.target.value }))}
                placeholder="Clinical procedure notes, diagnostic codes, or insurance instructions..."
                className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-xs outline-none focus:border-forest resize-none"
              />
            </div>

          </div>


          {/* ============================================================== */}
          {/* RIGHT COLUMN: HIGH-FIDELITY A4 INVOICE SHEET (7 cols)          */}
          {/* ============================================================== */}
          <div className={`lg:col-span-7 ${
            activeTab === 'edit' ? 'hidden lg:block' : 'block'
          }`}>
            
            {/* Download Prompt Banner */}
            <div className="mb-4 flex items-center justify-between p-3.5 rounded-2xl bg-forest/10 border border-forest/20 text-xs text-forest">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="font-medium">Direct A4 Print & PDF Ready Layout</span>
              </div>
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="px-3.5 py-1.5 rounded-xl bg-forest hover:bg-forest-dark text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .PDF</span>
              </button>
            </div>

            {/* THE ACTUAL PRINTABLE / EXPORTABLE INVOICE SHEET (A4 standard proportion) */}
            <div className="shadow-2xl rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white text-neutral-900 text-left">
              <div 
                ref={invoicePrintRef}
                id="invoice-printable-sheet"
                className="p-8 sm:p-12 space-y-8 bg-white text-neutral-900 max-w-[800px] mx-auto min-h-[950px] relative font-sans"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                
                {/* Decorative Top Accent Stripe */}
                <div className="h-2.5 bg-[#1E3A2F] -mx-8 sm:-mx-12 -mt-8 sm:-mt-12" />

                {/* 1. INVOICE HEADER: BRANDING & TITLE */}
                <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b border-neutral-200">
                  {/* Left: Logo & Company Name */}
                  <div className="flex items-start gap-4">
                    {invoice.logoUrl && (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-neutral-200 shrink-0 bg-neutral-50 flex items-center justify-center">
                        <img 
                          src={invoice.logoUrl} 
                          alt="Company Logo" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1E3A2F]">
                        {invoice.fromName}
                      </h2>
                      <p className="text-xs font-semibold text-neutral-600 mt-0.5">
                        {invoice.fromTitle}
                      </p>
                      <p className="text-[11px] text-neutral-500 font-light mt-1 max-w-sm">
                        {invoice.fromAddress1}, {invoice.fromAddress2}
                      </p>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-neutral-500 mt-1 font-mono">
                        {invoice.fromGstin && <span>GSTIN: {invoice.fromGstin}</span>}
                        {invoice.fromRegNo && <span>{invoice.fromRegNo}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Right: Invoice Label & Status badge */}
                  <div className="sm:text-right shrink-0">
                    <span className="block text-[10px] uppercase font-bold tracking-widest text-[#1E3A2F] font-sans">
                      TAX INVOICE
                    </span>
                    <h3 className="font-mono text-lg font-bold text-neutral-800 mt-0.5">
                      {invoice.invoiceNumber}
                    </h3>
                    
                    <div className="mt-2 sm:inline-block">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        invoice.status === 'PAID' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                          : invoice.status === 'DUE' 
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-neutral-100 text-neutral-800 border border-neutral-300'
                      }`}>
                        {invoice.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-neutral-500 mt-2 space-y-0.5">
                      <p>Date: <strong className="text-neutral-700">{invoice.invoiceDate}</strong></p>
                      <p>Due: <strong className="text-neutral-700">{invoice.dueDate}</strong></p>
                    </div>
                  </div>
                </div>

                {/* 2. BILLED TO & PAYMENT ESSENTIALS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-neutral-50 border border-neutral-100 text-xs">
                  {/* Billed To */}
                  <div>
                    <span className="block text-[9px] uppercase font-bold tracking-wider text-neutral-400 font-sans mb-1">
                      BILLED TO (CLIENT / PATIENT)
                    </span>
                    <h4 className="font-serif text-sm font-bold text-neutral-900">
                      {invoice.clientName}
                    </h4>
                    {invoice.clientCompany && (
                      <p className="text-xs text-neutral-600 font-medium">{invoice.clientCompany}</p>
                    )}
                    {invoice.clientContactPerson && (
                      <p className="text-[11px] text-neutral-500">Attn: {invoice.clientContactPerson}</p>
                    )}
                    <p className="text-[11px] text-neutral-600 mt-1">{invoice.clientAddress}</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{invoice.clientPhone} • {invoice.clientEmail}</p>
                    {invoice.clientGstin && (
                      <p className="text-[10px] text-neutral-500 font-mono mt-0.5">Client GSTIN: {invoice.clientGstin}</p>
                    )}
                    {invoice.patientId && (
                      <p className="text-[10px] text-neutral-500 font-mono mt-0.5">Patient ID: {invoice.patientId}</p>
                    )}
                  </div>

                  {/* Payment Details */}
                  <div className="sm:border-l sm:border-neutral-200 sm:pl-6 space-y-1">
                    <span className="block text-[9px] uppercase font-bold tracking-wider text-neutral-400 font-sans mb-1">
                      PAYMENT & SETTLEMENT INFO
                    </span>
                    <p className="text-[11px] text-neutral-600">
                      Mode: <strong className="text-neutral-800">{invoice.paymentMode}</strong>
                    </p>
                    {invoice.transactionRef && (
                      <p className="text-[10px] text-neutral-500 font-mono">
                        Ref / Razorpay ID: {invoice.transactionRef}
                      </p>
                    )}
                    {invoice.bankDetails && (
                      <div className="pt-2 text-[10px] text-neutral-500 space-y-0.5 border-t border-neutral-200 mt-2">
                        <p className="font-bold text-neutral-700">{invoice.bankDetails.bankName}</p>
                        <p>A/C: {invoice.bankDetails.accountNumber} ({invoice.bankDetails.ifscCode})</p>
                        <p>UPI ID: <strong className="text-[#1E3A2F] font-mono">{invoice.bankDetails.upiId}</strong></p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. ITEMIZED SERVICES TABLE */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b-2 border-[#1E3A2F] text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-600">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Service & Description</th>
                        <th className="py-2.5 px-3">SAC</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Unit Price</th>
                        <th className="py-2.5 px-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {invoice.items.map((item, index) => (
                        <tr key={item.id} className="hover:bg-neutral-50/50">
                          <td className="py-3 px-3 text-neutral-400 font-mono text-[10px]">{index + 1}</td>
                          <td className="py-3 px-3">
                            <p className="font-semibold text-neutral-800">{item.description}</p>
                          </td>
                          <td className="py-3 px-3 text-neutral-500 font-mono text-[10px]">{item.sacCode || '-'}</td>
                          <td className="py-3 px-3 text-center font-medium">{item.quantity}</td>
                          <td className="py-3 px-3 text-right font-medium text-neutral-600">
                            {invoice.currencySymbol}{item.unitPrice.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-neutral-900">
                            {invoice.currencySymbol}{item.total.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 4. TOTALS & FINANCIAL SUMMARY */}
                <div className="pt-4 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                  
                  {/* Left: Amount in Words & Notes */}
                  <div className="sm:col-span-7 space-y-3 text-xs">
                    <div>
                      <span className="block text-[9px] uppercase font-bold tracking-wider text-neutral-400 font-sans">
                        AMOUNT IN WORDS
                      </span>
                      <p className="font-serif italic text-neutral-800 text-xs mt-0.5">
                        {invoice.currency === 'INR' ? 'Rupees' : invoice.currency} {numberToWords(invoice.grandTotal)} Only
                      </p>
                    </div>

                    {invoice.clinicalNotes && (
                      <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200/60 text-[10px] text-neutral-600 leading-relaxed">
                        <span className="font-bold text-[#1E3A2F] uppercase tracking-wider block text-[9px] mb-0.5">
                          Clinical & Insurance Super-Bill Remarks:
                        </span>
                        {invoice.clinicalNotes}
                      </div>
                    )}
                  </div>

                  {/* Right: Calculations */}
                  <div className="sm:col-span-5 space-y-2 text-xs">
                    <div className="flex justify-between text-neutral-600">
                      <span>Subtotal:</span>
                      <span className="font-semibold">{invoice.currencySymbol}{invoice.subtotal.toLocaleString('en-IN')}</span>
                    </div>

                    {invoice.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Discount {invoice.discountType === 'percent' ? `(${invoice.discountValue}%)` : ''}:</span>
                        <span>-{invoice.currencySymbol}{invoice.discountAmount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-neutral-600">
                      <span>GST ({invoice.taxRate}%):</span>
                      <span>
                        {invoice.taxRate === 0 
                          ? '₹0.00 (Healthcare Exempt)' 
                          : `${invoice.currencySymbol}${invoice.taxAmount.toLocaleString('en-IN')}`
                        }
                      </span>
                    </div>

                    <div className="border-t-2 border-[#1E3A2F] pt-2 flex justify-between items-baseline">
                      <span className="font-serif text-sm font-bold text-neutral-900">Total Payable:</span>
                      <span className="font-serif text-xl font-bold text-[#1E3A2F]">
                        {invoice.currencySymbol}{invoice.grandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                </div>

                {/* 5. FOOTER: TERMS, DISCLAIMER & CLINICAL SIGNATURE */}
                <div className="pt-8 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-6 items-end text-[10px] text-neutral-500">
                  <div className="space-y-1">
                    <p className="font-bold text-neutral-700 uppercase tracking-wider text-[9px]">Terms & Conditions</p>
                    <p className="leading-relaxed font-light">{invoice.terms}</p>
                    <p className="pt-2 text-[9px] text-neutral-400">
                      Official computer-generated clinical tax invoice. Out-of-network super-bill compliant.
                    </p>
                  </div>

                  {/* Clinician Signature Stamp */}
                  <div className="sm:text-right space-y-1">
                    <div className="inline-block text-center border-b border-neutral-300 pb-1 px-4">
                      <span className="font-serif italic font-bold text-base text-[#1E3A2F] block">
                        Dr. Shripuja Siddamsetty
                      </span>
                      <span className="text-[9px] text-neutral-400">Authorized Clinician Signature</span>
                    </div>
                    <p className="text-[9px] text-neutral-400">Calm Mind Wellness • Jubilee Hills</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
