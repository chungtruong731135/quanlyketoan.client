/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { Popconfirm, Dropdown, Menu } from "antd";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import clsx from "clsx";
import * as actionsModal from "@/setup/redux/modal/Actions";
import {
  requestPOST,
  requestDELETE,
  FILE_URL,
  requestPOST_NEW,
} from "@/utils/baseAPI";
import { toAbsoluteUrl } from "@/utils/AssetHelpers";

import TableList from "@/app/components/TableList";
import ModalItem from "./ChiTietModal";
import ModalResetPass from "./ModalResetPass";
const UsersList = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const modalVisible = useSelector((state) => state.modal.modalVisible);
  const dataSearch = props?.dataSearch;
  const random = useSelector((state) => state.modal.random);

  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState(10);
  const [count, setCount] = useState("");
  const [offset, setOffset] = useState(1);
  const [modalResetPassVisible, setModalResetPassVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await requestPOST(
          `api/users/search`,
          _.assign(
            {
              pageNumber: offset,
              pageSize: size,
              orderBy: ["createdOn DESC"],
            },
            dataSearch
          )
        );
        setDataTable(res?.data ?? []);
        setCount(res?.totalCount ?? 0);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    if (refreshing) {
      fetchData();
      setRefreshing(false);
    }
    return () => {};
  }, [refreshing]);
  useEffect(() => {
    if (!refreshing) {
      setRefreshing(true);
    }
    return () => {};
  }, [offset, size, dataSearch, random]);
  useEffect(() => {
    setOffset(1);
    return () => {};
  }, [dataSearch]);

  const handleButton = async (type, item) => {
    switch (type) {
      case "delete":
        var res = await requestDELETE(`api/users/${item?.id}`);
        if (res) {
          toast.success("Thao tác thành công!");
          dispatch(actionsModal.setRandom());
        } else {
          toast.error("Thất bại, vui lòng thử lại!");
        }
        break;
      case "change-parent":
        var res = await requestPOST_NEW(`api/users/${item?.id}/change-type`, {
          type: 2,
          userId: item?.id,
        });
        if (res?.status == 200) {
          toast.success("Thao tác thành công!");
          dispatch(actionsModal.setRandom());
        } else {
          toast.error("Thất bại, vui lòng thử lại!");
        }
        break;
      case "change-student":
        var res = await requestPOST_NEW(`api/users/${item?.id}/change-type`, {
          type: 1,
          userId: item?.id,
        });
        if (res?.status == 200) {
          toast.success("Thao tác thành công!");
          dispatch(actionsModal.setRandom());
        } else {
          toast.error("Thất bại, vui lòng thử lại!");
        }
        break;
      case "edit-employee":
        dispatch(actionsModal.setDataModal(item));
        dispatch(actionsModal.setModalVisible(true));
        break;
      case "reset-pass":
        dispatch(actionsModal.setDataModal({ userName: item?.userName }));
        setModalResetPassVisible(true);
        break;

      default:
        break;
    }
  };

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      render: (text, record, index) => {
        const nameArray =
          record.fullName && record.fullName.length > 1
            ? record.fullName.match(/\S+/g)
            : ["A"];
        const lastName = nameArray[nameArray.length - 1];
        const firstChar = lastName.charAt(0);
        let arr = ["primary", "success", "danger", "warning", "info", "muted"];
        const color = arr[index % arr.length];
        return (
          <>
            <div className="d-flex align-items-center">
              {/* begin:: Avatar */}
              <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
                <a href="#">
                  {record.imageUrl ? (
                    <div className="symbol-label">
                      <img
                        src={
                          record.imageUrl.includes("https://") ||
                          record.imageUrl.includes("http://")
                            ? record.imageUrl
                            : FILE_URL +
                              `${
                                record.imageUrl.startsWith("/")
                                  ? record.imageUrl.substring(1)
                                  : record.imageUrl
                              }`
                        }
                        alt={record.fullName}
                        className="w-100"
                      />
                    </div>
                  ) : (
                    <div
                      className={`symbol-label fs-3 bg-light-${color} text-${color}`}
                    >
                      {` ${firstChar.toUpperCase()} `}
                    </div>
                  )}
                </a>
              </div>
              <div className="d-flex flex-column">
                <a
                  href="#"
                  className="text-gray-800 text-hover-primary mb-1 fw-bolder"
                >
                  {record?.fullName}
                </a>
                <span>{record?.userName}</span>
              </div>
            </div>
          </>
        );
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Ngày tham gia",
      dataIndex: "createdOn",
      key: "createdOn",
    },

    {
      title:
        dataSearch?.type == 4 || dataSearch?.type == 5
          ? "Mã giới thiệu cá nhân"
          : "Mã giới thiệu",
      dataIndex: "code",
      key: "code",
      render: (text, record) => (
        <div>
          {dataSearch?.type == 4 || dataSearch?.type == 5
            ? record?.myRefCode
            : record?.refCode}
        </div>
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "",
      key: "",
      width: 150,
      render: (text, record) => {
        return (
          <div>
            <a
              className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1"
              data-toggle="m-tooltip"
              title="Sửa thông tin"
              onClick={() => {
                handleButton(`edit-employee`, record);
              }}
            >
              <i className="fa fa-eye"></i>
            </a>

            {/* <Popconfirm
              title="Xoá?"
              onConfirm={() => {
                handleButton(`delete`, record);
              }}
              okText="Xoá"
              cancelText="Huỷ"
            >
              <a
                className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1 mb-1"
                data-toggle="m-tooltip"
                title="Xoá"
              >
                <i className="fa fa-trash"></i>
              </a>
            </Popconfirm> */}
            <Dropdown
              trigger={"click"}
              menu={{
                items: [
                  {
                    key: "reset-pass",
                    disabled: false,
                    label: (
                      <a
                        className="p-2 text-dark"
                        data-toggle="m-tooltip"
                        title="Khôi phục mật khẩu"
                        onClick={() => {
                          handleButton(`reset-pass`, record);
                        }}
                      >
                        <i className="fas fa-lock me-2"></i>
                        Khôi phục mật khẩu
                      </a>
                    ),
                  },
                  dataSearch?.type == 1
                    ? {
                        key: "change-parent",
                        disabled: false,
                        label: (
                          <a
                            className="p-2 text-dark"
                            data-toggle="m-tooltip"
                            title="Chuyển sang tài khoản phụ huynh"
                            onClick={() => {
                              handleButton(`change-parent`, record);
                            }}
                          >
                            <i className="fas fa-user-cog me-2"></i>
                            Chuyển sang tài khoản phụ huynh
                          </a>
                        ),
                      }
                    : null,
                  dataSearch?.type == 2
                    ? {
                        key: "change-student",
                        disabled: false,
                        label: (
                          <a
                            className="p-2 text-dark"
                            data-toggle="m-tooltip"
                            title="Chuyển sang tài khoản học sinh"
                            onClick={() => {
                              handleButton(`change-student`, record);
                            }}
                          >
                            <i className="fas fa-user-cog me-2"></i>
                            Chuyển sang tài khoản học sinh
                          </a>
                        ),
                      }
                    : null,
                ],
              }}
            >
              <a
                className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1"
                title="Thao tác nhanh"
              >
                <i className="fa fa-ellipsis-h"></i>
              </a>
            </Dropdown>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <div className="card-body card-dashboard px-3 py-3">
        <div className="card-dashboard-body table-responsive">
          <TableList
            dataTable={dataTable}
            columns={columns}
            isPagination={true}
            size={size}
            count={count}
            offset={offset}
            setOffset={setOffset}
            setSize={setSize}
            loading={loading}
          />
        </div>
      </div>
      {modalVisible ? <ModalItem /> : <></>}
      {modalResetPassVisible ? (
        <ModalResetPass
          modalVisible={modalResetPassVisible}
          setModalVisible={setModalResetPassVisible}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default UsersList;
