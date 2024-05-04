/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input } from "antd";
import Collapse from "react-bootstrap/Collapse";

import * as actionsModal from "@/setup/redux/modal/Actions";

import ItemsList from "./components/ItemsList";
import TDSelect from "@/app/components/TDSelect";
import { requestPOST } from "@/utils/baseAPI";

const FormItem = Form.Item;

const UsersPage = (props) => {
  const { type } = props;
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
            {"Lớp học online"}
          </h3>
          <div className="card-toolbar">
            <div className="btn-group me-2 w-xl-250px w-lg-200px">
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
            <div className="btn-group mx-2 align-items-center w-xl-300px w-lg-250px">
              <span className="fw-bold  w-100px">Khoá học:</span>
              <div className="ms-2 w-100">
                <TDSelect
                  reload={true}
                  showSearch
                  placeholder="Chọn khoá học"
                  fetchOptions={async (keyword) => {
                    const res = await requestPOST(
                      `api/v1/courseonlines/search`,
                      {
                        pageNumber: 1,
                        pageSize: 100,
                        keyword: keyword,
                      }
                    );
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
            {type == 3 ? (
              <></>
            ) : (
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
                  <i className="fas fa-plus"></i>
                  <span className="">Thêm mới</span>
                </span>
              </button>
            )}
          </div>
        </div>

        <ItemsList dataSearch={dataSearch} type={type} />
      </div>
    </>
  );
};

export default UsersPage;
