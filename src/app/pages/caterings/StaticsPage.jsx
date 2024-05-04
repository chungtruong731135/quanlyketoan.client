import { Navigate, Route, Routes, Outlet } from "react-router-dom";

import RegistratingPage from "./statics/registratings/RegistratingPage";
import RegistrationReportPage from "./statics/registrationreports/RegistrationReportPage";

const GeneralPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route path="registratings" element={<RegistratingPage />} />
        <Route
          path="registrationreports"
          element={<RegistrationReportPage />}
        />
      </Route>
    </Routes>
  );
};

export default GeneralPage;
