import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Chatbot from "./components/Chatbot";
import AnimatedRoutes from "./components/AnimatedRoutes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import MyApplications from "./pages/MyApplications";
import CreateCompany from "./pages/CreateCompany";
import Company from "./pages/Company";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import CreateJob from "./pages/CreateJob";
import ManageJobs from "./pages/ManageJobs";
import EmployerApplications from "./pages/EmployerApplications";
import EditJob from "./pages/EditJob";
import Profile from "./pages/Profile";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import JobMatches from "./pages/JobMatches";
import ResumeBuilder from "./pages/ResumeBuilder";
import MyResume from "./pages/MyResume";
import ResumePreview from "./pages/ResumePreview";
function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Chatbot />
      
<AnimatedRoutes>
        {/* =====================================
            PUBLIC ROUTES
        ===================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/jobs"
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


        {/* =====================================
            PROFILE
        ===================================== */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute
              allowedRoles={[
                "JOB_SEEKER",
                "EMPLOYER"
              ]}
            >
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* =====================================
            JOB SEEKER
        ===================================== */}

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


        {/* =====================================
            EMPLOYER DASHBOARD
        ===================================== */}

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


        {/* =====================================
            COMPANY
        ===================================== */}

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


        {/* =====================================
            MANAGE JOBS
        ===================================== */}

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


        {/* =====================================
            EDIT JOB
        ===================================== */}

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


        {/* =====================================
            EMPLOYER APPLICATIONS
        ===================================== */}

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


        {/* =====================================
            RESUME ANALYZER
        ===================================== */}

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

        {/* =====================================
            AI JOB MATCHING
        ===================================== */}

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
 {/* =====================================
    RESUME BUILDER
===================================== */}

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
{/* =====================================
    RESUME PREVIEW
===================================== */}

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


{/* =====================================
    MY RESUMES
===================================== */}

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

{/* =====================================
    FALLBACK
===================================== */}

<Route
  path="*"
  element={
    <Navigate
      to="/jobs"
      replace
    />
  }
/>
</AnimatedRoutes>

    </BrowserRouter>
  );
}

export default App;