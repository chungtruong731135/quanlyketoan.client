/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { Popconfirm } from "antd";
import * as actionsModal from "@/setup/redux/modal/Actions";
import { requestPOST, FILE_URL, requestDELETE } from "@/utils/baseAPI";

import TableList from "@/app/components/TableList";
import ModalItem from "./ChiTietModal";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import ModalReply from "./ModalReply";
const UsersList = (props) => {
  const dispatch = useDispatch();
  const { dataSearch } = props;
  const random = useSelector((state) => state.modal.random);

  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState(10);
  const [count, setCount] = useState("");
  const [offset, setOffset] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
              isActive: false,
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
      case "tu-van":
        dispatch(actionsModal.setDataModal(item));
        setModalVisible(true);

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
      title: "Khoá học đăng ký",
      dataIndex: "courseTitle",
      key: "courseTitle",
    },

    {
      title: "Thời gian đăng ký",
      dataIndex: "timeBuyAll",
      key: "timeBuyAll",
      render: (text, record) => {
        var time =
          record?.timeBuyAll || record?.timeBuyProgram || record?.timeBuyExam;
        return <div>{time ? dayjs(time).format("DD/MM/YYYY HH:mm") : ""}</div>;
      },
    },
    {
      title: "Thông tin liên hệ",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text, record) => {
        return <div>{record?.phoneNumber || record?.email}</div>;
      },
    },
    {
      title: "Đại lý/Cộng tác viên",
      dataIndex: "distributorFullName",
      key: "distributorFullName",
      render: (text, record, index) => {
        const nameArray =
          record.distributorFullName && record.distributorFullName.length > 1
            ? record.distributorFullName.match(/\S+/g)
            : ["A"];
        const lastName = nameArray[nameArray.length - 1];
        const firstChar = lastName.charAt(0);
        let arr = ["primary", "success", "danger", "warning", "info", "muted"];
        const color = arr[index % arr.length];
        return record?.distributorFullName ? (
          <div className="d-flex align-items-center">
            <div className="symbol symbol-circle symbol-50px overflow-hidden me-3">
              <a href="#">
                {record.distributorImageUrl ? (
                  <div className="symbol-label">
                    <img
                      src={
                        record.distributorImageUrl.includes("https://") ||
                        record.distributorImageUrl.includes("http://")
                          ? record.distributorImageUrl
                          : FILE_URL +
                            `${
                              record.distributorImageUrl.startsWith("/")
                                ? record.distributorImageUrl.substring(1)
                                : record.distributorImageUrl
                            }`
                      }
                      alt={record.distributorFullName}
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
                {record?.distributorFullName}
              </a>
              <span>{record?.distributorUserName}</span>
            </div>
          </div>
        ) : (
          <></>
        );
      },
    },
    {
      title: "Trạng thái tư vấn",
      dataIndex: "isAdvised",
      key: "isAdvised",
      render: (text, record) => {
        return (
          <div
            className={`me-2 badge badge-light-${text ? "success" : "danger"}`}
          >
            {`${text ? "Đã tư vấn" : "Chưa tư vấn"}`}
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
          <div className="text-center">
            <a
              className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1"
              data-toggle="m-tooltip"
              title="Tư vấn"
              onClick={() => {
                handleButton(`tu-van`, record);
              }}
            >
              <i className="fas fa-comment-dots"></i>
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
      {modalVisible ? (
        <ModalReply
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default UsersList;
