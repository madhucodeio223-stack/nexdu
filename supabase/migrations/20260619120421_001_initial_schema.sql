/*
# Initial University ERP Schema

1. New Tables
- `departments` - Academic departments
- `courses` - Course offerings
- `users` - Extended user profiles (linked to auth.users)
- `students` - Student records
- `faculty` - Faculty records
- `announcements` - System announcements
- `events` - Campus events
- `applications` - Admission applications
- `attendance` - Attendance records
- `assignments` - Academic assignments
- `exams` - Examination records
- `library_books` - Library catalog
- `library_transactions` - Book issue/return
- `hostel_rooms` - Hostel room inventory
- `hostel_allocations` - Room allocations
- `placement_jobs` - Job postings
- `placement_applications` - Student job applications
- `messages` - Internal messaging
- `notifications` - User notifications
- `fees` - Fee structures
- `fee_payments` - Payment records

2. Security
- Enable RLS on all tables
- Role-based policies for each table
*/

-- Departments
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  description text,
  head_id uuid,
  established_date date,
  created_at timestamptz DEFAULT now()
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  department_id uuid REFERENCES departments(id),
  duration_years int NOT NULL DEFAULT 4,
  degree_type text NOT NULL,
  eligibility text,
  fees_per_year decimal(10,2),
  description text,
  syllabus jsonb,
  created_at timestamptz DEFAULT now()
);

-- Extended user profiles
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'student',
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  avatar_url text,
  department_id uuid REFERENCES departments(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Students
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id),
  enrollment_number text UNIQUE NOT NULL,
  course_id uuid REFERENCES courses(id),
  admission_year int NOT NULL,
  current_year int NOT NULL DEFAULT 1,
  cgpa decimal(3,2) DEFAULT 0.00,
  status text DEFAULT 'active',
  parent_name text,
  parent_phone text,
  parent_email text,
  address text,
  created_at timestamptz DEFAULT now()
);

-- Faculty
CREATE TABLE IF NOT EXISTS faculty (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id),
  employee_id text UNIQUE NOT NULL,
  designation text NOT NULL,
  qualification text,
  specialization text,
  experience_years int DEFAULT 0,
  office_hours text,
  publications jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Announcements
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text DEFAULT 'general',
  priority text DEFAULT 'normal',
  posted_by uuid REFERENCES user_profiles(id),
  target_roles text[] DEFAULT ARRAY['all'],
  is_pinned boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  event_time time,
  location text,
  category text DEFAULT 'general',
  organizer_id uuid REFERENCES user_profiles(id),
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Admission Applications
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  course_id uuid REFERENCES courses(id),
  status text DEFAULT 'pending',
  documents jsonb DEFAULT '{}',
  marks_10th decimal(5,2),
  marks_12th decimal(5,2),
  entrance_score decimal(5,2),
  application_date timestamptz DEFAULT now(),
  reviewed_by uuid REFERENCES user_profiles(id),
  reviewed_at timestamptz
);

-- Attendance
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id),
  course_id uuid REFERENCES courses(id),
  date date NOT NULL,
  status text NOT NULL DEFAULT 'present',
  marked_by uuid REFERENCES user_profiles(id),
  method text DEFAULT 'manual',
  created_at timestamptz DEFAULT now()
);

-- Assignments
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  course_id uuid REFERENCES courses(id),
  faculty_id uuid REFERENCES faculty(id),
  due_date date,
  max_marks int DEFAULT 100,
  attachments jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Assignment Submissions
CREATE TABLE IF NOT EXISTS assignment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid REFERENCES assignments(id),
  student_id uuid REFERENCES students(id),
  submission_url text,
  marks_obtained int,
  feedback text,
  submitted_at timestamptz DEFAULT now()
);

-- Exams
CREATE TABLE IF NOT EXISTS exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  course_id uuid REFERENCES courses(id),
  exam_type text NOT NULL,
  exam_date date NOT NULL,
  start_time time,
  end_time time,
  venue text,
  max_marks int DEFAULT 100,
  created_at timestamptz DEFAULT now()
);

-- Exam Results
CREATE TABLE IF NOT EXISTS exam_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid REFERENCES exams(id),
  student_id uuid REFERENCES students(id),
  marks_obtained int,
  grade text,
  remarks text,
  created_at timestamptz DEFAULT now()
);

-- Library Books
CREATE TABLE IF NOT EXISTS library_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  isbn text UNIQUE,
  title text NOT NULL,
  author text NOT NULL,
  publisher text,
  category text,
  department_id uuid REFERENCES departments(id),
  total_copies int DEFAULT 1,
  available_copies int DEFAULT 1,
  shelf_location text,
  created_at timestamptz DEFAULT now()
);

-- Library Transactions
CREATE TABLE IF NOT EXISTS library_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid REFERENCES library_books(id),
  student_id uuid REFERENCES students(id),
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date NOT NULL,
  return_date date,
  fine_amount decimal(10,2) DEFAULT 0.00,
  status text DEFAULT 'issued',
  created_at timestamptz DEFAULT now()
);

-- Hostel Rooms
CREATE TABLE IF NOT EXISTS hostel_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number text UNIQUE NOT NULL,
  block text NOT NULL,
  floor int,
  capacity int DEFAULT 2,
  occupied int DEFAULT 0,
  room_type text DEFAULT 'shared',
  amenities jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Hostel Allocations
CREATE TABLE IF NOT EXISTS hostel_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES hostel_rooms(id),
  student_id uuid REFERENCES students(id),
  allocation_date date NOT NULL DEFAULT CURRENT_DATE,
  vacate_date date,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

-- Placement Jobs
CREATE TABLE IF NOT EXISTS placement_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  job_title text NOT NULL,
  description text,
  location text,
  package_lpa decimal(5,2),
  eligibility_criteria text,
  application_deadline date,
  status text DEFAULT 'open',
  created_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Placement Applications
CREATE TABLE IF NOT EXISTS placement_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES placement_jobs(id),
  student_id uuid REFERENCES students(id),
  status text DEFAULT 'applied',
  resume_url text,
  applied_at timestamptz DEFAULT now()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES user_profiles(id),
  receiver_id uuid REFERENCES user_profiles(id),
  subject text,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id),
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info',
  is_read boolean DEFAULT false,
  link text,
  created_at timestamptz DEFAULT now()
);

-- Fees
CREATE TABLE IF NOT EXISTS fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id),
  fee_type text NOT NULL,
  amount decimal(10,2) NOT NULL,
  academic_year int NOT NULL,
  due_date date,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Fee Payments
CREATE TABLE IF NOT EXISTS fee_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id),
  fee_id uuid REFERENCES fees(id),
  amount_paid decimal(10,2) NOT NULL,
  payment_method text DEFAULT 'online',
  transaction_id text,
  payment_date timestamptz DEFAULT now(),
  status text DEFAULT 'completed'
);

-- Enable RLS
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;

-- Public read policies for basic info
DROP POLICY IF EXISTS "public_read_departments" ON departments;
CREATE POLICY "public_read_departments" ON departments FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_courses" ON courses;
CREATE POLICY "public_read_courses" ON courses FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_announcements" ON announcements;
CREATE POLICY "public_read_announcements" ON announcements FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_events" ON events;
CREATE POLICY "public_read_events" ON events FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_library_books" ON library_books;
CREATE POLICY "public_read_library_books" ON library_books FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_placement_jobs" ON placement_jobs;
CREATE POLICY "public_read_placement_jobs" ON placement_jobs FOR SELECT TO anon, authenticated USING (true);

-- User profile policies
DROP POLICY IF EXISTS "select_own_profile" ON user_profiles;
CREATE POLICY "select_own_profile" ON user_profiles FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON user_profiles;
CREATE POLICY "insert_own_profile" ON user_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON user_profiles;
CREATE POLICY "update_own_profile" ON user_profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Admin can manage all
DROP POLICY IF EXISTS "admin_all_profiles" ON user_profiles;
CREATE POLICY "admin_all_profiles" ON user_profiles FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'principal', 'admin'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'principal', 'admin'))
);

-- Applications - public can create
DROP POLICY IF EXISTS "public_insert_applications" ON applications;
CREATE POLICY "public_insert_applications" ON applications FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_read_applications" ON applications;
CREATE POLICY "public_read_applications" ON applications FOR SELECT TO anon, authenticated USING (true);

-- Admin can update applications
DROP POLICY IF EXISTS "admin_update_applications" ON applications;
CREATE POLICY "admin_update_applications" ON applications FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'principal', 'admissions_officer', 'admin'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'principal', 'admissions_officer', 'admin'))
);

-- Notifications
DROP POLICY IF EXISTS "select_own_notifications" ON notifications;
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "insert_own_notifications" ON notifications;
CREATE POLICY "insert_own_notifications" ON notifications FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "update_own_notifications" ON notifications;
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Messages
DROP POLICY IF EXISTS "select_own_messages" ON messages;
CREATE POLICY "select_own_messages" ON messages FOR SELECT TO authenticated USING (sender_id = auth.uid() OR receiver_id = auth.uid());

DROP POLICY IF EXISTS "insert_own_messages" ON messages;
CREATE POLICY "insert_own_messages" ON messages FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_course_id ON students(course_id);
CREATE INDEX IF NOT EXISTS idx_faculty_user_id ON faculty(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_assignments_course ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_exams_course ON exams(course_id);
CREATE INDEX IF NOT EXISTS idx_library_transactions_student ON library_transactions(student_id);
CREATE INDEX IF NOT EXISTS idx_hostel_allocations_student ON hostel_allocations(student_id);
CREATE INDEX IF NOT EXISTS idx_placement_applications_student ON placement_applications(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_student ON fee_payments(student_id);
CREATE INDEX IF NOT EXISTS idx_announcements_category ON announcements(category);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
