/* eslint-disable react/jsx-no-target-blank */
import React from "react";
import { useIntl } from "react-intl";
import { SidebarMenuItemWithSub } from "@/_metronic/layout/components/sidebar/sidebar-menu/SidebarMenuItemWithSub";
import { SidebarMenuItem } from "@/_metronic/layout/components/sidebar/sidebar-menu/SidebarMenuItem";
import { useAuth } from "@/app/modules/auth";
import { CheckRole } from "@/utils/utils";

const SidebarMenu = () => {
  const intl = useIntl();
  const { currentUser } = useAuth();
  const currentPermissions = currentUser?.permissions;
  const type = currentUser?.type;

  return (
    <>
      <SidebarMenuItem to="/catering/home" title="Trang chủ" hasBullet={true} />
      <SidebarMenuItemWithSub
        to="/catering/systems"
        title="Suất ăn"
        icon="briefcase"
        fontIcon="bi-person"
      >
        <SidebarMenuItem
          to="/catering/systems/mealtime"
          title="Ca ăn"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/catering/systems/menufood"
          title="Thực đơn"
          hasBullet={true}
        />
        {/* <SidebarMenuItem
          to="/catering/systems/menufooditem"
          title="Món ăn"
          hasBullet={true}
        /> */}
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to="/catering/manages"
        title="Quản lý"
        icon="briefcase"
        fontIcon="bi-person"
      >
        <SidebarMenuItem
          to="/catering/manages/jobposition"
          title="Chức vụ"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/catering/manages/organization"
          title="Bộ phận"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/catering/manages/users"
          title="Người dùng"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/catering/manages/lanes"
          title="Làn"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/catering/manages/devices"
          title="Thiết bị"
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub
        to="/catering/statics"
        title="Báo cáo"
        icon="briefcase"
        fontIcon="bi-person"
      >
        <SidebarMenuItem
          to="/catering/statics/registratings"
          title="Danh sách đăng ký"
          hasBullet={true}
        />

        <SidebarMenuItem
          to="/catering/statics/registrationreports"
          title="Báo cáo lượt đăng ký"
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>
    </>
  );
};

export { SidebarMenu };
