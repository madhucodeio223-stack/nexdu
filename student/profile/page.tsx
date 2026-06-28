'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, GraduationCap, Award, FileText, Github, Linkedin, Globe, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function StudentProfilePage() {
  const [userName, setUserName] = useState('Student');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }

      const { data: userData } = await supabase
        .from('user_profiles')
        .select('first_name, last_name, email, phone')
        .eq('id', session.user.id)
        .maybeSingle();

      const { data: studentData } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (userData) {
        setUserName(`${userData.first_name || ''} ${userData.last_name || ''}`.trim());
      }
      setProfile({ ...userData, ...studentData });
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div {...fadeInUp}>
        <h1 className="text-3xl font-bold font-[family-name:var(--font-poppins)]">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information and placement profile</p>
      </motion.div>

      <motion.div {...fadeInUp}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><User className="w-5 h-5" /> Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Full Name</Label><Input defaultValue={userName} /></div>
              <div className="space-y-2"><Label>Email</Label><Input defaultValue={profile?.email} disabled /></div>
              <div className="space-y-2"><Label>Phone</Label><Input defaultValue={profile?.phone || ''} placeholder="+91 98765 43210" /></div>
              <div className="space-y-2"><Label>Enrollment Number</Label><Input defaultValue={profile?.enrollment_number || ''} placeholder="CSE202301" /></div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div {...fadeInUp} transition={{ delay: 0.05 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><GraduationCap className="w-5 h-5" /> Academic Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Course</Label><Input defaultValue="B.Tech Computer Science" /></div>
              <div className="space-y-2"><Label>Current Year</Label><Input defaultValue={profile?.current_year?.toString() || '3'} /></div>
              <div className="space-y-2"><Label>CGPA</Label><Input defaultValue={profile?.cgpa?.toString() || '8.7'} /></div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Globe className="w-5 h-5" /> Online Profiles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="flex items-center gap-2"><Github className="w-4 h-4" /> GitHub</Label><Input defaultValue={profile?.github_url || ''} placeholder="github.com/username" /></div>
              <div className="space-y-2"><Label className="flex items-center gap-2"><Linkedin className="w-4 h-4" /> LinkedIn</Label><Input defaultValue={profile?.linkedin_url || ''} placeholder="linkedin.com/in/username" /></div>
              <div className="space-y-2"><Label className="flex items-center gap-2"><Globe className="w-4 h-4" /> Portfolio</Label><Input defaultValue={profile?.portfolio_url || ''} placeholder="yourportfolio.com" /></div>
              <div className="space-y-2"><Label className="flex items-center gap-2"><FileText className="w-4 h-4" /> Resume URL</Label><Input defaultValue={profile?.resume_url || ''} placeholder="Link to resume" /></div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div {...fadeInUp} transition={{ delay: 0.15 }}>
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
