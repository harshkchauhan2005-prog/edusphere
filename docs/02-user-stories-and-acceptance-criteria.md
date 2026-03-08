# 02. User Stories and Acceptance Criteria

## 1. Authentication & Authorization
**Epic:** As a user, I need to securely log in to access role-specific features.

**User Story 1.1:** As a new user (Student/Faculty), I want to register for an account so I can access the platform.
- **Acceptance Criteria:**
  - Registration form requires Name, Email, Password, Role, and Department.
  - Students must also provide their Semester.
  - Successfully submitting the form creates an account.

**User Story 1.2:** As a registered user, I want to log in using my email and password so I can access my dashboard.
- **Acceptance Criteria:**
  - Login form requires Email and Password.
  - System validates credentials against the database.
  - On success, the user is redirected to their respective role-based dashboard.
  - Unknown credentials show an error message.

## 2. Course Management
**Epic:** As a faculty member or student, I want to participate in courses.

**User Story 2.1:** As a Faculty member, I want to create a new course so I can manage my students and materials.
- **Acceptance Criteria:**
  - Faculty provides Course Name, Subject, and Semester.
  - System auto-generates a unique Course ID upon creation.
  - The new course appears in the Faculty's dashboard.

**User Story 2.2:** As a Student, I want to join a course using a Course ID so I can access its content.
- **Acceptance Criteria:**
  - Student inputs a valid Course ID.
  - System validates the ID and adds the student to the course roster.
  - The course appears in the Student's enrolled courses list.

## 3. Assessments (Quizzes & Assignments)
**Epic:** As a faculty member, I want to evaluate my students using quizzes and assignments.

**User Story 3.1:** As a Faculty member, I want to create an MCQ quiz (timed or non-timed) for a specific course.
- **Acceptance Criteria:**
  - Faculty can add multiple-choice questions with answer keys.
  - Faculty can set a time limit (or leave it non-timed).
  - The quiz becomes visible to enrolled students.

**User Story 3.2:** As a Student, I want to attempt an MCQ quiz and see my results immediately.
- **Acceptance Criteria:**
  - Quizzes auto-submit when the timer runs out (if timed).
  - System auto-evaluates the submitted answers.
  - Student is shown their score upon completion.

**User Story 3.3:** As a Faculty member, I want to upload assignments with specific deadlines.
- **Acceptance Criteria:**
  - Faculty can upload an associated file and set a due date/time.

**User Story 3.4:** As a Student, I want to submit my assignment files before the deadline.
- **Acceptance Criteria:**
  - Student can upload a file (.pdf, .doc, etc.) up to the deadline.
  - The system blocks submissions after the specified deadline.

## 4. Special Section (Peer Sharing)
**Epic:** As a student, I want to view and share academic resources with my peers.

**User Story 4.1:** As a Student, I want to upload resources to my semester's Special Section.
- **Acceptance Criteria:**
  - Student can upload files (PDFs, ZIPs) tagged by their current semester.
  - Files are immediately available without an approval workflow.

**User Story 4.2:** As a Student, I want to download resources uploaded by my peers in my semester.
- **Acceptance Criteria:**
  - Students can strictly view and download resources assigned to their semester.
  - Students can search for specific resources by title or tag.

## 5. Administration
**Epic:** As an administrator, I want to manage platform settings and user accounts.

**User Story 5.1:** As an Admin, I want to manage (activate/deactivate) user accounts.
- **Acceptance Criteria:**
  - Admins can view a list of all students and faculty.
  - Admins can toggle the active status of any user.
  - Deactivated users cannot log in.
