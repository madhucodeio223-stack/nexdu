'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  GraduationCap, Users, BookOpen, Award, Calendar, MapPin,
  Phone, Mail, ArrowRight, ChevronRight, Star, TrendingUp,
  Building2, Laptop, Microscope, Globe, Clock, CheckCircle2,
  BarChart3, MessageSquare, Shield, Zap, Menu, X, Moon, Sun, Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { supabase } from '@/lib/supabase';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Courses', href: '/courses' },
    { label: 'Admissions', href: '/admissions' },
    { label: 'Faculty', href: '/faculty' },
    { label: 'Placements', href: '/placements' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl shadow-lg border-b border-border/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold font-[family-name:var(--font-poppins)] text-foreground">
                EduNexus
              </span>
              <span className="block text-[10px] text-muted-foreground -mt-1 tracking-wider uppercase">
                University ERP
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent/50"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-accent/50 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="hidden sm:flex">Get Started</Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent/50"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border"
        >
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent/50"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              AI-Powered Education Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-poppins)] leading-tight mb-6">
              Shaping Future{' '}
              <span className="text-primary">Leaders</span> Through
              Excellence in Education
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              A comprehensive university management system empowering students, faculty, and administration with cutting-edge technology and AI-driven insights.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/admissions">
                <Button size="lg" className="gap-2">
                  Apply Now <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="gap-2">
                  Explore Courses <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-10">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-background bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-xs font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Trusted by 15,000+ students</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl" />
              <div className="relative bg-card border border-border rounded-3xl p-6 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-primary/10 rounded-2xl p-4">
                      <Users className="w-8 h-8 text-primary mb-2" />
                      <p className="text-2xl font-bold">15,000+</p>
                      <p className="text-sm text-muted-foreground">Students</p>
                    </div>
                    <div className="bg-accent/10 rounded-2xl p-4">
                      <Award className="w-8 h-8 text-accent mb-2" />
                      <p className="text-2xl font-bold">98%</p>
                      <p className="text-sm text-muted-foreground">Placement Rate</p>
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="bg-secondary/10 rounded-2xl p-4">
                      <BookOpen className="w-8 h-8 text-secondary mb-2" />
                      <p className="text-2xl font-bold">200+</p>
                      <p className="text-sm text-muted-foreground">Courses</p>
                    </div>
                    <div className="bg-chart-4/10 rounded-2xl p-4">
                      <Globe className="w-8 h-8 text-chart-4 mb-2" />
                      <p className="text-2xl font-bold">50+</p>
                      <p className="text-sm text-muted-foreground">Countries</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 bg-muted rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Academic Performance</span>
                    <TrendingUp className="w-4 h-4 text-accent" />
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div className="h-full w-[92%] bg-gradient-to-r from-primary to-secondary rounded-full" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">92% Average GPA</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { icon: Users, value: 15000, suffix: '+', label: 'Students Enrolled', color: 'text-primary' },
    { icon: GraduationCap, value: 850, suffix: '+', label: 'Faculty Members', color: 'text-secondary' },
    { icon: Building2, value: 12, suffix: '', label: 'Departments', color: 'text-accent' },
    { icon: Award, value: 98, suffix: '%', label: 'Placement Rate', color: 'text-chart-4' },
    { icon: Globe, value: 500, suffix: '+', label: 'Research Papers', color: 'text-chart-5' },
    { icon: Star, value: 25, suffix: '+', label: 'Years of Excellence', color: 'text-primary' },
  ];

  return (
    <section className="py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
              <p className="text-3xl font-bold font-[family-name:var(--font-poppins)]">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Laptop,
      title: 'Smart Learning',
      description: 'AI-powered personalized learning paths with adaptive assessments and real-time progress tracking.',
    },
    {
      icon: Shield,
      title: 'Secure Campus',
      description: 'Advanced security with biometric attendance, visitor management, and 24/7 surveillance integration.',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics for academic performance, attendance trends, and institutional insights.',
    },
    {
      icon: MessageSquare,
      title: 'Unified Communication',
      description: 'Seamless communication between students, faculty, parents, and administration in one platform.',
    },
    {
      icon: Microscope,
      title: 'Research Hub',
      description: 'State-of-the-art research facilities with publication tracking and collaboration tools.',
    },
    {
      icon: Clock,
      title: 'Smart Scheduling',
      description: 'Intelligent timetable management with conflict resolution and resource optimization.',
    },
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Why Choose Us</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-poppins)] mt-2 mb-4">
            World-Class Education Platform
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive ERP system delivers cutting-edge tools for modern education management
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoursesPreviewSection() {
  const courses = [
    { name: 'Computer Science & Engineering', duration: '4 Years', degree: 'B.Tech', icon: Laptop },
    { name: 'Business Administration', duration: '2 Years', degree: 'MBA', icon: BarChart3 },
    { name: 'Data Science & AI', duration: '2 Years', degree: 'M.Tech', icon: Microscope },
    { name: 'Electronics & Communication', duration: '4 Years', degree: 'B.Tech', icon: Zap },
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Academic Programs</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-poppins)] mt-2">
              Popular Courses
            </h2>
          </div>
          <Link href="/courses" className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View All Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                <course.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-semibold mb-2 line-clamp-2">{course.name}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {course.duration}
                </span>
                <span className="px-2 py-0.5 bg-secondary/10 text-secondary rounded-full text-xs font-medium">
                  {course.degree}
                </span>
              </div>
              <Link href="/admissions">
                <Button variant="ghost" size="sm" className="mt-4 gap-1 p-0 h-auto">
                  Apply Now <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Dr. Sarah Mitchell',
      role: 'Professor of Computer Science',
      content: 'EduNexus has transformed how we manage academic operations. The AI-powered insights help us identify at-risk students early and improve outcomes.',
      avatar: 'SM',
    },
    {
      name: 'James Chen',
      role: 'Final Year Student, B.Tech CSE',
      content: 'The platform made course registration, assignment submission, and tracking my academic progress incredibly seamless. Best university experience!',
      avatar: 'JC',
    },
    {
      name: 'Prof. Robert Williams',
      role: 'Head of Placement Cell',
      content: 'Our placement rates increased by 15% since adopting EduNexus. The recruitment management and student profiling tools are exceptional.',
      avatar: 'RW',
    },
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-poppins)] mt-2 mb-4">
            What Our Community Says
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 relative"
            >
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">{t.content}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlacementsSection() {
  const recruiters = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Tesla', 'Adobe'];

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Career Success</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-poppins)] mt-2 mb-4">
            Top Recruiters
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Our students are placed at leading global companies with competitive packages
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {recruiters.map((company, index) => (
            <motion.div
              key={company}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-card border border-border rounded-xl p-6 flex items-center justify-center h-20 font-semibold text-muted-foreground hover:border-primary/50 hover:text-primary transition-all"
            >
              {company}
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { label: 'Highest Package', value: '45 LPA', sub: 'International Offer' },
            { label: 'Average Package', value: '12 LPA', sub: 'Domestic Offer' },
            { label: 'Companies Visited', value: '250+', sub: 'This Academic Year' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 text-center"
            >
              <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
              <p className="font-medium text-sm">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewsEventsSection() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: a }, { data: e }] = await Promise.all([
        supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(3),
        supabase.from('events').select('*').order('event_date', { ascending: true }).limit(3),
      ]);
      setAnnouncements(a || []);
      setEvents(e || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div {...fadeInUp}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-primary font-medium text-sm uppercase tracking-wider">Latest</span>
                <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] mt-1">News & Announcements</h2>
              </div>
              <Link href="/about" className="text-sm text-primary hover:underline">View All</Link>
            </div>
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-20 bg-muted rounded-xl" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-card border border-border rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bell className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.content}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full mt-2 inline-block ${
                        item.priority === 'high' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                      }`}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-primary font-medium text-sm uppercase tracking-wider">Upcoming</span>
                <h2 className="text-2xl font-bold font-[family-name:var(--font-poppins)] mt-1">Events Calendar</h2>
              </div>
              <Link href="/about" className="text-sm text-primary hover:underline">View All</Link>
            </div>
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-20 bg-muted rounded-xl" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="flex gap-4 p-4 bg-card border border-border rounded-xl">
                    <div className="w-12 h-12 rounded-lg bg-secondary/10 flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-secondary">{new Date(event.event_date).toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-sm font-bold text-secondary">{new Date(event.event_date).getDate()}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{event.location}</p>
                      <span className="text-[10px] text-muted-foreground mt-1 block">{event.event_time?.slice(0,5)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-poppins)] text-white mb-4">
            Begin Your Journey Today
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students who have transformed their careers through our world-class education platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/admissions">
              <Button size="lg" variant="secondary" className="gap-2">
                Apply for Admission <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2">
                Contact Us <Phone className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  const footerLinks = {
    'Academics': ['Courses', 'Departments', 'Faculty', 'Research', 'Library'],
    'Admissions': ['Apply Now', 'Eligibility', 'Fee Structure', 'Scholarships', 'FAQs'],
    'Campus Life': ['Hostels', 'Sports', 'Clubs', 'Events', 'Cafeteria'],
    'Resources': ['Student Portal', 'Faculty Portal', 'Parent Portal', 'Alumni Network', 'Career Center'],
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold font-[family-name:var(--font-poppins)]">EduNexus</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Empowering education through technology. A comprehensive platform for modern university management.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" /> 123 University Avenue, Tech City
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" /> +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" /> info@edunexus.edu
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EduNexus University. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CoursesPreviewSection />
      <TestimonialsSection />
      <PlacementsSection />
      <NewsEventsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
