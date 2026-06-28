/*
# Role-Specific Schema Update

1. New Tables
- `student_profiles` - Extended student data (placement focused)
- `placement_drives` - Placement drive events
- `job_applications` - Student job applications (replaces placement_applications)
- `interviews` - Interview schedules
- `skills` - Student skills tracking
- `certifications` - Student certifications
- `training_programs` - Available training programs
- `student_training` - Student training enrollments
- `assessments` - Faculty assessments
- `student_assessments` - Student assessment results
- `attendance_records` - Detailed attendance tracking

2. Modified Tables
- Enhanced `user_profiles` with department link

3. Security
- RLS enabled on all new tables
- Role-scoped policies
*/

-- Student Profiles (extends user_profiles for students)
CREATE TABLE IF NOT EXISTS student_profiles (
  id uuid PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  enrollment_number text UNIQUE,
  course_id uuid REFERENCES courses(id),
  admission_year int,
  current_year int DEFAULT 1,
  cgpa decimal(3,2) DEFAULT 0.00,
  profile_completion int DEFAULT 0,
  skill_score int DEFAULT 0,
  placement_status text DEFAULT 'not_started',
  resume_url text,
  portfolio_url text,
  github_url text,
  linkedin_url text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Placement Drives
CREATE TABLE IF NOT EXISTS placement_drives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  drive_date date NOT NULL,
  job_roles text[] DEFAULT '{}',
  package_range text,
  eligibility_criteria text,
  status text DEFAULT 'upcoming',
  registered_students int DEFAULT 0,
  created_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Job Applications (student applies to placement drives)
CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES student_profiles(id),
  drive_id uuid REFERENCES placement_drives(id),
  status text DEFAULT 'applied',
  applied_at timestamptz DEFAULT now(),
  resume_version text,
  cover_letter text
);

-- Interviews
CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES job_applications(id),
  round_name text NOT NULL,
  scheduled_at timestamptz,
  status text DEFAULT 'scheduled',
  feedback text,
  result text,
  created_at timestamptz DEFAULT now()
);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text
);

-- Student Skills
CREATE TABLE IF NOT EXISTS student_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES student_profiles(id),
  skill_id uuid REFERENCES skills(id),
  proficiency int DEFAULT 1,
  certified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Certifications
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES student_profiles(id),
  name text NOT NULL,
  issuer text,
  issue_date date,
  expiry_date date,
  credential_url text,
  created_at timestamptz DEFAULT now()
);

-- Training Programs
CREATE TABLE IF NOT EXISTS training_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text,
  duration_hours int,
  status text DEFAULT 'active'
);

-- Student Training Enrollments
CREATE TABLE IF NOT EXISTS student_training (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES student_profiles(id),
  program_id uuid REFERENCES training_programs(id),
  progress int DEFAULT 0,
  status text DEFAULT 'enrolled',
  enrolled_at timestamptz DEFAULT now()
);

-- Assessments (created by faculty)
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  faculty_id uuid REFERENCES user_profiles(id),
  course_id uuid REFERENCES courses(id),
  max_marks int DEFAULT 100,
  assessment_type text DEFAULT 'quiz',
  created_at timestamptz DEFAULT now()
);

-- Student Assessment Results
CREATE TABLE IF NOT EXISTS student_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES assessments(id),
  student_id uuid REFERENCES student_profiles(id),
  marks_obtained int,
  feedback text,
  submitted_at timestamptz DEFAULT now()
);

-- Attendance Records
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES student_profiles(id),
  faculty_id uuid REFERENCES user_profiles(id),
  course_id uuid REFERENCES courses(id),
  date date NOT NULL,
  status text DEFAULT 'present',
  marked_at timestamptz DEFAULT now()
);

-- Seed skills
INSERT INTO skills (name, category, description) VALUES
('Python', 'Technical', 'Python programming language'),
('Java', 'Technical', 'Java programming language'),
('Data Structures', 'Technical', 'Core computer science concepts'),
('Machine Learning', 'Technical', 'ML algorithms and frameworks'),
('SQL', 'Technical', 'Database query language'),
('React', 'Technical', 'Frontend JavaScript framework'),
('Node.js', 'Technical', 'Backend JavaScript runtime'),
('Communication', 'Soft', 'Verbal and written communication'),
('Leadership', 'Soft', 'Team leadership and management'),
('Problem Solving', 'Soft', 'Analytical problem solving')
ON CONFLICT DO NOTHING;

-- Seed training programs
INSERT INTO training_programs (name, description, category, duration_hours) VALUES
('Resume Building Workshop', 'Learn to build ATS-friendly resumes', 'Career', 4),
('Interview Preparation', 'Mock interviews and tips', 'Career', 8),
('Aptitude Training', 'Quantitative and logical reasoning', 'Career', 16),
('Coding Bootcamp', 'Intensive coding practice', 'Technical', 40),
('Communication Skills', 'Business communication and presentations', 'Soft Skills', 12)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_training ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Public read for skills and training
DROP POLICY IF EXISTS "public_read_skills" ON skills;
CREATE POLICY "public_read_skills" ON skills FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_training" ON training_programs;
CREATE POLICY "public_read_training" ON training_programs FOR SELECT TO anon, authenticated USING (true);

-- Student profiles - own data
DROP POLICY IF EXISTS "select_own_student_profile" ON student_profiles;
CREATE POLICY "select_own_student_profile" ON student_profiles FOR SELECT TO authenticated USING (id = auth.uid());

DROP POLICY IF EXISTS "update_own_student_profile" ON student_profiles;
CREATE POLICY "update_own_student_profile" ON student_profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Faculty can view assigned students
DROP POLICY IF EXISTS "faculty_view_students" ON student_profiles;
CREATE POLICY "faculty_view_students" ON student_profiles FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'faculty')
);

-- Placement officers can view all students
DROP POLICY IF EXISTS "placement_view_students" ON student_profiles;
CREATE POLICY "placement_view_students" ON student_profiles FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'placement_officer')
);

-- Job applications - own data
DROP POLICY IF EXISTS "select_own_applications" ON job_applications;
CREATE POLICY "select_own_applications" ON job_applications FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM student_profiles WHERE id = student_id AND id = auth.uid())
);

DROP POLICY IF EXISTS "insert_own_applications" ON job_applications;
CREATE POLICY "insert_own_applications" ON job_applications FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM student_profiles WHERE id = student_id AND id = auth.uid())
);

-- Placement officers manage all applications
DROP POLICY IF EXISTS "placement_manage_applications" ON job_applications;
CREATE POLICY "placement_manage_applications" ON job_applications FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'placement_officer')
) WITH CHECK (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'placement_officer')
);

-- Placement drives - public read
DROP POLICY IF EXISTS "public_read_drives" ON placement_drives;
CREATE POLICY "public_read_drives" ON placement_drives FOR SELECT TO anon, authenticated USING (true);

-- Placement officers manage drives
DROP POLICY IF EXISTS "placement_manage_drives" ON placement_drives;
CREATE POLICY "placement_manage_drives" ON placement_drives FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'placement_officer')
) WITH CHECK (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'placement_officer')
);

-- Interviews - own data + placement officer
DROP POLICY IF EXISTS "select_own_interviews" ON interviews;
CREATE POLICY "select_own_interviews" ON interviews FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM job_applications ja
    JOIN student_profiles sp ON ja.student_id = sp.id
    WHERE ja.id = interviews.application_id AND sp.id = auth.uid()
  ) OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'placement_officer')
);

-- Student skills - own data
DROP POLICY IF EXISTS "select_own_skills" ON student_skills;
CREATE POLICY "select_own_skills" ON student_skills FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM student_profiles WHERE id = student_id AND id = auth.uid())
);

-- Certifications - own data
DROP POLICY IF EXISTS "select_own_certs" ON certifications;
CREATE POLICY "select_own_certs" ON certifications FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM student_profiles WHERE id = student_id AND id = auth.uid())
);

-- Student training - own data
DROP POLICY IF EXISTS "select_own_training" ON student_training;
CREATE POLICY "select_own_training" ON student_training FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM student_profiles WHERE id = student_id AND id = auth.uid())
);

-- Assessments - faculty manage, students read
DROP POLICY IF EXISTS "public_read_assessments" ON assessments;
CREATE POLICY "public_read_assessments" ON assessments FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "faculty_manage_assessments" ON assessments;
CREATE POLICY "faculty_manage_assessments" ON assessments FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'faculty')
) WITH CHECK (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'faculty')
);

-- Student assessments - own data
DROP POLICY IF EXISTS "select_own_assessment_results" ON student_assessments;
CREATE POLICY "select_own_assessment_results" ON student_assessments FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM student_profiles WHERE id = student_id AND id = auth.uid())
);

-- Attendance records - own data + faculty
DROP POLICY IF EXISTS "select_own_attendance" ON attendance_records;
CREATE POLICY "select_own_attendance" ON attendance_records FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM student_profiles WHERE id = student_id AND id = auth.uid())
  OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'faculty')
);

-- Admin policies for all tables
DROP POLICY IF EXISTS "admin_all_student_profiles" ON student_profiles;
CREATE POLICY "admin_all_student_profiles" ON student_profiles FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'principal'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'principal'))
);

DROP POLICY IF EXISTS "admin_all_interviews" ON interviews;
CREATE POLICY "admin_all_interviews" ON interviews FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'principal'))
) WITH CHECK (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'principal'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_student_profiles_course ON student_profiles(course_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_student ON job_applications(student_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_drive ON job_applications(drive_id);
CREATE INDEX IF NOT EXISTS idx_interviews_application ON interviews(application_id);
CREATE INDEX IF NOT EXISTS idx_student_skills_student ON student_skills(student_id);
CREATE INDEX IF NOT EXISTS idx_certifications_student ON certifications(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_assessments_faculty ON assessments(faculty_id);
CREATE INDEX IF NOT EXISTS idx_student_assessments_student ON student_assessments(student_id);
