import { Navigate, Route, Routes, Outlet } from "react-router-dom";

import JobLevel from "./manages/joblevels/JobLevelsPage";
import Organizations from "./manages/organizations/OrganizationsPage";
import Users from "./manages/users/UsersPage";
import Devices from "./manages/devices/DevicesPage";
import Lanes from "./manages/lanes/LanesPage";

const GeneralPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route path="jobposition" element={<JobLevel />} />
        <Route path="organization" element={<Organizations />} />
        <Route path="users" element={<Users />} />
        <Route path="devices" element={<Devices />} />
        <Route path="lanes" element={<Lanes />} />
      </Route>
    </Routes>
  );
};

export default GeneralPage;
