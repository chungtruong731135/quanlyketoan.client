/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input } from "antd";
import Collapse from "react-bootstrap/Collapse";

import * as actionsModal from "@/setup/redux/modal/Actions";

import QuestionLevelsList from "../questionlevels/components/ItemsList";
import { useNavigate, useSearchParams } from "react-router-dom";
import { requestGET } from "@/utils/baseAPI";

const FormItem = Form.Item;

const UsersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();

  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const [dataSearch, setDataSearch] = useState(null);
  const [dataCourse, setDataCourse] = useState(null);
  useEffect(() => {
    const fetchData = async (id) => {
      const res = await requestGET(`api/v1/topics/${id}`);
      setDataCourse(res?.data ?? null);
    };
    var topicId = searchParams.get("topicId");
    // var courseId = searchParams.get("courseId");
    if (topicId) {
      fetchData(topicId);
      setDataSearch({ ...dataSearch, topicId: topicId });
    }
  }, [searchParams]);
  const TimKiem = () => {
    const formData = form.getFieldsValue(true);
    setDataSearch(formData);
  };

  return (
    <>
      <div className="card card-xl-stretch mb-xl-3">
        <div className="px-3 py-3 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <a
              className="btn btn-icon btn-active-light-primary btn-sm me-1 rounded-circle"
              data-toggle="m-tooltip"
              title="Trở về"
              onClick={() => {
                navigate(-1);
              }}
            >
              <i className="fa fa-arrow-left fs-2 text-gray-600"></i>
            </a>
            <h3 className="card-title fw-bolder text-header-td fs-2 mb-0">
              {dataCourse?.name ?? "Danh sách chương trình học chủ đề"}
            </h3>
          </div>
        </div>
      </div>
      <div className="card card-xl-stretch mb-xl-9">
        <div className="px-3 py-3 border-bottom border-secondary border-bottom-solid d-flex align-items-center justify-content-between">
          <h3 className="card-title fw-bold text-header-td fs-4 mb-0">
            {"Chương trình học"}
          </h3>
          <div className="card-toolbar">
            <div className="btn-group me-2 w-200px">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Nhập từ khoá tìm kiếm"
                onChange={(e) => {
                  setDataSearch({
                    ...dataSearch,
                    keywordSearch: e.target.value,
                  });
                }}
              />
            </div>
            <button
              className="btn btn-primary btn-sm py-2 me-2"
              onClick={() => {
                dispatch(
                  actionsModal.setDataModal({
                    readOnly: false,
                    courseId: dataCourse?.courseId,
                    topicId: dataCourse?.id,
                    topicName: dataCourse?.name,
                  })
                );
                dispatch(actionsModal.setModalVisible(true));
              }}
            >
              <span>
                <i className="fas fa-plus"></i>
                <span className="">Thêm mới</span>
              </span>
            </button>
          </div>
        </div>
        <div></div>
        <QuestionLevelsList dataSearch={dataSearch} />
      </div>
    </>
  );
};

export default UsersPage;
