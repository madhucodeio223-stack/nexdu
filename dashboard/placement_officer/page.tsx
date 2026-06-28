'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Briefcase, Building2, Users, TrendingUp, ArrowRight,
  DollarSign, CheckCircle2, Clock, AlertCircle, Star,
  BarChart3, Award, Search, User, GraduationCap
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

export default function PlacementOfficerDashboard() {
  const [userName, setUserName] = useState('Placement Officer');
  const [userData, setUserData] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
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
          .select('first_name, last_name, role, email, created_at')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile) {
          setUserName(`${profile.first_name || ''} ${profile.last_name || ''}`.trim());
          setUserData(profile);
        }

        const [
          { data: jobsData },
          { data: appsData },
        ] = await Promise.all([
          supabase.from('placement_jobs').select('*').eq('status', 'open').order('package_lpa', { ascending: false }),
          supabase.from('placement_applications').select('*, students(enrollment_number), placement_jobs(company_name, job_title)').order('applied_at', { ascending: false }).limit(5),
        ]);

        setJobs(jobsData || []);
        setApplications(appsData || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };

    fetchAll();
  }, []);

  const stats = [
    { label: 'Active Jobs', value: jobs.length.toString(), icon: Briefcase, color: 'bg-primary', trend: '+3' },
    { label: 'Total Companies', value: '156', icon: Building2, color: 'bg-secondary', trend: '+12' },
    { label: 'Applications', value: '1,240', icon: Users, color: 'bg-accent', trend: '+89' },
    { label: 'Placed Students', value: '892', icon: Award, color: 'bg-chart-4', trend: '+45' },
  ];

  const placementStats = [
    { label: 'Computer Science', placed: 340, total: 350, rate: 97 },
    { label: 'Electronics', placed: 280, total: 300, rate: 93 },
    { label: 'Mechanical', placed: 220, total: 250, rate: 88 },
    { label: 'Management', placed: 180, total: 200, rate: 90 },
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} {...fadeInUp} transition={{ delay: index * 0.05 }}>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-accent font-medium">{stat.trend}</span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div {...fadeInUp} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Active Job Postings</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                  <Input placeholder="Search jobs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-7 h-8 text-sm w-48" />
                </div>
                <Link href="/dashboard/placement_officer/jobs"><Button size="sm" variant="outline">View All</Button></Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {jobs.filter(j => j.company_name.toLowerCase().includes(searchQuery.toLowerCase()) || j.job_title.toLowerCase().includes(searchQuery.toLowerCase())).map((job: any, index: number) => (
                  <div key={job.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">{job.company_name.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-medium">{job.job_title}</p>
                        <p className="text-xs text-muted-foreground">{job.company_name} • {job.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{job.package_lpa} LPA</p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-accent/10 text-accent">{job.application_deadline ? new Date(job.application_deadline).toLocaleDateString() : 'Open'}</span>
                    </div>
                  </div>
                ))}
                {jobs.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No active job postings</p>}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Placement Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {placementStats.map((dept) => (
                  <div key={dept.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{dept.label}</span>
                      <span className="text-xs text-muted-foreground">{dept.placed}/{dept.total}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${dept.rate}%` }} /></div>
                    <p className="text-xs text-right text-muted-foreground mt-1">{dept.rate}% placed</p>
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
            <CardHeader>
              <CardTitle className="text-lg">Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {applications.length > 0 ? applications.map((app: any) => (
                  <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{app.students?.enrollment_number?.charAt(0) || 'S'}</div>
                      <div>
                        <p className="text-sm font-medium">{app.placement_jobs?.company_name}</p>
                        <p className="text-xs text-muted-foreground">{app.placement_jobs?.job_title} • {app.students?.enrollment_number}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${app.status === 'offered' ? 'bg-accent/10 text-accent' : app.status === 'shortlisted' ? 'bg-primary/10 text-primary' : 'bg-muted-foreground/10 text-muted-foreground'}`}>{app.status}</span>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent applications</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Recruiters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Google', 'Microsoft', 'Amazon', 'Meta'].map((company, index) => (
                  <div key={company} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{company.charAt(0)}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{company}</p>
                      <p className="text-xs text-muted-foreground">{[45, 38, 32, 18][index]} offers</p>
                    </div>
                    <span className="text-sm font-bold text-primary">{['35 LPA', '28 LPA', '32 LPA', '40 LPA'][index]}</span>
                  </div>
                ))}
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
                <div className="p-4 rounded-xl bg-muted/50"><p className="text-xs text-muted-foreground">Role</p><p className="font-medium capitalize">{userData.role.replace('_', ' ')}</p></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
