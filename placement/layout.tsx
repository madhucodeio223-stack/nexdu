import DashboardShell from '@/components/dashboard/dashboard-shell';
import type { ReactNode } from 'react';

export default function PlacementLayout({ children }: { children: ReactNode }) {
  return <DashboardShell role="placement_officer">{children}</DashboardShell>;
}
