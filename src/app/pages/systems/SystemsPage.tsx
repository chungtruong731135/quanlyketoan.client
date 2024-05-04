import { Navigate, Route, Routes, Outlet } from "react-router-dom";

import DashboardWrapper from "./dashboard/DashboardWrapper";
import CateringsPage from "../caterings/CateringsPage";

const SystemsPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route path="dashboard" element={<DashboardWrapper />} />

        <Route element={<Outlet />}>
          <Route
            path="manages/*"
            element={
              <>
                <CateringsPage />
              </>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/error/404/system" />} />

        <Route index element={<Navigate to="/catering/dashboard" />} />
      </Route>
    </Routes>
  );
};

export default SystemsPage;
