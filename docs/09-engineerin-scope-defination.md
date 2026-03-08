# 09. Engineering Scope Definition

## 1. Overview
This document strictly defines the boundaries of the EduSphere engineering effort for the Minimum Viable Product (MVP). It solidifies what the engineering team must deliver, and what is deferred to subsequent releases.

## 2. In-Scope (Engineering Deliverables)
The engineering team is responsible for delivering the following technical components:

### Frontend
- Responsive React web application (Desktop-first approach).
- Component-based architecture supporting 3 explicit roles: Student, Faculty, Admin.
- Route protection to prevent unauthorized access to dashboards.
- Integrations with backend APIs using Axios.

### Backend
- Node.js + Express REST API.
- JWT-based authentication system securely managing sessions.
- Role-based authorization middleware restricting access to specific endpoints.
- Basic API validation stopping malformed requests.
- File upload handling infrastructure utilizing robust multipart parsing (e.g., Multer), enforcing size limits and file type checks.

### Database
- MongoDB integration via Mongoose ODM.
- Normalized and indexed schemas enabling rapid lookups for Auth, Courses, and Quizzes.
- Cloud deployment readiness (e.g., MongoDB Atlas).

## 3. Out of Scope (Explicit Exclusions)
The following are **NOT** to be built during the MVP phase. Any scope-creep involving these items must be rejected:
- **Mobile Applications:** No native iOS or Android versions.
- **Email Systems:** No password resets, no email verifications, no system activity notifications.
- **Sub-systems:**
  - Automated grading for descriptive text assignments.
  - Faculty assignment feedback/commenting interfaces.
  - Peer-review or semantic approval workflows for the Special Section.
- **Monetization:** No payment gateways or subscription tiers.
- **Analytics:** Complex metric tracking dashboards (beyond basic statistical counts for admins).

## 4. Technical Assumptions
- Target users will primarily access the app via a modern desktop or laptop web browser.
- External cloud storage services (like AWS S3 or Cloudinary) or isolated scalable volume setups will be used for file storage in production, rather than internal server disk memory.
- The hosting environments support Node environments (e.g., AWS, Render, Heroku).
- Institutions utilize a standard semester-based tiering model rather than continuous non-linear learning tracks.

## 5. Foundational Constraints
- **State Management Limitations:** Authentication is the primary persistent client-side state required. Complex Redux setups are discouraged in favor of localized React Context/Hooks to retain MVP simplicity.
- **Question Types Context:** The quiz assessment engine is strictly constrained to multiple-choice formats to enable instantaneous auto-evaluation.
