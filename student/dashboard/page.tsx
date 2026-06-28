'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  User, FileText, Mail, Award, Calendar, TrendingUp,
  CheckCircle2, Clock, AlertCircle, ArrowRight, Briefcase,
  GraduationCap, Star, Target, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function StudentDashboard() {
  const [userName, setUserName] = useState('Student');
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [training, setTraining] = useState<any[]>([]);
  const [drives, setDrives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { setLoading(false); return; }

        const userId = session.user.id;

        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('first_name, last_name, email')
          .eq('id', userId)
          .maybeSingle();

        if (profileData) {
          setUserName(`${profileData.first_name || ''} ${profileData.last_name || ''}`.trim());
        }

        const { data: studentData } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        setProfile(studentData);

        const [
          { data: apps },
          { data: ints },
          { data: sks },
          { data: certs },
          { data: trn },
          { data: drvs },
        ] = await Promise.all([
          supabase.from('job_applications').select('*, placement_drives(company_name, job_roles, package_range)').eq('student_id', userId).order('applied_at', { ascending: false }),
          supabase.from('interviews').select('*, job_applications(drive_id, placement_drives(company_name))').eq('status', 'scheduled'),
          supabase.from('student_skills').select('*, skills(name, category)').eq('student_id', userId),
          supabase.from('certifications').select('*').eq('student_id', userId).order('issue_date', { ascending: false }),
          supabase.from('student_training').select('*, training_programs(name, category)').eq('student_id', userId),
          supabase.from('placement_drives').select('*').eq('status', 'upcoming').order('drive_date', { ascending: true }).limit(3),
        ]);

        setApplications(apps || []);
        setInterviews(ints || []);
        setSkills(sks || []);
        setCertifications(certs || []);
        setTraining(trn || []);
        setDrives(drvs || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };

    fetchAll();
  }, []);

  const profileCompletion = profile?.profile_completion || 65;
  const skillScore = profile?.skill_score || 72;
  const placementStatus = profile?.placement_status || 'not_started';

  const stats = [
    { label: 'Profile Completion', value: `${profileCompletion}%`, icon: User, color: 'bg-primary', progress: profileCompletion },
    { label: 'Applications', value: applications.length.toString(), icon: FileText, color: 'bg-secondary', progress: Math.min(applications.length * 10, 100) },
    { label: 'Interviews', value: interviews.length.toString(), icon: Mail, color: 'bg-accent', progress: Math.min(interviews.length * 20, 100) },
    { label: 'Skill Score', value: skillScore.toString(), icon: Star, color: 'bg-chart-4', progress: skillScore },
    { label: 'Certifications', value: certifications.length.toString(), icon: Award, color: 'bg-chart-5', progress: Math.min(certifications.length * 15, 100) },
    { label: 'Placement Status', value: placementStatus === 'placed' ? 'Placed' : placementStatus === 'in_progress' ? 'In Progress' : 'Not Started', icon: Target, color: 'bg-primary', progress: placementStatus === 'placed' ? 100 : placementStatus === 'in_progress' ? 50 : 10 },
  ];

  const statusColors: Record<string, string> = {
    placed: 'bg-accent/10 text-accent',
    in_progress: 'bg-secondary/10 text-secondary',
    not_started: 'bg-muted-foreground/10 text-muted-foreground',
    not_placed: 'bg-destructive/10 text-destructive',
  };

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
            <p className="text-muted-foreground mt-1">Student Portal • Placement & Career Center</p>
          </div>
          <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusColors[placementStatus] || statusColors.not_started}`}>
            <Zap className="w-4 h-4" />
            {placementStatus === 'placed' ? 'Placed' : placementStatus === 'in_progress' ? 'In Progress' : 'Not Started'}
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
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xl font-bold">{stat.value}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{stat.label}</p>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${stat.color} rounded-full`} style={{ width: `${stat.progress}%` }} />
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
              <CardTitle className="text-lg flex items-center gap-2"><Briefcase className="w-5 h-5" /> My Applications</CardTitle>
              <Link href="/student/applications" className="text-sm text-primary hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
            </CardHeader>
            <CardContent>
              {applications.length > 0 ? (
                <div className="space-y-3">
                  {applications.map((app: any) => (
                    <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">{app.placement_drives?.company_name?.charAt(0)}</div>
                        <div>
                          <p className="text-sm font-medium">{app.placement_drives?.company_name}</p>
                          <p className="text-xs text-muted-foreground">{app.placement_drives?.job_roles?.[0]} • {app.placement_drives?.package_range}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        app.status === 'offered' ? 'bg-accent/10 text-accent' :
                        app.status === 'shortlisted' ? 'bg-primary/10 text-primary' :
                        app.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                        'bg-muted-foreground/10 text-muted-foreground'
                      }`}>{app.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No applications yet</p>
                  <Link href="/student/jobs"><Button size="sm" className="mt-3">Browse Jobs</Button></Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Calendar className="w-5 h-5" /> Interview Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {interviews.length > 0 ? (
                <div className="space-y-3">
                  {interviews.map((int: any) => (
                    <div key={int.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{int.round_name}</p>
                        <p className="text-xs text-muted-foreground">{int.job_applications?.placement_drives?.company_name}</p>
                        <p className="text-xs text-muted-foreground">{int.scheduled_at ? new Date(int.scheduled_at).toLocaleString() : 'TBD'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No upcoming interviews</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div {...fadeInUp}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Star className="w-5 h-5" /> Skills Progress</CardTitle>
            </CardHeader>
            <CardContent>
              {skills.length > 0 ? (
                <div className="space-y-3">
                  {skills.map((sk: any) => (
                    <div key={sk.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{sk.skills?.name}</span>
                        <span className="text-xs text-muted-foreground">{sk.proficiency}/5</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${(sk.proficiency / 5) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No skills added yet</p>
                  <Link href="/student/profile"><Button size="sm" variant="outline" className="mt-2">Update Profile</Button></Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeInUp} transition={{ delay: 0.05 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Award className="w-5 h-5" /> Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              {certifications.length > 0 ? (
                <div className="space-y-3">
                  {certifications.map((cert: any) => (
                    <div key={cert.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Award className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{cert.name}</p>
                        <p className="text-xs text-muted-foreground">{cert.issuer} • {cert.issue_date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No certifications yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><GraduationCap className="w-5 h-5" /> Training Programs</CardTitle>
            </CardHeader>
            <CardContent>
              {training.length > 0 ? (
                <div className="space-y-3">
                  {training.map((tr: any) => (
                    <div key={tr.id} className="p-3 rounded-xl bg-muted/50">
                      <p className="text-sm font-medium">{tr.training_programs?.name}</p>
                      <p className="text-xs text-muted-foreground">{tr.training_programs?.category}</p>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{tr.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-secondary rounded-full" style={{ width: `${tr.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">Not enrolled in any training</p>
                  <Link href="/student/training"><Button size="sm" variant="outline" className="mt-2">Browse Training</Button></Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div {...fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="w-5 h-5" /> Placement Readiness Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-4 gap-6">
              {[
                { label: 'Technical Skills', score: skillScore, color: 'bg-primary' },
                { label: 'Soft Skills', score: 78, color: 'bg-secondary' },
                { label: 'Profile Completeness', score: profileCompletion, color: 'bg-accent' },
                { label: 'Overall Readiness', score: Math.round((skillScore + 78 + profileCompletion) / 3), color: 'bg-chart-4' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-3">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="none" className="text-muted" />
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="none"
                        strokeDasharray={`${(item.score / 100) * 251.2} 251.2`} className={item.color} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold">{item.score}%</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div {...fadeInUp}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2"><Briefcase className="w-5 h-5" /> Upcoming Placement Drives</CardTitle>
            <Link href="/student/jobs"><Button size="sm" variant="outline">Browse All</Button></Link>
          </CardHeader>
          <CardContent>
            {drives.length > 0 ? (
              <div className="grid sm:grid-cols-3 gap-4">
                {drives.map((drive: any) => (
                  <div key={drive.id} className="p-4 rounded-xl bg-muted/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">{drive.company_name.charAt(0)}</div>
                      <div>
                        <p className="font-medium text-sm">{drive.company_name}</p>
                        <p className="text-xs text-muted-foreground">{drive.drive_date}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{drive.job_roles?.join(', ')}</p>
                    <p className="text-xs text-primary font-medium mt-1">{drive.package_range}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No upcoming drives</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
