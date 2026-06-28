'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Search, Clock, GraduationCap, BookOpen, ArrowRight, Laptop, BarChart3, Microscope, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const iconMap: Record<string, React.ElementType> = {
  'Computer Science & Engineering': Laptop,
  'Business Administration': BarChart3,
  'Data Science & AI': Microscope,
  'Electronics & Communication': Zap,
  'Mechanical Engineering': BookOpen,
  'Civil Engineering': BookOpen,
  'Biotechnology': Microscope,
};

interface Course {
  id: string;
  name: string;
  code: string;
  department_id: string;
  duration_years: number;
  degree_type: string;
  eligibility: string;
  fees_per_year: number;
  description: string;
  departments?: { name: string } | null;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDegree, setSelectedDegree] = useState('all');

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*, departments(name)')
        .order('name');

      if (error) {
        console.error('Error fetching courses:', error);
      } else {
        setCourses(data || []);
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDegree = selectedDegree === 'all' || course.degree_type === selectedDegree;
    return matchesSearch && matchesDegree;
  });

  const degrees = ['all', ...Array.from(new Set(courses.map((c) => c.degree_type)))];

  const getIcon = (name: string) => iconMap[name] || BookOpen;
  const formatFees = (fees: number) => fees ? `₹${fees.toLocaleString('en-IN')}` : 'N/A';
  const getDuration = (years: number) => `${years} Year${years > 1 ? 's' : ''}`;

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Academic Programs</span>
          <h1 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-poppins)] mt-2 mb-4">
            Explore Our Courses
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover world-class programs designed to prepare you for a successful career in your chosen field.
          </p>
        </motion.div>

        <motion.div {...fadeInUp} className="bg-card border border-border rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedDegree} onValueChange={setSelectedDegree}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Degree" />
              </SelectTrigger>
              <SelectContent>
                {degrees.map((deg) => (
                  <SelectItem key={deg} value={deg}>
                    {deg === 'all' ? 'All Degrees' : deg}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => {
              const Icon = getIcon(course.name);
              return (
                <motion.div
                  key={course.id}
                  {...fadeInUp}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium">
                      {course.degree_type}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold mb-2">{course.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" /> {getDuration(course.duration_years)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GraduationCap className="w-4 h-4" /> {course.eligibility || 'See details'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Annual Fee</p>
                      <p className="text-lg font-bold text-primary">{formatFees(course.fees_per_year)}</p>
                    </div>
                    <Link href="/admissions">
                      <Button size="sm" className="gap-1">
                        Apply <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No courses found matching your criteria.</p>
          </div>
        )}
      </div>
    </main>
  );
}
