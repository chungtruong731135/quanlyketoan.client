import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import ReportRevenuePage from "./reports/ReportRevenuePage";
import ReportPartnerPage from "./reports/ReportPartnerPage";
import ReportInvoicesPage from "./reports/ReportInvoicesPage";
import ReportExaminatsPage from "./reports/ReportExaminatsPage";
import ReportCourseOnlinePage from "./reports/ReportCourseOnlinePage";
import ReportDebtPage from "./reports/ReportDebtPage";
const GeneralPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route path="revenue" element={<ReportRevenuePage />} />
        <Route path="partner" element={<ReportPartnerPage />} />
        <Route path="invoice" element={<ReportInvoicesPage />} />
        <Route path="examinats" element={<ReportExaminatsPage />} />
        <Route path="debt" element={<ReportDebtPage />} />
        <Route path="course-online" element={<ReportCourseOnlinePage />} />
        <Route path="*" element={<Navigate to="/error/404/system" />} />
        <Route index element={<Navigate to="/system/reports/revenue" />} />
      </Route>
    </Routes>
  );
};

export default GeneralPage;
