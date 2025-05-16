import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./components/home/HomePage";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import Nutrition from "./pages/resources/nutrition/Nutrition";
import DiseasePrevention from "./pages/resources/disease-prevention/DiseasePrevention";
import MentalHealth from "./pages/resources/mental-health/MentalHealth";
import FirstAid from "./pages/resources/first-aid/FirstAid";
import PhysicalDevelopment from "./pages/resources/physical-development/PhysicalDevelopment";
import MedicalProcedures from "./pages/resources/medical-procedures/MedicalProcedures";
import StudentHealthProfile from "./pages/parent/health-profile/StudentHealthProfile";
import HealthProfileList from "./pages/parent/health-profile/HealthProfileList";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Health Resources Routes */}
        <Route path="/resources/nutrition" element={<Nutrition />} />
        <Route
          path="/resources/disease-prevention"
          element={<DiseasePrevention />}
        />
        <Route path="/resources/mental-health" element={<MentalHealth />} />
        <Route path="/resources/first-aid" element={<FirstAid />} />
        <Route
          path="/resources/physical-development"
          element={<PhysicalDevelopment />}
        />
        <Route
          path="/resources/medical-procedures"
          element={<MedicalProcedures />}
        />
        <Route
          path="/parent/health-profile/new"
          element={<StudentHealthProfile />}
        />
        <Route path="/parent/health-profile" element={<HealthProfileList />} />
      </Routes>
    </div>
  );
}

export default App;
