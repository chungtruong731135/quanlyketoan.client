/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { Popconfirm } from "antd";
import { toast } from "react-toastify";
import clsx from "clsx";
import * as actionsModal from "@/setup/redux/modal/Actions";
import { requestPOST, requestDELETE } from "@/utils/baseAPI";

import TableList from "@/app/components/TableList";
import ModalItem from "./ChiTietModal";
import { useNavigate, createSearchParams } from "react-router-dom";

const UsersList = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const modalVisible = useSelector((state) => state.modal.modalVisible);
  const { dataSearch } = props;
  const random = useSelector((state) => state.modal.random);

  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState(10);
  const [count, setCount] = useState("");
  const [offset, setOffset] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await requestPOST(
          `api/v1/exams/search`,
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
    fetchData();

    return () => {};
  }, [offset, size, dataSearch, random]);
  // useEffect(() => {
  //   setOffset(1);

  //   return () => {};
  // }, [dataSearch]);

  const handleButton = async (type, item) => {
    switch (type) {
      case "chi-tiet":
        dispatch(actionsModal.setDataModal(item));
        dispatch(actionsModal.setModalVisible(true));

        break;
      case "content":
        var params = {
          examId: item?.id,
        };
        navigate({
          pathname: "detail",
          search: `?${createSearchParams(params)}`,
        });

        break;
      case "result":
        var params = {
          examId: item?.id,
        };
        navigate({
          pathname: "result",
          search: `?${createSearchParams(params)}`,
        });

        break;
      case "delete":
        var res = await requestDELETE(`api/v1/exams/${item.id}`);
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
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => (
        <div>{(offset - 1) * size + index + 1}</div>
      ),
    },
    {
      title: "Thuộc kỳ thi",
      dataIndex: "examinatTitle",
      key: "examinatTitle",
    },
    {
      title: "Tên đề thi",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Cấp độ",
      dataIndex: "examAreaName",
      key: "examAreaName",
    },
    {
      title: "Thời gian thi (Phút)",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Tổng số câu hỏi",
      dataIndex: "totalQuestion",
      key: "totalQuestion",
    },
    {
      title: "Tổng điểm",
      dataIndex: "totalScore",
      key: "totalScore",
    },
    {
      title: "Trạng thái",
      dataIndex: "isFree",
      key: "isFree",
      width: 200,
      render: (text, record) => {
        return (
          <>
            <div
              className={`me-2 badge badge-light-${
                record?.isFree ? "success" : "danger"
              }`}
            >
              {`${record?.isFree ? "Miễn phí" : "Tính phí"}`}
            </div>
            <div
              className={`badge badge-light-${
                record?.isActive ? "info" : "danger"
              }`}
            >
              {`${record?.isActive ? "Hoạt động" : "Không hoạt động"}`}
            </div>
          </>
        );
      },
    },
    {
      title: "",
      dataIndex: "result",
      key: "result",
      render: (text, record) => (
        <a
          className="btn btn-info btn-sm py-2"
          onClick={() => {
            handleButton(`result`, record);
          }}
        >
          Kết quả
        </a>
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
            <a
              className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1"
              data-toggle="m-tooltip"
              title="Xem nội dung"
              onClick={() => {
                handleButton(`content`, record);
              }}
            >
              <i className="fa fa-clipboard-list"></i>
            </a>
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
