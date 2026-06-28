'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Calendar, ClipboardCheck, BarChart3,
  FileText, MessageSquare, GraduationCap
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/faculty/dashboard', icon: LayoutDashboard },
  { label: 'Students', href: '/faculty/students', icon: Users },
  { label: 'Attendance', href: '/faculty/attendance', icon: Calendar },
  { label: 'Assessments', href: '/faculty/assessments', icon: ClipboardCheck },
  { label: 'Performance', href: '/faculty/performance', icon: BarChart3 },
  { label: 'Reports', href: '/faculty/reports', icon: FileText },
  { label: 'Messages', href: '/faculty/messages', icon: MessageSquare },
];

export default function FacultyNav({ collapsed = false }: { collapsed?: boolean }) {
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
