# 07. Monorepo Structure

## 1. Overview
The EduSphere application is built using the MERN stack. A monorepo structure is recommended for the MVP to keep frontend and backend synchronized, share configuration files, and simplify the local developer experience.

## 2. Directory Layout
```text
edusphere/
├── backend/                  # Node.js & Express API
│   ├── src/
│   │   ├── config/           # Database, environment variables
│   │   ├── controllers/      # Route logic (Auth, Users, Courses...)
│   │   ├── middlewares/      # Auth, Role guards, Error handling, File uploads
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Express router definitions
│   │   ├── services/         # Business logic (e.g., Quiz Evaluation)
│   │   ├── utils/            # Helpers (JWT generation, formatters)
│   │   └── app.js            # Express app setup
│   ├── .env                  # Environment variables
│   ├── package.json          # Backend dependencies
│   └── server.js             # Entry point
│
├── frontend/                 # React.js application
│   ├── public/               # Static assets, index.html
│   ├── src/
│   │   ├── assets/           # Images, icons, global styles
│   │   ├── components/       # Shared UI components (Nav, Buttons)
│   │   ├── context/          # React Context (Auth State)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Role-based page views
│   │   │   ├── admin/
│   │   │   ├── faculty/
│   │   │   ├── public/
│   │   │   └── student/
│   │   ├── services/         # Axios API calls
│   │   ├── utils/            # Frontend helpers
│   │   ├── App.js            # React Router setup
│   │   └── index.js          # React DOM entry
│   ├── .env                  # Environment variables
│   └── package.json          # Frontend dependencies
│
├── .gitignore                # Ignored files (node_modules, .env, uploads)
├── package.json              # Monorepo root dependencies (Workspaces/Concurrently)
└── README.md                 # Project documentation
```

## 3. Tooling
- **Package Manager:** Standard `npm` or `yarn` with workspace support to manage both directories from the root.
- **Concurrent Execution:** Use `concurrently` in the root `package.json` to spin up both the React dev server and the Node backend with a single command (e.g., `npm run dev`).
- **Environment Variables:** Handled separately within the `/frontend` and `/backend` directories for proper separation of secrets.
- **Uploads:** For local development, an `/uploads` directory can reside at the root or inside `/backend`, heavily `.gitignore`d. In production, this shifts to a cloud storage solution.
