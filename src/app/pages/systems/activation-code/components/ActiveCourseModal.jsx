import { useState } from "react";
import { useDispatch } from "react-redux";

import { Form, Select, Spin, InputNumber, Checkbox } from "antd";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import _ from "lodash";

import TDSelect from "@/app/components/TDSelect";
import * as actionsModal from "@/setup/redux/modal/Actions";
import { requestPOST_NEW, requestPOST } from "@/utils/baseAPI";

const FormItem = Form.Item;

const ModalItem = (props) => {
  const dispatch = useDispatch();
  const { modalVisible, setModalVisible } = props;

  const [form] = Form.useForm();

  const [loadding, setLoadding] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    setModalVisible(false);
  };

  const onFinish = async () => {
    setBtnLoading(true);
    try {
      const values = await form.validateFields();
      const formData = form.getFieldsValue(true);
      console.log(formData);
      const res = await requestPOST_NEW(
        `api/v1/activationcodes/adminactivecode`,
        formData
      );

      if (res.status === 200) {
        toast.success("Thao thành công!");
        dispatch(actionsModal.setRandom());
        handleCancel();
      } else {
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
  const onFinishFailed = (error) => {
    console.log(error);
  };
  const handleSubmit = () => {
    form.submit();
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
        <Modal.Title className="text-white">Kích hoạt khoá học</Modal.Title>
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
              autoComplete="off"
              onFinishFailed={onFinishFailed}
              onFinish={onFinish}
              initialValues={{ type: 0 }}
            >
              <div className="row">
                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label="Hình thức kích hoạt"
                    name="type"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      options={[
                        {
                          value: 0,
                          label: "Trả trước",
                        },
                        {
                          value: 1,
                          label: "Trả sau",
                        },
                      ]}
                      onChange={(value, current) => {
                        form.setFieldValue("distributorUserId", null);
                        form.setFieldValue("distributorUser", null);
                      }}
                    />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.type !== currentValues.type
                    }
                  >
                    {({ getFieldValue }) => (
                      <FormItem
                        label="Cộng tác viên/Đại lý"
                        name="distributorUser"
                        rules={[
                          { required: true, message: "Không được để trống!" },
                        ]}
                      >
                        <TDSelect
                          reload
                          showSearch
                          placeholder=""
                          fetchOptions={async (keyword) => {
                            const res = await requestPOST(`api/users/search`, {
                              pageNumber: 1,
                              pageSize: 100,
                              advancedSearch: {
                                fields: ["name"],
                                keyword: keyword || null,
                              },
                              type:
                                getFieldValue("type") == 0
                                  ? 5
                                  : getFieldValue("type") == 1
                                  ? 4
                                  : null,
                            });
                            return res.data.map((item) => ({
                              ...item,
                              label: `${item.fullName} - ${item.userName}`,
                              value: item.id,
                            }));
                          }}
                          style={{
                            width: "100%",
                          }}
                          onChange={(value, current) => {
                            if (value) {
                              form.setFieldValue(
                                "distributorUserId",
                                current?.id
                              );
                            } else {
                              form.setFieldValue("distributorUserId", null);
                            }
                          }}
                        />
                      </FormItem>
                    )}
                  </Form.Item>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label="Loại mã kích hoạt"
                    name="activeType"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                    initialValue={0}
                  >
                    <Select
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
                    />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label="Khoá học"
                    name="course"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <TDSelect
                      reload
                      showSearch
                      placeholder=""
                      fetchOptions={async (keyword) => {
                        const res = await requestPOST(`api/v1/courses/search`, {
                          pageNumber: 1,
                          pageSize: 1000,
                          keyword: keyword,
                          type: 3,
                        });
                        return res?.data?.map((item) => ({
                          ...item,
                          label: `${item?.type == 1 ? "KHOÁ ONLINE - " : ""}${
                            item.title
                          }`,
                          value: item.id,
                        }));
                      }}
                      style={{
                        width: "100%",
                        height: "auto",
                      }}
                      onChange={(value, current) => {
                        if (value) {
                          form.setFieldValue("courseId", current?.id);
                        } else {
                          form.setFieldValue("courseId", null);
                        }
                      }}
                    />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label="Học sinh"
                    name="user"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <TDSelect
                      reload={true}
                      showSearch
                      placeholder=""
                      fetchOptions={async (keyword) => {
                        const res = await requestPOST(`api/users/search`, {
                          pageNumber: 1,
                          pageSize: 100,
                          type: 1,
                          keyword: keyword,
                        });
                        var _data = res?.data ?? [];
                        return _data?.map((item) => ({
                          ...item,
                          label: `${item.fullName} (${item?.userName})`,
                          value: item.id,
                        }));
                      }}
                      style={{
                        width: "100%",
                      }}
                      onChange={(value, current) => {
                        if (value) {
                          form.setFieldValue("userId", current?.id);
                        } else {
                          form.setFieldValue("userId", null);
                        }
                      }}
                    />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Nguồn khách hàng" name="userType">
                    <TDSelect
                      reload={true}
                      showSearch
                      placeholder=""
                      fetchOptions={async (keyword) => {
                        const res = await requestPOST(
                          `api/v1/categories/search`,
                          {
                            pageNumber: 1,
                            pageSize: 100,
                            isActive: true,
                            categoryGroupCode: "LoaiKichHoat",
                            keyword: keyword,
                          }
                        );
                        return res?.data?.map((item) => ({
                          ...item,
                          label: `${item.name}`,
                          value: item.id,
                        }));
                      }}
                      style={{
                        width: "100%",
                      }}
                      onChange={(value, current) => {
                        if (value) {
                          form.setFieldValue("userTypeId", current?.id);
                          form.setFieldValue("userTypeName", current?.name);
                        } else {
                          form.setFieldValue("userTypeId", null);
                          form.setFieldValue("userTypeName", null);
                        }
                      }}
                    />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label=" "
                    name="isCustomPrice"
                    valuePropName="checked"
                  >
                    <Checkbox>Giá tuỳ chọn</Checkbox>
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.isCustomPrice !== currentValues.isCustomPrice
                    }
                  >
                    {({ getFieldValue }) =>
                      getFieldValue("isCustomPrice") ? (
                        <FormItem label="Giá tiền" name="price">
                          <InputNumber
                            min={0}
                            placeholder=""
                            formatter={(value) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                          />
                        </FormItem>
                      ) : (
                        <></>
                      )
                    }
                  </Form.Item>
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
            onClick={handleSubmit}
            disabled={btnLoading}
          >
            <i className="fa fa-save me-2"></i>
            {"Tạo mới"}
          </Button>
        </div>
        <div className="d-flex justify-content-center  align-items-center">
          <Button
            className="btn-sm btn-secondary rounded-1 p-2  ms-2"
            onClick={handleCancel}
          >
            <i className="fa fa-times me-2"></i>Đóng
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalItem;
