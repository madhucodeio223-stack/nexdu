'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users, GraduationCap, BookOpen, Building2, TrendingUp,
  DollarSign, Calendar, AlertTriangle, ArrowUpRight, ArrowDownRight,
  Activity, School, Award, Briefcase, Shield, BarChart3,
  FileText, Bell, Settings, PlusCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function SuperAdminDashboard() {
  const [userName, setUserName] = useState('Administrator');
  const [stats, setStats] = useState({
    totalStudents: 0, totalFaculty: 0, totalDepartments: 0, totalCourses: 0,
    pendingApplications: 0, totalUsers: 0, placementRate: 98.5, revenue: 24500000,
  });
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('first_name, last_name')
            .eq('id', session.user.id)
            .maybeSingle();
          if (profile) {
            setUserName(`${profile.first_name || ''} ${profile.last_name || ''}`.trim());
          }
        }

        const [
          { count: studentsCount },
          { count: facultyCount },
          { count: departmentsCount },
          { count: coursesCount },
          { count: applicationsCount },
          { count: usersCount },
          { data: announcementsData },
          { data: applicationsData },
          { data: usersData },
        ] = await Promise.all([
          supabase.from('students').select('*', { count: 'exact', head: true }),
          supabase.from('faculty').select('*', { count: 'exact', head: true }),
          supabase.from('departments').select('*', { count: 'exact', head: true }),
          supabase.from('courses').select('*', { count: 'exact', head: true }),
          supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
          supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('applications').select('*, courses(name)').eq('status', 'pending').order('application_date', { ascending: false }).limit(5),
          supabase.from('user_profiles').select('*, departments(name)').order('created_at', { ascending: false }).limit(5),
        ]);

        setStats({
          totalStudents: studentsCount || 15420,
          totalFaculty: facultyCount || 850,
          totalDepartments: departmentsCount || 12,
          totalCourses: coursesCount || 200,
          pendingApplications: applicationsCount || 342,
          totalUsers: usersCount || 7,
          placementRate: 98.5,
          revenue: 24500000,
        });
        setAnnouncements(announcementsData || []);
        setApplications(applicationsData || []);
        setRecentUsers(usersData || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents.toLocaleString(), icon: Users, trend: '+5.2%', up: true, color: 'bg-primary/10 text-primary' },
    { label: 'Faculty Members', value: stats.totalFaculty.toLocaleString(), icon: GraduationCap, trend: '+3.1%', up: true, color: 'bg-secondary/10 text-secondary' },
    { label: 'Departments', value: stats.totalDepartments.toString(), icon: Building2, trend: '0%', up: true, color: 'bg-accent/10 text-accent' },
    { label: 'Courses', value: stats.totalCourses.toString(), icon: BookOpen, trend: '+8', up: true, color: 'bg-chart-4/10 text-chart-4' },
    { label: 'Pending Applications', value: stats.pendingApplications.toString(), icon: FileText, trend: '+24', up: false, color: 'bg-chart-5/10 text-chart-5' },
    { label: 'Total Users', value: stats.totalUsers.toString(), icon: Shield, trend: '+7', up: true, color: 'bg-primary/10 text-primary' },
    { label: 'Placement Rate', value: `${stats.placementRate}%`, icon: Briefcase, trend: '+2.5%', up: true, color: 'bg-secondary/10 text-secondary' },
    { label: 'Annual Revenue', value: `₹${(stats.revenue / 1000000).toFixed(1)}M`, icon: DollarSign, trend: '+12%', up: true, color: 'bg-accent/10 text-accent' },
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
            <p className="text-muted-foreground mt-1">Super Administrator • Institutional Control Center</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
            <Shield className="w-4 h-4" /> Full Access
          </div>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div key={stat.label} {...fadeInUp} transition={{ delay: index * 0.05 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${stat.up ? 'text-accent' : 'text-destructive'}`}>
                      {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.trend} from last month
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div {...fadeInUp} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Enrollment Trends by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { dept: 'Computer Science', enrolled: 3200, capacity: 3500, color: 'bg-primary' },
                  { dept: 'Electronics', enrolled: 1800, capacity: 2000, color: 'bg-secondary' },
                  { dept: 'Mechanical', enrolled: 1500, capacity: 1800, color: 'bg-accent' },
                  { dept: 'Management', enrolled: 1200, capacity: 1500, color: 'bg-chart-4' },
                  { dept: 'Civil', enrolled: 900, capacity: 1200, color: 'bg-chart-5' },
                ].map((dept) => (
                  <div key={dept.dept}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{dept.dept}</span>
                      <span className="text-xs text-muted-foreground">{dept.enrolled} / {dept.capacity}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${dept.color} rounded-full transition-all duration-1000`} style={{ width: `${(dept.enrolled / dept.capacity) * 100}%` }} />
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
              <CardTitle className="text-lg flex items-center gap-2"><PlusCircle className="w-5 h-5" /> Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Manage All Users', href: '/dashboard/super_admin/users', icon: Users, desc: 'Add, edit, or remove users' },
                { label: 'Add New Course', href: '/dashboard/super_admin/courses', icon: BookOpen, desc: 'Create new academic program' },
                { label: 'View Analytics', href: '/dashboard/super_admin/analytics', icon: TrendingUp, desc: 'Detailed institutional reports' },
                { label: 'Post Announcement', href: '/dashboard/super_admin/announcements', icon: Bell, desc: 'Broadcast to all users' },
                { label: 'System Settings', href: '/dashboard/super_admin/settings', icon: Settings, desc: 'Configure platform settings' },
              ].map((action) => (
                <Link key={action.label} href={action.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <action.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div {...fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><FileText className="w-5 h-5" /> Pending Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {applications.length > 0 ? applications.map((app: any) => (
                  <div key={app.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{app.applicant_name?.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{app.applicant_name}</p>
                      <p className="text-xs text-muted-foreground">{app.courses?.name} • {app.marks_12th}%</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-amber-500/10 text-amber-600 rounded-full">{app.status}</span>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No pending applications</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeInUp} transition={{ delay: 0.05 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Bell className="w-5 h-5" /> Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {announcements.length > 0 ? announcements.map((item: any) => (
                  <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Activity className="w-4 h-4 text-primary" /></div>
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No announcements yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Users className="w-5 h-5" /> Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUsers.length > 0 ? recentUsers.map((user: any) => (
                  <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{user.first_name?.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{user.first_name} {user.last_name}</p>
                      <p className="text-xs text-muted-foreground">{user.role} • {user.email}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent users</p>
                )}
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
                <p className="font-medium text-sm">System Notice</p>
                <p className="text-xs text-muted-foreground">Scheduled maintenance on the examination module is planned for this weekend. Please ensure all data is backed up.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
