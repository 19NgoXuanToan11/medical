import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./components/home/HomePage";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import RoleSelection from "./pages/auth/RoleSelection";
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
import MedicalInventory from "./pages/staff/medication/MedicalInventory";
import InventoryTransaction from "./pages/staff/medication/InventoryTransaction";
import TransactionHistory from "./pages/staff/medication/TransactionHistory";
import HealthEventList from "./pages/staff/health-events/HealthEventList";
import HealthEventForm from "./pages/staff/health-events/HealthEventForm";
import HealthEventDetail from "./pages/staff/health-events/HealthEventDetail";
import MedicalEventSupplies from "./pages/staff/health-events/MedicalEventSupplies";
import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";
import AuthLayout from "./components/layout/AuthLayout";
import VaccinationManagement from "./pages/staff/VaccinationManagement";
import VaccinationFlowDiagram from "./pages/staff/VaccinationFlowDiagram";
import VaccinationConsent from "./pages/parent/VaccinationConsent";
import HealthCheckManagement from "./pages/staff/HealthCheckManagement";
import HealthCheckExecution from "./pages/staff/HealthCheckExecution";
import HealthCheckResults from "./pages/staff/HealthCheckResults";
import HealthCheckConfirmation from "./pages/parent/HealthCheckConfirmation";
// Import admin components
import {
  AdminDashboard,
  UserManagement,
  ReportsAnalytics,
  SystemSettings,
} from "./pages/admin";

function App() {
  return (
    <div>
      <Routes>
        {/* Auth Routes - No Navbar/Footer */}
        <Route element={<AuthLayout />}>
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Admin Routes - Custom Admin Layout */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/reports" element={<ReportsAnalytics />} />
          <Route path="/admin/settings" element={<SystemSettings />} />
        </Route>

        {/* Main Routes - With Navbar and Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />

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

          {/* Parent Vaccination Routes */}
          <Route
            path="/parent/vaccination/consent/:id"
            element={<VaccinationConsent />}
          />
          <Route
            path="/parent/vaccination/consent/new"
            element={<VaccinationConsent />}
          />

          {/* Parent Health Check Routes */}
          <Route
            path="/parent/health-check"
            element={<HealthCheckConfirmation />}
          />
          <Route
            path="/parent/health-check/results"
            element={<HealthCheckConfirmation initialTab="completed" />}
          />
          <Route
            path="/parent/health-check/:id/results"
            element={<HealthCheckConfirmation />}
          />

          {/* Staff Medication Routes */}
          <Route path="/staff/medication" element={<StaffMedicationList />} />
          <Route
            path="/staff/medication/administer/:id"
            element={<MedicationAdminister />}
          />
          <Route
            path="/staff/medication/inventory"
            element={<MedicalInventory />}
          />
          <Route
            path="/staff/medication/inventory/transaction"
            element={<InventoryTransaction />}
          />
          <Route
            path="/staff/medication/inventory/transaction/:id"
            element={<InventoryTransaction />}
          />
          <Route
            path="/staff/medication/inventory/history"
            element={<TransactionHistory />}
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
          <Route
            path="/staff/health-events/:id/supplies"
            element={<MedicalEventSupplies />}
          />

          {/* Staff Vaccination Management Routes */}
          <Route
            path="/staff/vaccination"
            element={<VaccinationManagement />}
          />
          <Route
            path="/staff/vaccination/flow"
            element={<VaccinationFlowDiagram />}
          />

          {/* Staff Health Check Management Routes */}
          <Route
            path="/staff/health-check"
            element={<HealthCheckManagement />}
          />
          <Route
            path="/staff/health-check/new"
            element={<HealthCheckManagement />}
          />
          <Route
            path="/staff/health-check/:checkId"
            element={<HealthCheckExecution />}
          />
          <Route
            path="/staff/health-check/:checkId/results"
            element={<HealthCheckResults />}
          />
          <Route
            path="/staff/health-check/:checkId/edit"
            element={<HealthCheckManagement />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
