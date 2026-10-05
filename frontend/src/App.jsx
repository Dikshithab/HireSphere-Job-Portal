import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Chatbot from "./components/Chatbot";

// Public Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";

// Common
import Profile from "./pages/Profile";

// Job Seeker
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import MyApplications from "./pages/MyApplications";
import SavedJobs from "./pages/SavedJobs";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import JobMatches from "./pages/JobMatches";
import ResumeBuilder from "./pages/ResumeBuilder";
import MyResume from "./pages/MyResume";
import ResumePreview from "./pages/ResumePreview";
import Notifications from "./pages/Notifications";

// Employer
import EmployerDashboard from "./pages/EmployerDashboard";
import CreateCompany from "./pages/CreateCompany";
import Company from "./pages/Company";
import CreateJob from "./pages/CreateJob";
import ManageJobs from "./pages/ManageJobs";
import EmployerApplications from "./pages/EmployerApplications";
import EditJob from "./pages/EditJob";

// Recruiter / AI
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AIJobRecommendations from "./pages/AIJobRecommendations";
import CandidateRanking from "./pages/CandidateRanking";
import RecruiterCandidateSearch from "./pages/RecruiterCandidateSearch";
import RecruiterAnalytics from "./pages/RecruiterAnalytics";


function App() {
  return (
    <BrowserRouter>

      {/* Global Navbar */}
      <Navbar />

      {/* Global Chatbot */}
      <Chatbot />

      <Routes>

        {/* =====================================================
            PUBLIC ROUTES
        ===================================================== */}

 <Route
  path="/"
  element={
    <Navigate
      to={
        localStorage.getItem("token")
          ? JSON.parse(localStorage.getItem("user") || "{}").role === "EMPLOYER"
            ? "/employer"
            : "/seeker"
          : "/login"
      }
      replace
    />
  }
/>
        

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/jobs/:id"
          element={<JobDetails />}
        />


        {/* =====================================================
            PROFILE
        ===================================================== */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute
              allowedRoles={["JOB_SEEKER", "EMPLOYER"]}
            >
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            JOB SEEKER
        ===================================================== */}

        <Route
          path="/seeker"
          element={
            <ProtectedRoute
              allowedRoles={["JOB_SEEKER"]}
            >
              <JobSeekerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <ProtectedRoute
              allowedRoles={["JOB_SEEKER"]}
            >
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/saved-jobs"
          element={
            <ProtectedRoute
              allowedRoles={["JOB_SEEKER"]}
            >
              <SavedJobs />
            </ProtectedRoute>
          }
        />
<Route
  path="/job-matches"
  element={
    <ProtectedRoute
      allowedRoles={["JOB_SEEKER"]}
    >
      <JobMatches />
    </ProtectedRoute>
  }
/>

<Route
  path="/resume-analyzer"
  element={
    <ProtectedRoute
      allowedRoles={["JOB_SEEKER"]}
    >
      <ResumeAnalyzer />
    </ProtectedRoute>
  }
/>

<Route
  path="/resume-builder"
  element={
    <ProtectedRoute
      allowedRoles={["JOB_SEEKER"]}
    >
      <ResumeBuilder />
    </ProtectedRoute>
  }
/>


        
        <Route
          path="/my-resumes"
          element={
            <ProtectedRoute
              allowedRoles={["JOB_SEEKER"]}
            >
              <MyResume />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume-preview/:id"
          element={
            <ProtectedRoute
              allowedRoles={["JOB_SEEKER"]}
            >
              <ResumePreview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute
              allowedRoles={["JOB_SEEKER", "EMPLOYER"]}
            >
              <Notifications />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            EMPLOYER DASHBOARD
        ===================================================== */}

        <Route
          path="/employer"
          element={
            <ProtectedRoute
              allowedRoles={["EMPLOYER"]}
            >
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company"
          element={
            <ProtectedRoute
              allowedRoles={["EMPLOYER"]}
            >
              <Company />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-company"
          element={
            <ProtectedRoute
              allowedRoles={["EMPLOYER"]}
            >
              <CreateCompany />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-job"
          element={
            <ProtectedRoute
              allowedRoles={["EMPLOYER"]}
            >
              <CreateJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/jobs"
          element={
            <ProtectedRoute
              allowedRoles={["EMPLOYER"]}
            >
              <ManageJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/jobs/edit/:id"
          element={
            <ProtectedRoute
              allowedRoles={["EMPLOYER"]}
            >
              <EditJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/applications"
          element={
            <ProtectedRoute
              allowedRoles={["EMPLOYER"]}
            >
              <EmployerApplications />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            RECRUITER
        ===================================================== */}

        <Route
          path="/recruiter-dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["EMPLOYER"]}
            >
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-recommendations"
          element={
            <ProtectedRoute
              allowedRoles={["EMPLOYER"]}
            >
              <AIJobRecommendations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate-ranking/:jobId"
          element={
            <ProtectedRoute
              allowedRoles={["EMPLOYER"]}
            >
              <CandidateRanking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter-candidates"
          element={
            <ProtectedRoute
              allowedRoles={["EMPLOYER"]}
            >
              <RecruiterCandidateSearch />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter-analytics"
          element={
            <ProtectedRoute
              allowedRoles={["EMPLOYER"]}
            >
              <RecruiterAnalytics />
            </ProtectedRoute>
          }
        />


        {/* =====================================================
            FALLBACK
        ===================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/jobs"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;