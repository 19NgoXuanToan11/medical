import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import MedicalInventory from "./pages/staff/medication/MedicalInventory";
import InventoryTransaction from "./pages/staff/medication/InventoryTransaction";
import TransactionHistory from "./pages/staff/medication/TransactionHistory";
import AddMedicalItem from "./pages/staff/medication/AddMedicalItem";
import MedicalItemDetail from "./pages/staff/medication/MedicalItemDetail";
import EditMedicalItem from "./pages/staff/medication/EditMedicalItem";
import HealthEventList from "./pages/staff/health-events/HealthEventList";
import HealthEventForm from "./pages/staff/health-events/HealthEventForm";
import HealthEventDetail from "./pages/staff/health-events/HealthEventDetail";
import MedicalEventSupplies from "./pages/staff/health-events/MedicalEventSupplies";
import MainLayout from "./components/layout/main/MainLayout";
import AdminLayout from "./components/layout/admin/AdminLayout";
import ManagerLayout from "./components/layout/manager/ManagerLayout";
import AuthLayout from "./components/layout/auth/AuthLayout";
import ParentLayout from "./components/layout/parent/ParentLayout";
import VaccinationManagement from "./pages/staff/VaccinationManagement";
import VaccinationFlowDiagram from "./pages/staff/VaccinationFlowDiagram";
import VaccinationConsent from "./pages/parent/VaccinationConsent";
import HealthCheckManagement from "./pages/staff/HealthCheckManagement";
import HealthCheckExecution from "./pages/staff/HealthCheckExecution";
import HealthCheckResults from "./pages/staff/HealthCheckResults";
import HealthCheckForm from "./pages/staff/HealthCheckForm";
import HealthCheckConfirmation from "./pages/parent/HealthCheckConfirmation";
import HealthCheckResultDetail from "./pages/parent/HealthCheckResultDetail";
import HealthEventsList from "./pages/parent/health-events/HealthEventsList";
import HealthEventResultDetail from "./pages/parent/health-events/HealthEventResultDetail";
import Notifications from "./pages/parent/notifications/Notifications";
import NurseLayout from "./components/layout/nurse/NurseLayout";
import NurseHealthCheckLayout from "./components/layout/nurse/NurseHealthCheckLayout";
import NurseDashboard from "./pages/nurse/NurseDashboard";
import NurseHealthCheck from "./pages/nurse/NurseHealthCheck";
import NurseHealthCheckCreate from "./pages/nurse/NurseHealthCheckCreate";
import NurseHealthCheckDetail from "./pages/nurse/NurseHealthCheckDetail";
import StudentHealthHistory from "./pages/nurse/StudentHealthHistory";
import StudentLayout from "./components/layout/student/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentMedication from "./pages/student/StudentMedication";
import StudentHealthEvents from "./pages/student/StudentHealthEvents";
import StudentHealthResources from "./pages/student/StudentHealthResources";

// Import admin components
import { AdminDashboard, ReportsAnalytics } from "./pages/admin";
import UserManagement from "./pages/admin/UserManagement";
import UserList from "./pages/admin/UserManagement/UserList";
import UserRoles from "./pages/admin/UserManagement/UserRoles";
import UserPermissions from "./pages/admin/UserManagement/UserPermissions";
import NewUser from "./pages/admin/UserManagement/NewUser";

// Import Manager components
import {
  Dashboard as ManagerDashboard,
  MedicineInventory,
  SupplyInventory,
} from "./pages/manager";
import ParentManagement from "./pages/manager/ParentManagement";
import StudentManagement from "./pages/manager/StudentManagement";

// Import the VaccinationIndex component
import VaccinationIndex from "./pages/parent/vaccination";

function App() {
  return (
    <div>
      <Routes>
        {/* Auth Routes - No Navbar/Footer */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Admin Routes - Custom Admin Layout */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* User Management routes */}
          <Route path="/admin/users" element={<UserManagement />}>
            <Route index element={<UserList />} />
            <Route path="roles" element={<UserRoles />} />
            <Route path="permissions" element={<UserPermissions />} />
          </Route>

          <Route path="/admin/users/new" element={<NewUser />} />

          <Route path="/admin/reports" element={<ReportsAnalytics />} />
        </Route>

        {/* Manager Routes - Custom Manager Layout */}
        <Route element={<ManagerLayout />}>
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route
            path="/manager/parent-management"
            element={<ParentManagement />}
          />
          <Route
            path="/manager/student-management"
            element={<StudentManagement />}
          />
          <Route
            path="/manager/medicine-inventory"
            element={<MedicineInventory />}
          />
          <Route
            path="/manager/supply-inventory"
            element={<SupplyInventory />}
          />
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
        </Route>

        {/* Parent Routes - With Parent Layout (No Main Header/Footer) */}
        <Route element={<ParentLayout />}>
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
          <Route
            path="/parent/health-profile/:id"
            element={<StudentHealthProfile viewOnly={true} />}
          />
          <Route
            path="/parent/health-profile/edit/:id"
            element={<StudentHealthProfile />}
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
            path="/parent/vaccination"
            element={<Navigate to="/parent/vaccination/upcoming" replace />}
          />
          <Route path="/parent/vaccination/*" element={<VaccinationIndex />} />
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
            element={<HealthCheckResultDetail />}
          />

          {/* Parent Health Events Routes */}
          <Route path="/parent/health-events" element={<HealthEventsList />} />
          <Route
            path="/parent/health-events/:id"
            element={<HealthEventDetail />}
          />
          <Route
            path="/parent/health-events/:id/results"
            element={<HealthEventResultDetail />}
          />

          {/* Parent Notifications Routes */}
          <Route path="/parent/notifications" element={<Notifications />} />
        </Route>

        {/* Staff Routes - With MainLayout */}
        <Route element={<MainLayout />}>
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
            path="/staff/medication/inventory/add"
            element={<AddMedicalItem />}
          />
          <Route
            path="/staff/medication/inventory/detail/:id"
            element={<MedicalItemDetail />}
          />
          <Route
            path="/staff/medication/inventory/edit/:id"
            element={<EditMedicalItem />}
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
          <Route path="/staff/health-check/new" element={<HealthCheckForm />} />
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

          <Route
            path="/teacher/health-report/new"
            element={
              <div className="p-8">
                Form báo cáo sức khỏe học sinh mới (đang phát triển)
              </div>
            }
          />
        </Route>

        {/* Nurse Routes - With NurseLayout */}
        <Route element={<NurseLayout />}>
          <Route path="/nurse/dashboard" element={<NurseDashboard />} />
          <Route
            path="/nurse/students"
            element={
              <div className="p-8">
                Quản lý hồ sơ học sinh (đang phát triển)
              </div>
            }
          />
          <Route path="/nurse/medication" element={<StaffMedicationList />} />
          <Route path="/nurse/supplies" element={<MedicalInventory />} />
          <Route path="/nurse/health-events" element={<HealthEventList />} />
          <Route
            path="/nurse/vaccination"
            element={<VaccinationManagement />}
          />
        </Route>

        {/* Nurse Health Check Routes - Without Header/Footer */}
        <Route element={<NurseHealthCheckLayout />}>
          <Route path="/nurse/health-check" element={<NurseHealthCheck />} />
          <Route
            path="/nurse/health-check/new"
            element={<NurseHealthCheckCreate />}
          />
          <Route
            path="/nurse/health-check/:id"
            element={<NurseHealthCheckDetail />}
          />
          <Route
            path="/nurse/student/:id/health-history"
            element={<StudentHealthHistory />}
          />
          {/* Keep legacy routes for backward compatibility */}
          <Route
            path="/nurse/health-check/:checkId"
            element={<HealthCheckExecution />}
          />
          <Route
            path="/nurse/health-check/:checkId/results"
            element={<HealthCheckResults />}
          />
          <Route
            path="/nurse/health-check/:checkId/edit"
            element={<HealthCheckManagement />}
          />
        </Route>

        {/* Student Routes - With StudentLayout */}
        <Route element={<StudentLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route
            path="/student/health-profile"
            element={<StudentHealthProfile />}
          />
          <Route path="/student/medication" element={<StudentMedication />} />
          <Route
            path="/student/health-events"
            element={<StudentHealthEvents />}
          />
          <Route
            path="/student/resources"
            element={<StudentHealthResources />}
          />
          <Route
            path="/student/help"
            element={<div className="p-8">Trợ giúp (đang phát triển)</div>}
          />
          <Route
            path="/student/messages"
            element={<div className="p-8">Tin nhắn (đang phát triển)</div>}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
