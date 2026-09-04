\# 🚀 HireSphere — AI-Powered Job Portal



HireSphere is a full-stack job portal designed to connect job seekers with employers through a modern web platform.



The application provides job discovery, applications, employer job management, resume analysis, ATS comparison, and an AI-powered career chatbot.



\## 🌐 Live Application



\*\*Frontend:\*\* https://hiresphere-job-portal-2.onrender.com



\*\*Backend API:\*\* https://hiresphere-job-portal-1.onrender.com



\---



\## ✨ Features



\### 👤 Job Seeker



\* User registration and login

\* JWT-based authentication

\* Browse available jobs

\* Search and view job details

\* Apply for jobs

\* Track applications

\* Upload resumes

\* PDF and DOCX resume support

\* ATS resume comparison

\* Keyword matching

\* Skill matching

\* Missing skill identification

\* AI-generated resume recommendations

\* AI resume analysis

\* AI career chatbot



\### 🏢 Employer



\* Employer registration and login

\* Create and manage company profile

\* Create job postings

\* Edit job postings

\* Delete job postings

\* View managed jobs

\* View received applications

\* Manage applicant information



\### 🤖 AI Resume Analyzer



HireSphere includes an AI-powered resume analysis system that evaluates a candidate's resume against a job description.



The analyzer provides:



\* Resume summary

\* Strengths

\* Weaknesses

\* Missing skills

\* Keyword analysis

\* Skill matching

\* Recommendations

\* Experience analysis

\* Project analysis

\* ATS-oriented feedback



The AI functionality is powered by \*\*Groq\*\*.



\### 💬 AI Career Chatbot



The integrated AI chatbot helps users with career and job-related questions.



Examples include:



\* Resume improvement

\* Interview preparation

\* Job search guidance

\* Career questions

\* Skill recommendations

\* Job-related queries



The chatbot endpoint is protected using JWT authentication.



\---



\## 🛠️ Tech Stack



\### Frontend



\* React.js

\* Vite

\* JavaScript

\* HTML5

\* CSS3

\* Axios



\### Backend



\* Java

\* Spring Boot

\* Spring Security

\* Spring Data JPA

\* Hibernate

\* JWT

\* Maven



\### Database



\* MySQL



\### AI



\* Groq API

\* AI Resume Analyzer

\* AI Career Chatbot



\### Deployment



\* Render

\* GitHub



\---



\## 🏗️ Project Architecture



```text

&#x20;                   ┌─────────────────────┐

&#x20;                   │      User           │

&#x20;                   │  Job Seeker/Employer│

&#x20;                   └──────────┬──────────┘

&#x20;                              │

&#x20;                              ▼

&#x20;                   ┌─────────────────────┐

&#x20;                   │   React + Vite      │

&#x20;                   │     Frontend        │

&#x20;                   └──────────┬──────────┘

&#x20;                              │ REST API

&#x20;                              ▼

&#x20;                   ┌─────────────────────┐

&#x20;                   │   Spring Boot       │

&#x20;                   │      Backend        │

&#x20;                   ├─────────────────────┤

&#x20;                   │ JWT Authentication  │

&#x20;                   │ REST Controllers    │

&#x20;                   │ Business Services   │

&#x20;                   │ JPA/Hibernate       │

&#x20;                   └──────┬─────────┬────┘

&#x20;                          │         │

&#x20;                   ┌──────▼───┐ ┌──▼──────────┐

&#x20;                   │  MySQL   │ │  Groq AI    │

&#x20;                   │ Database │ │ API         │

&#x20;                   └──────────┘ └─────────────┘

```



\---



\## 🔐 Security



HireSphere uses Spring Security and JWT authentication.



Security features include:



\* JWT-based authentication

\* Role-based authorization

\* BCrypt password hashing

\* Stateless authentication

\* Protected API endpoints

\* Protected AI chatbot endpoint

\* CORS configuration

\* Environment-based secrets

\* Input validation

\* Resume upload size restrictions



Sensitive configuration such as:



```text

DB\_URL

DB\_USERNAME

DB\_PASSWORD

JWT\_SECRET

GROQ\_API\_KEY

```



is stored using environment variables rather than hardcoded in the source code.



\---



\## 📄 Resume Processing



The resume analyzer supports:



```text

PDF

DOCX

```



Uploaded resumes are processed by the backend to extract text.



The extracted resume content can then be compared with a target job description for ATS-oriented analysis.



\---



\## 🔄 Authentication Flow



```text

User

&#x20; │

&#x20; ▼

Login

&#x20; │

&#x20; ▼

Spring Security Authentication

&#x20; │

&#x20; ▼

JWT Token

&#x20; │

&#x20; ▼

Frontend localStorage

&#x20; │

&#x20; ▼

Axios Authorization Header

&#x20; │

&#x20; ▼

JWT Filter

&#x20; │

&#x20; ▼

Protected API

```



\---



\## 🚀 Running Locally



\### Prerequisites



Install:



\* Java 21

\* Node.js

\* npm

\* MySQL

\* Git



\### Backend



Navigate to:



```bash

cd backend

```



Configure the required environment variables:



```text

DB\_URL

DB\_USERNAME

DB\_PASSWORD

JWT\_SECRET

GROQ\_API\_KEY

```



Then build and run the Spring Boot application.



\### Frontend



Navigate to:



```bash

cd frontend

```



Install dependencies:



```bash

npm install

```



Create the environment configuration:



```text

VITE\_API\_URL=http://localhost:8080/api

```



Start the development server:



```bash

npm run dev

```



\---



\## 🌍 Deployment



HireSphere is deployed using Render.



\### Frontend



```text

React + Vite → Render

```



\### Backend



```text

Spring Boot → Render

```



\### Database



```text

MySQL

```



\### AI



```text

Spring Boot → Groq API

```



\---



\## 📁 Project Structure



```text

HireSphere/

│

├── backend/

│   ├── src/

│   │   └── main/

│   │       ├── java/

│   │       │   └── com.jobportal.backend/

│   │       │       ├── controller/

│   │       │       ├── service/

│   │       │       ├── repository/

│   │       │       ├── entity/

│   │       │       ├── dto/

│   │       │       └── security/

│   │       └── resources/

│   │

│   ├── pom.xml

│   └── Dockerfile

│

├── frontend/

│   ├── src/

│   │   ├── components/

│   │   ├── pages/

│   │   ├── services/

│   │   └── ...

│   │

│   ├── package.json

│   └── vite.config.js

│

├── .github/

├── .vscode/

├── .gitignore

├── package.json

└── README.md

```



\---



\## 🎯 Future Improvements



Potential future enhancements include:



\* Email notifications

\* Advanced job recommendation system

\* Recruiter analytics dashboard

\* Candidate ranking

\* Interview scheduling

\* Saved jobs

\* Application status notifications

\* Resume builder

\* AI-powered interview practice

\* Production database migrations



\---



\## 👩‍💻 Project Goal



HireSphere was developed as a practical full-stack application combining modern web development, secure authentication, database management, cloud deployment, and generative AI.



The project demonstrates the integration of:



\*\*React + Spring Boot + MySQL + JWT + Groq AI + Cloud Deployment\*\*



into a real-world job recruitment platform.



\---



\## ⭐ Author



\*\*Shiva Dikshitha\*\*



Full-Stack Developer | AI/ML Enthusiast



\---

