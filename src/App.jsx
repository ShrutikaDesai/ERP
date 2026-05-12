import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AdminLayout from "./components/layouts/AdminLayout";
import Dashboard from "./components/admin/dashboard/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/s-admin" element={<AdminLayout />}>
          
          {/* Default Redirect */}
          <Route
            index
            element={<Navigate to="dashboard" />}
          />

          {/* Dashboard */}
          <Route
            path="dashboard"
            element={<Dashboard />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;