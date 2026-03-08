# 12. Testing Strategy

## 1. Overview
The EduSphere testing strategy ensures that the MVP goals—role-based access, academic content handling, and core workflows—function predictably and securely. Testing is prioritized around high-risk flows such as file uploads, authentication, and quiz evaluation.

## 2. Testing Layers

### 2.1 Unit Testing (Backend Core)
Focus on isolated testing of helper functions and domain rules.
- **Auth Utils:** Test JWT generation and signature verification logic independently.
- **Quiz Evaluation Algorithm:** Feed mocked student submission arrays against mocked quiz correct indices to ensure score output is 100% mathematically correct based on logic.
- **Validators:** Test that input schemas properly reject missing passwords, invalid emails, or missing roles.

### 2.2 Integration Testing (API Endpoints)
Tools like Postman (or Jest + Supertest) are used to test module connections and interactions with a test database.
- **Auth Flows:** Verify registration successfully hashes passwords. Verify login returns a valid JWT.
- **Role-Based Routing:** Call `Admin` specific API endpoints using a `Student` JWT. The system MUST return a `403 Forbidden` status. Attempt to join a course as a Faculty member (`403 Forbidden`).
- **File Upload Security:** Send executable scripts (`.sh`, `.exe`, `.js`) to the `/materials` POST route. The middleware MUST reject them with `400 Bad Request` regarding unsupported file types. Test file sizes exceeding the 10MB/50MB limit to ensure standard rejection errors.

### 2.3 System/End-to-End Testing (UI & UX)
Simulate real user behavior utilizing the React frontend. (Manual execution for MVP, optionally automated via Cypress later).
- **Workflow A (Faculty creates course and content):** Faculty logs in -> Navigates to Dashboard -> Creates Course -> Receives unique Course ID -> Uploads a PDF -> Creates a 3-question MCQ Quiz.
- **Workflow B (Student joins and participates):** Student logs in -> Clicks Join Course -> Enters Course ID -> Views PDF material -> Completes the Quiz -> Receives immediate score visualization.
- **Workflow C (Assignment Deadline Enforcement):** Faculty creates assignment A with a deadline in the past. Faculty creates assignment B with a deadline in the future. Student attempts to upload to both. System must block A and allow B.

## 3. User Acceptance Testing (UAT)
Conducted on the `Staging` environment before the product goes live.
- Stakeholders review the visual aesthetics to ensure the 'Clean and modern interface' and 'Responsive design' requirements from the PRD are met.
- General exploratory testing mimicking edge cases (e.g., student attempting to browse another semester's Special Section).

## 4. Known Bugs & Mitigation Strategy
- **File System Clutter:** If uploads fail mid-stream or users delete items, orphaned files might remain on the disk. Mitigation: Periodic manual review or standardizing a cloud service like AWS S3 which can handle lifecycle rules eventually. 
