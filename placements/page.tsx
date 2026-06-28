'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  TrendingUp, Building2, DollarSign, Users, Briefcase,
  Award, ArrowRight, Star, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

interface PlacementJob {
  id: string;
  company_name: string;
  job_title: string;
  package_lpa: number;
  location: string;
  status: string;
}

export default function PlacementsPage() {
  const [jobs, setJobs] = useState<PlacementJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from('placement_jobs')
        .select('*')
        .eq('status', 'open')
        .order('package_lpa', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
      } else {
        setJobs(data || []);
      }
      setLoading(false);
    };

    fetchJobs();
  }, []);

  const stats = [
    { icon: TrendingUp, value: '98%', label: 'Placement Rate', sub: 'Consistently above 95%' },
    { icon: DollarSign, value: '45 LPA', label: 'Highest Package', sub: 'International offer' },
    { icon: Users, value: '250+', label: 'Companies', sub: 'Visited this year' },
    { icon: Award, value: '12 LPA', label: 'Average Package', sub: 'Domestic offers' },
  ];

  const recruiters = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Tesla', 'Adobe'];

  const placementTraining = [
    {
      title: 'Technical Skills',
      items: ['Data Structures & Algorithms', 'System Design', 'Coding Interviews', 'Project Portfolio'],
    },
    {
      title: 'Soft Skills',
      items: ['Communication', 'Leadership', 'Teamwork', 'Problem Solving'],
    },
    {
      title: 'Career Development',
      items: ['Resume Building', 'Mock Interviews', 'LinkedIn Optimization', 'Salary Negotiation'],
    },
  ];

  const successStories = [
    {
      name: 'Alex Johnson',
      role: 'Software Engineer',
      company: 'Google',
      package: '35 LPA',
      quote: 'The placement training and mentorship at EduNexus prepared me exceptionally well for tech interviews.',
    },
    {
      name: 'Priya Patel',
      role: 'Data Scientist',
      company: 'Microsoft',
      package: '28 LPA',
      quote: 'The AI/ML specialization and hands-on projects gave me a significant edge during campus placements.',
    },
    {
      name: 'Ryan Kim',
      role: 'Product Manager',
      company: 'Amazon',
      package: '32 LPA',
      quote: 'EduNexus connected me with industry mentors who guided my transition from engineering to product management.',
    },
  ];

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeInUp} className="text-center mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Career Success</span>
          <h1 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-poppins)] mt-2 mb-4">
            Placement & Career Center
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our dedicated placement cell ensures every student gets the opportunity to launch their dream career with top global companies.
          </p>
        </motion.div>

        <motion.div {...fadeInUp} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              {...fadeInUp}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 text-center"
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="font-medium text-sm mt-1">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div {...fadeInUp} className="mb-20">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-center mb-10">
            Top Recruiters
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {recruiters.map((company, index) => (
              <motion.div
                key={company}
                {...fadeInUp}
                transition={{ delay: index * 0.03 }}
                className="bg-card border border-border rounded-xl p-4 flex items-center justify-center h-16 font-semibold text-muted-foreground hover:border-primary/50 hover:text-primary transition-all text-sm"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <motion.div {...fadeInUp} className="mb-20">
            <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-center mb-10">
              Active Job Openings
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  {...fadeInUp}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary text-lg">
                      {job.company_name.charAt(0)}
                    </div>
                    <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
                      {job.package_lpa} LPA
                    </span>
                  </div>
                  <h3 className="font-semibold">{job.job_title}</h3>
                  <p className="text-sm text-muted-foreground">{job.company_name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{job.location}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div {...fadeInUp} className="mb-20">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-center mb-10">
            Placement Training Programs
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {placementTraining.map((program, index) => (
              <motion.div
                key={program.title}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-4">{program.title}</h3>
                <ul className="space-y-2">
                  {program.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeInUp} className="mb-20">
          <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] text-center mb-10">
            Student Success Stories
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {successStories.map((story, index) => (
              <motion.div
                key={story.name}
                {...fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">&ldquo;{story.quote}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{story.name}</p>
                    <p className="text-sm text-muted-foreground">{story.role} at {story.company}</p>
                  </div>
                  <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
                    {story.package}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeInUp} className="text-center bg-gradient-to-r from-primary to-secondary rounded-2xl p-12">
          <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)] text-white mb-4">
            Start Your Career Journey
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Connect with our placement cell to explore opportunities, attend workshops, and prepare for your dream job.
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="gap-2">
              Contact Placement Cell <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
