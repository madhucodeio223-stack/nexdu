'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, LogOut, Menu, X, ChevronLeft, ChevronRight,
  Moon, Sun
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { supabase } from '@/lib/supabase';
import StudentNav from './student-nav';
import PlacementNav from './placement-nav';
import FacultyNav from './faculty-nav';
import AdminNav from './admin-nav';

interface DashboardShellProps {
  children: React.ReactNode;
  role: 'student' | 'placement_officer' | 'faculty' | 'super_admin' | string;
}

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  principal: 'Principal',
  faculty: 'Faculty',
  student: 'Student',
  placement_officer: 'Placement Officer',
};

const roleColors: Record<string, string> = {
  student: 'bg-accent/10 text-accent',
  placement_officer: 'bg-secondary/10 text-secondary',
  faculty: 'bg-primary/10 text-primary',
  super_admin: 'bg-chart-5/10 text-chart-5',
};

export default function DashboardShell({ children, role }: DashboardShellProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState('User');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('first_name, last_name, role')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profile) {
        setUserName(`${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User');
      } else if (session.user.user_metadata?.role) {
        setUserName(`${session.user.user_metadata.first_name || ''} ${session.user.user_metadata.last_name || ''}`.trim() || 'User');
      }
      setLoading(false);
    };

    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') router.push('/auth/login');
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const renderNav = () => {
    switch (role) {
      case 'student':
        return <StudentNav collapsed={!sidebarOpen} />;
      case 'placement_officer':
        return <PlacementNav collapsed={!sidebarOpen} />;
      case 'faculty':
        return <FacultyNav collapsed={!sidebarOpen} />;
      case 'super_admin':
      case 'principal':
        return <AdminNav collapsed={!sidebarOpen} />;
      default:
        return <StudentNav collapsed={!sidebarOpen} />;
    }
  };

  const getRoleBadge = () => {
    const label = roleLabels[role] || role;
    const color = roleColors[role] || 'bg-muted text-muted-foreground';
    return { label, color };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const badge = getRoleBadge();

  return (
    <div className="min-h-screen bg-background flex">
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-card border-r border-border flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-16 flex items-center px-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            {sidebarOpen && (
              <span className="font-bold font-[family-name:var(--font-poppins)] text-lg whitespace-nowrap">
                EduNexus
              </span>
            )}
          </Link>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden ml-auto p-1"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <p className="font-medium text-sm truncate">{userName}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${badge.color}`}>
                  {badge.label}
                </span>
              </div>
            )}
          </div>
        </div>

        {renderNav()}

        <div className="p-3 border-t border-border space-y-1">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all w-full"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {sidebarOpen && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full items-center justify-center shadow-sm"
        >
          {sidebarOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-accent/50">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${badge.color}`}>
              {badge.label}
            </span>
            <Link href="/">
              <span className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5">Public Site</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
