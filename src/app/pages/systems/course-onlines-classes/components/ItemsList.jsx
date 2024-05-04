/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { Dropdown, Popconfirm } from "antd";
import { toast } from "react-toastify";
import clsx from "clsx";
import * as actionsModal from "@/setup/redux/modal/Actions";
import { requestPOST, requestDELETE } from "@/utils/baseAPI";
import { useNavigate, createSearchParams } from "react-router-dom";
import TableList from "@/app/components/TableList";
import ModalItem from "./ChiTietModal";
import ModalListStudent from "./ModalListStudent";
const UsersList = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const modalVisible = useSelector((state) => state.modal.modalVisible);
  const { dataSearch, type } = props;
  const random = useSelector((state) => state.modal.random);
  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState(10);
  const [count, setCount] = useState("");
  const [offset, setOffset] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [modalStudentVisible, setModalStudentVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await requestPOST(
          `api/v1/courseclasses/search`,
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

  const handleButton = async (action, item) => {
    switch (action) {
      case "chi-tiet":
        dispatch(
          actionsModal.setDataModal({
            ...item,
            readOnly: type == 3 ? true : false,
          })
        );
        dispatch(actionsModal.setModalVisible(true));

        break;
      case "students":
        dispatch(actionsModal.setDataModal(item));
        setModalStudentVisible(true);

        break;

      case "sessions":
        var params = {
          courseClassId: item?.id,
        };
        navigate({
          pathname: "sessions",
          search: `?${createSearchParams(params)}`,
        });

        break;

      case "delete":
        var res = await requestDELETE(`api/v1/courseclasses/${item.id}`);
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
      title: "Khoá học",
      dataIndex: "courseTitle",
      key: "courseTitle",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "isActive",
    //   key: "isActive",
    //   width: 200,
    //   render: (text, record) => {
    //     return (
    //       <div>
    //         <div
    //           className={`me-2 badge badge-light-${
    //             record?.isActive ? "success" : "danger"
    //           }`}
    //         >
    //           {`${record?.isActive ? "Sử dụng" : "Không sử dụng"}`}
    //         </div>
    //         {record?.isPublic ? (
    //           <div
    //             className={`badge badge-light-${
    //               record?.isPublic ? "success" : "danger"
    //             }`}
    //           >
    //             {`${record?.isPublic ? "Phát hành" : "Không phát hành"}`}
    //           </div>
    //         ) : (
    //           <></>
    //         )}
    //       </div>
    //     );
    //   },
    // },

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
            {type == 3 ? (
              <></>
            ) : (
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
            )}
            <Dropdown
              trigger={"click"}
              menu={{
                items: [
                  {
                    key: "sessions",
                    disabled: false,
                    label: (
                      <a
                        className="p-2 text-dark"
                        data-toggle="m-tooltip"
                        title="Danh sách buổi học"
                        onClick={() => {
                          handleButton(`sessions`, record);
                        }}
                      >
                        <i className="fas fa-clipboard-list me-2"></i>
                        Danh sách buổi học
                      </a>
                    ),
                  },
                  {
                    key: "students",
                    disabled: false,
                    label: (
                      <a
                        className="p-2 text-dark"
                        data-toggle="m-tooltip"
                        title="Danh sách học sinh"
                        onClick={() => {
                          handleButton(`students`, record);
                        }}
                      >
                        <i className="fas fa-users me-2"></i>
                        Danh sách học sinh
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
      {modalStudentVisible ? (
        <ModalListStudent
          modalVisible={modalStudentVisible}
          setModalVisible={setModalStudentVisible}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default UsersList;
