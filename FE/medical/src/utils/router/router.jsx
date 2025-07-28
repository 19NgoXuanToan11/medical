import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Protected Routes và Unauthorized Page
import ProtectedRoute, {
  AdminRoute,
  ManagerRoute,
  NurseRoute,
  ParentRoute,
  StudentRoute,
} from "../../components/common/ProtectedRoute";
import UnauthorizedPage from "../../components/common/UnauthorizedPage";

// home
import HomePage from "../../components/home/HomePage";

// layout
import AuthLayout from "../../components/layout/auth/AuthLayout";
import AdminLayout from "../../components/layout/admin/AdminLayout";
import ManagerLayout from "../../components/layout/manager/ManagerLayout";
import MainLayout from "../../components/layout/main/MainLayout";
import ParentLayout from "../../components/layout/parent/ParentLayout";
import NurseLayout from "../../components/layout/nurse/NurseLayout";
import StudentLayout from "../../components/layout/student/StudentLayout";

// auth
import Login from "../../pages/auth/login/Login";

// admin
import AdminDashboard from "../../pages/admin/dashboard/AdminDashboard";
import StaffManagement from "../../pages/admin/staff/StaffManagement";
import NurseGradeManagement from "../../pages/admin/staff/NurseGradeManagement";
import ReportsAnalytics from "../../pages/admin/report/ReportsAnalytics";

// manager
import Dashboard from "../../pages/manager/dashboard/Dashboard";
import MedicineInventory from "../../pages/manager/inventory/MedicineInventory";
import SupplyInventory from "../../pages/manager/inventory/SupplyInventory";
import ExcelManagement from "../../pages/manager/excel/ExcelManagement";
import MedicationManagement from "../../pages/manager/medication/MedicationManagement";
import HealthCheckManagement from "../../pages/manager/health-check/HealthCheckManagement";
import VaccinationManagement from "../../pages/manager/vaccination/VaccinationManagement";
import VaccinationDetailManager from "../../pages/manager/vaccination/VaccinationDetail";
import VaccineManagement from "../../pages/manager/vaccination/VaccineManagement";
import ClassManagement from "../../pages/manager/manage/ClassManagement";
import ClassDetail from "../../pages/manager/manage/ClassDetail";
import ExaminationCategoryManagement from "../../pages/manager/manage/ExaminationCategoryManagement";
import HealthEventsManagement from "../../pages/manager/health-events/HealthEventsManagement";
import ManagerHealthEventDetail from "../../pages/manager/health-events/HealthEventDetail";

// nurse
import NurseDashboard from "../../pages/nurse/dashboard/NurseDashboard";
import NurseProfile from "../../pages/nurse/profile/NurseProfile";
import HealthEventList from "../../pages/nurse/health-events/HealthEventList";
import HealthEventDetail from "../../pages/nurse/health-events/HealthEventDetail";
import HealthEventCreate from "../../pages/nurse/health-events/HealthEventCreate";
import HealthEventEdit from "../../pages/nurse/health-events/HealthEventEdit";
import NurseMedicationManagement from "../../pages/nurse/medication/MedicationManagement";

import StudentHealthRecords from "../../pages/nurse/health-records/StudentHealthRecords";
import StudentHealthRecordDetail from "../../pages/nurse/health-records/StudentHealthRecordDetail";
import HealthServicesManagement from "../../pages/nurse/health-services/HealthServicesManagement";
import HealthServiceCreate from "../../pages/nurse/health-services/HealthServiceCreate";
import HealthServicesDetail from "../../pages/nurse/health-services/HealthServicesDetail";
import VaccinationDetail from "../../pages/nurse/health-services/VaccinationDetail";
import HealthCheckCreate from "../../pages/nurse/health-services/HealthCheckCreate";

// parent
import ParentDashboard from "../../pages/parent/dashboard/ParentDashboard";
import ParentProfile from "../../pages/parent/profile/ParentProfile";
import HealthProfileList from "../../pages/parent/health-profile/HealthProfileList";
import MedicationRequest from "../../pages/parent/medication/MedicationRequest";
import MedicationHistory from "../../pages/parent/medication/MedicationHistory";
import MedicationDetail from "../../pages/parent/medication/MedicationDetail";
import VaccinationIndex from "../../pages/parent/vaccination/index";
import VaccinationConsent from "../../pages/parent/vaccination/VaccinationConsent";
import HealthEventsList from "../../pages/parent/health-events/HealthEventsList";
import ParentHealthEventDetail from "../../pages/parent/health-events/HealthEventDetail";
import HealthEventResultDetail from "../../pages/parent/health-events/HealthEventResultDetail";
import HealthEventNotificationDetail from "../../pages/parent/health-events/HealthEventNotificationDetail";
import Notifications from "../../pages/parent/notification/Notifications";
import HealthServices from "../../pages/parent/health-services/HealthServices";

// student
import StudentDashboard from "../../pages/student/dashboard/StudentDashboard";
import StudentMedication from "../../pages/student/medication/StudentMedication";
import StudentHealthEvents from "../../pages/student/health-events/StudentHealthEvents";
import StudentHealthResources from "../../pages/student/health-resources/StudentHealthResources";

function AppRoutes() {
  return (
    <Routes>
      {/* Home Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />{" "}
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Unauthorized Page */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Admin Routes */}
      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="/admin/staff" element={<StaffManagement />} />
        <Route path="/admin/nurse-grades" element={<NurseGradeManagement />} />
        
        <Route path="/admin/reports" element={<ReportsAnalytics />} />
      </Route>

      {/* Manager Routes */}
      <Route
        element={
          <ManagerRoute>
            <ManagerLayout />
          </ManagerRoute>
        }
      >
        <Route path="/manager/dashboard" element={<Dashboard />} />

        <Route path="/manager/medication" element={<MedicationManagement />} />
        
        <Route path="/manager/health-check" element={<HealthCheckManagement />} />
        
        <Route path="/manager/vaccination" element={<VaccinationManagement />} />
        <Route path="/manager/vaccination/:id" element={<VaccinationDetailManager />} />
        
        <Route path="/manager/vaccines" element={<VaccineManagement />} />
        
        <Route path="/manager/health-events" element={<HealthEventsManagement />} />
        <Route path="/manager/health-events/:id" element={<ManagerHealthEventDetail />} />
        
        <Route path="/manager/class-management" element={<ClassManagement />} />
        <Route path="/manager/class-management/:id" element={<ClassDetail />} />
        
        <Route path="/manager/examination-categories" element={<ExaminationCategoryManagement />} />
        
        <Route path="/manager/medicine-inventory" element={<MedicineInventory />} />
        
        <Route path="/manager/supply-inventory" element={<SupplyInventory />} />
        
        <Route path="/manager/excel" element={<ExcelManagement />} />
      </Route>

      {/* Nurse Routes */}
      <Route
        element={
          <NurseRoute>
            <NurseLayout />
          </NurseRoute>
        }
      >
        <Route path="/nurse/dashboard" element={<NurseDashboard />} />

        <Route path="/nurse/profile" element={<NurseProfile />} />

        <Route path="/nurse/health-records" element={<StudentHealthRecords />} />
        <Route path="/nurse/health-records/:studentId" element={<StudentHealthRecordDetail />} />

        <Route path="/nurse/medication" element={<NurseMedicationManagement />} />

        <Route path="/nurse/health-services" element={<HealthServicesManagement />} />
        <Route path="/nurse/health-services/create/:serviceType" element={<HealthServiceCreate />} />
        <Route path="/nurse/health-services/edit/:id" element={<HealthCheckCreate />} />
        <Route path="/nurse/health-services/vaccination/:id" element={<VaccinationDetail />} />
        <Route path="/nurse/health-services/:id" element={<HealthServicesDetail />} />

        <Route path="/nurse/health-events" element={<HealthEventList />} />
        <Route path="/nurse/health-events/new" element={<HealthEventCreate />} />
        <Route path="/nurse/health-events/:id" element={<HealthEventDetail />} />
        <Route path="/nurse/health-events/:id/edit" element={<HealthEventEdit />} />
      </Route>

      {/* Parent Routes */}
      <Route
        element={
          <ParentRoute>
            <ParentLayout />
          </ParentRoute>
        }
      >
        <Route path="/parent/dashboard" element={<ParentDashboard />} />

        <Route path="/parent/profile" element={<ParentProfile />} />

        <Route path="/parent/health-profile" element={<HealthProfileList />} />

        <Route path="/parent/medication/request" element={<MedicationRequest />} />
        <Route path="/parent/medication/history" element={<MedicationHistory />} />
        <Route path="/parent/medication/detail/:id" element={<MedicationDetail />} />

        <Route path="/parent/vaccination" element={<Navigate to="/parent/vaccination/upcoming" replace />} />
        <Route path="/parent/vaccination/*" element={<VaccinationIndex />} />
        <Route path="/parent/vaccination/consent/:id" element={<VaccinationConsent />} />
        
        <Route path="/parent/health-events" element={<HealthEventsList />} />
        <Route path="/parent/health-events/:id" element={<ParentHealthEventDetail />} />
        <Route path="/parent/health-events/:id/results" element={<HealthEventResultDetail />} />
        <Route path="/parent/health-events/:id/notification" element={<HealthEventNotificationDetail />} />

        <Route path="/parent/notifications" element={<Notifications />} />

        <Route path="/parent/health-services" element={<HealthServices />} />
      </Route>

      {/* Student Routes */}
      <Route
        element={
          <StudentRoute>
            <StudentLayout />
          </StudentRoute>
        }
      >
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/medication" element={<StudentMedication />} />
        <Route path="/student/health-events" element={<StudentHealthEvents />} />
        <Route path="/student/resources" element={<StudentHealthResources />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
