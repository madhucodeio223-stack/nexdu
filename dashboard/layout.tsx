'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, LayoutDashboard, Users, BookOpen, Calendar,
  BarChart3, MessageSquare, Bell, Settings, LogOut, Menu, X,
  ChevronLeft, ChevronRight, Moon, Sun, Search,
  FileText, Wallet, Building2, Award, ClipboardList,
  Library, Home, Briefcase, TrendingUp, Microscope,
  Shield, UserCog
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { supabase } from '@/lib/supabase';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const roleNavItems: Record<string, { label: string; href: string; icon: React.ElementType }[]> = {
  super_admin: [
    { label: 'Dashboard', href: '/dashboard/super_admin', icon: LayoutDashboard },
    { label: 'Users', href: '/dashboard/super_admin/users', icon: Users },
    { label: 'Departments', href: '/dashboard/super_admin/departments', icon: Building2 },
    { label: 'Courses', href: '/dashboard/super_admin/courses', icon: BookOpen },
    { label: 'Analytics', href: '/dashboard/super_admin/analytics', icon: BarChart3 },
    { label: 'Announcements', href: '/dashboard/super_admin/announcements', icon: Bell },
    { label: 'Settings', href: '/dashboard/super_admin/settings', icon: Settings },
  ],
  student: [
    { label: 'Dashboard', href: '/dashboard/student', icon: LayoutDashboard },
    { label: 'My Courses', href: '/dashboard/student/courses', icon: BookOpen },
    { label: 'Attendance', href: '/dashboard/student/attendance', icon: Calendar },
    { label: 'Assignments', href: '/dashboard/student/assignments', icon: FileText },
    { label: 'Exams', href: '/dashboard/student/exams', icon: ClipboardList },
    { label: 'Results', href: '/dashboard/student/results', icon: Award },
    { label: 'Fees', href: '/dashboard/student/fees', icon: Wallet },
    { label: 'Library', href: '/dashboard/student/library', icon: Library },
    { label: 'Placements', href: '/dashboard/student/placements', icon: Briefcase },
    { label: 'Messages', href: '/dashboard/student/messages', icon: MessageSquare },
  ],
  faculty: [
    { label: 'Dashboard', href: '/dashboard/faculty', icon: LayoutDashboard },
    { label: 'My Classes', href: '/dashboard/faculty/classes', icon: BookOpen },
    { label: 'Attendance', href: '/dashboard/faculty/attendance', icon: Calendar },
    { label: 'Assignments', href: '/dashboard/faculty/assignments', icon: FileText },
    { label: 'Exams', href: '/dashboard/faculty/exams', icon: ClipboardList },
    { label: 'Grades', href: '/dashboard/faculty/grades', icon: Award },
    { label: 'Students', href: '/dashboard/faculty/students', icon: Users },
    { label: 'Research', href: '/dashboard/faculty/research', icon: Microscope },
    { label: 'Messages', href: '/dashboard/faculty/messages', icon: MessageSquare },
  ],
  placement_officer: [
    { label: 'Dashboard', href: '/dashboard/placement_officer', icon: LayoutDashboard },
    { label: 'Companies', href: '/dashboard/placement_officer/companies', icon: Building2 },
    { label: 'Job Postings', href: '/dashboard/placement_officer/jobs', icon: Briefcase },
    { label: 'Applications', href: '/dashboard/placement_officer/applications', icon: Users },
    { label: 'Analytics', href: '/dashboard/placement_officer/analytics', icon: TrendingUp },
    { label: 'Messages', href: '/dashboard/placement_officer/messages', icon: MessageSquare },
  ],
  hostel_warden: [
    { label: 'Dashboard', href: '/dashboard/hostel_warden', icon: LayoutDashboard },
    { label: 'Rooms', href: '/dashboard/hostel_warden/rooms', icon: Home },
    { label: 'Allocations', href: '/dashboard/hostel_warden/allocations', icon: Users },
    { label: 'Complaints', href: '/dashboard/hostel_warden/complaints', icon: MessageSquare },
    { label: 'Fees', href: '/dashboard/hostel_warden/fees', icon: Wallet },
  ],
  librarian: [
    { label: 'Dashboard', href: '/dashboard/librarian', icon: LayoutDashboard },
    { label: 'Books', href: '/dashboard/librarian/books', icon: BookOpen },
    { label: 'Transactions', href: '/dashboard/librarian/transactions', icon: ClipboardList },
    { label: 'Members', href: '/dashboard/librarian/members', icon: Users },
    { label: 'Analytics', href: '/dashboard/librarian/analytics', icon: BarChart3 },
  ],
  finance_officer: [
    { label: 'Dashboard', href: '/dashboard/finance_officer', icon: LayoutDashboard },
    { label: 'Fee Structure', href: '/dashboard/finance_officer/fees', icon: FileText },
    { label: 'Payments', href: '/dashboard/finance_officer/payments', icon: Wallet },
    { label: 'Scholarships', href: '/dashboard/finance_officer/scholarships', icon: Award },
    { label: 'Reports', href: '/dashboard/finance_officer/reports', icon: BarChart3 },
  ],
};

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  principal: 'Principal',
  department_head: 'Department Head',
  faculty: 'Faculty',
  student: 'Student',
  parent: 'Parent',
  librarian: 'Librarian',
  finance_officer: 'Finance Officer',
  hostel_warden: 'Hostel Warden',
  placement_officer: 'Placement Officer',
  alumni: 'Alumni',
  admissions_officer: 'Admissions Officer',
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>('student');
  const [userName, setUserName] = useState('User');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role, first_name, last_name')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profile) {
        setUserRole(profile.role);
        setUserName(`${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User');
      } else if (session.user.user_metadata?.role) {
        // Fallback to user metadata if profile not found
        setUserRole(session.user.user_metadata.role);
        setUserName(`${session.user.user_metadata.first_name || ''} ${session.user.user_metadata.last_name || ''}`.trim() || 'User');
      }
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.push('/auth/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const navItems = roleNavItems[userRole] || roleNavItems.student;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar overlay */}
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

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-card border-r border-border flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
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
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden ml-auto p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <p className="font-medium text-sm truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">{roleLabels[userRole] || userRole}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
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

        {/* Collapse button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full items-center justify-center shadow-sm"
        >
          {sidebarOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-accent/50"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-muted border-0 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button className="relative p-2 rounded-lg hover:bg-accent/50 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <Link href="/">
              <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
                <Shield className="w-4 h-4" /> Public Site
              </Button>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
