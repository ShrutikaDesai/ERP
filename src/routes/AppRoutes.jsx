
import { Routes, Route } from "react-router-dom";
import AdmissionRoutes from "./AdmissionRoutes";


const AppRoutes = () => {
  return (
    <Routes>

      {AdmissionRoutes()}

      
    </Routes>
  );
}

export default AppRoutes;