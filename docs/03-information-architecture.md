# 03. Information Architecture

## 1. Top-Level Navigation
EduSphere uses role-based routing to ensure users land in the correct application context. The shared components include:
- **Navbar:** Displays logo, user profile (with photo), and global actions.
- **Sidebar:** Contains context-specific navigation links.

## 2. Public Pages
Accessible by unauthenticated users.
- `/` - **Landing Page:** Product overview and clear calls-to-action (Login/Register).
- `/login` - **Login Page:** Email/password authentication form.
- `/register` - **Register Page:** Separate flows/forms for Student and Faculty registration.

## 3. Student Dashboard Flow (`/student/*`)
Accessible only to users with the `Student` role.
- `/student` or `/student/dashboard` - **Student Dashboard Overview:** Summary of enrolled courses and upcoming deadlines.
- `/student/courses` - **My Courses:** List of currently enrolled courses.
  - `/student/courses/join` - **Join Course Form:** Input Course ID to enroll.
  - `/student/courses/:courseId` - **Course Details:** Overview of a specific course.
    - `/student/courses/:courseId/materials` - **Study Materials:** View and download files uploaded by faculty.
    - `/student/courses/:courseId/quizzes` - **Quizzes:** View available quizzes and attempts.
      - `/student/courses/:courseId/quizzes/:quizId` - **Quiz View & Attempt:** Interface for attempting MCQ quizzes (timed or non-timed).
      - `/student/courses/:courseId/quizzes/:quizId/results` - **Quiz Results:** Score and feedback.
    - `/student/courses/:courseId/assignments` - **Assignments:** View open assignments.
      - `/student/courses/:courseId/assignments/:assignmentId` - **Submit Assignment:** File upload interface (blocked past deadline).
- `/student/special-section` - **Special Section:** Access semester-specific peer-shared resources.
  - `/student/special-section/upload` - **Upload Resource:** Form to upload files to the section.
- `/student/profile` - **My Profile:** View and update profile photo.

## 4. Faculty Dashboard Flow (`/faculty/*`)
Accessible only to users with the `Faculty` role.
- `/faculty` or `/faculty/dashboard` - **Faculty Dashboard Overview:** Summary of managed courses.
- `/faculty/courses` - **My Courses:** List of courses created by the faculty.
  - `/faculty/courses/create` - **Create Course Form:** Input course details to generate a Course ID.
  - `/faculty/courses/:courseId` - **Course Details:** Manage a specific course.
    - `/faculty/courses/:courseId/materials` - **Manage Materials:** Upload study resources to the course.
    - `/faculty/courses/:courseId/quizzes` - **Manage Quizzes:** View all course quizzes and results.
      - `/faculty/courses/:courseId/quizzes/create` - **Create Quiz Form:** Add MCQs, set time limits.
    - `/faculty/courses/:courseId/assignments` - **Manage Assignments:** Upload new assignments, set deadlines.
      - `/faculty/courses/:courseId/assignments/:assignmentId/submissions` - **View Submissions:** See file uploads by enrolled students.
- `/faculty/profile` - **My Profile:** View and update profile photo.

## 5. Admin Dashboard Flow (`/admin/*`)
Accessible only to users with the `Admin` role.
- `/admin` or `/admin/dashboard` - **Admin Dashboard Overview:** System metrics and top-level stats.
- `/admin/users` - **Manage Users:** List all students and faculty.
  - Ability to activate/deactivate accounts.
- `/admin/departments` - **Manage Departments:** Create, edit, and delete institutional departments.
- `/admin/semesters` - **Manage Semesters:** Configure valid semesters for the institution.
- `/admin/subjects` - **Manage Subjects:** Create subjects and assign faculty to them.
- `/admin/courses` - **Monitor Courses:** View all courses created across the system.

## 6. Route Protection & Redirects
- Unauthenticated users attempting to access dashboard routes are redirected back to `/login`.
- Authenticated users attempting to access unauthorized role paths (e.g. Student accessing `/faculty`) fall back to their default dashboard or an access denied page.
