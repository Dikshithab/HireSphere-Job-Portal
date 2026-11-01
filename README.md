# 🚀 HireSphere — AI-Powered Job Portal

<p align="center">
  <strong>Discover Opportunities. Analyze Your Resume. Accelerate Your Career.</strong>
</p>

<p align="center">
  A full-stack AI-powered recruitment platform connecting job seekers and employers through intelligent resume analysis, ATS scoring, skill matching, and application tracking.
</p>

<p align="center">
  <a href="https://hiresphere-frontend-mn01.onrender.com">🌐 Live Demo</a> •
  <a href="https://github.com/Dikshithab/HireSphere-Job-Portal">💻 Source Code</a> •
  <a href="https://hiresphere-backend-6ksv.onrender.com">⚙️ Backend API</a>
</p>

---

## 📌 About the Project

Traditional job portals primarily focus on job searching and applications. **HireSphere takes the process further by integrating AI-powered career assistance into the recruitment workflow.**

It provides a unified platform where:

* Job seekers can discover opportunities, manage applications, and evaluate their resumes.
* Employers can manage companies, publish job openings, and review candidates.
* AI helps candidates understand resume quality, identify skill gaps, and improve job alignment.

The goal is to make recruitment more organized and help candidates make better career decisions.

---

## ✨ Key Features

### 🔐 Authentication & Role-Based Access

* User registration and login.
* JWT-based authentication.
* Protected API endpoints.
* Role-based access control.
* Separate workflows for job seekers and employers.

### 👩‍💻 Job Seeker Dashboard

* Browse available job opportunities.
* Search jobs using keywords and location.
* Filter by job type, skills, experience, salary, and remote options.
* Save and manage favorite jobs.
* Apply for jobs.
* Track application progress.
* View application notifications.

### 🏢 Employer Dashboard

* Create and manage company profiles.
* Publish new job openings.
* Edit and delete job postings.
* View applicants for posted jobs.
* Review candidate applications.
* Update application statuses.

### 🤖 AI-Powered Resume Analysis

HireSphere integrates Groq AI to provide intelligent resume insights.

Users can upload their resumes and analyze them against job requirements.

The system provides insights into:

* Technical skills and qualifications.
* Relevant experience.
* Resume content.
* Job description alignment.
* Matched and missing skills.
* ATS compatibility.

### 📊 ATS Score & Resume Insights

The resume analysis system provides a score to help candidates understand how closely their resume aligns with a target job.

**Example analysis:**

```text
           RESUME ANALYSIS
        ─────────────────────

             ATS SCORE
               78/100

        MATCHED SKILLS
        ✓ Python
        ✓ Django
        ✓ REST APIs
        ✓ PostgreSQL

        MISSING SKILLS
        • Docker
        • AWS

        ─────────────────────
        Resume improvement insights
```

*Illustrative example, not a fixed system result.*

### 🎯 Intelligent Skill Matching

HireSphere compares resume skills with job requirements.

```text
       Uploaded Resume
              |
              v
       Extract Resume Text
              |
              v
       Identify Candidate Skills
              |
              v
       Analyze Job Requirements
              |
              v
        Compare Skills
              |
       +------+------+
       |             |
       v             v
 Matched Skills   Missing Skills
       |             |
       +------+------+
              |
              v
       AI Recommendations
```

This helps candidates understand their strengths and identify areas where additional learning may be useful.

### 🔔 Application Notifications

Stay informed about recruitment progress through application notifications.

Features include:

* Application status updates.
* Unread notification count.
* Notification badge.
* Application progress tracking.

**Application workflow:**

```text
Application Submitted
         |
         v
      Pending
         |
         v
    Shortlisted
         |
         v
     Interview
         |
         v
      Selected
```

### 📱 Responsive Interface

The frontend supports:

* Desktop screens.
* Tablets.
* Mobile devices.

Separate interfaces support the needs of job seekers and employers.

---

## 🏗️ System Architecture

HireSphere follows a frontend-backend architecture using REST APIs.

```text
             REACT FRONTEND
                   |
                   | HTTP Requests
                   v
          DJANGO REST FRAMEWORK
                   |
          +--------+--------+
          |                 |
          v                 v
      POSTGRESQL          GROQ AI
          |                 |
          v                 v
     Application       Resume Analysis
     User Data         ATS Insights
     Job Data          Skill Matching
     Company Data      AI Responses
     Notifications
```

### Application Workflow

1. A user registers and logs in.
2. The platform identifies the user's role.
3. Job seekers browse and apply for jobs.
4. Employers publish openings and manage applications.
5. Candidates upload resumes for AI analysis.
6. The platform provides resume insights and skill comparisons.
7. Users track application updates and notifications.

---

## 🛠️ Technology Stack

| Category          | Technologies                 |
| ----------------- | ---------------------------- |
| Frontend          | React, Vite, JavaScript, CSS |
| API Communication | Axios                        |
| Routing           | React Router                 |
| Backend           | Python, Django               |
| API Framework     | Django REST Framework        |
| Authentication    | Simple JWT                   |
| Database          | PostgreSQL                   |
| AI Integration    | Groq API                     |
| Deployment        | Render                       |

---

## 🔐 Security

Security is an important part of HireSphere.

Implemented security features include:

* JWT-based authentication.
* Protected API endpoints.
* Role-based authorization.
* User-specific data access.
* Server-side validation.
* Environment-based configuration.
* CORS configuration.
* Secure handling of API credentials through environment variables.

---

## 📂 Project Structure

```text
HireSphere-Job-Portal/
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
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Local Setup

Follow these steps to run HireSphere locally.

### Prerequisites

* Python 3.10+
* Node.js and npm
* PostgreSQL
* Groq API key
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/Dikshithab/HireSphere-Job-Portal.git

cd HireSphere-Job-Portal
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the backend directory:

```env
SECRET_KEY=your_secret_key
DEBUG=True

DATABASE_URL=your_postgresql_database_url

GROQ_API_KEY=your_groq_api_key
```

Apply database migrations:

```bash
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

Backend runs at:

```text
http://127.0.0.1:8000/
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Configure the backend API URL in your frontend environment file:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at the local Vite development URL displayed in your terminal.

---

## ☁️ Deployment

HireSphere is deployed using Render.

| Component | Deployment                                                             |
| --------- | ---------------------------------------------------------------------- |
| Frontend  | [Open Live Application](https://hiresphere-frontend-mn01.onrender.com) |
| Backend   | [Open Backend API](https://hiresphere-backend-6ksv.onrender.com)       |
| Database  | PostgreSQL                                                             |

Sensitive credentials and environment variables should be configured through the deployment platform rather than committed to the repository.

---

## 🧪 Core Feature Checklist

* [x] User registration and login
* [x] JWT authentication
* [x] Role-based access control
* [x] Company management
* [x] Job creation and management
* [x] Advanced job search and filters
* [x] Save and unsave jobs
* [x] Job applications
* [x] Employer application management
* [x] Application status updates
* [x] Application notifications
* [x] Resume upload
* [x] Resume analysis
* [x] ATS scoring
* [x] Skill matching
* [x] Missing skill detection
* [x] Responsive user interface

---

## 💡 What Makes HireSphere Different?

HireSphere combines three important areas into one platform:

| Recruitment        | AI Career Assistance   | Application Management |
| ------------------ | ---------------------- | ---------------------- |
| Job discovery      | Resume analysis        | Application tracking   |
| Job applications   | ATS scoring            | Status notifications   |
| Employer dashboard | Skill matching         | Candidate management   |
| Job management     | Missing skill insights | Recruitment workflow   |

Instead of simply helping candidates find jobs, HireSphere also helps them understand how well their resumes align with those opportunities.

---

## 🔮 Future Enhancements

Potential improvements include:

* AI-powered interview preparation.
* Personalized job recommendations.
* Automated resume improvement suggestions.
* Advanced candidate ranking.
* Recruiter analytics dashboard.
* Interview scheduling.
* Email notifications.
* Enhanced job recommendation engine.

---

## 👩‍💻 About the Developer

**Shiva Dikshitha Burra**

B.Tech — Computer Science Engineering (Cyber Security)

Interested in building practical applications using full-stack development, artificial intelligence, and cybersecurity.

**Technical Interests**

* Python Full Stack Development
* Django & REST APIs
* React Development
* Generative AI
* AI-powered Applications
* Cybersecurity

<p>
  <a href="https://github.com/Dikshithab">GitHub</a> •
  <a href="https://www.linkedin.com/in/burra-shiva-dikshitha-353173350/">LinkedIn</a>
</p>

---

## ⭐ Support

If you find HireSphere interesting, consider giving the repository a ⭐ on GitHub.

<p align="center">
  <strong>HireSphere — Bringing Recruitment and AI-Powered Career Assistance Together.</strong>
</p>
