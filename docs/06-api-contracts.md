# 06. API Contracts

## 1. Overview
The EduSphere RESTful API serves JSON-formatted responses. All protected endpoints expect an `Authorization` header formatted as `Bearer <JWT_TOKEN>`.

### Common Response Format
**Success Responses (2xx):**
```json
{
  "success": true,
  "data": { ... } // Or Array
}
```

**Error Responses (4xx, 5xx):**
```json
{
  "success": false,
  "message": "Error description..."
}
```

## 2. Authentication (`/api/auth`)
- `POST /api/auth/register`
  - **Body:** `{ "name", "email", "password", "role", "department", "semester" }`
  - **Returns:** `{ "token", "user" }`
- `POST /api/auth/login`
  - **Body:** `{ "email", "password" }`
  - **Returns:** `{ "token", "user" }`

## 3. Users (`/api/users`)
- `GET /api/users/profile`
  - **Access:** Any authenticated user
  - **Returns:** User profile data.
- `PUT /api/users/profile/photo`
  - **Access:** Any authenticated user
  - **Body (multipart/form-data):** `image` file.
- `GET /api/users`
  - **Access:** Admin
  - **Returns:** List of all users.
- `PATCH /api/users/:userId/status`
  - **Access:** Admin
  - **Body:** `{ "isActive": boolean }`

## 4. Courses (`/api/courses`)
- `POST /api/courses`
  - **Access:** Faculty
  - **Body:** `{ "courseName", "subject", "semester" }`
  - **Returns:** Newly created course object (with generated `courseId`).
- `POST /api/courses/join`
  - **Access:** Student
  - **Body:** `{ "courseId" }` // The string ID, not ObjectId
- `GET /api/courses/enrolled`
  - **Access:** Student
  - **Returns:** array of enrolled course documents.
- `GET /api/courses/managed`
  - **Access:** Faculty
  - **Returns:** array of courses created by the caller faculty.
- `GET /api/courses`
  - **Access:** Admin
  - **Returns:** array of all courses.

## 5. Materials (`/api/courses/:courseId/materials`)
- `POST /`
  - **Access:** Faculty associated with the course.
  - **Body (multipart/form-data):** `title` string, `file` attachment.
- `GET /`
  - **Access:** Enrolled Students, Faculty associated with the course.
  - **Returns:** Array of materials for the specific course.

## 6. Quizzes (`/api/courses/:courseId/quizzes`)
- `POST /`
  - **Access:** Faculty associated with the course.
  - **Body:** `{ "title", "isTimed", "durationInMinutes", "questions": [ { "questionText", "options", "correctOptionIndex" } ] }`
- `GET /`
  - **Access:** Enrolled Students, Associated Faculty.
- `POST /:quizId/attempt`
  - **Access:** Enrolled Students.
  - **Body:** `{ "answers": [ "index", "index", ... ] }`
  - **Returns:** Immediate evaluated score.

## 7. Assignments (`/api/courses/:courseId/assignments`)
- `POST /`
  - **Access:** Faculty associated with the course.
  - **Body (multipart/form-data):** `title`, `description`, `deadline` (ISO string), optional `facultyAttachment`.
- `GET /`
  - **Access:** Enrolled Students, Associated Faculty.
- `POST /:assignmentId/submit`
  - **Access:** Enrolled Students.
  - **Body (multipart/form-data):** `submissionFile`.
  - **Validation:** Server rejects 403 if `Date.now() > assignment.deadline`.
- `GET /:assignmentId/submissions`
  - **Access:** Associated Faculty.
  - **Returns:** Array of all student submissions for the assignment.

## 8. Special Section (`/api/special-section`)
- `POST /`
  - **Access:** Student
  - **Body (multipart/form-data):** `title`, `file`. (Semester derived from student profile).
- `GET /`
  - **Access:** Student
  - **Query:** `?search=xyz`
  - **Returns:** Resources matching the caller student's semester.

## 9. Admin Resources (`/api/admin`)
- `POST /departments`, `GET /departments`
- `POST /semesters`, `GET /semesters` 
- `POST /subjects`, `GET /subjects`
  - **Access:** Admin only.
