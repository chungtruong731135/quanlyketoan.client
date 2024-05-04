import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Collapse from "react-bootstrap/Collapse";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import moment from "moment";
import TDSelect from "@/app/components/TDSelect";
import {
  Form,
  Input,
  Spin,
  Checkbox,
  InputNumber,
  DatePicker,
  Select,
} from "antd";
import { Modal, Button, ModalBody } from "react-bootstrap";
import { toast } from "react-toastify";
import _ from "lodash";

import locale from "antd/es/date-picker/locale/vi_VN";

import * as authHelper from "@/app/modules/auth/core/AuthHelpers";
import * as actionsModal from "@/setup/redux/modal/Actions";
import {
  requestGET,
  requestPOST_NEW,
  requestPUT_NEW,
  API_URL,
  FILE_URL,
  requestPOST,
} from "@/utils/baseAPI";
import ImageUpload from "@/app/components/ImageUpload";
import { handleImage } from "@/utils/utils";
import TDEditorNew from "@/app/components/TDEditorNew";
const FormItem = Form.Item;
const { Option } = Select;

const PageHeader = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(true);
  const [mealTimes, setMealTimes] = useState([]);
  const [menuFoods, setMenuFoods] = useState([]);

  useEffect(() => {
    form.resetFields();
    dispatch(actionsModal.setDataSearch(null));
    return () => {};
  }, []);

  const TimKiem = () => {
    const formData = form.getFieldsValue(true);

    let formData2 = { ...formData };

    if (formData?.isEating) {
      console.log(formData?.isEating);
      formData2.isEating =
        formData?.isEating == 1 ? true : formData?.isEating == 2 ? false : null;
    }

    dispatch(actionsModal.setDataSearch(formData2));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await requestPOST(
          `api/v1/mealtimes/search`,
          _.assign({
            pageNumber: 1,
            pageSize: 1000,
          })
        );
        setMealTimes(res?.data ?? []);
      } catch (error) {}
    };

    fetchData();

    return () => {};
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await requestPOST(
          `api/v1/menufoods/search`,
          _.assign({
            pageNumber: 1,
            pageSize: 1000,
          })
        );
        setMenuFoods(res?.data ?? []);
      } catch (error) {}
    };

    fetchData();

    return () => {};
  }, []);

  const eatingOptions = [
    { id: 3, value: "Tất cả" },
    { id: 1, value: "Có ăn" },
    { id: 2, value: "Không ăn" },
  ];

  return (
    <>
      <div className="px-3 py-3 border-bottom border-secondary border-bottom-solid d-flex align-items-center justify-content-between">
        <h3 className="card-title fw-bold text-header-td fs-4 mb-0">
          {props?.title ?? ""}
        </h3>
        <div className="d-flex align-items-center">
          <button
            className="btn btn-secondary btn-sm m-btn m-btn--icon py-2 me-2"
            type="button"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span>
              <i className="fas fa-search"></i>
              <span className="">Tìm kiếm</span>
            </span>
          </button>
        </div>
      </div>
      <div>
        <Collapse in={open}>
          <div className="card card-body">
            <Form form={form} autoComplete="off">
              <div className="row">
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Từ khoá" name="keyword">
                    <Input placeholder="" />
                  </FormItem>
                </div>

                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Chọn ngày" name="registrationDate">
                    <DatePicker
                      locale={locale}
                      format="DD/MM/YYYY"
                      placeholder="Chọn ngày"
                      allowClear={true}
                      defaultValue={dayjs()}
                    />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Ca ăn" name="mealTimeId">
                    <Select
                      allowClear
                      showSearch
                      placeholder="Ca ăn"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {mealTimes.map((item) => {
                        return (
                          <Option key={item?.id} value={item?.id}>
                            {item?.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </FormItem>
                </div>

                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Thực đơn" name="menuFoodId">
                    <Select
                      allowClear
                      showSearch
                      placeholder="Thực đơn"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {menuFoods.map((item) => {
                        return (
                          <Option key={item?.id} value={item?.id}>
                            {item?.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </FormItem>
                </div>

                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Thể loại" name="isEating">
                    <Select
                      allowClear
                      showSearch
                      placeholder="Thể loại"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      defaultValue={
                        eatingOptions.length > 0
                          ? eatingOptions[0].id
                          : undefined
                      }
                    >
                      {eatingOptions.map((item) => {
                        return (
                          <Option key={item?.id} value={item?.id}>
                            {item?.value}
                          </Option>
                        );
                      })}
                    </Select>
                  </FormItem>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-12 col-lg-12 d-flex justify-content-center">
                  <button
                    className="btn btn-primary btn-sm m-btn m-btn--icon py-2 me-2"
                    onClick={TimKiem}
                  >
                    <span>
                      <i className="fas fa-search"></i>
                      <span className="">Tìm kiếm</span>
                    </span>
                  </button>
                  <button
                    className="btn btn-secondary btn-sm m-btn m-btn--icon py-2 me-2"
                    onClick={() => {
                      form.resetFields();
                      dispatch(actionsModal.setDataSearch(null));
                    }}
                  >
                    <span>
                      <i className="fas fa-sync"></i>
                      <span className="">Tải lại</span>
                    </span>
                  </button>
                </div>
              </div>
            </Form>
          </div>
        </Collapse>
      </div>
    </>
  );
};

export default PageHeader;
