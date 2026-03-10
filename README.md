<div align="center">
  <img src="https://raw.githubusercontent.com/harshkchauhan2005-prog/edusphere/main/frontend/public/vite.svg" alt="EduSphere Logo" width="120" />
  
  # EduSphere

  **A modern, comprehensive web-based platform for educational institutions to seamlessly manage administration, faculty, and student interactions.**

  [🚀 Live Demo](https://edusphere-enlm.onrender.com)

  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/React-19-61dafb.svg?logo=react)](https://react.dev/)
  [![Node.js](https://img.shields.io/badge/Node.js-Express-339933.svg?logo=nodedotjs)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248.svg?logo=mongodb)](https://www.mongodb.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
</div>

<br />

## 🌟 Overview

EduSphere is designed to streamline academic workflows, offering distinct, feature-rich portals for **Students**, **Faculty**, and **Administrators**. From course materials and automated quiz grading to faculty announcements and departmental administration, EduSphere centralizes the academic experience into a single, beautiful, and responsive web application.

---

## ✨ Key Features

### 👨‍🎓 For Students
*   **Intuitive Dashboard**: Overview of enrolled courses, upcoming deadlines, and recent announcements.
*   **Course Management**: Easy access to course materials, assignments, and quizzes.
*   **Assignments & Quizzes**: Submit assignments directly through the platform and take interactive multiple-choice and descriptive quizzes.
*   **Real-time Grades**: View grades and faculty feedback upon assignment/quiz evaluation.

### 👨‍🏫 For Faculty
*   **Course Administration**: Create, manage, and attach materials (PDFs, Documents) to courses.
*   **Announcements**: Broadcast important updates to enrolled students.
*   **Advanced Grading System**: 
    *   Create dynamic quizzes with MCQ (auto-graded) and Descriptive (manually graded) questions.
    *   Review and grade student assignment submissions with a built-in feedback system.
*   **Course Analytics**: Visualize student performance and enrollment trends.

### 🛡️ For Administrators
*   **Academic Structure**: Manage Departments, Subjects, and map them to courses.
*   **User Management**: Oversee platform users, enrollments, and roles.
*   **System Settings**: Configure global application settings.

### 🎨 Global Features
*   **Fully Responsive UI**: A mobile-first design leveraging Tailwind CSS ensures the platform looks stunning on desktops, tablets, and smartphones.
*   **Dark Mode Support**: Seamless toggle between light and dark themes.
*   **Secure Authentication**: Role-based access control (RBAC) securely separates student, faculty, and admin data.
*   **Cloud Storage**: Integration with Cloudinary for robust file and image uploads.

---

## 🛠️ Technology Stack

**Frontend**
*   **React 19** with Vite for lightning-fast builds
*   **Tailwind CSS 4** for modern, utility-first styling
*   **React Router v7** for smooth client-side navigation
*   **Recharts** for interactive analytics dashboards
*   **Heroicons / Google Material Symbols** for beautiful typography and iconography

**Backend**
*   **Node.js & Express.js** providing a robust REST API
*   **MongoDB & Mongoose 9** for flexible NoSQL data management
*   **JSON Web Tokens (JWT)** for secure, stateless authentication
*   **Cloudinary / Multer** for secure asset and document management
*   **Nodemailer & Resend** for automated system emails (verification, notifications)

---

## 🚀 Getting Started

Follow these steps to set up EduSphere locally for development and testing.

### Prerequisites
*   Node.js (v18 or higher recommended)
*   npm or yarn
*   A MongoDB Atlas Database (or local MongoDB instance)
*   A Cloudinary Account (for file uploads)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/harshkchauhan2005-prog/edusphere.git
    cd edusphere
    ```

2.  **Install all dependencies:**
    EduSphere is set up as a monorepo. You can install dependencies for both the frontend and backend simultaneously:
    ```bash
    npm run install:all
    ```

### Environment Configuration

You will need to set up environment variables for both the backend and frontend.

**Backend (`backend/.env`):**
Create a `.env` file in the `/backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
# Cloudinary Keys
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
# Email Configuration (e.g., Resend)
RESEND_API_KEY=your_resend_api_key
FRONTEND_URL=http://localhost:5173
```

**Frontend (`frontend/.env`):**
Create a `.env` file in the `/frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

Start both the React development server and the Node.js backend API concurrently from the root directory:

```bash
npm start
```

*   **Frontend**: `http://localhost:5173`
*   **Backend API**: `http://localhost:5000`

---

## 📸 Screenshots

*(Add screenshots of your application here. You can upload them to a `screenshots` folder in your repo or link them directly. Examples below:)*

<details>
<summary>Click to view screenshots</summary>

*   **Student Dashboard:**
    *(Insert image link here)*
*   **Faculty Grading Interface:**
    *(Insert image link here)*
*   **Admin Architecture Manager:**
    *(Insert image link here)*
*   **Responsive Mobile View:**
    *(Insert image link here)*

</details>

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check out the [issues page](https://github.com/harshkchauhan2005-prog/edusphere/issues) if you want to contribute.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
<div align="center">
  <i>Built with ❤️ for better education management.</i>
</div>
