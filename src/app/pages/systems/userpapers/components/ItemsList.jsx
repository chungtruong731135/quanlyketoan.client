/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { Dropdown, Popconfirm } from "antd";
import { toast } from "react-toastify";
import clsx from "clsx";
import * as actionsModal from "@/setup/redux/modal/Actions";
import { requestPOST, requestDELETE } from "@/utils/baseAPI";

import TableList from "@/app/components/TableList";
import ModalItem from "./ChiTietModal";
import { useNavigate, createSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import ModalReply from "./ModalReply";
import ModalSendToAdvised from "./ModalSendToAdvised";
const UsersList = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const modalVisible = useSelector((state) => state.modal.modalVisible);
  const { dataSearch } = props;
  const random = useSelector((state) => state.modal.random);

  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [size, setSize] = useState(10);
  const [count, setCount] = useState("");
  const [offset, setOffset] = useState(1);
  const [modalReplyVisible, setModalReplyVisible] = useState(false);
  const [modalSendVisible, setModalSendVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await requestPOST(
          `api/v1/userpapers/search`,
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
  const handleButton = async (type, item) => {
    switch (type) {
      case "chi-tiet":
        dispatch(actionsModal.setDataModal(item));
        dispatch(actionsModal.setModalVisible(true));

        break;
      case "tu-van":
        dispatch(actionsModal.setDataModal(item));
        setModalReplyVisible(true);

        break;
      case "chuyen-xu-ly":
        dispatch(actionsModal.setDataModal(item));
        setModalSendVisible(true);

        break;
      case "delete":
        var res = await requestDELETE(`api/v1/userpapers/${item.id}`);
        if (res) {
          toast.success("Thao tác thành công!");
          dispatch(actionsModal.setRandom());
        } else {
          toast.error("Thất bại, vui lòng thử lại!");
        }
        break;
      case "XoaVanBan":
        //handleXoaVanBan(item);
        break;

      default:
        break;
    }
  };

  const columns = [
    // {
    //   title: "STT",
    //   dataIndex: "index",
    //   key: "index",
    //   render: (text, record, index) => (
    //     <div>{(offset - 1) * size + index + 1}</div>
    //   ),
    // },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    // {
    //   title: "Khối lớp",
    //   dataIndex: "gradeName",
    //   key: "gradeName",
    // },
    // {
    //   title: "Kỳ thi",
    //   dataIndex: "examinatName",
    //   key: "examinatName",
    // },

    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Thời gian đăng ký",
      dataIndex: "createdOn",
      key: "createdOn",
      render: (text) => (
        <div>{text ? dayjs(text).format("DD/MM/YYYY HH:mm") : ""}</div>
      ),
    },
    {
      title: "Trạng thái tư vấn",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        return (
          <div
            className={`me-2 badge badge-light-${
              text == 0
                ? "info"
                : text == 1
                ? "success"
                : text == 2
                ? "primary"
                : "danger"
            }`}
          >
            {`${
              text == 0
                ? "Đã chuyển tư vấn"
                : text == 1
                ? "Đã tư vấn"
                : text == 2
                ? "Đang tư vấn"
                : "Chờ tư vấn"
            }`}
          </div>
        );
      },
    },
    {
      title: "Thao tác",
      dataIndex: "",
      key: "",
      width: 150,
      render: (text, record) => {
        return (
          <div className="text-center">
            <a
              className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1"
              data-toggle="m-tooltip"
              title="Xem chi tiết/Sửa"
              onClick={() => {
                handleButton(`chi-tiet`, record);
              }}
            >
              <i className="fa fa-eye"></i>
            </a>

            <Popconfirm
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
            </Popconfirm>
            <Dropdown
              trigger={"click"}
              menu={{
                items: [
                  {
                    key: "tu-van",
                    disabled: false,
                    label: (
                      <a
                        className="e-1 p-2 text-dark"
                        onClick={() => {
                          handleButton(`tu-van`, record);
                        }}
                      >
                        <i className={`fas fa-comment-dots me-2`}></i>
                        {`Tư vấn`}
                      </a>
                    ),
                  },
                  record?.status == null || record?.status == -1
                    ? {
                        key: "chuyen-xu-ly",
                        disabled: false,
                        label: (
                          <a
                            className="e-1 p-2 text-dark"
                            onClick={() => {
                              handleButton(`chuyen-xu-ly`, record);
                            }}
                          >
                            <i className={`fas fa-paper-plane me-2`}></i>
                            {`Chuyển xử lý`}
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
      {modalReplyVisible ? (
        <ModalReply
          modalVisible={modalReplyVisible}
          setModalVisible={setModalReplyVisible}
        />
      ) : (
        <></>
      )}
      {modalSendVisible ? (
        <ModalSendToAdvised
          modalVisible={modalSendVisible}
          setModalVisible={setModalSendVisible}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default UsersList;
