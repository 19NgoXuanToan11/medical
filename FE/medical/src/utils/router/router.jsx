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
import ReportsAnalytics from "../../pages/admin/report/ReportsAnalytics";

// manager
import Dashboard from "../../pages/manager/dashboard/Dashboard";
import ParentManagement from "../../pages/manager/manage/ParentManagement";
import StudentManagement from "../../pages/manager/manage/StudentManagement";
import MedicineInventory from "../../pages/manager/inventory/MedicineInventory";
import SupplyInventory from "../../pages/manager/inventory/SupplyInventory";
import ExcelImport from "../../pages/manager/inventory/ExcelImport";
import ExcelManagement from "../../pages/manager/excel/ExcelManagement";
import MedicationManagement from "../../pages/manager/medication/MedicationManagement";
import HealthCheckManagement from "../../pages/manager/health-check/HealthCheckManagement";
import VaccinationManagement from "../../pages/manager/vaccination/VaccinationManagement";
import VaccinationDetailManager from "../../pages/manager/vaccination/VaccinationDetail";
import HealthCheckDetailManager from "../../pages/manager/health-check/HealthCheckDetail";
import ClassManagement from "../../pages/manager/manage/ClassManagement";
import ExaminationCategoryManagement from "../../pages/manager/manage/ExaminationCategoryManagement";

// nurse
import NurseDashboard from "../../pages/nurse/dashboard/NurseDashboard";
import NurseProfile from "../../pages/nurse/profile/NurseProfile";
import NurseHealthCheck from "../../pages/nurse/health-check/NurseHealthCheck";
import NurseHealthCheckCreate from "../../pages/nurse/health-check/NurseHealthCheckCreate";
import NurseHealthCheckDetail from "../../pages/nurse/health-check/NurseHealthCheckDetail";
import StudentHealthHistory from "../../pages/nurse/health-check/StudentHealthHistory";
import HealthEventList from "../../pages/nurse/health-events/HealthEventList";
import HealthEventDetail from "../../pages/nurse/health-events/HealthEventDetail";
import HealthEventCreate from "../../pages/nurse/health-events/HealthEventCreate";
import HealthEventEdit from "../../pages/nurse/health-events/HealthEventEdit";
import VaccinationDetail from "../../pages/nurse/vaccination/VaccinationDetail";
import VaccinationEdit from "../../pages/nurse/vaccination/VaccinationEdit";
import VaccinationPlanCreate from "../../pages/nurse/vaccination/VaccinationPlanCreate";
import NurseMedicationManagement from "../../pages/nurse/medication/MedicationManagement";
import StudentHealthDetail from "../../pages/nurse/health-check/StudentHealthDetail";
import NurseSchedule from "../../pages/nurse/schedule/NurseSchedule";
import StudentHealthRecords from "../../pages/nurse/health-records/StudentHealthRecords";
import StudentHealthRecordDetail from "../../pages/nurse/health-records/StudentHealthRecordDetail";
import HealthServicesManagement from "../../pages/nurse/health-services/HealthServicesManagement";
import HealthServiceCreate from "../../pages/nurse/health-services/HealthServiceCreate";
import HealthServicesDetail from "../../pages/nurse/health-services/HealthServicesDetail";

// parent
import ParentDashboard from "../../pages/parent/dashboard/ParentDashboard";
import ParentProfile from "../../pages/parent/profile/ParentProfile";
import StudentHealthProfile from "../../pages/parent/health-profile/StudentHealthProfile";
import HealthProfileList from "../../pages/parent/health-profile/HealthProfileList";
import ComprehensiveHealthTable from "../../pages/parent/health-profile/ComprehensiveHealthTable";
import MedicationRequest from "../../pages/parent/medication/MedicationRequest";
import MedicationHistory from "../../pages/parent/medication/MedicationHistory";
import MedicationDetail from "../../pages/parent/medication/MedicationDetail";
import VaccinationIndex from "../../pages/parent/vaccination/index";
import VaccinationConsent from "../../pages/parent/vaccination/VaccinationConsent";
import HealthCheckConfirmation from "../../pages/parent/health-check/HealthCheckConfirmation";
import HealthCheckResultDetail from "../../pages/parent/health-check/HealthCheckResultDetail";
import HealthEventsList from "../../pages/parent/health-events/HealthEventsList";
import ParentHealthEventDetail from "../../pages/parent/health-events/HealthEventDetail";
import HealthEventResultDetail from "../../pages/parent/health-events/HealthEventResultDetail";
import Notifications from "../../pages/parent/notification/Notifications";
import HealthProfileDetailView from "../../pages/parent/health-profile/HealthProfileDetailView";
import HealthServices from "../../pages/parent/health-services/HealthServices";

// student
import StudentDashboard from "../../pages/student/dashboard/StudentDashboard";
import StudentMedication from "../../pages/student/medication/StudentMedication";
import StudentHealthEvents from "../../pages/student/health-events/StudentHealthEvents";
import StudentHealthResources from "../../pages/student/health-resources/StudentHealthResources";

// Demo component
import ProtectedRouteDemo from "../../components/demo/ProtectedRouteDemo";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo/protected-routes" element={<ProtectedRouteDemo />} />
      </Route>

      {/* Auth Routes - No protection needed */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Unauthorized Page - Public access */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Admin Routes - Only Admin can access */}
      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/staff" element={<StaffManagement />} />
        <Route path="/admin/reports" element={<ReportsAnalytics />} />
      </Route>

      {/* Manager Routes - Only Manager can access */}
      <Route
        element={
          <ManagerRoute>
            <ManagerLayout />
          </ManagerRoute>
        }
      >
        <Route path="/manager/dashboard" element={<Dashboard />} />
        <Route
          path="/manager/parent-management"
          element={<ParentManagement />}
        />
        <Route
          path="/manager/student-management"
          element={<StudentManagement />}
        />
        <Route path="/manager/medication" element={<MedicationManagement />} />
        <Route
          path="/manager/health-check"
          element={<HealthCheckManagement />}
        />
        <Route
          path="/manager/vaccination"
          element={<VaccinationManagement />}
        />
        <Route
          path="/manager/vaccination/:id"
          element={<VaccinationDetailManager />}
        />
        <Route
          path="/manager/health-check/:id"
          element={<HealthCheckDetailManager />}
        />
        <Route path="/manager/class-management" element={<ClassManagement />} />
        <Route
          path="/manager/examination-categories"
          element={<ExaminationCategoryManagement />}
        />
        <Route
          path="/manager/medicine-inventory"
          element={<MedicineInventory />}
        />
        <Route path="/manager/supply-inventory" element={<SupplyInventory />} />
        <Route path="/manager/upload" element={<ExcelImport />} />
        <Route path="/manager/excel" element={<ExcelManagement />} />
      </Route>

      {/* Parent Routes - Only Parent can access */}
      <Route
        element={
          <ParentRoute>
            <ParentLayout />
          </ParentRoute>
        }
      >
        {/* Parent Dashboard */}
        <Route path="/parent/dashboard" element={<ParentDashboard />} />

        {/* Parent Profile */}
        <Route path="/parent/profile" element={<ParentProfile />} />

        {/* Parent Health Profile Routes */}
        <Route path="/parent/health-profile" element={<HealthProfileList />} />
        <Route
          path="/parent/health-profile/comprehensive"
          element={<ComprehensiveHealthTable />}
        />
        <Route
          path="/parent/health-profile/new"
          element={<StudentHealthProfile />}
        />
        <Route
          path="/parent/health-profile/:id"
          element={<HealthProfileDetailView />}
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
          element={<ParentHealthEventDetail />}
        />
        <Route
          path="/parent/health-events/:id/results"
          element={<HealthEventResultDetail />}
        />

        {/* Parent Notifications Routes */}
        <Route path="/parent/notifications" element={<Notifications />} />

        {/* Parent Health Services Routes */}
        <Route path="/parent/health-services" element={<HealthServices />} />
      </Route>

      {/* Nurse Routes - Only Nurse can access */}
      <Route
        element={
          <NurseRoute>
            <NurseLayout />
          </NurseRoute>
        }
      >
        {/* Nurse Dashboard */}
        <Route path="/nurse/dashboard" element={<NurseDashboard />} />

        {/* Nurse Profile */}
        <Route path="/nurse/profile" element={<NurseProfile />} />

        {/* Schedule Routes */}
        <Route path="/nurse/schedule" element={<NurseSchedule />} />

        {/* Health Records Routes */}
        <Route
          path="/nurse/health-records"
          element={<StudentHealthRecords />}
        />
        <Route
          path="/nurse/health-records/:studentId"
          element={<StudentHealthRecordDetail />}
        />

        {/* Medication Routes */}
        <Route
          path="/nurse/medication"
          element={<NurseMedicationManagement />}
        />

        {/* Health Services Routes */}
        <Route
          path="/nurse/health-services"
          element={<HealthServicesManagement />}
        />
        <Route
          path="/nurse/health-services/create"
          element={<HealthServiceCreate />}
        />
        <Route
          path="/nurse/health-services/create/:serviceType"
          element={<HealthServiceCreate />}
        />
        <Route
          path="/nurse/health-services/:id"
          element={<HealthServicesDetail />}
        />

        {/* Health Check Routes */}
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
          path="/nurse/health-check/:id/student/:studentId"
          element={<StudentHealthDetail />}
        />
        <Route
          path="/nurse/student/:id/health-history"
          element={<StudentHealthHistory />}
        />

        {/* Health Events Routes */}
        <Route path="/nurse/health-events" element={<HealthEventList />} />
        <Route
          path="/nurse/health-events/new"
          element={<HealthEventCreate />}
        />
        <Route
          path="/nurse/health-events/:id"
          element={<HealthEventDetail />}
        />
        <Route
          path="/nurse/health-events/:id/edit"
          element={<HealthEventEdit />}
        />

        {/* Vaccination Routes */}
        <Route path="/nurse/vaccination" element={<VaccinationManagement />} />
        <Route
          path="/nurse/vaccination/create"
          element={<VaccinationPlanCreate />}
        />
        <Route path="/nurse/vaccination/:id" element={<VaccinationDetail />} />
        <Route
          path="/nurse/vaccination/:id/edit"
          element={<VaccinationEdit />}
        />
      </Route>

      {/* Student Routes - Only Student can access */}
      <Route
        element={
          <StudentRoute>
            <StudentLayout />
          </StudentRoute>
        }
      >
        {/* Student Dashboard */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />

        {/* Student Medication Routes */}
        <Route path="/student/medication" element={<StudentMedication />} />

        {/* Student Health Events Routes */}
        <Route
          path="/student/health-events"
          element={<StudentHealthEvents />}
        />

        {/* Student Health Resources Routes */}
        <Route path="/student/resources" element={<StudentHealthResources />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
