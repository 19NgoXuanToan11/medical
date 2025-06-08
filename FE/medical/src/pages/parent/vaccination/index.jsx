import { Routes, Route, Navigate } from "react-router-dom";
import VaccinationHistory from "./VaccinationHistory";
import UpcomingVaccination from "./UpcomingVaccination";
import VaccinationConsent from "./VaccinationConsent";

const VaccinationIndex = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="upcoming" replace />} />
      <Route path="upcoming" element={<UpcomingVaccination />} />
      <Route path="history" element={<VaccinationHistory />} />
      <Route path="consent/:id" element={<VaccinationConsent />} />
      <Route path="consent/new" element={<VaccinationConsent />} />
    </Routes>
  );
};

export default VaccinationIndex;

// Also export individual components for direct import
export { VaccinationHistory, UpcomingVaccination };
