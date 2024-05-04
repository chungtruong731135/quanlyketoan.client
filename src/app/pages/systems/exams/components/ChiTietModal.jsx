import React, { useState, useEffect, useRef } from "react";
import { shallowEqual, useSelector, useDispatch } from "react-redux";

import { Form, Input, Select, Spin, Checkbox, InputNumber } from "antd";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import _ from "lodash";

import * as actionsModal from "@/setup/redux/modal/Actions";
import {
  requestPOST,
  requestGET,
  requestPOST_NEW,
  requestPUT_NEW,
  API_URL,
  FILE_URL,
} from "@/utils/baseAPI";
import { removeAccents } from "@/utils/slug";
import TDSelect from "@/app/components/TDSelect";
import ImageUpload from "@/app/components/ImageUpload";
import * as authHelper from "@/app/modules/auth/core/AuthHelpers";
import { handleImage } from "@/utils/utils";
const FormItem = Form.Item;

const { TextArea } = Input;

const ModalItem = (props) => {
  const dispatch = useDispatch();
  const { token } = authHelper.getAuth();

  const dataModal = useSelector((state) => state.modal.dataModal);
  const modalVisible = useSelector((state) => state.modal.modalVisible);
  const id = dataModal?.id ?? null;

  const [form] = Form.useForm();

  const [loadding, setLoadding] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [image, setImage] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadding(true);
      const res = await requestGET(`api/v1/exams/${id}`);

      var _data = res?.data ?? null;
      if (_data) {
        _data.examinat = {
          value: _data?.examinatId,
          label: _data?.examinatTitle,
        };

        _data.questionLevel = {
          value: _data?.questionLevelId,
          label: _data?.questionLevelName,
        };
        _data.examArea = {
          value: _data?.examAreaId,
          label: _data?.examAreaName,
        };
        if (_data?.gradeIds?.length > 0) {
          let temp = [];
          let tmpIds = _data?.gradeIds?.split("##");
          let tmpNames = _data?.gradeNames?.split("##");
          tmpIds?.map((i, index) => {
            temp.push({
              value: i,
              label: tmpNames[index],
            });
          });
          _data.grades = temp;
        }
        setImage(handleImage(_data?.avatar ?? "", FILE_URL));

        form.setFieldsValue(_data);
      }
      setLoadding(false);
    };
    if (id) {
      fetchData();
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = () => {
    form.resetFields();
    /*  props.setDataModal(null);
    props.setModalVisible(false); */
    dispatch(actionsModal.setModalVisible(false));
  };

  const onFinish = async () => {
    setBtnLoading(true);
    try {
      const formData = form.getFieldsValue(true);
      var body = { ...formData };
      let arrImage = [];
      image.forEach((i) => {
        if (i?.response) {
          arrImage.push(i.response.data[0].url);
        } else {
          arrImage.push(i?.path);
        }
      });

      body.avatar = arrImage?.join("##");
      if (body?.grades?.length > 0) {
        body.gradeIds = body?.grades?.map((i) => i.value)?.join("##");
      } else {
        body.gradeIds = null;
      }
      if (id) {
        body.id = id;
      }

      const res = id
        ? await requestPUT_NEW(`api/v1/exams/${id}`, body)
        : await requestPOST_NEW(`api/v1/exams`, body);

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
              autoComplete="off"
              onFinishFailed={onFinishFailed}
              onFinish={onFinish}
            >
              <div className="row">
                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label="Tiêu đề"
                    name="title"
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
                    label="Mã"
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
                    label="Kỳ thi"
                    name="examinat"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <TDSelect
                      reload
                      showSearch
                      placeholder=""
                      fetchOptions={async (keyword) => {
                        const res = await requestPOST(
                          `api/v1/examinats/search`,
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
                        height: "auto",
                      }}
                      onChange={(value, current) => {
                        if (value) {
                          form.setFieldValue("examinatId", current?.id);
                          form.setFieldValue("questionLevel", null);
                          form.setFieldValue("questionLevelId", null);
                        } else {
                          form.setFieldValue("examinatId", null);
                          form.setFieldValue("questionLevel", null);
                          form.setFieldValue("questionLevelId", null);
                        }
                      }}
                    />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Khối lớp" name="grades">
                    <TDSelect
                      reload
                      mode="multiple"
                      placeholder=""
                      fetchOptions={async (keyword) => {
                        const res = await requestPOST(
                          `api/v1/categories/search`,
                          {
                            pageNumber: 1,
                            pageSize: 100,
                            categoryGroupCode: "KhoiLop",
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
                        height: "auto",
                      }}
                      onChange={() => {
                        form.setFieldValue("questionLevel", null);
                        form.setFieldValue("questionLevelId", null);
                      }}
                    />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label="Loại kỳ thi"
                    name="type"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                    initialValue={1}
                  >
                    <Select
                      style={{ width: "100%" }}
                      options={[
                        {
                          value: 0,
                          label: "Đề thi theo chương trình học",
                        },
                        {
                          value: 1,
                          label: "Đề thi thử",
                        },
                      ]}
                    />
                  </FormItem>
                </div>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.type !== currentValues.type
                  }
                >
                  {({ getFieldValue }) =>
                    getFieldValue("type") == 0 ? (
                      <div className="col-xl-6 col-lg-6">
                        <FormItem label="Chương trình học" name="questionLevel">
                          <TDSelect
                            reload
                            showSearch
                            placeholder=""
                            fetchOptions={async (keyword) => {
                              const res = await requestPOST(
                                `api/v1/questionLevels/search`,
                                {
                                  pageNumber: 1,
                                  pageSize: 100,
                                  keyword: keyword,
                                  examinatId: getFieldValue("examinatId"),
                                  gradeIds: getFieldValue("grades")?.map(
                                    (i) => i.value
                                  ),
                                }
                              );
                              return res?.data?.map((item) => ({
                                ...item,
                                label: `${item.name} - ${item?.topicName} - ${item?.courseTitle}`,
                                value: item.id,
                              }));
                            }}
                            style={{
                              width: "100%",
                              height: "auto",
                            }}
                            onChange={(value, current) => {
                              if (value) {
                                form.setFieldValue(
                                  "questionLevelId",
                                  current?.id
                                );
                              } else {
                                form.setFieldValue("questionLevelId", null);
                              }
                            }}
                          />
                        </FormItem>
                      </div>
                    ) : (
                      <></>
                    )
                  }
                </Form.Item>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Thứ tự" name="sortOrder">
                    <InputNumber
                      placeholder=""
                      min={0}
                      max={1000}
                      style={{ width: "100%" }}
                    />
                  </FormItem>
                </div>
                <div className="col-xl-12 col-lg-12">
                  <FormItem label="Mô tả" name="description">
                    <TextArea rows={4} placeholder="" />
                  </FormItem>
                </div>

                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Cấp độ" name="examArea">
                    <TDSelect
                      reload
                      showSearch
                      placeholder=""
                      fetchOptions={async (keyword) => {
                        const res = await requestPOST(
                          `api/v1/examAreas/search`,
                          {
                            pageNumber: 1,
                            pageSize: 1000,
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
                        height: "auto",
                      }}
                      onChange={(value, current) => {
                        if (value) {
                          form.setFieldValue("examAreaId", current?.id);
                        } else {
                          form.setFieldValue("examAreaId", null);
                        }
                      }}
                    />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label="Thời gian làm bài"
                    name="duration"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <InputNumber
                      placeholder=""
                      min={0}
                      max={1000}
                      style={{ width: "100%" }}
                      addonAfter="Phút"
                    />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Tổng số câu hỏi" name="totalQuestion">
                    <InputNumber
                      placeholder=""
                      min={0}
                      max={1000}
                      style={{ width: "100%" }}
                    />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Tổng điểm" name="totalScore">
                    <InputNumber
                      placeholder=""
                      min={0}
                      max={1000}
                      style={{ width: "100%" }}
                    />
                  </FormItem>
                </div>
                <div className="col-xl-6">
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
                  <FormItem label=" " name="isFree" valuePropName="checked">
                    <Checkbox>Miễn phí</Checkbox>
                  </FormItem>
                  <FormItem label="" name="isActive" valuePropName="checked">
                    <Checkbox>Hoạt động</Checkbox>
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
            onClick={handleSubmit}
            disabled={btnLoading}
          >
            <i className="fa fa-save me-2"></i>
            {id ? "Lưu" : "Tạo mới"}
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
