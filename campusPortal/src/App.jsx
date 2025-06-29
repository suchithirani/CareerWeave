// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/unauthorized";

import AdminDashboard from "./components/dashboards/admin/AdminDashboard";
import StudentDashboard from "./components/dashboards/student/StudentDashboard";
import HrDashboard from "./components/dashboards/HR/HrDashboard";
import OfficerDashboard from "./components/dashboards/Officer/OfficerDashboard";

import Register from "./pages/Register"; // 👈 Combined register

import AdminCompanyForm from "./components/dashboards/admin/AdminCompanyForm";
import AdminCompanyManagement from "./components/dashboards/admin/AdminCompanyManagement";
import AdminUsers from "./components/dashboards/admin/AdminUsers";
import AdminStudentProfiles from "./components/dashboards/admin/AdminStudentProfile";
import AdminJobOpenings from "./components/dashboards/admin/AdminJobOpenings";
import AdminJobApplications from "./components/dashboards/admin/AdminJobApplications";
import AdminInterviewSchedule from "./components/dashboards/admin/AdminInterviewSchedule";
import AdminNotification from "./components/dashboards/admin/AdminNotification";
import HrJobOpening from "./components/dashboards/HR/HrJobOpening";
import HrJobApplications from "./components/dashboards/HR/HRJobApplication";
import HrInterview from "./components/dashboards/HR/HrInterview";
import HrSelectedStudents from "./components/dashboards/HR/HrSelectedStudents";
import HiringPipeline from "./components/dashboards/HR/HiringPipeline";
import HrOffer from "./components/dashboards/HR/HrOffer";
import HrOnboarding from "./components/dashboards/HR/HrOnboarding";
import HrNotification from "./components/dashboards/HR/HrNotification";
import OfficerCompany from "./components/dashboards/Officer/OfficerCompany";
import OfficerAllCompany from "./components/dashboards/Officer/OfficerAllCompany";
import OfficerJobOpenings from "./components/dashboards/Officer/OfficerJobOpening";
import OfficerStudents from "./components/dashboards/Officer/OfficerStudents";
import OfficerJobApplications from "./components/dashboards/Officer/OfficerJobApplications";
import OfficerInterviewSchedule from "./components/dashboards/Officer/OfficerInterviewSchedule";
import OfficerNotification from "./components/dashboards/Officer/OfficerNotification";
import OfficerReportSummery from "./components/dashboards/Officer/OfficerReportSummery";
import StudentProfile from "./components/dashboards/student/StudentProfile";
import StudentJobOpening from "./components/dashboards/student/StudentJobOpening";
import StudentYourApplication from "./components/dashboards/student/StudentYourApplication";
import StudentInterviewSchedule from "./components/dashboards/student/StudentInterviewSchedule";
import StudentNotification from "./components/dashboards/student/StudentNotification";
import StudentOffer from "./components/dashboards/student/StudentOffer";
import AdminOffers from "./components/dashboards/admin/AdminOffers";
import AdminOfficer from "./components/dashboards/admin/AdminOfficer";
import AdminReport from "./components/dashboards/admin/AdminReport";
import HrProfile from "./components/dashboards/HR/HrProfile";
import OfficerOffers from "./components/dashboards/Officer/OfficerOffers";
import OfficerOnboarding from "./components/dashboards/Officer/OfficerOnboarding";
import OfficerProfile from "./components/dashboards/Officer/OfficerProfile";
import HelpStudent from "./components/dashboards/student/HelpStudent";
import HrHelp from "./components/dashboards/HR/HrHelp";
import AdminHelpManagement from "./components/dashboards/admin/AdminHelpManagement";
import OfficerHelp from "./components/dashboards/Officer/OfficerHelp";
import StudentFeedback from "./components/dashboards/student/StudentFeedback";
import OfficerFeedback from "./components/dashboards/Officer/OfficerFeedback";
import HrFeedback from "./components/dashboards/HR/HrFeedback";
import AdminFeedbackManager from "./components/dashboards/admin/AdminFeedbackManager";
const App = () => {

  
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/register"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/companies"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminCompanyManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/company/create"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminCompanyForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/offers"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminOffers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/officers"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminOfficer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminReport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/company/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminCompanyForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminJobOpenings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminJobApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/interviews"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminInterviewSchedule />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminNotification />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/help"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminHelpManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/student-profiles"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminStudentProfiles />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/feedback"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminFeedbackManager />
            </ProtectedRoute>
          }
        />

        {/* HR routes */}

        <Route
          path="/hr/profile"
          element={
            <ProtectedRoute allowedRoles={["COMPANY_HR"]}>
              <HrProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr/dashboard"
          element={
            <ProtectedRoute allowedRoles={["COMPANY_HR"]}>
              <HrDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/jobs/new"
          element={
            <ProtectedRoute allowedRoles={["COMPANY_HR"]}>
              <HrJobOpening />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/applications/:jobId?"
          element={
            <ProtectedRoute allowedRoles={["COMPANY_HR"]}>
              <HrJobApplications />
            </ProtectedRoute>
          }
        />

        <Route
  path="/hr/pipeline/:jobId"
  element={
    <ProtectedRoute allowedRoles={["COMPANY_HR"]}>
      <HiringPipeline />
    </ProtectedRoute>
  }
/>


        <Route
          path="/hr/offers"
          element={
            <ProtectedRoute allowedRoles={["COMPANY_HR"]}>
              <HrOffer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr/onboarding"
          element={
            <ProtectedRoute allowedRoles={["COMPANY_HR"]}>
              <HrOnboarding />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr/notifications"
          element={
            <ProtectedRoute allowedRoles={["COMPANY_HR"]}>
              <HrNotification />
            </ProtectedRoute>
          }
        />  

        <Route
          path="/hr/interviews"
          element={
            <ProtectedRoute allowedRoles={["COMPANY_HR"]}>
              <HrInterview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/candidates"
          element={
            <ProtectedRoute allowedRoles={["COMPANY_HR"]}>
              <HrSelectedStudents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr/help"
          element={
            <ProtectedRoute allowedRoles={["COMPANY_HR"]}>
              <HrHelp />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr/feedback"
          element={
            <ProtectedRoute allowedRoles={["COMPANY_HR"]}>
              <HrFeedback />
            </ProtectedRoute>
          }
        />

        {/* Student routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/job-openings"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentJobOpening />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/applications"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentYourApplication />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/interviews"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentInterviewSchedule />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/notifications"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentNotification />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/offers"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentOffer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/help"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <HelpStudent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/feedback"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentFeedback />
            </ProtectedRoute>
          }
        />

        {/* Placement Officer routes */}
        <Route
          path="/officer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["PLACEMENT_OFFICER"]}>
              <OfficerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/officer/profile"
          element={
            <ProtectedRoute allowedRoles={["PLACEMENT_OFFICER"]}>
              <OfficerProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/officer/companies"
          element={
            <ProtectedRoute allowedRoles={["PLACEMENT_OFFICER"]}>
              <OfficerAllCompany />
            </ProtectedRoute>
          }
        />

        <Route
          path="/officer/hr-users"
          element={
            <ProtectedRoute allowedRoles={["PLACEMENT_OFFICER"]}>
              <OfficerCompany />
            </ProtectedRoute>
          }
        />

        <Route
          path="/officer/offers"
          element={
            <ProtectedRoute allowedRoles={["PLACEMENT_OFFICER"]}>
              <OfficerOffers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/officer/onboarding"
          element={
            <ProtectedRoute allowedRoles={["PLACEMENT_OFFICER"]}>
              <OfficerOnboarding />
            </ProtectedRoute>
          }
        />

        <Route
          path="/officer/help"
          element={
            <ProtectedRoute allowedRoles={["PLACEMENT_OFFICER"]}>
              <OfficerHelp />
            </ProtectedRoute>
          }
        />

        <Route
          path="/officer/job-openings"
          element={
            <ProtectedRoute allowedRoles={["PLACEMENT_OFFICER"]}>
              <OfficerJobOpenings />
            </ProtectedRoute>
          }
        />

         <Route
          path="/officer/students"
          element={
            <ProtectedRoute allowedRoles={["PLACEMENT_OFFICER"]}>
              <OfficerStudents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/officer/feedback"
          element={
            <ProtectedRoute allowedRoles={["PLACEMENT_OFFICER"]}>
              <OfficerFeedback />
            </ProtectedRoute>
          }
        />

        <Route
          path="/officer/applications"
          element={
            <ProtectedRoute allowedRoles={["PLACEMENT_OFFICER"]}>
              <OfficerJobApplications/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/officer/interviews"
          element={
            <ProtectedRoute allowedRoles={["PLACEMENT_OFFICER"]}>
              <OfficerInterviewSchedule/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/officer/notifications"
          element={
            <ProtectedRoute allowedRoles={["PLACEMENT_OFFICER"]}>
              <OfficerNotification/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/officer/reports"
          element={
            <ProtectedRoute allowedRoles={["PLACEMENT_OFFICER"]}>
              <OfficerReportSummery/>
            </ProtectedRoute>
          }
        />

        

        {/* Fallback routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;