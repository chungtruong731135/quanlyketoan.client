import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Form,
  Input,
  Spin,
  Checkbox,
  InputNumber,
  DatePicker,
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
} from "@/utils/baseAPI";
import ImageUpload from "@/app/components/ImageUpload";
import { handleImage } from "@/utils/utils";
import { removeAccents } from "@/utils/slug";
import TDSelect from "@/app/components/TDSelect";
import TDEditorNew from "@/app/components/TDEditorNew";

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const ModalItem = (props) => {
  const dispatch = useDispatch();
  const { token } = authHelper.getAuth();
  const dataModal = useSelector((state) => state.modal.dataModal);
  const modalVisible = useSelector((state) => state.modal.modalVisible);
  const id = dataModal?.id ?? null;

  const [form] = Form.useForm();
  const [image, setImage] = useState([]);

  const [loadding, setLoadding] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [organizationunits, setOrganizationunits] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadding(true);
      const res = await requestGET(`api/users/${id}`);

      var _data = res ?? null;
      if (_data) {
        form.setFieldsValue({ ..._data });
        setImage(handleImage(_data?.imageUri ?? "", FILE_URL));
      }

      setLoadding(false);
    };
    if (id) {
      fetchData();
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await requestPOST(
          `api/v1/organizationunits/search`,
          _.assign({
            pageNumber: 1,
            pageSize: 1000,
          })
        );
        setOrganizationunits(res?.data ?? []);
      } catch (error) {}
    };

    fetchData();

    return () => {};
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await requestPOST(
          `api/v1/positions/search`,
          _.assign({
            pageNumber: 1,
            pageSize: 1000,
          })
        );
        setPositions(res?.data ?? []);
      } catch (error) {}
    };

    fetchData();

    return () => {};
  }, []);

  const handleCancel = () => {
    form.resetFields();
    /*  props.setDataModal(null);
    props.setModalVisible(false); */
    dispatch(actionsModal.setModalVisible(false));
  };

  const onFinish = async () => {
    const values = await form.validateFields();
    setBtnLoading(true);
    try {
      let arrImage = [];
      image.forEach((i) => {
        if (i.response) {
          arrImage.push(i.response.data[0].url);
        } else {
          arrImage.push(i.path);
        }
      });

      form.setFieldsValue({ imageUrl: arrImage.join("##") });

      const formData = form.getFieldsValue(true);
      if (id) {
        formData.id = id;
      }

      const res = id
        ? await requestPUT_NEW(`api/users/${id}`, formData)
        : await requestPOST_NEW(`api/users`, formData);

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

  return (
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
            <Form
              form={form}
              layout="vertical"
              /* initialValues={initData} */ autoComplete="off"
            >
              <div className="row">
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Ảnh đại diện">
                    <ImageUpload
                      URL={`${API_URL}/api/v1/attachments/public`}
                      fileList={image}
                      onChange={(e) => setImage(e.fileList)}
                      headers={{
                        Authorization: `Bearer ${token}`,
                      }}
                    />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label="Tên"
                    name="fullName"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <Input
                      placeholder=""
                      onChange={(e) => {
                        form.setFieldValue(
                          "code",
                          removeAccents(e.target.value)
                        );
                      }}
                    />
                  </FormItem>
                </div>

                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label="Mã nhân viên"
                    name="code"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <Input placeholder="" />
                  </FormItem>
                </div>

                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label="Tên đăng nhập"
                    name="userName"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                      {
                        pattern: /^[a-z0-9_.]{5,50}$/,
                        message:
                          "tên đăng nhập phải hơn 5-50 kí tự và không sử dụng kí tự đặc biệt!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Tên đăng nhập"
                      disabled={id ? true : false}
                    />
                  </FormItem>
                </div>
                {id == null && (
                  <div className="col-xl-6 col-lg-6">
                    <FormItem
                      label="Mật khẩu đăng nhập"
                      name="password"
                      rules={[
                        { required: true, message: "Không được để trống!" },
                        {
                          pattern:
                            /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,18}$/,
                          message:
                            "Mật khẩu từ 6-18 ký tự, phải có:  chữ thường, số và các ký tự đặc biệt!",
                        },
                      ]}
                    >
                      <Input placeholder="nhập mật khẩu" type="password" />
                    </FormItem>
                  </div>
                )}

                {id == null && (
                  <div className="col-xl-6 col-lg-6">
                    <FormItem
                      label="Nhập lại mật khẩu đăng nhập"
                      dependencies={["password"]}
                      name="confirmPassword"
                      rules={[
                        { required: true, message: "Không được để trống!" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("mật khẩu không khớp")
                            );
                          },
                        }),
                      ]}
                    >
                      <Input placeholder="nhập lại mật khẩu" type="password" />
                    </FormItem>
                  </div>
                )}

                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Bộ phận" name="organizationUnitId">
                    <Select allowClear placeholder="Bộ phận">
                      {organizationunits.map((item) => {
                        return (
                          <Option key={item.id} value={item.id}>
                            {item.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </FormItem>
                </div>

                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Chức vụ" name="positionId">
                    <Select allowClear placeholder="Chức vụ">
                      {positions.map((item) => {
                        return (
                          <Option key={item.id} value={item.id}>
                            {item.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </FormItem>
                </div>

                <div className="col-xl-12 col-lg-12">
                  <FormItem label="Ghi chú" name="note">
                    <TextArea rows={4} placeholder="" />
                  </FormItem>
                </div>
              </div>
            </Form>
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
          <Button
            className="btn-sm btn-secondary rounded-1 p-2  ms-2"
            onClick={handleCancel}
          >
            <i className="fa fa-times"></i>Đóng
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalItem;
