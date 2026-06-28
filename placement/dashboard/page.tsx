'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users, Building2, CheckCircle2, Rocket, TrendingUp,
  DollarSign, ArrowRight, Search, Filter, Calendar,
  Briefcase, BarChart3, Star, Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function PlacementDashboard() {
  const [userName, setUserName] = useState('Placement Officer');
  const [stats, setStats] = useState({
    totalStudents: 0, eligibleStudents: 0, placedStudents: 0,
    activeDrives: 0, companiesVisiting: 0, placementPercentage: 0,
  });
  const [students, setStudents] = useState<any[]>([]);
  const [drives, setDrives] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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
          { count: totalStudents },
          { count: eligibleStudents },
          { count: placedStudents },
          { count: activeDrives },
          { data: studentsData },
          { data: drivesData },
          { data: appsData },
        ] = await Promise.all([
          supabase.from('student_profiles').select('*', { count: 'exact', head: true }),
          supabase.from('student_profiles').select('*', { count: 'exact', head: true }).gte('cgpa', 6.0),
          supabase.from('student_profiles').select('*', { count: 'exact', head: true }).eq('placement_status', 'placed'),
          supabase.from('placement_drives').select('*', { count: 'exact', head: true }).eq('status', 'upcoming'),
          supabase.from('student_profiles').select('*, user_profiles(first_name, last_name, email), courses(name)').order('created_at', { ascending: false }).limit(5),
          supabase.from('placement_drives').select('*').order('drive_date', { ascending: true }).limit(5),
          supabase.from('job_applications').select('*, student_profiles(profile_completion, cgpa), placement_drives(company_name)').order('applied_at', { ascending: false }).limit(5),
        ]);

        const total = totalStudents || 1;
        setStats({
          totalStudents: totalStudents || 0,
          eligibleStudents: eligibleStudents || 0,
          placedStudents: placedStudents || 0,
          activeDrives: activeDrives || 0,
          companiesVisiting: drivesData?.length || 0,
          placementPercentage: Math.round(((placedStudents || 0) / total) * 100),
        });
        setStudents(studentsData || []);
        setDrives(drivesData || []);
        setApplications(appsData || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };

    fetchAll();
  }, []);

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents.toString(), icon: Users, color: 'bg-primary/10 text-primary', trend: '+120' },
    { label: 'Eligible Students', value: stats.eligibleStudents.toString(), icon: CheckCircle2, color: 'bg-accent/10 text-accent', trend: '+45' },
    { label: 'Students Placed', value: stats.placedStudents.toString(), icon: Award, color: 'bg-chart-4/10 text-chart-4', trend: '+28' },
    { label: 'Active Drives', value: stats.activeDrives.toString(), icon: Rocket, color: 'bg-secondary/10 text-secondary', trend: '+3' },
    { label: 'Companies', value: stats.companiesVisiting.toString(), icon: Building2, color: 'bg-chart-5/10 text-chart-5', trend: '+5' },
    { label: 'Placement %', value: `${stats.placementPercentage}%`, icon: TrendingUp, color: 'bg-primary/10 text-primary', trend: '+2.5%' },
  ];

  const filteredStudents = students.filter((s) =>
    (s.user_profiles?.first_name + ' ' + s.user_profiles?.last_name).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.user_profiles?.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const placementByDept = [
    { dept: 'Computer Science', placed: 340, total: 350, rate: 97 },
    { dept: 'Electronics', placed: 280, total: 300, rate: 93 },
    { dept: 'Mechanical', placed: 220, total: 250, rate: 88 },
    { dept: 'Management', placed: 180, total: 200, rate: 90 },
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
            <p className="text-muted-foreground mt-1">Placement Cell • Campus Recruitment Management</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
            <Briefcase className="w-4 h-4" /> Placement Season Active
          </div>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <motion.div key={stat.label} {...fadeInUp} transition={{ delay: index * 0.05 }}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-accent font-medium">{stat.trend}</span>
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
              <CardTitle className="text-lg flex items-center gap-2"><Users className="w-5 h-5" /> Student Eligibility</CardTitle>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                <Input placeholder="Search students..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-7 h-8 text-sm w-48" />
              </div>
            </CardHeader>
            <CardContent>
              {filteredStudents.length > 0 ? (
                <div className="space-y-3">
                  {filteredStudents.map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{s.user_profiles?.first_name?.charAt(0)}</div>
                        <div>
                          <p className="text-sm font-medium">{s.user_profiles?.first_name} {s.user_profiles?.last_name}</p>
                          <p className="text-xs text-muted-foreground">{s.courses?.name} • CGPA: {s.cgpa}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          s.placement_status === 'placed' ? 'bg-accent/10 text-accent' :
                          s.placement_status === 'in_progress' ? 'bg-secondary/10 text-secondary' :
                          'bg-muted-foreground/10 text-muted-foreground'
                        }`}>{s.placement_status?.replace('_', ' ')}</span>
                        <p className="text-xs text-muted-foreground mt-1">{s.profile_completion}% profile</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No students found</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2"><Rocket className="w-5 h-5" /> Active Placement Drives</CardTitle>
              <Link href="/placement/drives"><Button size="sm" variant="outline">Manage</Button></Link>
            </CardHeader>
            <CardContent>
              {drives.length > 0 ? (
                <div className="space-y-3">
                  {drives.map((drive: any) => (
                    <div key={drive.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">{drive.company_name.charAt(0)}</div>
                        <div>
                          <p className="text-sm font-medium">{drive.company_name}</p>
                          <p className="text-xs text-muted-foreground">{drive.drive_date} • {drive.job_roles?.join(', ')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">{drive.package_range}</p>
                        <p className="text-xs text-muted-foreground">{drive.registered_students} registered</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No active drives</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Placement by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {placementByDept.map((dept) => (
                  <div key={dept.dept}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{dept.dept}</span>
                      <span className="text-xs text-muted-foreground">{dept.placed}/{dept.total}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${dept.rate}%` }} />
                    </div>
                    <p className="text-xs text-right text-muted-foreground mt-1">{dept.rate}% placed</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {applications.length > 0 ? (
                <div className="space-y-3">
                  {applications.map((app: any) => (
                    <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{app.placement_drives?.company_name?.charAt(0)}</div>
                        <div>
                          <p className="text-sm font-medium">{app.placement_drives?.company_name}</p>
                          <p className="text-xs text-muted-foreground">CGPA: {app.student_profiles?.cgpa} • Profile: {app.student_profiles?.profile_completion}%</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        app.status === 'offered' ? 'bg-accent/10 text-accent' :
                        app.status === 'shortlisted' ? 'bg-primary/10 text-primary' :
                        'bg-muted-foreground/10 text-muted-foreground'
                      }`}>{app.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No recent applications</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div {...fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><DollarSign className="w-5 h-5" /> Package Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-4 gap-4">
              {[
                { range: '10-20 LPA', count: 245, color: 'bg-primary' },
                { range: '20-30 LPA', count: 180, color: 'bg-secondary' },
                { range: '30-40 LPA', count: 85, color: 'bg-accent' },
                { range: '40+ LPA', count: 32, color: 'bg-chart-4' },
              ].map((pkg) => (
                <div key={pkg.range} className="text-center p-4 rounded-xl bg-muted/50">
                  <p className="text-2xl font-bold">{pkg.count}</p>
                  <p className="text-sm text-muted-foreground">{pkg.range}</p>
                  <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                    <div className={`h-full ${pkg.color} rounded-full`} style={{ width: `${(pkg.count / 300) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
