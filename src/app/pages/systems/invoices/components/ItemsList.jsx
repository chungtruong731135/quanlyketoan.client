/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { Popconfirm } from "antd";
import { toast } from "react-toastify";
import clsx from "clsx";
import * as actionsModal from "@/setup/redux/modal/Actions";
import { requestPOST, requestDELETE, FILE_URL } from "@/utils/baseAPI";

import TableList from "@/app/components/TableList";
import ModalItem from "./ChiTietModal";
import dayjs from "dayjs";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await requestPOST(
          `api/v1/distributorinvoices/search`,
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
        var res = await requestDELETE(`api/v1/feedbacks/${item.id}`);
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
      width: 60,
      render: (text, record, index) => (
        <div>{(offset - 1) * size + index + 1}</div>
      ),
    },
    {
      title: "Cộng tác viên/Đại lý",
      dataIndex: "name",
      key: "name",
      render: (text, record, index) => {
        return record?.type == 2 ? (
          <div>null</div>
        ) : (
          <div className="d-flex flex-column">
            <span className="text-gray-800 text-hover-primary mb-1 fw-bolder">
              {record?.fullName}
            </span>
            <span>{record?.userName}</span>
          </div>
        );
      },
    },
    {
      title: "Loại tài khoản",
      dataIndex: "type",
      key: "type",
      render: (text) => (
        <div>{text == 0 ? "Đại lý" : text == 1 ? "Cộng tác viên" : "Khác"}</div>
      ),
    },

    {
      title: "Người thu tiền",
      dataIndex: "collectorFullName",
      key: "collectorFullName",
      render: (text, record, index) => {
        return (
          <div className="d-flex flex-column">
            <span className="text-gray-800 text-hover-primary mb-1 fw-bolder">
              {record?.collectorFullName}
            </span>
            <span>{record?.collectorUserName}</span>
          </div>
        );
      },
    },
    {
      title: "Loại khoá học",
      dataIndex: "courseType",
      key: "courseType",
      render: (text) => (
        <div>
          {text == 0
            ? "Khóa học online web"
            : text == 1
            ? "Khóa học online zoom"
            : "Khóa học offline"}
        </div>
      ),
    },
    {
      title: "Số tiền",
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
      title: "Thời gian",
      dataIndex: "paymentDate",
      key: "paymentDate",
      render: (text) => (
        <div>{text ? dayjs(text).format("DD/MM/YYYY HH:mm") : ""}</div>
      ),
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
    </>
  );
};

export default UsersList;
