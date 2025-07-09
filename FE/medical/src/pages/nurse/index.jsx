import React from "react";
import { Routes, Route } from "react-router-dom";
import NurseLayout from "../../components/layout/nurse/NurseLayout";

// Dashboard
import NurseDashboard from "./dashboard/NurseDashboard";

// Health Services
import HealthCheckCreate from "./health-services/HealthCheckCreate";
import HealthCheckList from "./health-services/HealthCheckList";
import HealthCheckManagement from "./health-services/HealthCheckManagement";

// Health Check Pages
import NurseHealthCheck from "./health-check/NurseHealthCheck";
import NurseHealthCheckCreate from "./health-check/NurseHealthCheckCreate";
import NurseHealthCheckDetail from "./health-check/NurseHealthCheckDetail";
import HealthCheckResults from "./health-check/HealthCheckResults";
import HealthCheckLiveMonitoring from "./health-check/HealthCheckLiveMonitoring";

// Health Records
import HealthRecordsList from "./health-records/HealthRecordsList";
import HealthRecordsDetail from "./health-records/HealthRecordsDetail";

// Health Events
import HealthEventsList from "./health-events/HealthEventsList";
import HealthEventsCreate from "./health-events/HealthEventsCreate";
import HealthEventsDetail from "./health-events/HealthEventsDetail";
import HealthEventsManage from "./health-events/HealthEventsManage";

// Medication
import MedicationManagement from "./medication/MedicationManagement";
import MedicationDispense from "./medication/MedicationDispense";
import MedicationSchedule from "./medication/MedicationSchedule";
import MedicationInventory from "./medication/MedicationInventory";
import MedicationRequest from "./medication/MedicationRequest";

// Vaccination
import VaccinationSchedule from "./vaccination/VaccinationSchedule";
import VaccinationRecord from "./vaccination/VaccinationRecord";
import VaccinationManagement from "./vaccination/VaccinationManagement";
import VaccinationInventory from "./vaccination/VaccinationInventory";

// Schedule
import ScheduleManagement from "./schedule/ScheduleManagement";

// Profile
import NurseProfile from "./profile/NurseProfile";

// API Test Component
import ApiTestComponent from "./health-services/ApiTestComponent";

const NursePages = () => {
  return (
    <NurseLayout>
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<NurseDashboard />} />
        <Route path="/dashboard" element={<NurseDashboard />} />

        {/* Health Services */}
        <Route path="/health-services" element={<HealthCheckManagement />} />
        <Route path="/health-services/create" element={<HealthCheckCreate />} />
        <Route path="/health-services/list" element={<HealthCheckList />} />
        <Route
          path="/health-services/api-test"
          element={<ApiTestComponent />}
        />

        {/* Health Check */}
        <Route path="/health-check" element={<NurseHealthCheck />} />
        <Route
          path="/health-check/create"
          element={<NurseHealthCheckCreate />}
        />
        <Route path="/health-check/:id" element={<NurseHealthCheckDetail />} />
        <Route path="/health-check/results" element={<HealthCheckResults />} />
        <Route
          path="/health-check/monitoring"
          element={<HealthCheckLiveMonitoring />}
        />

        {/* Health Records */}
        <Route path="/health-records" element={<HealthRecordsList />} />
        <Route path="/health-records/:id" element={<HealthRecordsDetail />} />

        {/* Health Events */}
        <Route path="/health-events" element={<HealthEventsList />} />
        <Route path="/health-events/create" element={<HealthEventsCreate />} />
        <Route path="/health-events/:id" element={<HealthEventsDetail />} />
        <Route path="/health-events/manage" element={<HealthEventsManage />} />

        {/* Medication */}
        <Route path="/medication" element={<MedicationManagement />} />
        <Route path="/medication/dispense" element={<MedicationDispense />} />
        <Route path="/medication/schedule" element={<MedicationSchedule />} />
        <Route path="/medication/inventory" element={<MedicationInventory />} />
        <Route path="/medication/request" element={<MedicationRequest />} />

        {/* Vaccination */}
        <Route path="/vaccination" element={<VaccinationManagement />} />
        <Route path="/vaccination/schedule" element={<VaccinationSchedule />} />
        <Route path="/vaccination/record" element={<VaccinationRecord />} />
        <Route
          path="/vaccination/inventory"
          element={<VaccinationInventory />}
        />

        {/* Schedule */}
        <Route path="/schedule" element={<ScheduleManagement />} />

        {/* Profile */}
        <Route path="/profile" element={<NurseProfile />} />
      </Routes>
    </NurseLayout>
  );
};

export default NursePages;
