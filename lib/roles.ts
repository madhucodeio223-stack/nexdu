export type UserRole =
  | 'super_admin'
  | 'principal'
  | 'department_head'
  | 'faculty'
  | 'student'
  | 'parent'
  | 'librarian'
  | 'finance_officer'
  | 'hostel_warden'
  | 'placement_officer'
  | 'alumni'
  | 'admissions_officer';

export const roleRoutes: Record<string, string> = {
  super_admin: '/admin/dashboard',
  principal: '/admin/dashboard',
  department_head: '/faculty/dashboard',
  faculty: '/faculty/dashboard',
  student: '/student/dashboard',
  parent: '/student/dashboard',
  librarian: '/dashboard/librarian',
  finance_officer: '/dashboard/finance_officer',
  hostel_warden: '/dashboard/hostel_warden',
  placement_officer: '/placement/dashboard',
  alumni: '/student/dashboard',
  admissions_officer: '/admin/dashboard',
};

export const roleLabels: Record<string, string> = {
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

export function getDashboardRoute(role: string): string {
  return roleRoutes[role] || '/student/dashboard';
}
