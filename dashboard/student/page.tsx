'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BookOpen, Calendar, FileText, Award, Wallet, TrendingUp,
  Clock, CheckCircle2, AlertCircle, ArrowRight, Bell, Star,
  BarChart3, GraduationCap, Library, Briefcase, User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function StudentDashboard() {
  const [userName, setUserName] = useState('Student');
  const [userData, setUserData] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { setLoading(false); return; }

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('first_name, last_name, role, email, created_at')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile) {
          setUserName(`${profile.first_name || ''} ${profile.last_name || ''}`.trim());
          setUserData(profile);
        }

        const { data: annData } = await supabase
          .from('announcements')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        setAnnouncements(annData || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };

    fetchAll();
  }, []);

  const stats = [
    { label: 'Attendance', value: '92%', icon: Calendar, color: 'bg-primary', progress: 92 },
    { label: 'CGPA', value: '8.7', icon: Star, color: 'bg-secondary', progress: 87 },
    { label: 'Assignments', value: '8/10', icon: FileText, color: 'bg-accent', progress: 80 },
    { label: 'Fee Status', value: 'Paid', icon: Wallet, color: 'bg-chart-4', progress: 100 },
  ];

  const upcomingClasses = [
    { subject: 'Data Structures', time: '09:00 AM', room: 'Lab 301', status: 'ongoing' },
    { subject: 'Machine Learning', time: '11:00 AM', room: 'Hall B', status: 'upcoming' },
    { subject: 'Database Systems', time: '02:00 PM', room: 'Lab 205', status: 'upcoming' },
    { subject: 'Software Engineering', time: '04:00 PM', room: 'Hall A', status: 'upcoming' },
  ];

  const assignments = [
    { title: 'AI Algorithm Implementation', subject: 'Machine Learning', due: 'Tomorrow', status: 'pending' },
    { title: 'Database Design Project', subject: 'DBMS', due: '3 days', status: 'pending' },
    { title: 'Web App Prototype', subject: 'Web Dev', due: '1 week', status: 'submitted' },
    { title: 'Research Paper Review', subject: 'Research Methods', due: '2 weeks', status: 'pending' },
  ];

  const academicPerformance = [
    { subject: 'Data Structures', marks: 88, grade: 'A', max: 100 },
    { subject: 'Machine Learning', marks: 92, grade: 'A+', max: 100 },
    { subject: 'Database Systems', marks: 85, grade: 'A', max: 100 },
    { subject: 'Software Engg', marks: 90, grade: 'A+', max: 100 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div {...fadeInUp}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-[family-name:var(--font-poppins)]">Welcome, {userName}</h1>
            <p className="text-muted-foreground mt-1">B.Tech Computer Science • 3rd Year • Roll: CSE202301</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" /> Semester Active
          </div>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} {...fadeInUp} transition={{ delay: index * 0.05 }}>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold">{stat.value}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${stat.progress}%` }} /></div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div {...fadeInUp} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Today's Schedule</CardTitle>
              <Link href="/dashboard/student/courses" className="text-sm text-primary hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingClasses.map((cls) => (
                  <div key={cls.subject} className={`flex items-center gap-4 p-3 rounded-xl ${cls.status === 'ongoing' ? 'bg-primary/5 border border-primary/20' : 'bg-muted/50'}`}>
                    <div className={`w-2 h-10 rounded-full ${cls.status === 'ongoing' ? 'bg-primary' : 'bg-muted-foreground/30'} flex-shrink-0`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{cls.subject}</p>
                      <p className="text-xs text-muted-foreground">{cls.room}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{cls.time}</p>
                      {cls.status === 'ongoing' && <span className="text-xs text-primary font-medium">In Progress</span>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Bell className="w-5 h-5" /> Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {announcements.length > 0 ? announcements.map((ann: any) => (
                  <div key={ann.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${ann.priority === 'high' ? 'bg-destructive' : 'bg-primary'}`} />
                    <div>
                      <p className="text-sm font-medium">{ann.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{ann.content}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No announcements</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...fadeInUp}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Assignments</CardTitle>
              <Link href="/dashboard/student/assignments" className="text-sm text-primary hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {assignments.map((assignment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${assignment.status === 'submitted' ? 'bg-accent/10' : 'bg-primary/10'}`}>
                        <FileText className={`w-4 h-4 ${assignment.status === 'submitted' ? 'text-accent' : 'text-primary'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{assignment.title}</p>
                        <p className="text-xs text-muted-foreground">{assignment.subject}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${assignment.status === 'submitted' ? 'bg-accent/10 text-accent' : 'bg-amber-500/10 text-amber-600'}`}>
                      {assignment.status === 'submitted' ? 'Done' : assignment.due}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'My Courses', href: '/dashboard/student/courses', icon: BookOpen, color: 'bg-primary/10 text-primary' },
                  { label: 'Attendance', href: '/dashboard/student/attendance', icon: Calendar, color: 'bg-secondary/10 text-secondary' },
                  { label: 'Library', href: '/dashboard/student/library', icon: Library, color: 'bg-accent/10 text-accent' },
                  { label: 'Placements', href: '/dashboard/student/placements', icon: Briefcase, color: 'bg-chart-4/10 text-chart-4' },
                  { label: 'Results', href: '/dashboard/student/results', icon: Award, color: 'bg-chart-5/10 text-chart-5' },
                  { label: 'Fee Status', href: '/dashboard/student/fees', icon: Wallet, color: 'bg-primary/10 text-primary' },
                ].map((link) => (
                  <Link key={link.label} href={link.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors">
                    <div className={`w-9 h-9 rounded-lg ${link.color} flex items-center justify-center`}><link.icon className="w-4 h-4" /></div>
                    <span className="text-sm font-medium">{link.label}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div {...fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Academic Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {academicPerformance.map((subj) => (
                <div key={subj.subject} className="text-center p-4 rounded-xl bg-muted/50">
                  <p className="text-sm font-medium mb-2">{subj.subject}</p>
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <svg className="w-16 h-16 transform -rotate-90"><circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-muted" /><circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray={`${(subj.marks / subj.max) * 175.9} 175.9`} className="text-primary" /></svg>
                    <div className="absolute inset-0 flex items-center justify-center"><span className="text-sm font-bold">{subj.marks}%</span></div>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">Grade: {subj.grade}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {userData && (
        <motion.div {...fadeInUp}>
          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><User className="w-5 h-5" /> My Profile</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-muted/50"><p className="text-xs text-muted-foreground">Full Name</p><p className="font-medium">{userName}</p></div>
                <div className="p-4 rounded-xl bg-muted/50"><p className="text-xs text-muted-foreground">Email</p><p className="font-medium">{userData.email}</p></div>
                <div className="p-4 rounded-xl bg-muted/50"><p className="text-xs text-muted-foreground">Role</p><p className="font-medium capitalize">{userData.role}</p></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
