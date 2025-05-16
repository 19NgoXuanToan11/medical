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
import MedicationRequest from "./pages/parent/medication/MedicationRequest";
import MedicationHistory from "./pages/parent/medication/MedicationHistory";
import MedicationDetail from "./pages/parent/medication/MedicationDetail";
import ParentDashboard from "./pages/parent/dashboard/ParentDashboard";
import StaffMedicationList from "./pages/staff/medication/StaffMedicationList";
import MedicationAdminister from "./pages/staff/medication/MedicationAdminister";
import HealthEventList from "./pages/staff/health-events/HealthEventList";
import HealthEventForm from "./pages/staff/health-events/HealthEventForm";
import HealthEventDetail from "./pages/staff/health-events/HealthEventDetail";
import MainLayout from "./components/layout/MainLayout";

function App() {
  return (
    <div>
      <Routes>
        <Route element={<MainLayout />}>
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

          {/* Parent Dashboard */}
          <Route path="/parent/dashboard" element={<ParentDashboard />} />

          {/* Parent Health Profile Routes */}
          <Route
            path="/parent/health-profile/new"
            element={<StudentHealthProfile />}
          />
          <Route
            path="/parent/health-profile"
            element={<HealthProfileList />}
          />

          {/* Parent Medication Routes */}
          <Route
            path="/parent/medication/request"
            element={<MedicationRequest />}
          />
          <Route
            path="/parent/medication/history"
            element={<MedicationHistory />}
          />
          <Route
            path="/parent/medication/detail/:id"
            element={<MedicationDetail />}
          />

          {/* Staff Medication Routes */}
          <Route path="/staff/medication" element={<StaffMedicationList />} />
          <Route
            path="/staff/medication/administer/:id"
            element={<MedicationAdminister />}
          />

          {/* Staff Health Events Routes */}
          <Route path="/staff/health-events" element={<HealthEventList />} />
          <Route
            path="/staff/health-events/new"
            element={<HealthEventForm />}
          />
          <Route
            path="/staff/health-events/:id"
            element={<HealthEventDetail />}
          />
          <Route
            path="/staff/health-events/edit/:id"
            element={<HealthEventForm />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
