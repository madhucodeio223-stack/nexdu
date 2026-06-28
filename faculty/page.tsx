'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Mail, BookOpen, Award, GraduationCap, Star,
  FileText, Clock
} from 'lucide-react';
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

interface FacultyMember {
  id: string;
  employee_id: string;
  designation: string;
  qualification: string;
  specialization: string;
  experience_years: number;
  publications: any[];
  user_profiles: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  departments?: {
    name: string;
  } | null;
}

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  useEffect(() => {
    const fetchFaculty = async () => {
      const { data, error } = await supabase
        .from('faculty')
        .select('*, user_profiles(first_name, last_name, email), departments(name)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching faculty:', error);
      } else {
        setFaculty(data || []);
      }
      setLoading(false);
    };

    fetchFaculty();
  }, []);

  const filteredFaculty = faculty.filter((f) => {
    const fullName = `${f.user_profiles?.first_name || ''} ${f.user_profiles?.last_name || ''}`.trim();
    const matchesSearch = fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.specialization || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'all' || f.departments?.name === selectedDept;
    return matchesSearch && matchesDept;
  });

  const departments = ['all', ...Array.from(new Set(faculty.map((f) => f.departments?.name).filter(Boolean))) as string[]];

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${(firstName || '').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase();
  };

  const getPubCount = (pubs: any) => {
    if (Array.isArray(pubs)) return pubs.length;
    try {
      const parsed = JSON.parse(pubs);
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Our Team</span>
          <h1 className="text-4xl sm:text-5xl font-bold font-[family-name:var(--font-poppins)] mt-2 mb-4">
            Distinguished Faculty
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn from world-class educators and researchers who are passionate about shaping the next generation of leaders.
          </p>
        </motion.div>

        <motion.div {...fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search faculty by name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedDept} onValueChange={setSelectedDept}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFaculty.map((f, index) => {
              const fullName = `${f.user_profiles?.first_name || ''} ${f.user_profiles?.last_name || ''}`.trim();
              const initials = getInitials(f.user_profiles?.first_name, f.user_profiles?.last_name);
              return (
                <motion.div
                  key={f.id}
                  {...fadeInUp}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-lg font-bold">
                      {initials}
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-950 rounded-full">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium">4.8</span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg">{fullName || 'Faculty Member'}</h3>
                  <p className="text-sm text-primary font-medium">{f.designation}</p>
                  <p className="text-xs text-muted-foreground mt-1">{f.departments?.name || 'Department'}</p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GraduationCap className="w-4 h-4" />
                      {f.qualification || 'Ph.D.'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {f.experience_years || 0} years experience
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="w-4 h-4" />
                      {getPubCount(f.publications)} publications
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="w-4 h-4" />
                      {f.specialization || 'General'}
                    </div>
                  </div>

                  {f.user_profiles?.email && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <a
                        href={`mailto:${f.user_profiles.email}`}
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Mail className="w-4 h-4" />
                        {f.user_profiles.email}
                      </a>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && filteredFaculty.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No faculty found matching your criteria.</p>
          </div>
        )}
      </div>
    </main>
  );
}
