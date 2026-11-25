# JobNest — Full Stack Job Portal

A React + Node.js + Express + MongoDB job portal project. Candidate accounts can search jobs and apply with a resume; employers can publish openings, review applicants and update application statuses.

## Stack
- Frontend: React, Vite, React Router, Axios, Lucide icons, custom responsive CSS
- Backend: Node.js, Express, JWT, bcryptjs, Multer
- Database: MongoDB / MongoDB Atlas (Mongoose)
- Optional email: SMTP with Nodemailer

## Prerequisites
Install Node.js (LTS) and create a MongoDB Atlas database (or run MongoDB locally).

## Setup

### 1) Backend
```bash
cd backend
npm install
```
Copy `.env.example` to `.env` and set `MONGODB_URI` and a long random `JWT_SECRET`.
```bash
npm run dev
```
Backend runs on `http://localhost:5000` and health check is `http://localhost:5000/api/health`.

### 2) Frontend (new terminal)
```bash
cd frontend
npm install
```
Copy `frontend/.env.example` to `frontend/.env` (default API URL is local backend).
```bash
npm run dev
```
Open `http://localhost:5173`.

## Demo flow
1. Register a Candidate account; add location and skills in Candidate dashboard.
2. Register a separate Employer account; create a job listing.
3. Log back in as Candidate, search and open the job, upload a PDF/DOC/DOCX resume and apply.
4. Log back in as Employer, open Applicants using the people icon and update the status.

## Deployment

### MongoDB Atlas
1. Create a free database cluster.
2. Add a database user and allow your deployment host IPs (for a student demo, Atlas network access may temporarily be set to `0.0.0.0/0`; restrict this after testing).
3. Copy the Atlas connection URI into backend environment variable `MONGODB_URI`.

### Backend (Render)
- Create a Web Service from the repository, root directory `backend`.
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel site URL), `PORT` (Render supplies this).
- If enabling email, add `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `MAIL_FROM`.

### Frontend (Vercel)
- Import repository, root directory `frontend`.
- Framework preset: Vite.
- Build command: `npm run build`; output directory `dist`.
- Set `VITE_API_URL` to `https://YOUR-BACKEND.onrender.com/api`.
- Update backend `CLIENT_URL` to your deployed frontend origin.

## Notes
- Resume uploads are stored in the backend's `uploads` directory. For a production deployment with ephemeral filesystems, use persistent disk storage or a cloud object storage provider (e.g. S3/Cloudinary) before expecting resumes to persist across redeploys.
- Email notifications are optional and silently skipped when SMTP settings are not configured.
- This is a student/demo starter; review file validation, secrets, privacy, and deployment settings before production use.
