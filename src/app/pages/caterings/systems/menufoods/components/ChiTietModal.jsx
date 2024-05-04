import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Form,
  Input,
  Spin,
  Checkbox,
  InputNumber,
  DatePicker,
  Popconfirm,
  Select,
} from "antd";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import _ from "lodash";
import dayjs from "dayjs";
import "dayjs/locale/vi";
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
  requestDELETE,
} from "@/utils/baseAPI";
import ImageUpload from "@/app/components/ImageUpload";
import { handleImage } from "@/utils/utils";
import { removeAccents } from "@/utils/slug";
import TDSelect from "@/app/components/TDSelect";
import TDEditorNew from "@/app/components/TDEditorNew";
import "./style.scss";
import ModalItemFood from "./ModalItemFood";
import { KTSVG, toAbsoluteUrl } from "@/_metronic/helpers";
import moment from "moment";

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const ModalItem = (props) => {
  const dispatch = useDispatch();
  const { token } = authHelper.getAuth();
  const dataModal = useSelector((state) => state.modal.dataModal);
  const modalVisible = useSelector((state) => state.modal.modalVisible);
  let id = dataModal?.id ?? null;
  const random = useSelector((state) => state.modal.random);
  const [form] = Form.useForm();
  const [image, setImage] = useState([]);

  const [loadding, setLoadding] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const { setModalFoodItem, setDataFoodItem, isAddNew, setIsAddNew } = props;
  const [listMenuFoodItems, setListMenuFoodItems] = useState([]);

  const [listMealTimes, setListMealTime] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setLoadding(true);
      const res = await requestGET(`api/v1/menufoods/${id}`);

      var _data = res?.data ?? null;
      if (_data) {
        _data.dateStart = _data?.dateStart ? dayjs(_data?.dateStart) : null;
        _data.dateStop = _data?.dateStop ? dayjs(_data?.dateStop) : null;

        form.setFieldsValue({ ..._data });
        setImage(handleImage(_data?.imageUri ?? "", FILE_URL));
        if (_data?.listMenuFoodItems) {
          setListMenuFoodItems(_data?.listMenuFoodItems);
        }
      }

      setLoadding(false);
    };
    if (id) {
      fetchData();
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, random]);

  const handleCancel = () => {
    form.resetFields();
    /*  props.setDataModal(null);
    props.setModalVisible(false); */
    setIsAddNew(false);
    dispatch(actionsModal.setModalVisible(false));
  };

  const onFinish = async () => {
    setBtnLoading(true);
    try {
      const values = await form.validateFields();
      const formData = form.getFieldsValue(true);
      if (id) {
        formData.id = id;
      }
      const res = id
        ? await requestPUT_NEW(`api/v1/menufoods/${id}`, formData)
        : await requestPOST_NEW(`api/v1/menufoods`, formData);

      if (res.status === 200) {
        toast.success("Cập nhật thành công!");
        dispatch(actionsModal.setRandom());
        handleCancel();
      } else {
        //toast.error('Thất bại, vui lòng thử lại!');
        const errors = Object.values(res?.data?.errors ?? {});
        let final_arr = [];
        errors.forEach((item) => {
          final_arr = _.concat(final_arr, item);
        });
        toast.error("Thất bại, vui lòng thử lại! " + final_arr.join(" "));
      }
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
    setBtnLoading(false);
  };

  const handleChangeItem = (item) => {
    setModalFoodItem(true);
    setDataFoodItem(item);
  };

  const handleAddItem = async () => {
    try {
      console.log(listMenuFoodItems.length);
      if (isAddNew == true && listMenuFoodItems.length == 0) {
        const values = await form.validateFields();
        const formData = form.getFieldsValue(true);

        const res = await requestPOST_NEW(`api/v1/menufoods`, formData);
        if (res?.data) {
          console.log(res);
          dispatch(
            actionsModal.setDataModal({ ...dataModal, id: res.data.data })
          );
        }
      }
    } catch {}

    setModalFoodItem(true);
    setDataFoodItem(null);
  };

  const handleDeleteItem = async (item) => {
    var res = await requestDELETE(`api/v1/menufooditems/${item}`);
    if (res) {
      toast.success("Thao tác thành công!");
      dispatch(actionsModal.setRandom());
    } else {
      toast.error("Thất bại, vui lòng thử lại!");
    }
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
        setListMealTime(res?.data ?? []);
      } catch (error) {}
    };

    fetchData();

    return () => {};
  }, []);

  useEffect(() => {}, [isAddNew]);
  return (
    <>
      <Modal
        show={modalVisible}
        fullscreen={"lg-down"}
        size="xl"
        onExited={handleCancel}
        keyboard={true}
        scrollable={true}
        onEscapeKeyDown={handleCancel}
      >
        <Modal.Header className="bg-primary px-4 py-3">
          <Modal.Title className="text-white">Chi tiết</Modal.Title>
          <button
            type="button"
            className="btn-close btn-close-white"
            aria-label="Close"
            onClick={handleCancel}
          ></button>
        </Modal.Header>
        <Modal.Body>
          <Spin spinning={loadding}>
            {!loadding && (
              <>
                <Form
                  form={form}
                  layout="vertical"
                  /* initialValues={initData} */ autoComplete="off"
                >
                  <div className="row">
                    <div className="col-xl-6 col-lg-6">
                      <FormItem
                        label="Tên"
                        name="name"
                        rules={[
                          { required: true, message: "Không được để trống!" },
                        ]}
                      >
                        <Input placeholder="" />
                      </FormItem>
                    </div>
                    <div className="col-xl-6 col-lg-6">
                      <FormItem
                        label="Ca ăn"
                        name="mealTimeId"
                        rules={[
                          { required: true, message: "Không được để trống!" },
                        ]}
                      >
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
                          {listMealTimes.map((item) => {
                            return (
                              <Option key={item?.id} value={item?.id}>
                                {item?.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </FormItem>
                    </div>
                    <div className="row">
                      <div className="col-xl-6 col-lg-6">
                        <FormItem
                          label="Thực đơn từ ngày"
                          name="dateStart"
                          rules={[
                            { required: true, message: "Không được để trống!" },
                          ]}
                        >
                          <DatePicker
                            locale={locale}
                            format={"DD/MM/YYYY"}
                            placeholder="Từ ngày"
                            style={{ width: "100%" }}
                          />
                        </FormItem>
                      </div>
                      <div className="col-xl-6 col-lg-6">
                        <FormItem
                          label="Thực đơn đến ngày"
                          name="dateStop"
                          rules={[
                            { required: true, message: "Không được để trống!" },
                          ]}
                        >
                          <DatePicker
                            locale={locale}
                            format={"DD/MM/YYYY"}
                            placeholder="Từ ngày"
                            style={{ width: "100%" }}
                          />
                        </FormItem>
                      </div>
                    </div>

                    <div className="col-xl-6 col-lg-6">
                      <FormItem label="Ghi chú" name="description">
                        <TextArea rows={2} placeholder="" />
                      </FormItem>
                    </div>
                  </div>
                </Form>
                <div className="container-menufood">
                  <h2>Thực đơn</h2>
                  {/* <h5 className="title-nocontent">Chưa có gì cả</h5> */}
                  <ul className="list-item-food">
                    {listMenuFoodItems &&
                      listMenuFoodItems.map((item) => (
                        <li className="col-xl-3 col-lg-6 mx-1">
                          <div className="bounder-itemfood">
                            <div className="item-food">
                              <div class="image-container">
                                <img
                                  src={toAbsoluteUrl(
                                    `${FILE_URL}${item?.imageUrl}`
                                  )}
                                  alt=""
                                />
                              </div>
                              <div class="text-container">
                                <h2>{item?.name}</h2>
                                <p>{item?.note}</p>
                              </div>

                              <div className="action-container">
                                <a
                                  className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 mb-1"
                                  data-toggle="m-tooltip"
                                  title="Xem chi tiết/Sửa"
                                  onClick={() => handleChangeItem(item.id)}
                                >
                                  <i className="fa-regular fa-pen-to-square"></i>
                                </a>
                                <Popconfirm
                                  title="Xoá?"
                                  onConfirm={() => {
                                    handleDeleteItem(item.id);
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
                            </div>
                          </div>
                        </li>
                      ))}
                  </ul>
                  <div className="box-btn-add">
                    <button className="btn-add" onClick={handleAddItem}>
                      <i className="fas fa-plus"></i>
                      Thêm món
                    </button>
                  </div>
                </div>
              </>
            )}
          </Spin>
        </Modal.Body>
        <Modal.Footer className="bg-light px-4 py-2 align-items-center">
          <div className="d-flex justify-content-center  align-items-center">
            <Button
              className="btn-sm btn-primary rounded-1 py-2 px-5  ms-2"
              onClick={onFinish}
              disabled={btnLoading}
            >
              <i className="fa fa-save"></i>
              {id ? "Lưu" : "Tạo mới"}
            </Button>
          </div>

          <div className="d-flex justify-content-center  align-items-center">
            {isAddNew && id ? (
              <Popconfirm
                title="bạn có chắc chắn muốn huỷ?"
                okText="Đồng ý"
                cancelText="Không"
                onConfirm={handleCancel}
              >
                <a
                  className="btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1 mb-1"
                  data-toggle="m-tooltip"
                  title="Huỷ"
                >
                  <i className="fa fa-times mx-1"></i>
                  Đóng
                </a>
              </Popconfirm>
            ) : (
              <Button
                className="btn-sm btn-secondary rounded-1 p-2  ms-2"
                onClick={handleCancel}
              >
                <i className="fa fa-times"></i>
                Đóng
              </Button>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalItem;
