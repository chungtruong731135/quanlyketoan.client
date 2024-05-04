/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { Popconfirm } from "antd";
import * as actionsModal from "@/setup/redux/modal/Actions";
import {
  requestPOST,
  FILE_URL,
  requestDELETE,
  requestPUT_NEW,
} from "@/utils/baseAPI";

import TableList from "@/app/components/TableList";
import ModalItem from "./ChiTietModal";
import dayjs from "dayjs";
import { toast } from "react-toastify";

const UsersList = (props) => {
  const dispatch = useDispatch();
  const modalVisible = useSelector((state) => state.modal.modalVisible);
  const { dataSearch } = props;
  const random = useSelector((state) => state.modal.random);

  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState(10);
  const [count, setCount] = useState("");
  const [offset, setOffset] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [xulyRowKeys, setXuLyRowKeys] = useState([]);

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      var tmp = [];
      selectedRows.map((i) => tmp.push(i.activationCodeId));
      setSelectedRowKeys(selectedRowKeys);
      setXuLyRowKeys(tmp);
    },
    getCheckboxProps: (record) => ({
      disabled:
        record?.activationCodePaymentStatus == 1 ||
        record.activationCodeId == null,
    }),
  };

  const handleUpdatePaymentStatus = async (ids, status = 1) => {
    var res = await requestPUT_NEW(`api/v1/activationcodes/paymentstatus`, {
      ids: ids,
      paymentStatus: status,
    });
    if (res) {
      toast.success("Thao tác thành công!");
      setSelectedRowKeys([]);
      dispatch(actionsModal.setRandom());
    } else {
      toast.error("Thất bại, vui lòng thử lại!");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await requestPOST(
          `api/v1/usercourses/search`,
          _.assign(
            {
              pageNumber: offset,
              pageSize: size,
              isActive: true,
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
      case "chi-tiet":
        dispatch(actionsModal.setDataModal(item));
        dispatch(actionsModal.setModalVisible(true));

        break;

      case "delete":
        var res = await requestDELETE(`api/v1/usercourses/${item.id}`);
        if (res) {
          toast.success("Thao tác thành công!");
          dispatch(actionsModal.setRandom());
        } else {
          toast.error("Thất bại, vui lòng thử lại!");
        }
        break;

      case "confirm":
        handleUpdatePaymentStatus([item?.activationCodeId], 1);
        break;

      case "chuanhantien":
        handleUpdatePaymentStatus([item?.activationCodeId], 0);
        break;

      default:
        break;
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => (
        <div>{(offset - 1) * size + index + 1}</div>
      ),
    },
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
      title: "Khoá học",
      dataIndex: "courseTitle",
      key: "courseTitle",
    },

    {
      title: "Thời gian thanh toán",
      dataIndex: "timeConfirmAll",
      key: "timeConfirmAll",
      render: (text, record) => {
        var time =
          record?.timeConfirmAll ||
          record?.timeConfirmProgram ||
          record?.timeConfirmExam;
        return <div>{time ? dayjs(time).format("DD/MM/YYYY HH:mm") : ""}</div>;
      },
    },
    {
      title: "Giá gốc",
      dataIndex: "amount",
      key: "amount",
      render: (text) => (
        <div>
          {(text || 0).toLocaleString("vi", {
            style: "currency",
            currency: "VND",
          })}
        </div>
      ),
    },
    {
      title: "Giá thanh toán",
      dataIndex: "userCourseCodeAmount",
      key: "userCourseCodeAmount",
      render: (text, record, index) => {
        var coursePrice = record?.userCourseActivationCodeAmount ?? 0;
        if (record?.userCourseCodeAmount) {
          coursePrice = record?.userCourseCodeAmount ?? 0;
        }

        return (
          <>
            <div>
              {(coursePrice || 0).toLocaleString("vi", {
                style: "currency",
                currency: "VND",
              })}
            </div>
            {record.amount && record.amount > 0 ? (
              <div className={`mt-2  me-auto badge badge-light-success`}>
                {Math.round(((coursePrice ?? 0) / (record?.amount ?? 1)) * 100)}
                %
              </div>
            ) : (
              <></>
            )}
          </>
        );
      },
    },
    {
      title: "Loại thanh toán",
      dataIndex: "type",
      key: "type",
      render: (text, record) => {
        return (
          <div>
            {record?.isSpecial == true
              ? "Trường hợp đặc biệt"
              : record?.isSpecial != true &&
                record?.userCourseActivationCodeId != null
              ? `Kích hoạt qua cộng tác viên/Đại lý (${
                  record?.activationCodeCode ?? ""
                })`
              : record?.userCourseCodeId != null
              ? "Kích hoạt trực tiếp"
              : ""}
          </div>
        );
      },
    },
    {
      title: "Đại lý/Cộng tác viên",
      dataIndex: "name",
      key: "name",
      render: (text, record, index) => {
        if (record?.userCourseActivationCodeId == null) {
          return <></>;
        }
        const nameArray =
          record.retailerFullName && record.retailerFullName.length > 1
            ? record.retailerFullName.match(/\S+/g)
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
                  {record.retailerImageUrl ? (
                    <div className="symbol-label">
                      <img
                        src={
                          record.retailerImageUrl.includes("https://") ||
                          record.retailerImageUrl.includes("http://")
                            ? record.retailerImageUrl
                            : FILE_URL +
                              `${
                                record.retailerImageUrl.startsWith("/")
                                  ? record.retailerImageUrl.substring(1)
                                  : record.retailerImageUrl
                              }`
                        }
                        alt={record.retailerFullName}
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
                  {record?.retailerFullName}
                </a>
                <span>{record?.retailerUserName}</span>
              </div>
            </div>
          </>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        return (
          <div className="d-flex flex-column ">
            {record?.userCourseActivationCodeId != null ? (
              <div
                className={`mt-2  me-auto badge badge-light-${
                  record?.activationCodePaymentStatus == 1
                    ? "success"
                    : "danger"
                }`}
              >
                {record?.activationCodePaymentStatus == 1
                  ? "Đã nhận tiền"
                  : "Chưa nhận tiền"}
              </div>
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
    {
      title: "Thao tác",
      dataIndex: "",
      key: "",
      width: 80,
      render: (text, record) => {
        return (
          <div>
            {record?.activationCodePaymentStatus != 1 &&
            record.activationCodeId != null ? (
              <Popconfirm
                title="Xác nhận đã nhận tiền?"
                onConfirm={() => {
                  handleButton(`confirm`, record);
                }}
                okText="Xác nhận"
                cancelText="Huỷ"
              >
                <a
                  className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1 mb-1"
                  data-toggle="m-tooltip"
                  title="Đã nhận tiền"
                >
                  <i className="fas fa-money-check-alt"></i>
                </a>
              </Popconfirm>
            ) : (
              <></>
            )}
            {record?.activationCodePaymentStatus == 1 &&
            record.activationCodeId != null ? (
              <Popconfirm
                title="Xác nhận chưa nhận tiền?"
                onConfirm={() => {
                  handleButton(`chuanhantien`, record);
                }}
                okText="Xác nhận"
                cancelText="Huỷ"
              >
                <a
                  className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1 mb-1"
                  data-toggle="m-tooltip"
                  title="Chưa nhận tiền"
                >
                  <i className="fas fa-rotate-left"></i>
                </a>
              </Popconfirm>
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
  ];
  return (
    <>
      <div className="card-body card-dashboard px-3 py-3">
        <div className="d-flex align-items-center flex-grow-1 my-3">
          {(selectedRowKeys || [])?.length > 0 && (
            <>
              <span className="me-2">Đã chọn</span>
              <span className="fw-bold me-10">
                {(selectedRowKeys || [])?.length}
              </span>
              <span
                className="fw-bold me-10 text-info cursor-pointer"
                onClick={() => {
                  setSelectedRowKeys([]);
                }}
              >
                Bỏ chọn
              </span>
              <Popconfirm
                title="Bạn có chắc chắn xác nhận đã nhận tiền?"
                onConfirm={() => {
                  handleUpdatePaymentStatus(xulyRowKeys);
                }}
                okText="Xác nhận"
                cancelText="Huỷ"
              >
                <a
                  type="button"
                  className="btn btn-success btn-sm m-btn m-btn--icon py-2 me-2"
                >
                  <span>
                    <i className="fas fa-check me-2"></i>
                    <span className="">Đã nhận tiền</span>
                  </span>
                </a>
              </Popconfirm>
            </>
          )}
        </div>
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
            rowSelection={rowSelection}
          />
        </div>
      </div>
      {modalVisible ? <ModalItem /> : <></>}
    </>
  );
};

export default UsersList;
