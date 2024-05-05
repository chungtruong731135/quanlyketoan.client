import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../app/modules/auth";
import { Languages } from "./Languages";
import { toAbsoluteUrl } from "../../../helpers";
import TenantSelectModal from "@/app/components/TenantSelectModal";
import ChangePasswordModal from "./ChangePasswordModal";
import { FILE_URL } from "@/utils/baseAPI";
const HeaderUserMenu = () => {
  const { currentUser, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalChangePassVisible, setModalChangePassVisible] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <div
        className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px"
        data-kt-menu="true"
      >
        <div className="menu-item px-3">
          <div className="menu-content d-flex align-items-center px-3">
            <div className="symbol symbol-50px me-5">
              <img
                alt="Logo"
                src={
                  currentUser?.imageUrl
                    ? `${toAbsoluteUrl(FILE_URL + currentUser?.imageUrl)}`
                    : toAbsoluteUrl("/media/avatars/blank.png")
                }
              />
            </div>
            <div className="d-flex flex-column">
              <span className="menu-title ">
                {currentUser?.fullName ||
                  currentUser?.firstName + " " + currentUser?.lastName}
              </span>
              <span className="text-gray-500">
                {currentUser?.userName ?? ""}
              </span>
            </div>
          </div>
        </div>

        <div className="separator my-2"></div>

        {/* <div
          className="menu-item px-5 "
          onClick={() => {
            setModalVisible(true);
          }}
        >
          <span className="menu-link px-5 border-gray-200 border-dashed">
            <span className="menu-title ">{currentUser?.tenantName ?? ""}</span>
            <i className="fa fa-chevron-right "></i>
          </span>
        </div> */}
        <div className="menu-item px-5">
          <a
            className="menu-link px-5"
            onClick={() => {
            }}
          >
            <span className="menu-text">Thông tin cá nhân</span>
            {/* <span className="menu-badge">
            <span className="badge badge-light-danger badge-circle fw-bolder fs-7">
              3
            </span>
          </span> */}
          </a>
        </div>

        <div className="menu-item px-5">
          <a
            className="menu-link px-5"
            onClick={() => setModalChangePassVisible(true)}
          >
            <span className="menu-text">Đổi mật khẩu</span>
            {/* <span className="menu-badge">
            <span className="badge badge-light-danger badge-circle fw-bolder fs-7">
              3
            </span>
          </span> */}
          </a>
        </div>

        {/* <div className="menu-item px-5">
          <a href="#" className="menu-link px-5">
            Thiết lập bảo mật
          </a>
        </div>

        <div className="separator my-2"></div>

        <Languages /> */}

        <div className="menu-item px-5">
          <a onClick={logout} className="menu-link px-5">
            Đăng xuất
          </a>
        </div>
      </div>
      {modalVisible && (
        <TenantSelectModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          dataModal={{
            name: currentUser?.tenantName,
            id: currentUser?.tenantId,
          }}
        />
      )}
      {modalChangePassVisible ? (
        <ChangePasswordModal
          modalVisible={modalChangePassVisible}
          setModalVisible={setModalChangePassVisible}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export { HeaderUserMenu };
