import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
