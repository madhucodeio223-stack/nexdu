'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users, BookOpen, Calendar, ClipboardCheck, TrendingUp,
  ArrowRight, CheckCircle2, AlertTriangle, BarChart3,
  GraduationCap, Award, FileText, MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function FacultyDashboard() {
  const [userName, setUserName] = useState('Faculty');
  const [userData, setUserData] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceToday, setAttendanceToday] = useState(0);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { setLoading(false); return; }

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('first_name, last_name, role, email, departments(name)')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile) {
          setUserName(`${profile.first_name || ''} ${profile.last_name || ''}`.trim());
          setUserData(profile);
        }

        const [
          { data: studentsData },
          { count: attendanceCount },
          { data: assessmentsData },
        ] = await Promise.all([
          supabase.from('student_profiles').select('*, user_profiles(first_name, last_name, email), courses(name)').order('created_at', { ascending: false }).limit(5),
          supabase.from('attendance_records').select('*', { count: 'exact', head: true }).eq('date', new Date().toISOString().split('T')[0]).eq('status', 'present'),
          supabase.from('assessments').select('*').order('created_at', { ascending: false }).limit(5),
        ]);

        setStudents(studentsData || []);
        setAttendanceToday(attendanceCount || 0);
        setAssessments(assessmentsData || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };

    fetchAll();
  }, []);

  const stats = [
    { label: 'Assigned Students', value: students.length.toString(), icon: Users, color: 'bg-primary/10 text-primary' },
    { label: 'Attendance Today', value: `${attendanceToday}%`, icon: Calendar, color: 'bg-accent/10 text-accent' },
    { label: 'Subjects', value: '4', icon: BookOpen, color: 'bg-secondary/10 text-secondary' },
    { label: 'Assessments', value: assessments.length.toString(), icon: ClipboardCheck, color: 'bg-chart-4/10 text-chart-4' },
    { label: 'Placement Ready', value: '78%', icon: TrendingUp, color: 'bg-chart-5/10 text-chart-5' },
    { label: 'Avg Performance', value: '82%', icon: Award, color: 'bg-primary/10 text-primary' },
  ];

  const studentPerformance = [
    { name: 'Alex Johnson', roll: 'CSE202301', attendance: 95, marks: 88, placement: 'ready', trend: 'up' },
    { name: 'Priya Sharma', roll: 'CSE202302', attendance: 92, marks: 94, placement: 'ready', trend: 'up' },
    { name: 'Ryan Kim', roll: 'CSE202303', attendance: 78, marks: 72, placement: 'at_risk', trend: 'down' },
    { name: 'Emma Davis', roll: 'CSE202304', attendance: 88, marks: 85, placement: 'ready', trend: 'up' },
    { name: 'James Wilson', roll: 'CSE202305', attendance: 65, marks: 58, placement: 'not_ready', trend: 'down' },
  ];

  const attendanceTrend = [
    { day: 'Mon', rate: 94 },
    { day: 'Tue', rate: 92 },
    { day: 'Wed', rate: 88 },
    { day: 'Thu', rate: 96 },
    { day: 'Fri', rate: 90 },
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
            <p className="text-muted-foreground mt-1">{userData?.departments?.name || 'Computer Science'} Department • Faculty Portal</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
            <GraduationCap className="w-4 h-4" /> Active Faculty
          </div>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} {...fadeInUp} transition={{ delay: index * 0.05 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...fadeInUp}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2"><Users className="w-5 h-5" /> Student Monitoring</CardTitle>
              <Link href="/faculty/students"><Button size="sm" variant="outline">View All</Button></Link>
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
                      <span className={`px-2 py-0.5 rounded-full font-medium ${
                        student.placement === 'ready' ? 'bg-accent/10 text-accent' :
                        student.placement === 'at_risk' ? 'bg-amber-500/10 text-amber-600' :
                        'bg-destructive/10 text-destructive'
                      }`}>{student.placement === 'ready' ? 'Ready' : student.placement === 'at_risk' ? 'At Risk' : 'Not Ready'}</span>
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
              <CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Attendance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendanceTrend.map((day) => (
                  <div key={day.day}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{day.day}</span>
                      <span className="text-xs text-muted-foreground">{day.rate}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${day.rate}%` }} />
                    </div>
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
              <CardTitle className="text-lg flex items-center gap-2"><ClipboardCheck className="w-5 h-5" /> Assessments</CardTitle>
              <Link href="/faculty/assessments"><Button size="sm" variant="outline">Manage</Button></Link>
            </CardHeader>
            <CardContent>
              {assessments.length > 0 ? (
                <div className="space-y-3">
                  {assessments.map((a: any) => (
                    <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><FileText className="w-4 h-4 text-primary" /></div>
                        <div>
                          <p className="text-sm font-medium">{a.title}</p>
                          <p className="text-xs text-muted-foreground">{a.assessment_type} • Max: {a.max_marks}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No assessments created</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Department Placement Readiness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { dept: 'Computer Science', ready: 85, atRisk: 10, notReady: 5 },
                  { dept: 'Electronics', ready: 78, atRisk: 15, notReady: 7 },
                  { dept: 'Mechanical', ready: 72, atRisk: 18, notReady: 10 },
                  { dept: 'Management', ready: 88, atRisk: 8, notReady: 4 },
                ].map((dept) => (
                  <div key={dept.dept}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{dept.dept}</span>
                      <span className="text-xs text-accent font-medium">{dept.ready}% Ready</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                      <div className="h-full bg-accent rounded-l-full" style={{ width: `${dept.ready}%` }} />
                      <div className="h-full bg-amber-500" style={{ width: `${dept.atRisk}%` }} />
                      <div className="h-full bg-destructive rounded-r-full" style={{ width: `${dept.notReady}%` }} />
                    </div>
                    <div className="flex gap-3 mt-1 text-[10px]">
                      <span className="text-accent">Ready {dept.ready}%</span>
                      <span className="text-amber-500">At Risk {dept.atRisk}%</span>
                      <span className="text-destructive">Not Ready {dept.notReady}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div {...fadeInUp}>
        <Card className="border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Students Need Attention</p>
                <p className="text-xs text-muted-foreground">5 students have attendance below 75% and may need placement readiness intervention.</p>
              </div>
              <Link href="/faculty/students" className="ml-auto"><Button size="sm" variant="outline">Review</Button></Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
