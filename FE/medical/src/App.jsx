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
import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";
import AuthLayout from "./components/layout/AuthLayout";
import VaccinationManagement from "./pages/staff/VaccinationManagement";
import VaccinationFlowDiagram from "./pages/staff/VaccinationFlowDiagram";
import VaccinationConsent from "./pages/parent/VaccinationConsent";
import HealthCheckManagement from "./pages/staff/HealthCheckManagement";
import HealthCheckExecution from "./pages/staff/HealthCheckExecution";
import HealthCheckResults from "./pages/staff/HealthCheckResults";
import HealthCheckForm from "./pages/staff/HealthCheckForm";
import HealthCheckConfirmation from "./pages/parent/HealthCheckConfirmation";
// Import admin components
import { AdminDashboard, ReportsAnalytics } from "./pages/admin";
import UserManagement from "./pages/admin/UserManagement";
import UserList from "./pages/admin/UserManagement/UserList";
import UserRoles from "./pages/admin/UserManagement/UserRoles";
import UserPermissions from "./pages/admin/UserManagement/UserPermissions";
import NewUser from "./pages/admin/UserManagement/NewUser";

// Import Teacher and Student components
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";

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

          {/* Teacher Routes */}
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route
            path="/teacher/health-report/new"
            element={
              <div className="p-8">
                Form báo cáo sức khỏe học sinh mới (đang phát triển)
              </div>
            }
          />
          <Route
            path="/teacher/medical-pass"
            element={
              <div className="p-8">
                Tạo phiếu xin phép đến phòng y tế (đang phát triển)
              </div>
            }
          />
          <Route
            path="/teacher/notifications"
            element={
              <div className="p-8">
                Thông báo y tế cho giáo viên (đang phát triển)
              </div>
            }
          />
          <Route
            path="/teacher/student/:id"
            element={
              <div className="p-8">Chi tiết học sinh (đang phát triển)</div>
            }
          />
          <Route
            path="/teacher/health-report/:id"
            element={
              <div className="p-8">Chi tiết báo cáo y tế (đang phát triển)</div>
            }
          />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route
            path="/student/health-profile"
            element={
              <div className="p-8">
                Hồ sơ sức khỏe của học sinh (đang phát triển)
              </div>
            }
          />
          <Route
            path="/student/report-symptom"
            element={
              <div className="p-8">Báo cáo triệu chứng (đang phát triển)</div>
            }
          />
          <Route
            path="/student/request-visit"
            element={
              <div className="p-8">Yêu cầu gặp y tá (đang phát triển)</div>
            }
          />
          <Route
            path="/student/health-events"
            element={
              <div className="p-8">
                Sự kiện y tế của học sinh (đang phát triển)
              </div>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
