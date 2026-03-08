# 05. Database Schema

## 1. Overview
EduSphere uses MongoDB as its primary datastore, modeled via Mongoose ODM. The database schema focuses on normalized references where appropriate, with explicit indexing for performance optimizations.

## 2. Core Collections

### 2.1 `users`
Stores all platform users (Students, Faculty, Admins).
- `_id`: ObjectId
- `name`: String (Required)
- `email`: String (Required, Unique, Indexed)
- `password`: String (Required, Hashed)
- `role`: Enum String `['student', 'faculty', 'admin']` (Required)
- `department`: ObjectId (Ref: `departments`)
- `semester`: Number (Required if role is `student`)
- `profilePhoto`: String (File URL/Path)
- `isActive`: Boolean (Default: true)
- `createdAt`: Date
- `updatedAt`: Date

### 2.2 `courses`
Stores courses created by Faculty.
- `_id`: ObjectId
- `courseId`: String (Required, Unique, Indexed, Auto-generated)
- `courseName`: String (Required)
- `subject`: ObjectId (Ref: `subjects`)
- `semester`: Number (Required)
- `facultyId`: ObjectId (Ref: `users`, Required)
- `enrolledStudents`: Array of ObjectIds (Ref: `users`)
- `createdAt`: Date
- `updatedAt`: Date

### 2.3 `materials`
Study material documents linked to courses.
- `_id`: ObjectId
- `courseId`: ObjectId (Ref: `courses`, Required, Indexed)
- `title`: String (Required)
- `fileUrl`: String (Required)
- `uploadedBy`: ObjectId (Ref: `users` - Faculty)
- `createdAt`: Date

### 2.4 `quizzes`
Quizzes created by Faculty for specific courses.
- `_id`: ObjectId
- `courseId`: ObjectId (Ref: `courses`, Required, Indexed)
- `title`: String (Required)
- `isTimed`: Boolean (Default: false)
- `durationInMinutes`: Number (Required if `isTimed` is true)
- `questions`: Array of Objects
  - `questionText`: String
  - `options`: Array of Strings
  - `correctOptionIndex`: Number
- `results`: Array of Objects
  - `studentId`: ObjectId (Ref: `users`)
  - `score`: Number
  - `submittedAt`: Date
- `createdAt`: Date

### 2.5 `assignments`
Assignments requiring student file submissions.
- `_id`: ObjectId
- `courseId`: ObjectId (Ref: `courses`, Required, Indexed)
- `title`: String (Required)
- `description`: String
- `facultyAttachment`: String (Optional File URL/Path)
- `deadline`: Date (Required)
- `submissions`: Array of Objects
  - `studentId`: ObjectId (Ref: `users`)
  - `submissionFile`: String (Required File URL/Path)
  - `submittedAt`: Date
- `createdAt`: Date
- `updatedAt`: Date

### 2.6 `specialResources`
Peer-to-peer files uploaded by students in the Special Section.
- `_id`: ObjectId
- `title`: String (Required)
- `semester`: Number (Required, Indexed)
- `fileUrl`: String (Required)
- `uploadedBy`: ObjectId (Ref: `users` - Student, Required)
- `createdAt`: Date

### 2.7 `departments`
Platform-wide departments managed by admins.
- `_id`: ObjectId
- `name`: String (Required, Unique)

### 2.8 `subjects`
Platform-wide subjects managed by admins.
- `_id`: ObjectId
- `name`: String (Required, Unique)
- `departmentId`: ObjectId (Ref: `departments`, Required)
- `assignedFaculty`: Array of ObjectIds (Ref: `users`)
