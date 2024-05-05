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
        to="/catering/manages"
        title="Quản lý"
        icon="briefcase"
        fontIcon="bi-person"
      >
        <SidebarMenuItem
          to="/catering/manages/users"
          title="Khách hàng"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/catering/manages/items"
          title="Hàng hoá"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/catering/manages/banks"
          title="Ngân hàng"
          hasBullet={true}
        />
        <SidebarMenuItem
          to="/catering/manages/accounts"
          title="Tài khoản"
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>
    </>
  );
};

export { SidebarMenu };
