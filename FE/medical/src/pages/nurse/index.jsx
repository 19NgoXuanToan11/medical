import React from "react";
import { Routes, Route } from "react-router-dom";
import NurseLayout from "../../components/layout/nurse/NurseLayout";

// Dashboard
import NurseDashboard from "./dashboard/NurseDashboard";

// Health Services
import HealthCheckCreate from "./health-services/HealthCheckCreate";
import HealthCheckList from "./health-services/HealthCheckList";
import HealthCheckManagement from "./health-services/HealthCheckManagement";
import HealthServicesDetail from "./health-services/HealthServicesDetail";

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

// Schedule
import ScheduleManagement from "./schedule/ScheduleManagement";

// Profile
import NurseProfile from "./profile/NurseProfile";

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
        <Route path="/health-services/edit/:id" element={<HealthCheckCreate />} />
        <Route path="/health-services/:id" element={<HealthServicesDetail />} />

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

        {/* Schedule */}
        <Route path="/schedule" element={<ScheduleManagement />} />

        {/* Profile */}
        <Route path="/profile" element={<NurseProfile />} />
      </Routes>
    </NurseLayout>
  );
};

export default NursePages;
