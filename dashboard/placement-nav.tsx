'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Building2, Rocket, BarChart3,
  FileText, Settings, MessageSquare
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/placement/dashboard', icon: LayoutDashboard },
  { label: 'Students', href: '/placement/students', icon: Users },
  { label: 'Companies', href: '/placement/companies', icon: Building2 },
  { label: 'Drives', href: '/placement/drives', icon: Rocket },
  { label: 'Applications', href: '/placement/applications', icon: FileText },
  { label: 'Reports', href: '/placement/reports', icon: BarChart3 },
  { label: 'Messages', href: '/placement/messages', icon: MessageSquare },
];

export default function PlacementNav({ collapsed = false }: { collapsed?: boolean }) {
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
