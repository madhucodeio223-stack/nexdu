import DashboardShell from '@/components/dashboard/dashboard-shell';

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="faculty">{children}</DashboardShell>;
}
