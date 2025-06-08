import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// home
import HomePage from "./components/home/HomePage";

// layout
import AuthLayout from "./components/layout/auth/AuthLayout";
import AdminLayout from "./components/layout/admin/AdminLayout";
import ManagerLayout from "./components/layout/manager/ManagerLayout";
import MainLayout from "./components/layout/main/MainLayout";
import ParentLayout from "./components/layout/parent/ParentLayout";
import NurseLayout from "./components/layout/nurse/NurseLayout";
import StudentLayout from "./components/layout/student/StudentLayout";

// auth
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";

// admin
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import UserManagement from "./pages/admin/manage/UserManagement";
import UserRoles from "./pages/admin/UserManagement/UserRoles";
import UserList from "./pages/admin/UserManagement/UserList";
import UserPermissions from "./pages/admin/UserManagement/UserPermissions";
import ReportsAnalytics from "./pages/admin/report/ReportsAnalytics";

// manager
import Dashboard from "./pages/manager/dashboard/Dashboard";
import ParentManagement from "./pages/manager/manage/ParentManagement";
import StudentManagement from "./pages/manager/manage/StudentManagement";
import MedicineInventory from "./pages/manager/inventory/MedicineInventory";
import SupplyInventory from "./pages/manager/inventory/SupplyInventory";

// nurse
import NurseDashboard from "./pages/nurse/dashboard/NurseDashboard";
import NurseHealthCheck from "./pages/nurse/health-check/NurseHealthCheck";
import NurseHealthCheckCreate from "./pages/nurse/health-check/NurseHealthCheckCreate";
import NurseHealthCheckDetail from "./pages/nurse/health-check/NurseHealthCheckDetail";
import StudentHealthHistory from "./pages/nurse/health-check/StudentHealthHistory";
import HealthEventList from "./pages/nurse/health-events/HealthEventList";
import HealthEventDetail from "./pages/nurse/health-events/HealthEventDetail";
import HealthEventCreate from "./pages/nurse/health-events/HealthEventCreate";
import HealthEventEdit from "./pages/nurse/health-events/HealthEventEdit";
import VaccinationManagement from "./pages/nurse/vaccination/VaccinationManagement";
import VaccinationDetail from "./pages/nurse/vaccination/VaccinationDetail";
import VaccinationEdit from "./pages/nurse/vaccination/VaccinationEdit";
import StaffMedicationList from "./pages/nurse/medication/StaffMedicationList";
import StaffMedicationDetail from "./pages/nurse/medication/StaffMedicationDetail";
import HealthCheckResults from "./pages/nurse/health-check/HealthCheckResults";
import StudentHealthDetail from "./pages/nurse/health-check/StudentHealthDetail";

// parent
import ParentDashboard from "./pages/parent/dashboard/ParentDashboard";
import StudentHealthProfile from "./pages/parent/health-profile/StudentHealthProfile";
import HealthProfileList from "./pages/parent/health-profile/HealthProfileList";
import MedicationRequest from "./pages/parent/medication/MedicationRequest";
import MedicationHistory from "./pages/parent/medication/MedicationHistory";
import MedicationDetail from "./pages/parent/medication/MedicationDetail";
import VaccinationIndex from "./pages/parent/vaccination/index";
import VaccinationConsent from "./pages/parent/vaccination/VaccinationConsent";
import HealthCheckConfirmation from "./pages/parent/health-check/HealthCheckConfirmation";
import HealthCheckResultDetail from "./pages/parent/health-check/HealthCheckResultDetail";
import HealthEventsList from "./pages/parent/health-events/HealthEventsList";
import ParentHealthEventDetail from "./pages/parent/health-events/HealthEventDetail";
import HealthEventResultDetail from "./pages/parent/health-events/HealthEventResultDetail";
import Notifications from "./pages/parent/notification/Notifications";

// student
import StudentDashboard from "./pages/student/dashboard/StudentDashboard";
import StudentMedication from "./pages/student/medication/StudentMedication";
import StudentHealthEvents from "./pages/student/health-events/StudentHealthEvents";
import StudentHealthResources from "./pages/student/health-resources/StudentHealthResources";

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

          {/* Admin Reports Routes */}
          <Route path="/admin/reports" element={<ReportsAnalytics />} />
        </Route>

        {/* Manager Routes - Custom Manager Layout */}
        <Route element={<ManagerLayout />}>
          {/* Manager Dashboard */}
          <Route path="/manager/dashboard" element={<Dashboard />} />

          {/* Manager Parent Management Routes */}
          <Route path="/manager/parent-management" element={<ParentManagement />} />
          <Route path="/manager/student-management" element={<StudentManagement />} />

          {/* Manager Inventory Routes */}
          <Route path="/manager/medicine-inventory" element={<MedicineInventory />} />

          {/* Manager Supply Inventory Routes */}
          <Route path="/manager/supply-inventory" element={<SupplyInventory />} />
        </Route>

        {/* Main Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* Parent Routes - With Parent Layout (No Main Header/Footer) */}
        <Route element={<ParentLayout />}>
          {/* Parent Dashboard */}
          <Route path="/parent/dashboard" element={<ParentDashboard />} />

          {/* Parent Health Profile Routes */}
          <Route path="/parent/health-profile" element={<HealthProfileList />} />
          <Route path="/parent/health-profile/new" element={<StudentHealthProfile />} />
          <Route path="/parent/health-profile/:id" element={<StudentHealthProfile viewOnly={true} />} />
          <Route path="/parent/health-profile/edit/:id" element={<StudentHealthProfile />} />

          {/* Parent Medication Routes */}
          <Route path="/parent/medication/request" element={<MedicationRequest />} />
          <Route path="/parent/medication/history" element={<MedicationHistory />} />
          <Route path="/parent/medication/detail/:id" element={<MedicationDetail />} />

          {/* Parent Vaccination Routes */}
          <Route path="/parent/vaccination" element={<Navigate to="/parent/vaccination/upcoming" replace />} />
          <Route path="/parent/vaccination/*" element={<VaccinationIndex />} />
          <Route path="/parent/vaccination/consent/:id" element={<VaccinationConsent />} />

          {/* Parent Health Check Routes */}
          <Route path="/parent/health-check" element={<HealthCheckConfirmation />} />
          <Route path="/parent/health-check/results" element={<HealthCheckConfirmation initialTab="completed" />} />
          <Route path="/parent/health-check/:id/results" element={<HealthCheckResultDetail />} />

          {/* Parent Health Events Routes */}
          <Route path="/parent/health-events" element={<HealthEventsList />} />
          <Route path="/parent/health-events/:id" element={<ParentHealthEventDetail />} />
          <Route path="/parent/health-events/:id/results" element={<HealthEventResultDetail />} />

          {/* Parent Notifications Routes */}
          <Route path="/parent/notifications" element={<Notifications />} />
        </Route>

        {/* Nurse Routes - With NurseLayout */}
        <Route element={<NurseLayout />}>
          {/* Nurse Dashboard */}
          <Route path="/nurse/dashboard" element={<NurseDashboard />} />

          {/* Medication Routes */}
          <Route path="/nurse/medication" element={<StaffMedicationList />} />
          <Route path="/nurse/medication/:id" element={<StaffMedicationDetail />} />

          {/* Health Check Routes */}
          <Route path="/nurse/health-check" element={<NurseHealthCheck />} />
          <Route path="/nurse/health-check/new" element={<NurseHealthCheckCreate />}/>
          <Route path="/nurse/health-check/:id" element={<NurseHealthCheckDetail />}/>
          <Route path="/nurse/health-check/:id/results" element={<HealthCheckResults />} />
          <Route path="/nurse/health-check/:id/student/:studentId" element={<StudentHealthDetail />} />
          <Route path="/nurse/student/:id/health-history" element={<StudentHealthHistory />}/>

          {/* Health Events Routes */}
          <Route path="/nurse/health-events" element={<HealthEventList />} />
          <Route path="/nurse/health-events/new" element={<HealthEventCreate />} />
          <Route path="/nurse/health-events/:id" element={<HealthEventDetail />} />
          <Route path="/nurse/health-events/:id/edit" element={<HealthEventEdit />} />

          {/* Vaccination Routes */}
          <Route path="/nurse/vaccination" element={<VaccinationManagement />} />
          <Route path="/nurse/vaccination/:id" element={<VaccinationDetail />} />
          <Route path="/nurse/vaccination/:id/edit" element={<VaccinationEdit />} />
        </Route>
        
        {/* Student Routes - With StudentLayout */}
        <Route element={<StudentLayout />}>
          {/* Student Dashboard */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />

          {/* Student Medication Routes */}
          <Route path="/student/medication" element={<StudentMedication />} />

          {/* Student Health Events Routes */}
          <Route path="/student/health-events" element={<StudentHealthEvents />} />

          {/* Student Health Resources Routes */}
          <Route path="/student/resources" element={<StudentHealthResources />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
