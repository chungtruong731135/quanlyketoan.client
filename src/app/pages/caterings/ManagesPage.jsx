import { Navigate, Route, Routes, Outlet } from "react-router-dom";

import Banks from "./manages/banks/BanksPage";
import Items from "./manages/items/ItemsPage";
import Users from "./manages/users/UsersPage";
import Accounts from "./manages/accounts/AccountsPage";

const GeneralPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route path="users" element={<Users />} />
        <Route path="items" element={<Items />} />
        <Route path="banks" element={<Banks />} />
        <Route path="accounts" element={<Accounts />} />
      </Route>
    </Routes>
  );
};

export default GeneralPage;
