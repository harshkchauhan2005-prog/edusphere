# 10. Development Phases

## 1. Phase 1: Planning and Setup (Days 1 - 3)
- Initialize the monorepo structure (React frontend, Node/Express backend).
- Setup ESLint, Prettier, and standard Git Hooks.
- Define environment configurations (Development, Staging).
- Spin up the MongoDB database (Local/Atlas).
- Scaffold baseline React structure (React Router, generic layout elements like Navbar and Sidebar).

## 2. Phase 2: Authentication & Authorization Base (Days 4 - 7)
- Implement Users collection in MongoDB.
- Build backend routes for Registration and Login.
- Implement JWT generation and token verification middleware.
- Build role-based authorization middleware (Student, Faculty, Admin).
- Create frontend Login, Register, and public Landing pages.
- Establish protected React routes testing successful login and redirection based on role.

## 3. Phase 3: Course Management Core (Days 8 - 12)
- Implement Admin dashboards for managing generic infrastructure: Departments, Subjects, Semesters.
- Build Faculty API and UI for generating new courses.
- Implement Course ID generation.
- Build Student API and UI for joining courses via Course ID.
- Create dashboard lists for Faculty (Managed Courses) and Students (Enrolled Courses).

## 4. Phase 4: Materials and File Uploads (Days 13 - 16)
- Setup Multer and file handling strategy on the backend (handling validation & storage limits).
- Build Faculty UI for uploading Study Materials to a course.
- Build Student UI to view and download study materials.
- Implement User Profile photo uploads.

## 5. Phase 5: Assessments Engine (Days 17 - 22)
- **Quizzes:** Build MCQ quiz creation UI for Faculty. Set up backend schema for timed/non-timed configurations. Build Student interface to consume quizzes, accompanied by the Backend Auto-Evaluation service to compute and store scores.
- **Assignments:** Build Faculty submission portals. Implement deadline enforcement logic on the backend. Create Student interface for uploading assignment files before the designated timeframe expires.

## 6. Phase 6: Special Section & Peer Sharing (Days 23 - 25)
- Create Special Section schema storing files linked explicitly to Semesters.
- Develop Student UI for uploading Zip/PDF files.
- Develop Student UI for viewing/searching files strictly filtered by their registered semester.

## 7. Phase 7: Polish, Bug Fixing, & Security (Days 26 - 28)
- End-to-end integration testing.
- UI/UX polish (CSS cleanup, responsive checks).
- Final review of edge cases (e.g., expired tokens, assignment deadlines, file size overflows).

## 8. Phase 8: Deployment & Handover (Days 29 - 30)
- Deploy frontend to a static host (e.g., Vercel, Netlify).
- Deploy backend to an application server (e.g., Render, Heroku).
- Hook up production Database variables.
- Final user acceptance testing on live URLs.
