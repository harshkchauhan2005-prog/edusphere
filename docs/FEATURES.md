# EduSphere Feature Digest

Welcome to the EduSphere feature breakdown! Here, we detail exactly what this platform is capable of, diving deep into the functionalities offered for each user role and the technical implementations supporting them.

---

## 🔐 Core System Features

### 1. Robust Authentication & Security
*   **Role-Based Access Control (RBAC):** EduSphere securely isolates routing, data access, and API endpoints depending on whether the user is a Student, Faculty member, or Administrator.
*   **JWT Sessions:** Secure, stateless JSON Web Token authentication keeps users logged in seamlessly.
*   **Email Verification Engine:** 
    *   Powered by Nodemailer & Resend.
    *   New users must verify their email address before accessing the platform.
    *   OTP verification logic ensures only intended users gain entry.

### 2. Cloud Integrations
*   **Persistent Cloudinary Storage:** Profile pictures, assignment PDFs, and course reference materials are securely transmitted and stored on Cloudinary for reliable, fast retrieval.
*   **Scalable MongoDB Database:** Data structures (Users, Courses, Quizzes, Departments) are highly optimized using Mongoose schemas for complex relationships (e.g., populating a Course with its assigned Faculty and enrolled Students).

### 3. Modern Responsive UI
*   **Mobile-First Design (Tailwind CSS):** From the dashboard sidebars to the data tables, the entire interface fluidly adapts to mobile, tablet, and desktop screens. 
    *   Hamburger menus and off-canvas slide-in sidebars provide intuitive navigation on small screens.
    *   Data-heavy tables feature horizontal scrolling to prevent layout breakage on mobile.
*   **Smart Dark Mode:** Context-aware theming easily toggles between bright, legible light mode and a sleek, low-glare dark mode.

---

## 👨‍🎓 Student Features

Students enjoy a dedicated, streamlined portal focused entirely on their coursework.

### Course Access & Updates
*   **Dynamic Course List:** Instantly see all enrolled courses on the dashboard.
*   **Real-time Announcements:** Receive critical class updates, deadline extensions, or general information broadcast by course instructors.
*   **Resource Library:** Download lecture notes, syllabi, or datasets directly from the `Materials` tab of any course.

### Assessments & Submissions
*   **Interactive Quizzes:**
    *   Take multi-format quizzes containing Multiple Choice Questions (MCQs) and Descriptive text answers.
    *   Instantly see scores for auto-graded MCQs.
*   **Assignment Uploads:** 
    *   Review assignment instructions and deadlines clearly displayed.
    *   Upload submission documents directly.
    *   Once graded, view the numerical score and read personalized instructor feedback.

---

## 👨‍🏫 Faculty Features

The faculty portal is a comprehensive toolkit for managing education delivery and tracking performance.

### Course Administration
*   **Content Management:** Upload files (like PDFs) to the course `Materials` section for students to review.
*   **Direct Communication:** Post quick Announcements to specifically targeted courses to keep students informed.

### Advanced Assessment Tools
*   **Dynamic Quiz Builder:** 
    *   Construct quizzes using a mix of question types (MCQ, Descriptive).
    *   Set the correct options for immediate MCQ grading.
*   **Assignment Master Panel:**
    *   Create assignments with specific, enforceable deadlines and detailed descriptions.
    *   Attach reference documents for students.
*   **Grading Workflows:**
    *   Review submitted quizzes and assignments side-by-side.
    *   Input marks directly for descriptive answers.
    *   Download student assignment files to review, enter final grades, and write constructive text feedback.

### Data Visualization
*   **Course Analytics:** Visual charts (powered by Recharts) visualize enrollment figures and average assignment/quiz grades, helping faculty tailor their teaching approach.

---

## 🛡️ Administrative Features

Administrators govern the platform, ensuring smooth operation and accurate academic structuring.

### Infrastructure Management
*   **Department & Subject Hierarchy:** Dynamically create, edit, or delete institutional departments (e.g., "Engineering") and the subjects that map to them (e.g., "Software Design").

### Enrollment Control
*   **User Provisioning:** Securely enroll specific Students into courses taught by designated Faculty. This maintains data integrity and ensures students only see content relevant to a course they are registered for.

### System Configuration
*   **Global Preferences:** Manage broad platform settings, such as forcing light/dark mode overrides or reviewing system logs.
