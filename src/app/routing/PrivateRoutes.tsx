import { lazy, FC, Suspense, useEffect } from "react";

import { Route, Routes, Navigate } from "react-router-dom";
import { MasterLayout } from "../../_metronic/layout/MasterLayout";
import TopBarProgress from "react-topbar-progress-indicator";
import { getCSSVariableValue } from "../../_metronic/assets/ts/_utils";
import { WithChildren } from "../../_metronic/helpers";

import * as actionsGlobal from "@/setup/redux/global/Actions";
import * as authHelper from "@/app/modules/auth/core/AuthHelpers";
import { useAppDispatch } from "@/setup/redux/Hook";

import { SidebarMenu as SidebarMenuSystem } from "@/app/components/sidebar-menu/SidebarMenuSystem";

import { MenuInner as MenuInnerSystem } from "@/app/components/header-menus/MenuInner";

const PrivateRoutes = () => {
  const CateringsPage = lazy(() => import("../pages/caterings/CateringsPage"));
  const token = authHelper.getAuth()?.token;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token) {
      dispatch(actionsGlobal.listenNotifications(token));
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <Routes>
      <Route path="auth/*" element={<Navigate to="/catering/dashboard" />} />
      <Route
        path="catering/*"
        element={
          <MasterLayout
            asideMenu={<SidebarMenuSystem />}
            menuInner={<MenuInnerSystem />}
          />
        }
      >
        <Route
          path="*"
          element={
            <SuspensedView>
              <CateringsPage />
            </SuspensedView>
          }
        />
      </Route>
      {/* <Route path="*" element={<Navigate to="/error/404" />} /> */}
    </Routes>
  );
};

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue("--bs-primary");
  TopBarProgress.config({
    barColors: {
      "0": baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  });
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
};

export { PrivateRoutes };
