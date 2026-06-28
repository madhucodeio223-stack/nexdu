'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, Clock, Send, CheckCircle2,
  MessageSquare, Building2, GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contacts = [
    {
      icon: Phone,
      title: 'General Enquiry',
      details: ['+1 (555) 123-4567', '+1 (555) 123-4568'],
      color: 'bg-primary',
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['info@edunexus.edu', 'admissions@edunexus.edu'],
      color: 'bg-secondary',
    },
    {
      icon: Clock,
      title: 'Office Hours',
      details: ['Mon - Fri: 9:00 AM - 5:00 PM', 'Sat: 9:00 AM - 1:00 PM'],
      color: 'bg-accent',
    },
    {
      icon: MapPin,
      title: 'Campus Address',
      details: ['123 University Avenue', 'Tech City, TC 12345'],
      color: 'bg-chart-4',
    },
  ];

  const departments = [
    { name: 'Admissions', email: 'admissions@edunexus.edu', phone: '+1 (555) 123-4569' },
    { name: 'Academics', email: 'academics@edunexus.edu', phone: '+1 (555) 123-4570' },
    { name: 'Finance', email: 'finance@edunexus.edu', phone: '+1 (555) 123-4571' },
    { name: 'Placement Cell', email: 'placement@edunexus.edu', phone: '+1 (555) 123-4572' },
    { name: 'Hostel', email: 'hostel@edunexus.edu', phone: '+1 (555) 123-4573' },
    { name: 'Library', email: 'library@edunexus.edu', phone: '+1 (555) 123-4574' },
  ];

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Get In Touch</span>
          <h1 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-poppins)] mt-2 mb-4">
            Contact Us
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We&apos;re here to help. Reach out to us for any queries about admissions, academics, or campus life.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <motion.div {...fadeInUp} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contacts.map((contact, index) => (
            <motion.div
              key={contact.title}
              {...fadeInUp}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 text-center"
            >
              <div className={`w-12 h-12 rounded-xl ${contact.color} flex items-center justify-center mx-auto mb-4`}>
                <contact.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{contact.title}</h3>
              {contact.details.map((detail) => (
                <p key={detail} className="text-sm text-muted-foreground">{detail}</p>
              ))}
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div {...fadeInUp}>
            <div className="bg-card border border-border rounded-2xl p-8">
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">
                    Thank you for reaching out. We will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-xl font-semibold mb-6">Send Us a Message</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
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
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(val) => setFormData({ ...formData, department: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admissions">Admissions</SelectItem>
                          <SelectItem value="academics">Academics</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="placement">Placement</SelectItem>
                          <SelectItem value="hostel">Hostel</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="What is this about?"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2">
                    <Send className="w-4 h-4" /> Send Message
                  </Button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Department Contacts */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <h3 className="text-xl font-semibold mb-6">Department Contacts</h3>
            <div className="space-y-4">
              {departments.map((dept, index) => (
                <motion.div
                  key={dept.name}
                  {...fadeInUp}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card border border-border rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{dept.name}</p>
                      <a href={`mailto:${dept.email}`} className="text-sm text-muted-foreground hover:text-primary">
                        {dept.email}
                      </a>
                    </div>
                  </div>
                  <a href={`tel:${dept.phone}`} className="text-sm text-primary hover:underline hidden sm:block">
                    {dept.phone}
                  </a>
                </motion.div>
              ))}
            </div>

            {/* Support Ticket */}
            <div className="mt-8 bg-muted/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <MessageSquare className="w-6 h-6 text-primary" />
                <h4 className="font-semibold">Need Immediate Help?</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Create a support ticket for technical issues or urgent queries. Our team responds within 2 hours.
              </p>
              <Button variant="outline" className="w-full gap-2">
                <GraduationCap className="w-4 h-4" /> Student Portal Support
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
