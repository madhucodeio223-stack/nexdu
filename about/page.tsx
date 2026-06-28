'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  GraduationCap, Target, Eye, Award, Users, Building2,
  BookOpen, Globe, Shield, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  established_date: string;
}

export default function AboutPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [deptCount, setDeptCount] = useState(12);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('departments').select('*').order('name');
      if (data) {
        setDepartments(data);
        setDeptCount(data.length);
      }
    };
    fetchData();
  }, []);

  const leadership = [
    { name: 'Dr. Michael Anderson', role: 'Vice Chancellor', initials: 'MA', color: 'bg-primary' },
    { name: 'Prof. Emily Roberts', role: 'Pro Vice Chancellor', initials: 'ER', color: 'bg-secondary' },
    { name: 'Dr. David Kumar', role: 'Registrar', initials: 'DK', color: 'bg-accent' },
    { name: 'Prof. Lisa Chang', role: 'Dean of Academics', initials: 'LC', color: 'bg-chart-4' },
  ];

  const accreditations = [
    { name: 'NAAC', grade: 'A++', desc: 'National Assessment and Accreditation Council' },
    { name: 'NBA', grade: 'Tier 1', desc: 'National Board of Accreditation' },
    { name: 'UGC', grade: 'Approved', desc: 'University Grants Commission' },
    { name: 'AICTE', grade: 'Approved', desc: 'All India Council for Technical Education' },
  ];

  const infrastructure = [
    { icon: Building2, title: 'Smart Campus', desc: '500-acre campus with smart classrooms and IoT-enabled facilities' },
    { icon: BookOpen, title: 'Central Library', desc: 'Digital library with 1M+ books, journals, and research databases' },
    { icon: Globe, title: 'Research Centers', desc: '25 specialized research centers with industry partnerships' },
    { icon: Shield, title: 'Safety First', desc: '24/7 security, medical facilities, and emergency response systems' },
  ];

  return (
    <main className="min-h-screen">
      <section className="pt-32 pb-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">About EduNexus</span>
            <h1 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-poppins)] leading-tight mt-3 mb-6">
              Building Tomorrow&apos;s Leaders Today
            </h1>
            <p className="text-lg text-muted-foreground">
              For over 25 years, EduNexus University has been at the forefront of educational innovation,
              combining academic excellence with cutting-edge technology to prepare students for a dynamic world.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div {...fadeInUp} className="bg-card border border-border rounded-2xl p-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To be a globally recognized center of excellence in higher education, fostering innovation,
                research, and holistic development of students who will lead positive change in society.
                We envision a future where technology and human potential converge to solve the world&apos;s
                most pressing challenges.
              </p>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-2xl p-8">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To provide transformative education through innovative pedagogy, world-class research,
                and industry collaboration. We are committed to nurturing critical thinking, ethical leadership,
                and entrepreneurial spirit in every student, preparing them to thrive in a rapidly evolving global landscape.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, value: '15,000+', label: 'Students' },
              { icon: Award, value: '850+', label: 'Faculty' },
              { icon: BookOpen, value: `${deptCount}`, label: 'Departments' },
              { icon: Globe, value: '50+', label: 'Countries' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="text-center bg-card border border-border rounded-2xl p-6"
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Leadership</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-poppins)] mt-2 mb-4">
              Meet Our Leadership Team
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadership.map((person, index) => (
              <motion.div
                key={person.name}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-lg transition-all"
              >
                <div className={`w-20 h-20 rounded-full ${person.color} flex items-center justify-center text-white text-xl font-bold mx-auto mb-4`}>
                  {person.initials}
                </div>
                <h3 className="font-semibold">{person.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{person.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Departments</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-poppins)] mt-2 mb-4">
              Academic Departments
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, index) => (
              <motion.div
                key={dept.id}
                {...fadeInUp}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">{dept.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">Code: {dept.code}</p>
                <p className="text-sm text-muted-foreground mt-2">{dept.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Quality Assurance</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-poppins)] mt-2 mb-4">
              Accreditations & Rankings
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {accreditations.map((acc, index) => (
              <motion.div
                key={acc.name}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{acc.name}</h3>
                <p className="text-primary font-semibold mt-1">{acc.grade}</p>
                <p className="text-sm text-muted-foreground mt-2">{acc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Campus</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-poppins)] mt-2 mb-4">
              World-Class Infrastructure
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {infrastructure.map((item, index) => (
              <motion.div
                key={item.title}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 bg-card border border-border rounded-2xl p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] text-white mb-4">
              Be Part of Our Legacy
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Join a community dedicated to excellence, innovation, and transformative education.
            </p>
            <Link href="/admissions">
              <Button size="lg" variant="secondary" className="gap-2">
                Apply Now <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
