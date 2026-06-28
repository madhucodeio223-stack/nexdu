'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ClipboardList, FileCheck, CreditCard, CheckCircle2, ArrowRight,
  Calendar, BookOpen, AlertCircle, GraduationCap, Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function AdmissionsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    marks10th: '',
    marks12th: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const steps = [
    {
      icon: ClipboardList,
      title: 'Online Application',
      desc: 'Fill out the online application form with your personal and academic details.',
    },
    {
      icon: Upload,
      title: 'Document Upload',
      desc: 'Upload required documents including marksheets, ID proof, and photographs.',
    },
    {
      icon: FileCheck,
      title: 'Entrance Exam',
      desc: 'Appear for the entrance examination or submit valid test scores.',
    },
    {
      icon: CheckCircle2,
      title: 'Merit List',
      desc: 'Check your name in the merit list based on academic performance and exam scores.',
    },
    {
      icon: CreditCard,
      title: 'Fee Payment',
      desc: 'Secure your admission by paying the admission fee within the deadline.',
    },
  ];

  const importantDates = [
    { event: 'Application Opens', date: 'January 15, 2026', status: 'Open' },
    { event: 'Last Date to Apply', date: 'March 31, 2026', status: 'Upcoming' },
    { event: 'Entrance Exam', date: 'April 15-20, 2026', status: 'Upcoming' },
    { event: 'Result Declaration', date: 'May 5, 2026', status: 'Upcoming' },
    { event: 'Counseling & Admission', date: 'May 10-25, 2026', status: 'Upcoming' },
    { event: 'Classes Begin', date: 'August 1, 2026', status: 'Upcoming' },
  ];

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Admissions 2026</span>
          <h1 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-poppins)] mt-2 mb-4">
            Begin Your Academic Journey
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join one of India&apos;s premier institutions. Our admissions process is designed to identify and nurture talented individuals.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div {...fadeInUp} className="mb-16">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-center mb-10">
            Admission Process
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="relative bg-card border border-border rounded-2xl p-6 text-center"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {index + 1}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tabs: Apply & Important Dates */}
        <motion.div {...fadeInUp} className="mb-16">
          <Tabs defaultValue="apply" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="apply">Apply Online</TabsTrigger>
              <TabsTrigger value="dates">Important Dates</TabsTrigger>
            </TabsList>

            <TabsContent value="apply">
              <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8">
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Application Submitted!</h3>
                    <p className="text-muted-foreground mb-6">
                      Your application has been received. We will review it and contact you shortly with the next steps.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Application Reference: <span className="font-mono font-medium">APP-{Date.now().toString(36).toUpperCase()}</span>
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-xl font-semibold mb-6">Online Application Form</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="course">Preferred Course *</Label>
                        <Select
                          value={formData.course}
                          onValueChange={(val) => setFormData({ ...formData, course: val })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select course" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cse">Computer Science & Engineering</SelectItem>
                            <SelectItem value="ece">Electronics & Communication</SelectItem>
                            <SelectItem value="me">Mechanical Engineering</SelectItem>
                            <SelectItem value="ce">Civil Engineering</SelectItem>
                            <SelectItem value="mba">Business Administration</SelectItem>
                            <SelectItem value="dsai">Data Science & AI</SelectItem>
                            <SelectItem value="bt">Biotechnology</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="marks10th">10th Percentage *</Label>
                        <Input
                          id="marks10th"
                          required
                          value={formData.marks10th}
                          onChange={(e) => setFormData({ ...formData, marks10th: e.target.value })}
                          placeholder="e.g., 85.5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="marks12th">12th Percentage *</Label>
                        <Input
                          id="marks12th"
                          required
                          value={formData.marks12th}
                          onChange={(e) => setFormData({ ...formData, marks12th: e.target.value })}
                          placeholder="e.g., 88.0"
                        />
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p>By submitting this form, you agree to our terms and conditions. All information provided will be verified during the admission process.</p>
                    </div>
                    <Button type="submit" className="w-full gap-2">
                      Submit Application <ArrowRight className="w-4 h-4" />
                    </Button>
                  </form>
                )}
              </div>
            </TabsContent>

            <TabsContent value="dates">
              <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-8">
                <h3 className="text-xl font-semibold mb-6">Admission Calendar 2026</h3>
                <div className="space-y-4">
                  {importantDates.map((item, index) => (
                    <div
                      key={item.event}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{item.event}</p>
                          <p className="text-sm text-muted-foreground">{item.date}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === 'Open'
                          ? 'bg-accent/10 text-accent'
                          : 'bg-muted-foreground/10 text-muted-foreground'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Eligibility */}
        <motion.div {...fadeInUp} className="mb-16">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-center mb-10">
            Eligibility Criteria
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Undergraduate (B.Tech)',
                items: [
                  '10+2 with Physics, Chemistry, Mathematics',
                  'Minimum 60% aggregate in PCM',
                  'Valid JEE Main score',
                  'Age: 17-25 years',
                ],
              },
              {
                title: 'Postgraduate (M.Tech/MBA)',
                items: [
                  'Bachelor\'s degree in relevant field',
                  'Minimum 60% or equivalent CGPA',
                  'Valid GATE/CAT score',
                  'Work experience preferred for MBA',
                ],
              },
              {
                title: 'Diploma & Certificate',
                items: [
                  '10+2 in any stream',
                  'Minimum 50% aggregate',
                  'Entrance test for specific courses',
                  'No age limit',
                ],
              },
            ].map((category, index) => (
              <motion.div
                key={category.title}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-4">{category.title}</h3>
                <ul className="space-y-3">
                  {category.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div {...fadeInUp} className="text-center bg-gradient-to-r from-primary to-secondary rounded-2xl p-12">
          <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] text-white mb-4">
            Have Questions?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Our admissions team is here to help you with any queries about courses, eligibility, or the application process.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="gap-2">
              Contact Admissions <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
