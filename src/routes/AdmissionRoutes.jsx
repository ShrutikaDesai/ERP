import { Route, Navigate } from "react-router-dom";
import { lazy } from "react";
import AdminLayout from "../components/layouts/AdminLayout";
import AdminLogin from "../components/admin/AdminLogin";
import AdminSignup from "../components/admin/AdminSignup";
import ForgotPassword from "../components/admin/ForgotPassword";

const Dashboard = lazy(() => import("../components/admin/module1/dashboard/Dashboard"));
const Classes = lazy(() => import("../components/admin/module1/academics/Classes"));
const Sections = lazy(() => import("../components/admin/module1/academics/Sections"));
const StudentList = lazy(() => import("../components/admin/module1/students/StudentList"));

const ExamsResults = lazy(() => import("../components/admin/module1/exam/ExamsResults"));
const AttendanceManagement = lazy(() => import("../components/admin/module1/attendance/AttendanceManagement "));
const ViewStudentDetails = lazy(() => import("../components/admin/module1/students/ViewStudentDetails"));

const AddStudent = lazy(() => import("../components/admin/module1/students/AddStudent"));
const MarkAttendancePage = lazy(() => import("../components/admin/module1/attendance/MarkAttendancePage"));
const AttendanceReportPage = lazy(() => import("../components/admin/module1/attendance/AttendanceReportPage"));
const ReviewAdmission = lazy(() => import("../components/admin/module1/students/Reviewadmission"));

const CampusSelection = lazy(() => import("../components/admin/CampusSelection"));
const BulkImport = lazy(() => import("../components/admin/module1/students/BulkImport"));
const UploadDocuments = lazy(() => import("../components/admin/module1/students/UploadDocuments"));
const Fees = lazy(() => import("../components/admin/module1/fees/Fees"));

const NotFound = lazy(() => import("../NotFound"));



const AdmissionRoutes = () => {
  return (
    <>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<AdminLogin />} />
      <Route path="/signup" element={<AdminSignup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/campus-selection" element={<CampusSelection />} />

      <Route path="/s-admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" />} />

        <Route path="dashboard" element={<Dashboard />} />

        {/* Student */}
        <Route path="students" element={<StudentList />} />
        <Route path="add-student" element={<AddStudent />} />
        <Route path="review-admission" element={<ReviewAdmission />} />
        <Route path="student-details/:id" element={<ViewStudentDetails />} />
        <Route path="Bulk-Import-Students" element={<BulkImport />} />
        <Route path="Upload-Student-Documents" element={<UploadDocuments />} />

        {/* Academics */}
        <Route path="classes" element={<Classes />} />
        <Route path="sections" element={<Sections />} />

        {/* Attendance */}
        <Route path="attendance" element={<AttendanceManagement />} />
        <Route path="mark-attendance" element={<MarkAttendancePage />} />
        <Route path="attendance-reports" element={<AttendanceReportPage />} />

        {/* Exams */}
        <Route path="exams" element={<ExamsResults />} />

        {/* Fees */}
        <Route path="fees" element={<Fees />} />

      </Route>
      
{/* Catch-all route for 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </>
  );
}

export default AdmissionRoutes;


// import { Route, Navigate } from "react-router-dom";
// import AdminLayout from "../components/layouts/AdminLayout";
// import AdminLogin from "../components/admin/AdminLogin";
// import AdminSignup from "../components/admin/AdminSignup";

// import Dashboard from "../components/admin/module1/dashboard/Dashboard";
// import Classes from "../components/admin/module1/academics/Classes";
// import Sections from "../components/admin/module1/academics/Sections";
// import StudentList from "../components/admin/module1/students/StudentList";

// import ExamsResults from "../components/admin/module1/exam/ExamsResults";   
// import AttendanceManagement from "../components/admin/module1/attendance/AttendanceManagement ";
// import ViewStudentDetails from "../components/admin/module1/students/ViewStudentDetails";

// import AddStudent from "../components/admin/module1/students/AddStudent";
// import MarkAttendancePage from "../components/admin/module1/attendance/MarkAttendancePage";
// import AttendanceReportPage from "../components/admin/module1/attendance/AttendanceReportPage";
// import ReviewAdmission from "../components/admin/module1/students/Reviewadmission";

// import CampusSelection from "../components/admin/CampusSelection";
// import BulkImport from "../components/admin/module1/students/BulkImport";
// import UploadDocuments from "../components/admin/module1/students/UploadDocuments";
// import Fees from "../components/admin/module1/fees/Fees";
// import NotFound from "../NotFound";


// const AdmissionRoutes = () => {
//   return (
//     <>
//       <Route path="/" element={<Navigate to="/login" />} />

//       <Route path="/login" element={<AdminLogin />} />
//       <Route path="/signup" element={<AdminSignup />} />
//       <Route path="/campus-selection" element={<CampusSelection />} />

//       <Route path="/s-admin" element={<AdminLayout />}>
//         <Route index element={<Navigate to="dashboard" />} />

//         <Route path="dashboard" element={<Dashboard />} />

//         {/* Student */}
//         <Route path="students" element={<StudentList />} />
//         <Route path="add-student" element={<AddStudent />} />
//         <Route path="review-admission" element={<ReviewAdmission />} />
//         <Route path="student-details/:id" element={<ViewStudentDetails />} />
//         <Route path="Bulk-Import-Students" element={<BulkImport />} />
//         <Route path="Upload-Student-Documents" element={<UploadDocuments />} />

//         {/* Academics */}
//         <Route path="classes" element={<Classes />} />
//         <Route path="sections" element={<Sections />} />

//         {/* Attendance */}
//         <Route path="attendance" element={<AttendanceManagement />} />
//         <Route path="mark-attendance" element={<MarkAttendancePage />} />
//         <Route path="attendance-reports" element={<AttendanceReportPage />} />

//         {/* Exams */}
//         <Route path="exams" element={<ExamsResults />} />

//         {/* Fees */}
//         <Route path="fees" element={<Fees />} />

//       </Route>
      
// {/* Catch-all route for 404 Not Found */}
//       <Route path="*" element={<NotFound />} />
//     </>
//   );
// }

// export default AdmissionRoutes;