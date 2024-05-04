import { Navigate, Route, Routes, Outlet } from "react-router-dom";

import ManagesPage from "./ManagesPage";
import SystemsPage from "./SystemsPage";
import StaticsPage from "./StaticsPage";

const CateringsPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route element={<Outlet />}>
          <Route
            path="manages/*"
            element={
              <>
                <ManagesPage />
              </>
            }
          />
        </Route>
        <Route element={<Outlet />}>
          <Route
            path="systems/*"
            element={
              <>
                <SystemsPage />
              </>
            }
          />
        </Route>

        <Route element={<Outlet />}>
          <Route
            path="statics/*"
            element={
              <>
                <StaticsPage />
              </>
            }
          />
        </Route>
        {/* <Route path="*" element={<Navigate to="/error/404/system" />} /> */}
        <Route index element={<Navigate to="/catering/home" />} />
      </Route>
    </Routes>
  );
};

export default CateringsPage;
