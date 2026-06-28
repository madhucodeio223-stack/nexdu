'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, User, Briefcase, FileText, FileEdit,
  GraduationCap, Award, Calendar
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { label: 'Profile', href: '/student/profile', icon: User },
  { label: 'Jobs & Drives', href: '/student/jobs', icon: Briefcase },
  { label: 'Applications', href: '/student/applications', icon: FileText },
  { label: 'Resume', href: '/student/resume', icon: FileEdit },
  { label: 'Training', href: '/student/training', icon: GraduationCap },
  { label: 'Certifications', href: '/student/certifications', icon: Award },
  { label: 'Schedule', href: '/student/schedule', icon: Calendar },
];

export default function StudentNav({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
