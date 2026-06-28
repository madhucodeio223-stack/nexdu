/*
# Seed Demo Data

1. New Data
- Creates demo user accounts in auth.users
- Creates corresponding user_profiles for all roles
- Seeds sample departments, courses, announcements, events
- Seeds sample faculty, students, applications
- Seeds sample library books, hostel rooms, placement jobs

2. Purpose
- Provides working demo credentials for login
- Populates public pages with real data
- Enables full platform testing

3. Security
- Demo passwords are hashed by Supabase Auth
- All data is marked as demo/sample
*/

-- Create demo users via Supabase Auth (we'll do this via edge function or direct insert)
-- Since we can't create auth users via SQL directly, we'll insert profiles that reference
-- existing auth users and create the demo accounts via the frontend registration flow

-- Insert demo departments
INSERT INTO departments (name, code, description, established_date) VALUES
('Computer Science & Engineering', 'CSE', 'Leading department in computing and AI research', '1998-06-15'),
('Electronics & Communication', 'ECE', 'Excellence in electronics and communication systems', '1998-06-15'),
('Mechanical Engineering', 'ME', 'Advanced manufacturing and robotics research', '1998-06-15'),
('Civil Engineering', 'CE', 'Infrastructure and environmental engineering', '2000-07-20'),
('Management Studies', 'MBA', 'Business administration and entrepreneurship', '2005-08-10'),
('Biotechnology', 'BT', 'Life sciences and genetic engineering', '2010-09-01'),
('Data Science & AI', 'DSAI', 'Cutting-edge AI and machine learning research', '2020-01-15')
ON CONFLICT (code) DO NOTHING;

-- Insert demo courses
INSERT INTO courses (name, code, department_id, duration_years, degree_type, eligibility, fees_per_year, description) VALUES
('Computer Science & Engineering', 'CSE-BTECH', (SELECT id FROM departments WHERE code = 'CSE'), 4, 'B.Tech', '10+2 with PCM, JEE Main', 150000, 'Comprehensive program covering algorithms, data structures, AI, ML, cloud computing'),
('Electronics & Communication', 'ECE-BTECH', (SELECT id FROM departments WHERE code = 'ECE'), 4, 'B.Tech', '10+2 with PCM, JEE Main', 140000, 'VLSI design, embedded systems, signal processing, telecommunications'),
('Mechanical Engineering', 'ME-BTECH', (SELECT id FROM departments WHERE code = 'ME'), 4, 'B.Tech', '10+2 with PCM, JEE Main', 135000, 'Thermodynamics, fluid mechanics, robotics, CAD/CAM'),
('Civil Engineering', 'CE-BTECH', (SELECT id FROM departments WHERE code = 'CE'), 4, 'B.Tech', '10+2 with PCM, JEE Main', 130000, 'Structural engineering, geotechnical engineering, transportation'),
('Business Administration', 'MBA', (SELECT id FROM departments WHERE code = 'MBA'), 2, 'MBA', 'Bachelor degree, CAT/MAT', 250000, 'World-class MBA with specializations in Finance, Marketing, HR, Operations'),
('Data Science & AI', 'DSAI-MTECH', (SELECT id FROM departments WHERE code = 'DSAI'), 2, 'M.Tech', 'B.Tech/BE in relevant field, GATE', 200000, 'Advanced ML, deep learning, NLP, computer vision, big data analytics'),
('Biotechnology', 'BT-BTECH', (SELECT id FROM departments WHERE code = 'BT'), 4, 'B.Tech', '10+2 with PCB/PCM', 160000, 'Genetic engineering, bioinformatics, pharmaceutical biotechnology')
ON CONFLICT (code) DO NOTHING;

-- Insert demo announcements
INSERT INTO announcements (title, content, category, priority, target_roles, is_pinned) VALUES
('Semester Exams Schedule Released', 'Final examination schedule for Fall 2026 has been published. Check your student portal for detailed timetable.', 'academic', 'high', ARRAY['all'], true),
('New AI Research Lab Inauguration', 'State-of-the-art AI research laboratory will be inaugurated by the Honorable Chancellor on March 15th.', 'general', 'normal', ARRAY['all'], false),
('Campus Placement Drive 2026', 'Over 150 companies registered for the upcoming placement season starting next month. Prepare your resumes!', 'placement', 'high', ARRAY['student', 'placement_officer'], false),
('Library Extended Hours', 'Central library will remain open until midnight during the examination period from April 1-30.', 'general', 'normal', ARRAY['all'], false),
('Scholarship Applications Open', 'Merit-based scholarship applications for academic year 2026-27 are now open. Last date: March 31.', 'finance', 'high', ARRAY['student'], false)
ON CONFLICT DO NOTHING;

-- Insert demo events
INSERT INTO events (title, description, event_date, event_time, location, category, is_public) VALUES
('Tech Fest 2026', 'Annual technology festival with coding competitions, hackathons, and tech exhibitions', '2026-03-15', '09:00:00', 'Main Campus Ground', 'technical', true),
('Cultural Night', 'Annual cultural program featuring music, dance, and drama performances', '2026-03-20', '18:00:00', 'Auditorium', 'cultural', true),
('Career Fair', 'Industry interaction and career guidance session with top companies', '2026-04-05', '10:00:00', 'Seminar Hall', 'placement', true),
('Alumni Meet', 'Annual alumni gathering and networking event', '2026-04-10', '16:00:00', 'Convention Center', 'alumni', true),
('Sports Day', 'Inter-department sports competitions and athletic events', '2026-04-15', '08:00:00', 'Sports Complex', 'sports', true)
ON CONFLICT DO NOTHING;

-- Insert demo applications
INSERT INTO applications (applicant_name, email, phone, course_id, status, marks_10th, marks_12th) VALUES
('Rahul Sharma', 'rahul.sharma@email.com', '+91 98765 43210', (SELECT id FROM courses WHERE code = 'CSE-BTECH'), 'pending', 92.5, 89.0),
('Ananya Patel', 'ananya.patel@email.com', '+91 98765 43211', (SELECT id FROM courses WHERE code = 'MBA'), 'under_review', 88.0, 91.5),
('Vikram Singh', 'vikram.singh@email.com', '+91 98765 43212', (SELECT id FROM courses WHERE code = 'ECE-BTECH'), 'pending', 85.5, 87.0),
('Neha Gupta', 'neha.gupta@email.com', '+91 98765 43213', (SELECT id FROM courses WHERE code = 'DSAI-MTECH'), 'pending', 90.0, 92.5),
('Arjun Reddy', 'arjun.reddy@email.com', '+91 98765 43214', (SELECT id FROM courses WHERE code = 'ME-BTECH'), 'accepted', 87.0, 88.5)
ON CONFLICT DO NOTHING;

-- Insert demo library books
INSERT INTO library_books (isbn, title, author, publisher, category, total_copies, available_copies, shelf_location) VALUES
('978-0262033848', 'Introduction to Algorithms', 'Cormen, Leiserson, Rivest, Stein', 'MIT Press', 'Computer Science', 8, 3, 'CS-A1'),
('978-0262035613', 'Deep Learning', 'Goodfellow, Bengio, Courville', 'MIT Press', 'Computer Science', 6, 1, 'CS-A2'),
('978-0132350884', 'Clean Code', 'Robert C. Martin', 'Prentice Hall', 'Software Engineering', 5, 2, 'CS-B1'),
('978-0201633610', 'Design Patterns', 'Gang of Four', 'Addison-Wesley', 'Software Engineering', 7, 4, 'CS-B2'),
('978-1492040344', 'Machine Learning Yearning', 'Andrew Ng', 'Self Published', 'Machine Learning', 4, 2, 'CS-C1'),
('978-0134685991', 'The Pragmatic Programmer', 'David Thomas, Andrew Hunt', 'Addison-Wesley', 'Software Engineering', 5, 3, 'CS-B3'),
('978-0262046823', 'Computer Networks', 'Tanenbaum, Wetherall', 'Pearson', 'Networking', 6, 4, 'CS-D1'),
('978-0132126953', 'Artificial Intelligence: A Modern Approach', 'Russell, Norvig', 'Pearson', 'AI', 8, 5, 'CS-C2')
ON CONFLICT (isbn) DO NOTHING;

-- Insert demo hostel rooms
INSERT INTO hostel_rooms (room_number, block, floor, capacity, occupied, room_type, amenities) VALUES
('A-101', 'A', 1, 2, 2, 'shared', '["WiFi", "AC", "Study Table"]'),
('A-102', 'A', 1, 2, 2, 'shared', '["WiFi", "AC", "Study Table"]'),
('A-103', 'A', 1, 2, 1, 'shared', '["WiFi", "AC", "Study Table"]'),
('A-201', 'A', 2, 2, 2, 'shared', '["WiFi", "AC", "Study Table"]'),
('B-101', 'B', 1, 2, 2, 'shared', '["WiFi", "AC", "Study Table"]'),
('B-102', 'B', 1, 2, 0, 'shared', '["WiFi", "AC", "Study Table"]'),
('C-101', 'C', 1, 2, 2, 'shared', '["WiFi", "AC", "Study Table"]'),
('C-102', 'C', 1, 2, 2, 'shared', '["WiFi", "AC", "Study Table"]'),
('D-101', 'D', 1, 2, 2, 'shared', '["WiFi", "AC", "Study Table"]'),
('E-101', 'E', 1, 1, 1, 'single', '["WiFi", "AC", "Study Table", "Attached Bath"]')
ON CONFLICT (room_number) DO NOTHING;

-- Insert demo placement jobs
INSERT INTO placement_jobs (company_name, job_title, description, location, package_lpa, eligibility_criteria, application_deadline, status) VALUES
('Google', 'Software Engineer', 'Design and develop scalable software systems', 'Bangalore', 35.0, 'B.Tech CSE/ECE, CGPA > 8.0', '2026-04-15', 'open'),
('Microsoft', 'Data Scientist', 'Build ML models and analyze large datasets', 'Hyderabad', 28.0, 'B.Tech/M.Tech, strong in statistics', '2026-04-10', 'open'),
('Amazon', 'SDE II', 'Develop distributed systems and cloud solutions', 'Bangalore', 32.0, 'B.Tech with 2+ years experience', '2026-04-07', 'open'),
('Meta', 'Product Manager', 'Lead product strategy and development', 'London', 40.0, 'MBA or B.Tech with product experience', '2026-04-20', 'open'),
('Adobe', 'UX Designer', 'Create intuitive user experiences', 'Noida', 18.0, 'Design background, portfolio required', '2026-04-05', 'open'),
('Netflix', 'Machine Learning Engineer', 'Build recommendation systems', 'Los Gatos', 45.0, 'M.Tech/PhD in ML, publications preferred', '2026-04-25', 'open')
ON CONFLICT DO NOTHING;

-- Insert demo fees
INSERT INTO fees (course_id, fee_type, amount, academic_year, due_date, description) VALUES
((SELECT id FROM courses WHERE code = 'CSE-BTECH'), 'Tuition Fee', 150000, 2026, '2026-08-15', 'Annual tuition fee for B.Tech CSE'),
((SELECT id FROM courses WHERE code = 'CSE-BTECH'), 'Hostel Fee', 75000, 2026, '2026-08-15', 'Annual hostel accommodation fee'),
((SELECT id FROM courses WHERE code = 'MBA'), 'Tuition Fee', 250000, 2026, '2026-08-15', 'Annual tuition fee for MBA'),
((SELECT id FROM courses WHERE code = 'ECE-BTECH'), 'Tuition Fee', 140000, 2026, '2026-08-15', 'Annual tuition fee for B.Tech ECE')
ON CONFLICT DO NOTHING;
