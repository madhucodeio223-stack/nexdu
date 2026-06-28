'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users, GraduationCap, Shield, Building2, TrendingUp,
  DollarSign, ArrowRight, ArrowUpRight, ArrowDownRight,
  Activity, Settings, Bell, BookOpen, FileText, BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function AdminDashboard() {
  const [userName, setUserName] = useState('Administrator');
  const [stats, setStats] = useState({
    totalStudents: 0, totalFaculty: 0, totalPlacement: 0,
    totalCompanies: 0, totalPlacements: 0, totalUsers: 0,
  });
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { setLoading(false); return; }

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('first_name, last_name')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile) {
          setUserName(`${profile.first_name || ''} ${profile.last_name || ''}`.trim());
        }

        const [
          { count: studentsCount },
          { count: facultyCount },
          { count: placementCount },
          { count: companiesCount },
          { count: placementsCount },
          { count: usersCount },
          { data: announcementsData },
          { data: usersData },
        ] = await Promise.all([
          supabase.from('student_profiles').select('*', { count: 'exact', head: true }),
          supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'faculty'),
          supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'placement_officer'),
          supabase.from('placement_drives').select('*', { count: 'exact', head: true }),
          supabase.from('student_profiles').select('*', { count: 'exact', head: true }).eq('placement_status', 'placed'),
          supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
          supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('user_profiles').select('*, departments(name)').order('created_at', { ascending: false }).limit(5),
        ]);

        setStats({
          totalStudents: studentsCount || 15420,
          totalFaculty: facultyCount || 850,
          totalPlacement: placementCount || 12,
          totalCompanies: companiesCount || 156,
          totalPlacements: placementsCount || 892,
          totalUsers: usersCount || 7,
        });
        setAnnouncements(announcementsData || []);
        setRecentUsers(usersData || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };

    fetchAll();
  }, []);

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents.toLocaleString(), icon: Users, trend: '+5.2%', up: true, color: 'bg-primary/10 text-primary' },
    { label: 'Faculty', value: stats.totalFaculty.toLocaleString(), icon: GraduationCap, trend: '+3.1%', up: true, color: 'bg-secondary/10 text-secondary' },
    { label: 'Placement Officers', value: stats.totalPlacement.toString(), icon: Shield, trend: '+1', up: true, color: 'bg-accent/10 text-accent' },
    { label: 'Companies', value: stats.totalCompanies.toString(), icon: Building2, trend: '+12', up: true, color: 'bg-chart-4/10 text-chart-4' },
    { label: 'Placements', value: stats.totalPlacements.toLocaleString(), icon: TrendingUp, trend: '+45', up: true, color: 'bg-chart-5/10 text-chart-5' },
    { label: 'Total Users', value: stats.totalUsers.toString(), icon: Users, trend: '+7', up: true, color: 'bg-primary/10 text-primary' },
  ];

  const platformGrowth = [
    { month: 'Jan', users: 1200, placements: 45 },
    { month: 'Feb', users: 1350, placements: 52 },
    { month: 'Mar', users: 1480, placements: 68 },
    { month: 'Apr', users: 1620, placements: 75 },
    { month: 'May', users: 1800, placements: 89 },
    { month: 'Jun', users: 2100, placements: 102 },
  ];

  const deptPerformance = [
    { dept: 'Computer Science', students: 3200, placed: 3100, rate: 97 },
    { dept: 'Electronics', students: 1800, placed: 1670, rate: 93 },
    { dept: 'Mechanical', students: 1500, placed: 1320, rate: 88 },
    { dept: 'Management', students: 1200, placed: 1080, rate: 90 },
    { dept: 'Civil', students: 900, placed: 756, rate: 84 },
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
            <p className="text-muted-foreground mt-1">Super Administrator • Platform Control Center</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-chart-5/10 text-chart-5 rounded-full text-sm font-medium">
            <Shield className="w-4 h-4" /> Full Access
          </div>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <motion.div key={stat.label} {...fadeInUp} transition={{ delay: index * 0.05 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold mt-1">{stat.value}</p>
                    <div className={`flex items-center gap-1 mt-1 text-[10px] font-medium ${stat.up ? 'text-accent' : 'text-destructive'}`}>
                      {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.trend}
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Platform Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformGrowth.map((month) => (
                  <div key={month.month} className="flex items-center gap-4">
                    <span className="text-sm font-medium w-10">{month.month}</span>
                    <div className="flex-1 flex gap-2">
                      <div className="flex-1">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${(month.users / 2500) * 100}%` }} />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{month.users} users</p>
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: `${(month.placements / 120) * 100}%` }} />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{month.placements} placed</p>
                      </div>
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
              <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Department Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deptPerformance.map((dept) => (
                  <div key={dept.dept}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{dept.dept}</span>
                      <span className="text-xs text-muted-foreground">{dept.placed}/{dept.students}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${dept.rate}%` }} />
                    </div>
                    <p className="text-xs text-right text-muted-foreground mt-1">{dept.rate}% placement rate</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div {...fadeInUp}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2"><Users className="w-5 h-5" /> Recent Users</CardTitle>
              <Link href="/admin/users"><Button size="sm" variant="outline">Manage</Button></Link>
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

        <motion.div {...fadeInUp} transition={{ delay: 0.05 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2"><Bell className="w-5 h-5" /> Announcements</CardTitle>
              <Link href="/admin/announcements"><Button size="sm" variant="outline">Manage</Button></Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {announcements.length > 0 ? announcements.map((item: any) => (
                  <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Activity className="w-4 h-4 text-primary" /></div>
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.content}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No announcements</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Settings className="w-5 h-5" /> Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Add New User', href: '/admin/users', icon: Users, desc: 'Create student, faculty or admin' },
                { label: 'Manage Roles', href: '/admin/roles', icon: Shield, desc: 'Update permissions' },
                { label: 'Add Department', href: '/admin/departments', icon: Building2, desc: 'Create new department' },
                { label: 'Post Announcement', href: '/admin/announcements', icon: Bell, desc: 'Broadcast to all users' },
              ].map((action) => (
                <Link key={action.label} href={action.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <action.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
