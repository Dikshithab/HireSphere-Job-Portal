# HireSphere – AI-Powered Job Portal

> **HireSphere is a full-stack AI-powered job portal that connects job seekers with employers while providing intelligent resume analysis, ATS scoring, skill insights, job discovery, and application tracking.**

Built with **React, Django REST Framework, PostgreSQL, and Groq AI**, and deployed on **Render**.

---

## 🌐 Live Demo

### Frontend

https://hiresphere-frontend-mn01.onrender.com

### Backend API

https://hiresphere-backend-6ksv.onrender.com

---

# 🚀 Overview

Traditional job portals mainly focus on searching and applying for jobs.

**HireSphere** combines the complete recruitment workflow with AI-powered career assistance.

The platform supports two types of users:

* 👩‍💻 **Job Seekers**
* 🏢 **Employers**

Job seekers can discover jobs, save opportunities, apply for positions, upload resumes, and analyze their resumes using AI.

Employers can manage their companies, create job postings, and review applications.

---

# ✨ Key Features

## 🔐 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Protected API endpoints
* Role-based access control
* Job seeker and employer workflows

---

## 👩‍💻 Job Seeker Features

### 🔎 Advanced Job Search

Users can search and filter jobs based on:

* Keywords
* Location
* Job type
* Skills
* Experience
* Salary range
* Remote opportunities

---

### 💾 Save Jobs

Users can:

* Save interesting jobs
* Remove saved jobs
* View saved opportunities

This allows users to maintain a personal shortlist of relevant jobs.

---

### 📩 Job Applications

Job seekers can:

* Apply for jobs
* Track applications
* View application status
* Receive status notifications

---

# 🏢 Employer Features

Employers can:

* Create and manage companies
* Create job postings
* Edit job postings
* Delete job postings
* View applicants
* Manage application statuses

This creates a complete recruitment workflow between candidates and employers.

---

# 🤖 AI-Powered Resume Analysis

One of HireSphere's main differentiating features is its **AI-powered resume analysis system**.

Users can upload their resumes and receive insights based on the resume content.

The system analyzes:

* Resume content
* Technical skills
* Relevant experience
* Job requirements
* Skill gaps
* ATS compatibility

---

## 📊 ATS Score

HireSphere evaluates how well a resume matches a target job.

Example:

```text
ATS SCORE
──────────────
78 / 100

Matched Skills
✓ Python
✓ Django
✓ REST APIs
✓ PostgreSQL

Missing Skills
• Docker
• AWS
• Redis
```

This helps users understand how competitive their resume is for a particular position.

---

# 🎯 Skill Matching

HireSphere compares:

```text
Resume Skills
      ↓
Job Requirements
      ↓
Skill Matching
      ↓
Matched Skills
      +
Missing Skills
      ↓
Recommendations
```

Users can identify the skills they already have and the skills they may need to improve.

---

# 🔔 Application Notifications

HireSphere includes an application notification system.

Users can receive notifications when application statuses change.

The platform also provides:

* Unread notification count
* Notification badge
* Application status updates

Example workflow:

```text
Application Submitted
        ↓
     Pending
        ↓
    Shortlisted
        ↓
    Interview
        ↓
     Selected
```

---

# 📱 Responsive UI

The frontend is designed to work across:

* Desktop
* Tablet
* Mobile

The interface includes separate workflows for job seekers and employers.

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │     React Frontend   │
                    │                      │
                    │ Job Search            │
                    │ Applications          │
                    │ Resume Analysis       │
                    │ Employer Dashboard    │
                    │ Notifications         │
                    └──────────┬───────────┘
                               │
                            REST API
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Django REST Framework│
                    │                      │
                    │ Authentication       │
                    │ Job APIs              │
                    │ Application APIs      │
                    │ Resume APIs           │
                    │ Notification APIs     │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴───────────┐
                    │                      │
                    ▼                      ▼
             ┌──────────────┐       ┌──────────────┐
             │ PostgreSQL   │       │   Groq AI    │
             │              │       │              │
             │ Users        │       │ Resume       │
             │ Companies    │       │ Analysis     │
             │ Jobs         │       │ ATS Insights │
             │ Applications │       │ Skill Match  │
             │ Notifications│       │              │
             └──────────────┘       └──────────────┘
```

---

# 🔄 Application Workflow

```text
                 ┌──────────────┐
                 │    Register  │
                 └──────┬───────┘
                        ↓
                 ┌──────────────┐
                 │    Login     │
                 └──────┬───────┘
                        ↓
                ┌────────────────┐
                │   Job Search   │
                └───────┬────────┘
                        ↓
                 ┌──────────────┐
                 │ Apply / Save │
                 └──────┬───────┘
                        ↓
                 ┌──────────────┐
                 │ Application  │
                 │   Tracking   │
                 └──────┬───────┘
                        ↓
                 ┌──────────────┐
                 │ Notifications│
                 └──────────────┘
```

---

# 🧠 AI Resume Workflow

```text
Resume Upload
      ↓
Resume Text Extraction
      ↓
Resume Content Analysis
      ↓
Job Requirement Analysis
      ↓
Skill Matching
      ↓
ATS Score
      ↓
Missing Skills
      ↓
Career Recommendations
```

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* Axios
* React Router
* CSS

## Backend

* Python
* Django
* Django REST Framework
* Simple JWT

## Database

* PostgreSQL

## AI

* Groq API

## Deployment

* Render
* PostgreSQL

---

# 🔐 Security

The application implements:

* JWT authentication
* Protected API routes
* Role-based authorization
* User-specific data access
* Server-side validation
* Environment variables for sensitive credentials
* CORS configuration

API credentials and secrets are not stored directly in the source code.

---

# 📂 Project Structure

```text
HireSphere/
│
├── backend/
│   ├── config/
│   ├── users/
│   ├── jobs/
│   ├── companies/
│   ├── applications/
│   ├── notifications/
│   ├── resume/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── public/
│   └── package.json
│
└── README.md
```

---

# ⚙️ Local Setup

## 1. Clone the Repository

```bash
git clone https://github.com/Dikshithab/HireSphere-Job-Portal.git
cd HireSphere-Job-Portal
```

---

## 2. Backend Setup

```bash
cd backend
python -m venv venv
```

### Windows

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file:

```env
SECRET_KEY=your_secret_key
DEBUG=True

DATABASE_URL=your_postgresql_database_url

GROQ_API_KEY=your_groq_api_key
```

Run migrations:

```bash
python manage.py migrate
```

Start the backend:

```bash
python manage.py runserver
```

---

## 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run using the Vite development server.

---

# 🧪 Core Testing Checklist

* [x] User registration
* [x] User login
* [x] JWT authentication
* [x] Role-based access
* [x] Company management
* [x] Job creation
* [x] Job editing
* [x] Job deletion
* [x] Job search
* [x] Advanced job filters
* [x] Save/unsave jobs
* [x] Job applications
* [x] Employer application management
* [x] Application status updates
* [x] Notifications
* [x] Unread notification badge
* [x] Resume upload
* [x] Resume analysis
* [x] ATS scoring
* [x] Skill matching
* [x] Missing skill detection
* [x] Responsive UI

---

# 🎯 Why HireSphere?

HireSphere goes beyond basic job searching by combining **recruitment, resume intelligence, and application management** in one platform.

Instead of simply asking:

> **"Which jobs can I apply for?"**

HireSphere also helps answer:

> **"How well does my resume match this job?"**

> **"Which skills am I missing?"**

> **"How ATS-friendly is my resume?"**

> **"What is the status of my application?"**

This makes HireSphere both a **job marketplace workflow** and a **career assistance platform**.

---

# 🚀 Future Improvements

Potential future enhancements include:

* AI Interview Coach
* Personalized job recommendations
* Resume improvement suggestions
* Recruiter analytics dashboard
* Email notifications
* Advanced candidate ranking
* Interview scheduling
* Job recommendation engine

---

# 📌 Project Highlights

```text
React + Django Full Stack
        +
REST API Architecture
        +
JWT Authentication
        +
Role-Based Access Control
        +
Job Search & Applications
        +
Resume Processing
        +
AI Resume Analysis
        +
ATS Scoring
        +
Skill Matching
        +
Application Notifications
        +
PostgreSQL
        +
Cloud Deployment
```

---

# 👩‍💻 Author

**Shiva Dikshitha Burra**

B.Tech Computer Science Engineering — Cyber Security

Interested in:

* Python Full Stack Development
* Artificial Intelligence
* Generative AI
* Backend Development
* Cybersecurity

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
