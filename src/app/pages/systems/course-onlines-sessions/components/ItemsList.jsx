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
import ModalAttendances from "./ModalAttendances";
import ModalUpdateFile from "./ModalUpdateFile";
import ModalUpdateVideo from "./ModalUpdateVideo";
import ModalUpdateAssignment from "./ModalUpdateAssignment";
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
  const [refreshing, setRefreshing] = useState(false);
  const [modalUserVisible, setModalUserVisible] = useState(false);
  const [modalUpdateFile, setModalUpdateFile] = useState(false);
  const [modalUpdateVideo, setModalUpdateVideo] = useState(false);
  const [modalUpdateAssignment, setModalUpdateAssignment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await requestPOST(
          `api/v1/classsessions/search`,
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
      case "attendance":
        dispatch(
          actionsModal.setDataModal({
            courseClassId: item?.courseClassId,
            classSessionId: item?.id,
          })
        );
        setModalUserVisible(true);
        break;

      case "assignment":
        var params = {
          classSessionId: item?.id,
        };
        navigate({
          pathname: "assignments",
          search: `?${createSearchParams(params)}`,
        });

        break;
      case "update-file":
        dispatch(actionsModal.setDataModal(item));
        setModalUpdateFile(true);
        break;
      case "update-video":
        dispatch(actionsModal.setDataModal(item));
        setModalUpdateVideo(true);
        break;
      case "update-assignment":
        dispatch(actionsModal.setDataModal(item));
        setModalUpdateAssignment(true);
        break;
      case "delete":
        var res = await requestDELETE(`api/v1/classsessions/${item.id}`);
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
      title: "Tên ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Lớp học",
      dataIndex: "courseClassName",
      key: "courseClassName",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "startTime",
      key: "startTime",
      render: (text) => (
        <div>{text ? dayjs(text).format("DD/MM/YYYY HH:mm") : ""}</div>
      ),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "endTime",
      key: "endTime",
      render: (text) => (
        <div>{text ? dayjs(text).format("DD/MM/YYYY HH:mm") : ""}</div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        var check = dayjs(record?.startTime).isAfter(
          dayjs().format("YYYY-MM-DD HH:mm")
        )
          ? 0
          : dayjs(record?.endTime).isBefore(dayjs().format("YYYY-MM-DD HH:mm"))
          ? 2
          : 1;
        return (
          <div
            className={`me-2 badge badge-light-${
              check == 0 ? "info" : check == 2 ? "danger" : "success"
            }`}
          >
            {check == 0
              ? "Chưa diễn ra"
              : check == 2
              ? "Đã kết thúc"
              : "Đang diễn ra"}
          </div>
        );
      },
    },

    {
      title: "Thao tác",
      dataIndex: "",
      key: "",
      width: 120,
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
              <i className="fas fa-eye"></i>
            </a>

            <Dropdown
              trigger={"click"}
              menu={{
                items: [
                  props?.type == 3
                    ? null
                    : {
                        key: "delete",
                        disabled: false,
                        label: (
                          <Popconfirm
                            title="Xoá?"
                            onConfirm={() => {
                              handleButton(`delete`, record);
                            }}
                            okText="Xoá"
                            cancelText="Huỷ"
                          >
                            <a
                              className="p-2 text-dark"
                              data-toggle="m-tooltip"
                              title="Xoá buổi học"
                            >
                              <i className="fas fa-trash me-2"></i>
                              Xoá buổi học
                            </a>
                          </Popconfirm>
                        ),
                      },
                  {
                    key: "attendance",
                    disabled: false,
                    label: (
                      <a
                        className="p-2 text-dark"
                        data-toggle="m-tooltip"
                        title="Điểm danh"
                        onClick={() => {
                          handleButton(`attendance`, record);
                        }}
                      >
                        <i className="fas fa-user-check me-2"></i>
                        Điểm danh
                      </a>
                    ),
                  },
                  {
                    key: "update-file",
                    disabled: false,
                    label: (
                      <a
                        className="p-2 text-dark"
                        data-toggle="m-tooltip"
                        title="Cập nhật tài liệu"
                        onClick={() => {
                          handleButton(`update-file`, record);
                        }}
                      >
                        <i className="fas fa-file-alt me-2"></i>
                        Cập nhật tài liệu
                      </a>
                    ),
                  },
                  {
                    key: "update-video",
                    disabled: false,
                    label: (
                      <a
                        className="p-2 text-dark"
                        data-toggle="m-tooltip"
                        title="Cập nhật video"
                        onClick={() => {
                          handleButton(`update-video`, record);
                        }}
                      >
                        <i className="fas fa-file-video me-2"></i>
                        Cập nhật video
                      </a>
                    ),
                  },
                  {
                    key: "update-assignment",
                    disabled: false,
                    label: (
                      <a
                        className="p-2 text-dark"
                        data-toggle="m-tooltip"
                        title="Cập nhật bài tập"
                        onClick={() => {
                          handleButton(`update-assignment`, record);
                        }}
                      >
                        <i className="fas fa-file-invoice me-2"></i>
                        Cập nhật bài tập
                      </a>
                    ),
                  },
                  {
                    key: "assignment",
                    disabled: false,
                    label: (
                      <a
                        className="p-2 text-dark"
                        data-toggle="m-tooltip"
                        title="Danh sách nộp bài tập"
                        onClick={() => {
                          handleButton(`assignment`, record);
                        }}
                      >
                        <i className="fas fa-clipboard-check me-2"></i>
                        Danh sách nộp bài tập
                      </a>
                    ),
                  },
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
      {modalUserVisible ? (
        <ModalAttendances
          modalVisible={modalUserVisible}
          setModalVisible={setModalUserVisible}
        />
      ) : (
        <></>
      )}
      {modalUpdateFile ? (
        <ModalUpdateFile
          modalVisible={modalUpdateFile}
          setModalVisible={setModalUpdateFile}
        />
      ) : (
        <></>
      )}
      {modalUpdateVideo ? (
        <ModalUpdateVideo
          modalVisible={modalUpdateVideo}
          setModalVisible={setModalUpdateVideo}
        />
      ) : (
        <></>
      )}
      {modalUpdateAssignment ? (
        <ModalUpdateAssignment
          modalVisible={modalUpdateAssignment}
          setModalVisible={setModalUpdateAssignment}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default UsersList;
