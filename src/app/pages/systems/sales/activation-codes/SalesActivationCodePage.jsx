/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker, Form, Input, Select } from "antd";
import Collapse from "react-bootstrap/Collapse";

import * as actionsModal from "@/setup/redux/modal/Actions";

import ItemsList from "./components/ItemsList";
import TDSelect from "@/app/components/TDSelect";
import { requestPOST } from "@/utils/baseAPI";
import locale from "antd/es/date-picker/locale/vi_VN";

const FormItem = Form.Item;

const ActivationCodePage = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  const [dataSearch, setDataSearch] = useState(null);

  const TimKiem = () => {
    const formData = form.getFieldsValue(true);
    setDataSearch(formData);
  };

  return (
    <>
      <div className="card card-xl-stretch mb-xl-9">
        <div className="px-3 py-3 border-bottom border-secondary border-bottom-solid d-flex align-items-center justify-content-between">
          <h3 className="card-title fw-bold text-header-td fs-4 mb-0">
            {"Mã kích hoạt khoá học"}
          </h3>
          <div className="card-toolbar">
            {/* <button
              className="btn btn-primary btn-sm py-2 me-2"
              onClick={() => {
                dispatch(
                  actionsModal.setDataModal({ ...null, readOnly: false })
                );
                dispatch(actionsModal.setModalVisible(true));
              }}
            >
              <span>
                <i className="fas fa-plus me-2"></i>
                <span className="">Thêm mới</span>
              </span>
            </button> */}
          </div>
        </div>
        <div className="row g-5 my-2">
          <div className="col-xl-3 col-lg-6 px-5">
            <div className="btn-group me-2 w-100">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Nhập từ khoá tìm kiếm"
                onChange={(e) => {
                  setDataSearch({
                    ...dataSearch,
                    keyword: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className="col-xl-3 col-lg-6 btn-group align-items-center px-5">
            <span className="fw-bold w-150px">Khoá học:</span>
            <div className="ms-2 w-100">
              <TDSelect
                reload={true}
                showSearch
                placeholder="Chọn khoá học"
                fetchOptions={async (keyword) => {
                  const res = await requestPOST(`api/v1/courses/search`, {
                    pageNumber: 1,
                    pageSize: 100,
                    keyword: keyword,
                  });
                  return res?.data?.map((item) => ({
                    ...item,
                    label: `${item.title}`,
                    value: item.id,
                  }));
                }}
                style={{
                  width: "100%",
                }}
                onChange={(value, current) => {
                  if (value) {
                    setDataSearch({ ...dataSearch, courseId: current?.id });
                  } else {
                    setDataSearch({ ...dataSearch, courseId: null });
                  }
                }}
              />
            </div>
          </div>
          <div className="col-xl-3 col-lg-6 btn-group align-items-center px-5">
            <span className="fw-bold  w-150px">Trạng thái:</span>
            <div className="ms-2 w-100">
              <Select
                allowClear
                placeholder="Trạng thái"
                style={{ width: "100%" }}
                options={[
                  {
                    value: 0,
                    label: "Chưa sử dụng",
                  },
                  {
                    value: 1,
                    label: "Đã sử dụng",
                  },
                  {
                    value: 2,
                    label: "Hết hạn",
                  },
                ]}
                onChange={(value) => {
                  setDataSearch({
                    ...dataSearch,
                    status: value,
                  });
                }}
              />
            </div>
          </div>
          <div className="col-xl-3 col-lg-6 btn-group align-items-center px-5">
            <span className="fw-bold  w-150px">Loại mã kích hoạt:</span>
            <div className="ms-2 w-100 ">
              <Select
                allowClear
                placeholder="Chọn"
                style={{ width: "100%" }}
                options={[
                  {
                    value: 0,
                    label: "Toàn bộ",
                  },
                  {
                    value: 1,
                    label: "Chương trình học",
                  },
                  {
                    value: 2,
                    label: "Luyện đề thi",
                  },
                ]}
                onChange={(value) => {
                  setDataSearch({
                    ...dataSearch,
                    activeType: value,
                  });
                }}
              />
            </div>
          </div>
          <div className="col-xl-3 col-lg-6 btn-group align-items-center px-5">
            <span className="fw-bold  w-150px">Thời gian tạo từ:</span>
            <div className="ms-2 w-100 ">
              <DatePicker
                placeholder="Chọn thời gian"
                format={"DD/MM/YYYY"}
                locale={locale}
                onChange={(date, dateString) => {
                  setDataSearch({
                    ...dataSearch,
                    createdOnFrom: date,
                  });
                }}
              />
            </div>
          </div>
          <div className="col-xl-3 col-lg-6 btn-group align-items-center px-5">
            <span className="fw-bold  w-150px">Thời gian tạo đến:</span>
            <div className="ms-2 w-100 ">
              <DatePicker
                placeholder="Chọn thời gian"
                format={"DD/MM/YYYY"}
                locale={locale}
                onChange={(date, dateString) => {
                  setDataSearch({
                    ...dataSearch,
                    createdOnTo: date,
                  });
                }}
              />
            </div>
          </div>
          <div className="col-xl-3 col-lg-6 btn-group align-items-center px-5">
            <span className="fw-bold  w-150px">Ngày kích hoạt từ:</span>
            <div className="ms-2 w-100 ">
              <DatePicker
                locale={locale}
                format={"DD/MM/YYYY"}
                style={{ width: "100%" }}
                onChange={(date, dateString) => {
                  setDataSearch({
                    ...dataSearch,
                    activedOnFrom: date,
                  });
                }}
              />
            </div>
          </div>
          <div className="col-xl-3 col-lg-6 btn-group align-items-center px-5">
            <span className="fw-bold  w-150px">Ngày kích hoạt đến:</span>
            <div className="ms-2 w-100 ">
              <DatePicker
                locale={locale}
                format={"DD/MM/YYYY"}
                style={{ width: "100%" }}
                onChange={(date, dateString) => {
                  setDataSearch({
                    ...dataSearch,
                    activedOnTo: date,
                  });
                }}
              />
            </div>
          </div>
        </div>
        <ItemsList dataSearch={dataSearch} />
      </div>
    </>
  );
};

export default ActivationCodePage;
