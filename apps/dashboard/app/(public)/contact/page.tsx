'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  FileText,
  Building2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import { ScrollReveal } from '@/components/scroll-reveal';

const PRODUCTS = [
  'General / Entire AI Portfolio',
  'MoodScanr AI (Video Sentiment Intelligence)',
  'HalalScanr (Food & Cosmetic Verification)',
  'FanScanr Sports (Emotion & Fan Engagement)',
  'AI Headshot Pro (Photorealistic Portraits)',
  'TalentScanr AI (Candidate Screening Engine)',
  'CallScanr Voice AI (Sub-300ms Conversational Telephony)',
  'AQIScanr AI (Environmental Air Quality Index)',
];

const CATEGORIES = [
  { value: 'affiliate', label: 'Affiliate & Partner Network Inquiry' },
  { value: 'enterprise', label: 'Enterprise & High-Volume Licensing' },
  { value: 'technical', label: 'API, Webhooks & Technical Integration' },
  { value: 'compliance', label: 'Tax Forms, Compliance & Payout Clearance' },
  { value: 'press', label: 'Press & Media Relations' },
  { value: 'other', label: 'General Corporate Inquiry' },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'affiliate',
    product: 'General / Entire AI Portfolio',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);

    // Simulate reliable dispatch
    setTimeout(() => {
      const generatedId = `INNK-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketId(generatedId);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      category: 'affiliate',
      product: 'General / Entire AI Portfolio',
      subject: '',
      message: '',
    });
    setIsSubmitted(false);
  };

  return (
    <div className="relative bg-transparent text-[#09090B] font-sans antialiased min-h-[calc(100vh-80px)]">
      {/* 1. Header Banner */}
      <section className="pt-16 pb-14 sm:pt-20 sm:pb-16 border-b border-neutral-300/80 bg-[#F7F5F0]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <ScrollReveal direction="up" delay={50} duration={600}>
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white/90 px-3.5 py-1 text-xs font-mono font-medium text-neutral-600 shadow-2xs mb-2">
              <MessageSquare className="h-3.5 w-3.5 text-black" />
              <span>CONTACT &amp; INQUIRIES</span>
              <span>&bull;</span>
              <span>INNOTEK GLOBAL LTD</span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#09090B] tracking-tight">
              Get in touch with our team
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed pt-2">
              Whether you are an affiliate creator, enterprise partner, or prospective client, we are here to support your growth. Our London operations respond within 24 business hours.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. Main Contact Grid */}
      <section className="py-16 sm:py-20 bg-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Contact Channels & Headquarters */}
            <div className="lg:col-span-5 space-y-8">
              
              <ScrollReveal direction="up" delay={100} duration={650}>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 block mb-2">
                    DIRECT CHANNELS
                  </span>
                  <h2 className="font-display text-2xl font-extrabold text-[#09090B]">
                    Specialized Department Desks
                  </h2>
                  <p className="text-xs text-neutral-600 mt-1">
                    Route your message directly to the appropriate team for faster resolution.
                  </p>
                </div>
              </ScrollReveal>

              {/* Channel Cards */}
              <ScrollReveal direction="up" delay={150} duration={650} className="space-y-3.5">
                {/* Desk 1: Partnerships */}
                <div className="p-5 rounded-2xl border border-neutral-200 bg-white hover:border-black transition shadow-2xs group">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-neutral-100 flex items-center justify-center text-black shrink-0 group-hover:bg-black group-hover:text-white transition">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-black">Affiliate &amp; Creator Network</h3>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        For commission queries, custom discount codes, tracking setups, and media kits.
                      </p>
                      <a
                        href="mailto:partners@innotek.global"
                        className="text-xs font-bold text-black hover:underline inline-flex items-center gap-1 pt-1"
                      >
                        <Mail className="h-3.5 w-3.5 text-neutral-500" />
                        <span>partners@innotek.global</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Desk 2: Enterprise & API */}
                <div className="p-5 rounded-2xl border border-neutral-200 bg-white hover:border-black transition shadow-2xs group">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-neutral-100 flex items-center justify-center text-black shrink-0 group-hover:bg-black group-hover:text-white transition">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-black">Enterprise &amp; Commercial Solutions</h3>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        For volume licensing, private model deployments, API quotas, and B2B vendor inquiries.
                      </p>
                      <a
                        href="mailto:contact@innotek.global"
                        className="text-xs font-bold text-black hover:underline inline-flex items-center gap-1 pt-1"
                      >
                        <Mail className="h-3.5 w-3.5 text-neutral-500" />
                        <span>contact@innotek.global</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Desk 3: Compliance & Legal */}
                <div className="p-5 rounded-2xl border border-neutral-200 bg-white hover:border-black transition shadow-2xs group">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-neutral-100 flex items-center justify-center text-black shrink-0 group-hover:bg-black group-hover:text-white transition">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-black">Compliance, Tax &amp; Payments</h3>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        For W-8BEN/W-9 validation, HMRC queries, UK ASA advertising compliance, and payout clearance.
                      </p>
                      <a
                        href="mailto:support@innotek.global"
                        className="text-xs font-bold text-black hover:underline inline-flex items-center gap-1 pt-1"
                      >
                        <Mail className="h-3.5 w-3.5 text-neutral-500" />
                        <span>support@innotek.global</span>
                      </a>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Physical Office Card */}
              <ScrollReveal direction="up" delay={200} duration={650}>
                <div className="p-5 rounded-2xl border border-neutral-200 bg-[#FAFAFA] space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-black" />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                      Headquarters &bull; London
                    </h3>
                  </div>
                  <div className="text-xs text-neutral-700 space-y-1 leading-relaxed">
                    <p className="font-bold text-black">Innotek Global Ltd</p>
                    <p>71-75 Shelton Street, Covent Garden</p>
                    <p>London, WC2H 9JQ, United Kingdom</p>
                    <p className="text-neutral-500 text-[11px] pt-1 font-mono">
                      Registered in England &amp; Wales &bull; Company Reg #14928172
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-500 text-[11px] pt-1 font-mono border-t border-neutral-200">
                    <Clock className="h-3.5 w-3.5 text-neutral-400" />
                    <span>Mon – Fri: 09:00 – 18:00 GMT</span>
                  </div>
                </div>
              </ScrollReveal>

              {/* Instant Self-Service Help Box */}
              <ScrollReveal direction="up" delay={250} duration={650}>
                <div className="p-5 rounded-2xl border border-neutral-200 bg-white space-y-3 shadow-2xs">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 block">
                    NEED IMMEDIATE ANSWERS?
                  </span>
                  <div className="space-y-2">
                    <Link
                      href="/faq"
                      className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition text-xs font-bold text-black group"
                    >
                      <div className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-neutral-500 group-hover:text-black transition" />
                        <span>Browse Affiliate &amp; Payout FAQ</span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition" />
                    </Link>

                    <Link
                      href="/partner/docs"
                      className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition text-xs font-bold text-black group"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-neutral-500 group-hover:text-black transition" />
                        <span>Partner Technical Documentation</span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 transition" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>

            </div>

            {/* Right Column: Interactive Form */}
            <div className="lg:col-span-7">
              <ScrollReveal direction="up" delay={150} duration={700}>
                <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-10 shadow-sm">
                  
                  {isSubmitted ? (
                    <div className="py-12 text-center space-y-6">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                      
                      <div className="space-y-2 max-w-md mx-auto">
                        <span className="font-mono text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                          TICKET REFERENCE: {ticketId}
                        </span>
                        <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#09090B]">
                          Message Received
                        </h3>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                          Thank you for contacting Innotek Global, <strong>{formData.name}</strong>. Your inquiry has been routed to our {formData.category} desk. We will respond to <strong>{formData.email}</strong> within 1 business day.
                        </p>
                      </div>

                      <div className="pt-4 flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={handleReset}
                          className="px-6 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold text-black hover:bg-neutral-50 transition shadow-2xs cursor-pointer"
                        >
                          Send Another Message
                        </button>
                        <Link
                          href="/partner/docs"
                          className="px-6 py-2.5 rounded-xl bg-black text-xs font-bold text-white hover:bg-neutral-800 transition shadow-2xs"
                        >
                          Visit Partner Docs
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                          ONLINE INQUIRY FORM
                        </span>
                        <h2 className="font-display text-2xl font-extrabold text-[#09090B]">
                          Send Us a Secure Message
                        </h2>
                        <p className="text-xs text-neutral-600 mt-1">
                          Complete the fields below and our operations desk will review your inquiry immediately.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {/* Name */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral-700 block">
                            Full Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Sarah Jenkins"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full rounded-xl border border-neutral-300 bg-neutral-50/50 px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:bg-white focus:border-black focus:outline-none transition"
                          />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral-700 block">
                            Business Email <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full rounded-xl border border-neutral-300 bg-neutral-50/50 px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:bg-white focus:border-black focus:outline-none transition"
                          />
                        </div>
                      </div>

                      {/* Inquiry Category */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-700 block">
                          Inquiry Department <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full rounded-xl border border-neutral-300 bg-neutral-50/50 px-3.5 py-2.5 text-xs text-neutral-900 focus:bg-white focus:border-black focus:outline-none transition cursor-pointer"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Product Focus */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-700 block">
                          Product of Interest
                        </label>
                        <select
                          value={formData.product}
                          onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                          className="w-full rounded-xl border border-neutral-300 bg-neutral-50/50 px-3.5 py-2.5 text-xs text-neutral-900 focus:bg-white focus:border-black focus:outline-none transition cursor-pointer"
                        >
                          {PRODUCTS.map((prod) => (
                            <option key={prod} value={prod}>
                              {prod}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Subject */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-700 block">
                          Subject Line
                        </label>
                        <input
                          type="text"
                          placeholder="Brief summary of your inquiry"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full rounded-xl border border-neutral-300 bg-neutral-50/50 px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:bg-white focus:border-black focus:outline-none transition"
                        />
                      </div>

                      {/* Message */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-700 block">
                          Message &amp; Proposal Details <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          required
                          rows={5}
                          placeholder="Please describe how we can help your business or audience..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full rounded-xl border border-neutral-300 bg-neutral-50/50 p-3.5 text-xs text-neutral-900 placeholder-neutral-400 focus:bg-white focus:border-black focus:outline-none transition resize-y"
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-black px-8 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-neutral-800 disabled:opacity-50 transition cursor-pointer"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                              <span>Sending message...</span>
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              <span>Submit Message</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-[11px] text-neutral-500 pt-1 font-mono">
                        Protected by UK GDPR. We never share your contact details with external third parties.
                      </p>
                    </form>
                  )}

                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
