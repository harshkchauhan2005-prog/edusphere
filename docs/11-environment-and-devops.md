# 11. Environment and DevOps

## 1. Overview
The EduSphere application depends on a robust environment strategy to ensure stable development, accurate testing, and reliable production deployment. The architecture natively supports multi-environment setups via simple `.env` configurations.

## 2. Environments

### 2.1 Local Development Environment
Used by developers for building and testing features on their local machines.
- **Frontend URL:** `http://localhost:3000`
- **Backend URL:** `http://localhost:5000`
- **Database:** Local MongoDB instance (`mongodb://localhost:27017/edusphere`) OR a shared Atlas Dev Cluster.
- **Execution:** Runs via a root `package.json` utilizing `concurrently` to spin up both servers. Node runs via `nodemon` for hot-reloading. React runs its default dev server.

### 2.2 Staging / QA Environment
An exact replica of the production environment used for User Acceptance Testing (UAT) to catch bugs before they hit live users.
- **Database:** Cloud-hosted MongoDB Atlas Cluster (Staging DB).
- **Code State:** Mirrors the `main` or `staging` branch.

### 2.3 Production Environment
The live application used by real Students, Faculty, and Admins.
- **Database:** Cloud-hosted MongoDB Atlas Cluster (Prod DB with daily backups).
- **Frontend Hosting:** Vercel or Netlify (enables automatic PR previews and fast CDN delivery).
- **Backend Hosting:** Render, Heroku, or AWS EC2 instance.
- **Domain:** Custom domain configured via Route53 / Cloudflare mapping to the frontend host.

## 3. Environment Variables
Sensitive keys and varying configurations are handled securely via `.env` files.

**Backend (`/backend/.env`):**
```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/edusphere?retryWrites=true&w=majority
JWT_SECRET=super_secret_key_12345
JWT_EXPIRES_IN=7d
NODE_ENV=development # or 'production'
```

**Frontend (`/frontend/.env`):**
```env
# Create React App format
REACT_APP_API_URL=http://localhost:5000/api
# Or Vite format
VITE_API_URL=http://localhost:5000/api
```

## 4. CI/CD Pipeline Context
While the MVP does not necessitate a complex automated pipeline, basic setup is recommended:
- **Continuous Integration (CI):** Run basic unit tests, Prettier formatting checks, and ESLint on every PR to `main`.
- **Continuous Deployment (CD):** Connect the frontend `main` branch directly to Vercel/Netlify for zero-downtime auto-deployments. Connect the backend to Render/Heroku for automated syncs upon merges.
