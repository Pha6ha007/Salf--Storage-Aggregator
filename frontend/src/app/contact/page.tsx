'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Phone, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageHero } from '@/components/PageHero';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

const inputCls = (hasError: boolean) =>
  `w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
    hasError ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
  }`;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const body = `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nSubject: ${data.subject}\n\n${data.message}`;
    window.location.href = `mailto:support@storagecompare.ae?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">

        <PageHero
          title="Contact Us"
          subtitle="Have a question or need help? We're here — responses within 1 business day."
          breadcrumbs={[{ label: 'Contact' }]}
        />

        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-8">

              {/* Form — 3 cols */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl border border-gray-100 p-8"
                  style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                  {submitted ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                        style={{ background: 'linear-gradient(135deg,#d1fae5,#a7f3d0)' }}>
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Message Sent!</h3>
                      <p className="text-gray-500 text-sm mb-5">Your email client should have opened. We&apos;ll respond within 1 business day.</p>
                      <button onClick={() => setSubmitted(false)} className="text-blue-600 text-sm hover:underline">Send another message</button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">Name</label>
                          <input {...register('name')} type="text" className={inputCls(!!errors.name)} placeholder="Your name" />
                          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
                          <input {...register('email')} type="email" className={inputCls(!!errors.email)} placeholder="you@example.com" />
                          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">Phone (optional)</label>
                          <input {...register('phone')} type="tel" className={inputCls(false)} placeholder="+971..." />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">Subject</label>
                          <select {...register('subject')} className={inputCls(!!errors.subject)}>
                            <option value="">Select subject</option>
                            <option>General Inquiry</option>
                            <option>Booking Assistance</option>
                            <option>Become an Operator</option>
                            <option>Technical Support</option>
                            <option>Other</option>
                          </select>
                          {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Message</label>
                        <textarea {...register('message')} rows={5}
                          className={inputCls(!!errors.message)}
                          placeholder="How can we help?" />
                        {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
                      </div>

                      <button type="submit" disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: 'linear-gradient(145deg,#1d4ed8,#1A56DB)', boxShadow: '0 4px 14px rgba(26,86,219,0.25)' }}>
                        {isSubmitting ? 'Opening email...' : 'Send Message'}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Info — 2 cols */}
              <div className="lg:col-span-2 space-y-5">
                <div className="bg-white rounded-2xl border border-gray-100 p-6"
                  style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                  <h2 className="font-bold text-gray-900 mb-5">Get in Touch</h2>
                  <div className="space-y-5">
                    {[
                      { icon: Mail, label: 'Email', value: 'support@storagecompare.ae', href: 'mailto:support@storagecompare.ae' },
                      { icon: Phone, label: 'Phone', value: '+971 4 300 0000', href: 'tel:+97143000000' },
                    ].map(({ icon: Icon, label, value, href }) => (
                      <div key={label} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)' }}>
                          <Icon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-medium">{label}</p>
                          <a href={href} className="text-sm text-blue-600 hover:underline font-medium">{value}</a>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)' }}>
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Business Hours</p>
                        <p className="text-sm text-gray-700">Sun–Thu: 9:00 AM – 6:00 PM GST</p>
                        <p className="text-sm text-gray-400">Fri–Sat: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Operator CTA */}
                <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg,#060E1E,#0f2a5c)' }}>
                  <h3 className="font-semibold text-white mb-2 text-sm">Are you a warehouse operator?</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(147,197,253,0.75)' }}>
                    List your facility for free and start receiving bookings today.
                  </p>
                  <a href="/auth/register"
                    className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(145deg,#fbbf24,#f59e0b)', color: '#060E1E' }}>
                    Register as Operator <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
