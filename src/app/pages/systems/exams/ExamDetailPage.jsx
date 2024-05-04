/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Empty, Form, Input, Menu, Popconfirm } from "antd";
import Collapse from "react-bootstrap/Collapse";
import * as actionsModal from "@/setup/redux/modal/Actions";
import ItemsList from "./components/ItemsList";
import TopicsList from "../topics/components/ItemsList";
import {
  useNavigate,
  useSearchParams,
  createSearchParams,
} from "react-router-dom";
import {
  requestDELETE,
  requestGET,
  requestPOST,
  requestPUT_NEW,
} from "@/utils/baseAPI";
import _ from "lodash";
import "./index.scss";
import RenderDataQuestion from "./components/RenderDataQuestion";
import ModalExamVariation from "./components/ModalExamVariation";
import ModalShuffleVariation from "./components/ModalShuffleVariation";
import { toast } from "react-toastify";

const FormItem = Form.Item;

const UsersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  const random = useSelector((state) => state.modal.random);

  const [form] = Form.useForm();

  const [dataExam, setDataExam] = useState(null);
  const [examId, setExamId] = useState(null);
  const [dataVariation, setDataVariation] = useState([]);

  const [currentVariation, setCurrentVariation] = useState(null);
  const [modalVariationVisible, setModalVariationVisible] = useState(false);
  const [modalShuffleVisible, setModalShuffleVisible] = useState(false);

  useEffect(() => {
    const fetchData = async (id) => {
      const res = await requestGET(`api/v1/exams/${id}`);
      setDataExam(res?.data ?? null);
    };
    var id = searchParams.get("examId");
    if (id) {
      setExamId(id);
      fetchData(id);
    }
  }, [searchParams]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await requestPOST(`api/v1/examvariations/search`, {
        pageNumber: 1,
        pageSize: 100,
        examId: examId,
      });
      var _data = res?.data ?? [];
      if (_data?.length > 0) {
        _data = _.orderBy(_data, ["isDefault"], ["desc"]);
        setDataVariation(_data);
        if (currentVariation) {
          var temp = _data?.find(
            (i) =>
              i.id == currentVariation?.id || i.code == currentVariation?.code
          );
          setCurrentVariation(temp);
        } else {
          var temp = _data?.find((i) => i.isDefault) || _data[0];
          setCurrentVariation(temp);
        }
      } else {
        setDataVariation([]);
      }
    };
    if (examId) {
      fetchData();
    }
  }, [examId, random]);
  const handleAddExamVariation = (item) => {
    var ind = dataVariation?.findIndex((i) => !i?.id);
    if (ind > -1) {
      var temp = [...dataVariation];
      temp.splice(ind, 1, item);
      setCurrentVariation(item);
      setDataVariation(temp);
    } else {
      setCurrentVariation(item);
      setDataVariation((arr) => [...arr, item]);
    }
  };
  const handleEditVariation = (item) => {
    dispatch(actionsModal.setDataModal(item));
    setModalVariationVisible(true);
  };
  const handleSetDefault = async (item) => {
    try {
      item.isDefault = true;
      console.log(item);
      const res = await requestPUT_NEW(
        `api/v1/examvariations/${item?.id}`,
        item
      );
      if (res.status === 200) {
        toast.success("Cập nhật thành công!");
        dispatch(actionsModal.setRandom());
      } else {
        toast.error("Thất bại, vui lòng thử lại!");
      }
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };
  const handleDeleteVariation = async (deleteId) => {
    var res = await requestDELETE(`api/v1/examvariations/${deleteId}`);
    if (res) {
      toast.success("Thao tác thành công!");
      if (deleteId == currentVariation?.id) {
        setCurrentVariation(null);
      }
      dispatch(actionsModal.setRandom());
    } else {
      toast.error("Thất bại, vui lòng thử lại!");
    }
  };
  return (
    <>
      <div className="card card-xl-stretch mb-xl-3">
        <div className="px-3 py-3 d-flex align-items-center justify-content-between flex-wrap">
          <div className="d-flex align-items-center">
            <a
              className="btn btn-icon btn-active-light-primary btn-sm me-1 rounded-circle"
              data-toggle="m-tooltip"
              title="Trở về"
              onClick={() => {
                navigate(-1);
              }}
            >
              <i className="fas fa-arrow-left fs-2 text-gray-600"></i>
            </a>
            <h3 className="card-title fw-bolder text-header-td fs-2 mb-0">
              {dataExam?.title ?? "Đề thi"}
            </h3>
          </div>
          <div className="card-toolbar">
            <button
              className="btn btn-primary py-3 me-2"
              onClick={() => {
                var params = {
                  examId: examId,
                };
                navigate({
                  pathname: "/system/study/exams/result",
                  search: `?${createSearchParams(params)}`,
                });
              }}
            >
              <span>
                <span className="">Kết quả</span>
              </span>
            </button>
            {/* <a
              className="btn  btn-secondary btn-active-color-primary py-3 px-10 me-2"
              data-toggle="m-tooltip"
              title="Đảo đề"
              onClick={() => {
                toast.info("Chức năng đang cập nhật!");
              }}
            >
              <i className="fas fa-retweet fs-4 px-0"></i>
            </a>
            <a
              className="btn  btn-secondary btn-active-color-primary py-3 px-10 me-2"
              data-toggle="m-tooltip"
              title="Tạo đề tự động từ ngân hàng câu hỏi"
              onClick={() => {
                toast.info("Chức năng đang cập nhật!");
              }}
            >
              <i className="fas fa-cogs fs-4 px-0"></i>
            </a>

            <a
              className="btn  btn-secondary btn-active-color-primary py-3 px-10 me-2"
              data-toggle="m-tooltip"
              title="Thêm từ ngân hàng câu hỏi"
              onClick={() => {
                toast.info("Chức năng đang cập nhật!");
              }}
            >
              <i className="fas fa-plus-square fs-4 px-0"></i>
            </a> 
            <a
              className="btn  btn-secondary btn-active-color-primary py-3 px-10 me-2"
              data-toggle="m-tooltip"
              title="Tạo đề từ file"
              onClick={() => {
                toast.info("Chức năng đang cập nhật!");
              }}
            >
              <i className="fas fa-file-upload fs-4 px-0"></i>
            </a>*/}
          </div>
        </div>
      </div>
      <div className="mb-xl-9">
        <div className="row g-5">
          <div className="col-xl-3">
            <div className="card">
              <div className="card-header d-flex align-items-center justify-content-between px-5 min-h-60px">
                <div className="card-title  text-header-td fs-3 mb-0">
                  Mã đề
                </div>
                <button
                  className="btn btn-success btn-sm btn-icon w-25px h-25px rounded-circle"
                  onClick={() => {
                    if (dataVariation?.length > 0) {
                      setModalShuffleVisible(true);
                    } else {
                      setModalVariationVisible(true);
                    }
                  }}
                >
                  <i className="fas fa-plus text-white"></i>
                </button>
              </div>
              <div className="card-body p-0 pb-2 category-menu">
                {dataVariation?.length > 0 ? (
                  <>
                    {dataVariation?.map((item, index) => (
                      <div
                        key={item?.id || item?.code}
                        className={`category-item border-bottom ${
                          item?.id == currentVariation?.id ||
                          (!item?.id && item?.code == currentVariation?.code)
                            ? "item-active"
                            : ""
                        }`}
                      >
                        <div
                          className="d-flex flex-column flex-grow-1 btn align-items-start ps-2"
                          onClick={() => {
                            setCurrentVariation(item);
                          }}
                        >
                          <div
                            className={`text-start ${
                              item?.id == currentVariation?.id ||
                              (!item?.id &&
                                item?.code == currentVariation?.code)
                                ? "text-primary"
                                : ""
                            }`}
                          >
                            <span className="fw-normal">Mã đề:</span>
                            <span className="fw-bold ms-2">
                              {item?.code ?? item?.id}
                            </span>
                          </div>

                          <div className="fs-7 fw-semibold text-info lh-sm mt-1">
                            {item?.isDefault ? "Đề mặc định" : ""}
                          </div>
                        </div>
                        <Dropdown
                          trigger={"click"}
                          menu={{
                            items: [
                              {
                                key: "default",
                                label: (
                                  <span
                                    className="p-2 text-dark"
                                    onClick={() => {
                                      handleSetDefault(item);
                                    }}
                                  >
                                    <i className={`fas fa-star me-2`}></i>
                                    {"Đề mặc định"}
                                  </span>
                                ),
                              },
                              {
                                key: "edit",
                                label: (
                                  <span
                                    className="p-2 text-dark"
                                    onClick={() => {
                                      handleEditVariation(item);
                                    }}
                                  >
                                    <i className={`fas fa-edit me-2`}></i>
                                    {"Chỉnh sửa mã đề"}
                                  </span>
                                ),
                              },
                              {
                                key: "download",
                                label: (
                                  <span
                                    className="p-2 text-dark"
                                    onClick={() => {
                                      toast.info("Chức năng đang cập nhật!");
                                    }}
                                  >
                                    <i className={`fas fa-download me-2`}></i>
                                    {"Tải xuống"}
                                  </span>
                                ),
                              },

                              !item?.isDefault
                                ? {
                                    key: "delete",
                                    label: (
                                      <Popconfirm
                                        title="Xoá mã đề?"
                                        onConfirm={() => {
                                          handleDeleteVariation(item?.id);
                                        }}
                                        okText="Xoá"
                                        cancelText="Huỷ"
                                      >
                                        <span className="p-2 text-dark">
                                          <i
                                            className={`fas fa-trash me-2`}
                                          ></i>
                                          {"Xoá mã đề"}
                                        </span>
                                      </Popconfirm>
                                    ),
                                  }
                                : null,
                            ],
                          }}
                        >
                          <button
                            className="btn btn-sm btn-icon btn-bg-light btn-active-color-primary"
                            title="Thao tác"
                          >
                            <i className="fa fa-ellipsis-h"></i>
                          </button>
                        </Dropdown>
                      </div>
                    ))}
                    {/* <Menu
                    className="w-100"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                  >
                    {dataVariation?.map((item, index) => (
                      <Menu.Item
                        key={item?.id || item?.code}
                        className="category-item border-bottom"
                        onClick={() => {
                          setSelectedKey(item?.id || item?.code);
                          setCurrentVariation(item);
                        }}
                      >
                        <div>
                          Mã đề:{" "}
                          <span className="fw-bold ms-2">
                            {item?.code ?? item?.id}
                          </span>
                        </div>

                        {item?.isDefault ? (
                          <div className="fs-7 fw-semibold text-info lh-sm">
                            Đề mặc định
                          </div>
                        ) : (
                          <></>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu> */}
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-9">
            <div className="card">
              {!currentVariation ? (
                <div className="h-300px d-flex align-items-center justify-content-center">
                  {" "}
                  <Empty />{" "}
                </div>
              ) : (
                <RenderDataQuestion
                  currentVariation={currentVariation}
                  setCurrentVariation={setCurrentVariation}
                  setModalVariationVisible={setModalVariationVisible}
                  examId={examId}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {modalVariationVisible ? (
        <ModalExamVariation
          modalVisible={modalVariationVisible}
          setModalVisible={setModalVariationVisible}
          examId={examId}
        />
      ) : (
        <></>
      )}
      {modalShuffleVisible ? (
        <ModalShuffleVariation
          examId={examId}
          modalVisible={modalShuffleVisible}
          setModalVisible={setModalShuffleVisible}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default UsersPage;
