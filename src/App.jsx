import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AdminLayout from "./components/layouts/AdminLayout";
import AdminLogin from "./components/admin/AdminLogin";
import AdminSignup from "./components/admin/AdminSignup";
import Dashboard from "./components/admin/dashboard/Dashboard";
import Classes from "./components/admin/academics/Classes";
import Sections from "./components/admin/academics/Sections";
import StudentList from "./components/admin/students/StudentList";

import ExamsResults from "./components/admin/exam/ExamsResults";
import AttendanceManagement from "./components/admin/attendance/AttendanceManagement ";
import MarkAttendancePage from "./components/admin/attendance/MarkAttendancePage";
import AttendanceReportPage from "./components/admin/attendance/AttendanceReportPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth Routes */}
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/signup" element={<AdminSignup />} />

        {/* Admin Routes */}
        <Route path="/s-admin" element={<AdminLayout />}>

          {/* Default Redirect */}
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<StudentList />} />
          <Route path="classes" element={<Classes />} />
          <Route path="sections" element={<Sections />} />








          <Route path="attendance" element={<AttendanceManagement />} />
          <Route path="mark-attendance" element={<MarkAttendancePage />} />
          <Route path="attendance-reports" element={<AttendanceReportPage />} />
          <Route path="exams" element={<ExamsResults />} />

        </Route>

        {/* 404 Route */}
        {/* <Route path="*" element={<h1>Page Not Found</h1>} /> */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;