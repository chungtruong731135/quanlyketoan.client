/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input } from "antd";
import Collapse from "react-bootstrap/Collapse";

import * as actionsModal from "@/setup/redux/modal/Actions";

import ItemsList from "./components/ItemsList";
import { requestPOST } from "@/utils/baseAPI";
import TDSelect from "@/app/components/TDSelect";

const FormItem = Form.Item;

const UsersPage = () => {
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
        <div className="px-3 py-3 border-bottom border-secondary border-bottom-solid d-flex align-items-center justify-content-between flex-wrap">
          <h3 className="card-title fw-bold text-header-td fs-4 mb-0">
            {"Khách hàng đăng ký tư vấn"}
          </h3>
          <div className="card-toolbar">
            <button
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
            </button>
          </div>
        </div>
        <div className="row g-5 my-2">
          <div className="col-xl-4 col-lg-6 px-5">
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
          <div className="col-xl-4 col-lg-6 btn-group align-items-center px-5">
            <span className="fw-bold w-100px">Kỳ thi:</span>
            <div className="ms-2 w-100">
              <TDSelect
                showSearch
                reload={true}
                placeholder="Chọn kỳ thi"
                fetchOptions={async (keyword) => {
                  const res = await requestPOST(`api/v1/examinats/search`, {
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
                  height: "auto",
                }}
                onChange={(value, current) => {
                  if (value) {
                    setDataSearch({ ...dataSearch, examinatId: current?.id });
                  } else {
                    setDataSearch({ ...dataSearch, examinatId: null });
                  }
                }}
              />
            </div>
          </div>
          <div className="col-xl-4 col-lg-6 btn-group align-items-center px-5">
            <span className="fw-bold w-100px">Khối lớp:</span>
            <div className="ms-2 w-100">
              <TDSelect
                reload
                placeholder="Chọn khối lớp"
                fetchOptions={async (keyword) => {
                  const res = await requestPOST(`api/v1/categories/search`, {
                    pageNumber: 1,
                    pageSize: 100,
                    categoryGroupCode: "KhoiLop",
                  });
                  return res?.data?.map((item) => ({
                    ...item,
                    label: `${item.name}`,
                    value: item.id,
                  }));
                }}
                style={{
                  width: "100%",
                  height: "auto",
                }}
                onChange={(value, current) => {
                  if (value) {
                    setDataSearch({
                      ...dataSearch,
                      gradeId: current?.id,
                    });
                  } else {
                    setDataSearch({ ...dataSearch, gradeId: null });
                  }
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

export default UsersPage;
