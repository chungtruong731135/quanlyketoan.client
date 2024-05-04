import { Navigate, Route, Routes, Outlet } from "react-router-dom";

import MealTime from "./systems/mealtimes/MealTimesPage";
import MenuFood from "./systems/menufoods/MenuFoodsPage";

const GeneralPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route path="mealtime" element={<MealTime />} />
      </Route>
      <Route element={<Outlet />}>
        <Route path="menufood" element={<MenuFood />} />
      </Route>
    </Routes>
  );
};

export default GeneralPage;
