// import { BrowserRouter } from "react-router-dom";
// import AppRoutes from "./routes/AppRoutes";

// function App() {
//   return (
//     <BrowserRouter>
//       <AppRoutes />
//     </BrowserRouter>
//   );
// }

// export default App;



import { BrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import AppRoutes from "./routes/AppRoutes";
import Loader from "./components/common-ui/Loader";

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;





// import React from "react";
// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// import AdminLayout from "./components/layouts/AdminLayout";
// import AdminLogin from "./components/admin/AdminLogin";
// import AdminSignup from "./components/admin/AdminSignup";
// import Dashboard from "./components/admin/dashboard/Dashboard";
// import Classes from "./components/admin/academics/Classes";
// import Sections from "./components/admin/academics/Sections";
// import StudentList from "./components/admin/students/StudentList";

// import ExamsResults from "./components/admin/exam/ExamsResults";
// import AttendanceManagement from "./components/admin/attendance/AttendanceManagement ";
// import ViewStudentDetails from "./components/admin/students/ViewStudentDetails";
// import AddStudent from "./components/admin/students/AddStudent";
// import MarkAttendancePage from "./components/admin/attendance/MarkAttendancePage";
// import AttendanceReportPage from "./components/admin/attendance/AttendanceReportPage";
// import ReviewAdmission from "./components/admin/students/Reviewadmission";
// import CampusSelection from "./components/admin/CampusSelection";
// import BulkImport from "./components/admin/students/BulkImport";
// import UploadDocuments from "./components/admin/students/UploadDocuments";
// import Fees from "./components/admin/fees/Fees";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* Default Route */}
//         <Route path="/" element={<Navigate to="/login" />} />

//         {/* Auth Routes */}
//         <Route path="/login" element={<AdminLogin />} />
//         <Route path="/signup" element={<AdminSignup />} />
//         <Route path="/campus-selection" element={<CampusSelection />} />

//         {/* Admin Routes */}
//         <Route path="/s-admin" element={<AdminLayout />}>

//           {/* Default Redirect */}
//           <Route index element={<Navigate to="dashboard" />} />
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="students" element={<StudentList />} />
//           <Route path="add-student" element={<AddStudent />} />
//           <Route path="review-admission" element={<ReviewAdmission />} />
//            <Route path="student-details/:id" element={<ViewStudentDetails />} />
//           <Route path="Bulk-Import-Students" element={<BulkImport />} />
//           <Route path="Upload-Student-Documents" element={<UploadDocuments />} />
//           <Route path="classes" element={<Classes />} />
//           <Route path="sections" element={<Sections />} />
//            <Route path="fees" element={<Fees />} />










//           <Route path="attendance" element={<AttendanceManagement />} />
//           <Route path="mark-attendance" element={<MarkAttendancePage />} />
//           <Route path="attendance-reports" element={<AttendanceReportPage />} />
//           <Route path="exams" element={<ExamsResults />} />

//         </Route>

//         {/* 404 Route */}
//         {/* <Route path="*" element={<h1>Page Not Found</h1>} /> */}

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;