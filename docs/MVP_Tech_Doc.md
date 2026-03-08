.

🚀 MVP Technical Documentation – EduSphere
1. Purpose of This Document

This document defines the Minimum Viable Product (MVP) for EduSphere, an E-Learning Portal.
It outlines the core features, technical stack, and implementation decisions required to build a functional, deployable version of the platform.

The MVP focuses on:

Core learning workflows

Essential collaboration features

Scalable technical foundation

Real-world usability

2. MVP Goals

Enable digital learning for students and faculty

Support course-based content delivery

Provide quiz and assignment functionality

Allow peer-to-peer academic resource sharing

Ensure role-based access control

Be deployable as a production-ready web application

3. In-Scope (MVP Features)
3.1 User Roles

Student

Faculty

Admin

3.2 Public Pages

Landing Page

Login Page

Register Page

3.3 Authentication (MVP Level)

Email & password login

Role-based access

No email verification

No password reset

3.4 Student Features (MVP)

Join course using Course ID

View enrolled courses

Download study materials

Attempt MCQ quizzes

Timed

Non-timed

Auto quiz submission

Upload assignments (file only)

Deadline-based submission blocking

Semester-wise access to Special Section

Upload & download peer-shared resources

Profile photo upload & change

3.5 Faculty Features (MVP)

Create and manage courses

Auto-generate Course ID

Upload study materials

Create MCQ quizzes

Enable timed / non-timed quizzes

View quiz results

Upload assignments with deadlines

View assignment submissions

Profile photo upload & change

3.6 Admin Features (MVP)

Admin dashboard overview

Manage students and faculty

Activate / deactivate users

Manage departments

Manage semesters

Manage subjects

Assign faculty to subjects

Monitor courses

4. Out of Scope (Non-MVP)

The following features are explicitly excluded from MVP:

Mobile application

Email notifications

Password reset & verification

Assignment grading & feedback

Quiz descriptive questions

Resource approval workflows

Analytics & reports

Payment or subscription features

5. Technology Stack (MVP)
Frontend

React.js

Role-based routing

Responsive UI (Desktop-first)

Axios for API calls

Backend

Node.js

Express.js

RESTful APIs

JWT-based authentication

Database

MongoDB

Mongoose ODM

6. MVP System Architecture
Browser
  ↓
React Frontend
  ↓ (REST APIs)
Node.js + Express Backend
  ↓
MongoDB Database
7. Data Models (High-Level)
User

name

email

password (hashed)

role (student / faculty / admin)

department

semester (student only)

profilePhoto

Course

courseName

subject

semester

facultyId

courseId (unique)

enrolledStudents

Quiz

courseId

questions (MCQ)

timed / non-timed

duration

results

Assignment

courseId

deadline

submissionFiles

Special Section Resource

title

semester

file

uploadedBy

8. File Upload Strategy (MVP)
Supported Uploads

Study materials

Assignments

Special section resources

Profile photos

Validation

File type validation

Size limits

Secure upload handling

9. Security (MVP Level)

Password hashing

JWT-based authentication

Role-based API access

Input validation

Protected routes

10. Deployment Considerations (MVP)

Frontend and backend deployed separately

Environment-based configuration

Scalable backend structure

Database hosted on cloud

Ready for production hosting

11. MVP Success Criteria

The MVP is considered successful if:

Users can register and log in

Faculty can create courses

Students can join courses

Materials, quizzes, and assignments function correctly

Special Section supports peer sharing

Role-based access works correctly

Application is deployable and stable

12. Conclusion

The EduSphere MVP delivers a complete, functional E-Learning platform while maintaining simplicity and scalability.
It establishes a strong technical foundation for future enhancements and real-world deployment.