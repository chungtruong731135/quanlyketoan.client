/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { toast } from "react-toastify";
import * as actionsModal from "@/setup/redux/modal/Actions";
import { requestPOST, requestDELETE, FILE_URL } from "@/utils/baseAPI";

import TableList from "@/app/components/TableList";
import ModalItem from "./ChiTietModal";
import dayjs from "dayjs";
import CopyToClipboard from "react-copy-to-clipboard";
import ActiveCourseModal from "./ActiveCourseModal";
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
  const [modalActiveVisible, setModalActiveVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await requestPOST(
          `api/v1/sales/activationcodes/search`,
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
      case "chi-tiet":
        dispatch(actionsModal.setDataModal(item));
        dispatch(actionsModal.setModalVisible(true));

        break;

      case "delete":
        var res = await requestDELETE(`api/v1/activationcodes/${item.id}`);
        if (res) {
          toast.success("Thao tác thành công!");
          dispatch(actionsModal.setRandom());
        } else {
          toast.error("Thất bại, vui lòng thử lại!");
        }
        break;
      case "kich-hoat":
        dispatch(actionsModal.setDataModal(item));
        setModalActiveVisible(true);

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
      title: "Mã kích hoạt",
      dataIndex: "code",
      key: "code",
      render: (text) => (
        <CopyToClipboard
          text={text}
          onCopy={() => {
            toast.info(`Đã sao chép: ${text}`);
          }}
        >
          <div className="d-flex align-items-center justify-content-between btn p-0">
            <div>{text}</div>
            <i className="fas fa-copy" />
          </div>
        </CopyToClipboard>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdOn",
      key: "createdOn",
      render: (text, record) => {
        return (
          <div>
            {record?.createdOn
              ? dayjs(record?.createdOn).format("DD/MM/YYYY")
              : ""}
          </div>
        );
      },
    },

    {
      title: "Ngày hết hạn",
      dataIndex: "expireDate",
      key: "expireDate",
      render: (text, record) => {
        return (
          <div>
            {record?.expireDate
              ? dayjs(record?.expireDate).format("DD/MM/YYYY")
              : ""}
          </div>
        );
      },
    },
    {
      title: "Khoá học",
      dataIndex: "courseTitle",
      key: "courseTitle",
    },
    {
      title: "Loại mã kích hoạt",
      dataIndex: "activeType",
      key: "activeType",
      render: (text, record) => {
        return (
          <div>
            {text == 0
              ? "Toàn bộ"
              : text == 1
              ? "Chương trình học"
              : "Luyện đề thi"}
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        return (
          <div
            className={`me-2 badge badge-light-${
              text == 1
                ? "success"
                : record?.expireDate &&
                  dayjs(record?.expireDate).isBefore(
                    dayjs().format("YYYY-MM-DD")
                  )
                ? "danger"
                : "primary"
            }`}
          >
            {text == 1
              ? "Đã sử dụng"
              : record?.expireDate &&
                dayjs(record?.expireDate).isBefore(dayjs().format("YYYY-MM-DD"))
              ? "Hết hạn"
              : "Chưa sử dụng"}
          </div>
        );
      },
    },
    {
      title: "Giá gốc",
      dataIndex: "coursePrice",
      key: "coursePrice",
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
      dataIndex: "amount",
      key: "amount",
      render: (text, record, index) => (
        <>
          <div>
            {(text || 0).toLocaleString("vi", {
              style: "currency",
              currency: "VND",
            })}
          </div>
          {record.amount && record.amount > 0 ? (
            <div className={`mt-2  me-auto badge badge-light-success`}>
              {Math.round(
                ((record?.amount ?? 0) / (record?.coursePrice ?? 1)) * 100
              )}
              %
            </div>
          ) : (
            <></>
          )}
        </>
      ),
    },
    {
      title: "Học sinh",
      dataIndex: "studentFullName",
      key: "studentFullName",
      render: (text, record, index) => {
        if (!record?.studentUserName) {
          return <></>;
        }

        const nameArray =
          record.studentFullName && record.studentFullName.length > 1
            ? record.studentFullName.match(/\S+/g)
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
                  {record.studentImageUrl ? (
                    <div className="symbol-label">
                      <img
                        src={
                          record.studentImageUrl.includes("https://") ||
                          record.studentImageUrl.includes("http://")
                            ? record.studentImageUrl
                            : FILE_URL +
                              `${
                                record.studentImageUrl.startsWith("/")
                                  ? record.studentImageUrl.substring(1)
                                  : record.studentImageUrl
                              }`
                        }
                        alt={record.studentFullName}
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
                  {record?.studentFullName}
                </a>
                <span>{record?.studentUserName}</span>
              </div>
            </div>
          </>
        );
      },
    },
    {
      title: "Ngày kích hoạt",
      dataIndex: "userCourseActivationCodeCreatedOn",
      key: "userCourseActivationCodeCreatedOn",
      render: (text, record) => {
        return (
          <div>
            {record?.userCourseActivationCodeCreatedOn
              ? dayjs(record?.userCourseActivationCodeCreatedOn).format(
                  "DD/MM/YYYY HH:mm"
                )
              : ""}
          </div>
        );
      },
    },
    {
      title: "Thao tác",
      dataIndex: "",
      key: "",
      width: 100,
      render: (text, record) => {
        return (
          <div>
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
            {record?.status == 0 ? (
              <a
                className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1"
                data-toggle="m-tooltip"
                title="Kích hoạt khoá học"
                onClick={() => {
                  handleButton(`kich-hoat`, record);
                }}
              >
                <i className="fas fa-paper-plane"></i>
              </a>
            ) : (
              <></>
            )}
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
      {modalActiveVisible ? (
        <ActiveCourseModal
          modalVisible={modalActiveVisible}
          setModalVisible={setModalActiveVisible}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default UsersList;
