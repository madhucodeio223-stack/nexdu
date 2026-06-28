'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users, BookOpen, Calendar, FileText, ClipboardList, Award,
  TrendingUp, ArrowRight, Clock, CheckCircle2, AlertCircle,
  MessageSquare, BarChart3, Microscope, GraduationCap, User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function FacultyDashboard() {
  const [userName, setUserName] = useState('Faculty');
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
          .select('first_name, last_name, role, email, created_at, departments(name)')
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
    { label: 'My Students', value: '156', icon: Users, color: 'bg-primary', progress: 78 },
    { label: 'Classes Today', value: '4', icon: BookOpen, color: 'bg-secondary', progress: 80 },
    { label: 'Pending Grades', value: '12', icon: FileText, color: 'bg-accent', progress: 60 },
    { label: 'Publications', value: '28', icon: Microscope, color: 'bg-chart-4', progress: 90 },
  ];

  const todayClasses = [
    { subject: 'Data Structures', time: '09:00 AM', room: 'Lab 301', students: 42, status: 'completed' },
    { subject: 'Algorithms', time: '11:00 AM', room: 'Hall B', students: 38, status: 'ongoing' },
    { subject: 'Machine Learning', time: '02:00 PM', room: 'Lab 205', students: 35, status: 'upcoming' },
    { subject: 'Research Methods', time: '04:00 PM', room: 'Seminar Hall', students: 15, status: 'upcoming' },
  ];

  const pendingTasks = [
    { title: 'Grade Mid-Term Papers', course: 'Data Structures', deadline: 'Today', priority: 'high' },
    { title: 'Review Project Submissions', course: 'Machine Learning', deadline: 'Tomorrow', priority: 'medium' },
    { title: 'Prepare Lecture Notes', course: 'Algorithms', deadline: '2 days', priority: 'medium' },
    { title: 'Submit Research Paper', course: 'Personal', deadline: '1 week', priority: 'low' },
  ];

  const studentPerformance = [
    { name: 'Alex Johnson', roll: 'CSE202301', attendance: 95, marks: 88, trend: 'up' },
    { name: 'Priya Sharma', roll: 'CSE202302', attendance: 92, marks: 94, trend: 'up' },
    { name: 'Ryan Kim', roll: 'CSE202303', attendance: 78, marks: 72, trend: 'down' },
    { name: 'Emma Davis', roll: 'CSE202304', attendance: 88, marks: 85, trend: 'up' },
    { name: 'James Wilson', roll: 'CSE202305', attendance: 65, marks: 58, trend: 'down' },
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
            <p className="text-muted-foreground mt-1">{userData?.departments?.name ? `${userData.departments.name} Department` : 'Computer Science Department'} • Associate Professor</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" /> Active Faculty
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
              <CardTitle className="text-lg">Today's Classes</CardTitle>
              <Link href="/dashboard/faculty/classes" className="text-sm text-primary hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayClasses.map((cls) => (
                  <div key={cls.subject} className={`flex items-center gap-4 p-3 rounded-xl ${cls.status === 'ongoing' ? 'bg-primary/5 border border-primary/20' : cls.status === 'completed' ? 'bg-muted/30' : 'bg-muted/50'}`}>
                    <div className={`w-2 h-10 rounded-full flex-shrink-0 ${cls.status === 'ongoing' ? 'bg-primary' : cls.status === 'completed' ? 'bg-accent' : 'bg-muted-foreground/30'}`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{cls.subject}</p>
                      <p className="text-xs text-muted-foreground">{cls.room} • {cls.students} students</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{cls.time}</p>
                      {cls.status === 'ongoing' && <span className="text-xs text-primary font-medium">In Progress</span>}
                      {cls.status === 'completed' && <span className="text-xs text-accent font-medium">Done</span>}
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
              <CardTitle className="text-lg flex items-center gap-2"><ClipboardList className="w-5 h-5" /> Pending Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingTasks.map((task, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${task.priority === 'high' ? 'bg-destructive' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-muted-foreground'}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.course}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${task.deadline === 'Today' ? 'bg-destructive/10 text-destructive' : 'bg-muted-foreground/10 text-muted-foreground'}`}>{task.deadline}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...fadeInUp}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Student Performance</CardTitle>
              <Link href="/dashboard/faculty/students" className="text-sm text-primary hover:underline">View All</Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {studentPerformance.map((student) => (
                  <div key={student.roll} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">{student.name.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.roll}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-muted-foreground">Att: {student.attendance}%</span>
                      <span className="font-medium">{student.marks}%</span>
                      <TrendingUp className={`w-3 h-3 ${student.trend === 'up' ? 'text-accent' : 'text-destructive'}`} />
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
              <CardTitle className="text-lg">Announcements</CardTitle>
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

      {userData && (
        <motion.div {...fadeInUp}>
          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><User className="w-5 h-5" /> My Profile</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-muted/50"><p className="text-xs text-muted-foreground">Full Name</p><p className="font-medium">{userName}</p></div>
                <div className="p-4 rounded-xl bg-muted/50"><p className="text-xs text-muted-foreground">Email</p><p className="font-medium">{userData.email}</p></div>
                <div className="p-4 rounded-xl bg-muted/50"><p className="text-xs text-muted-foreground">Department</p><p className="font-medium">{userData.departments?.name || 'Computer Science'}</p></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
