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
  const { modalVisible, setModalVisible, onSubmit } = props;
  const dataModal = useSelector((state) => state.modal.dataModal);
  const [form] = Form.useForm();
  const [loadding, setLoadding] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    if (dataModal) {
      form.setFieldsValue(dataModal);
    }

    return () => {};
  }, [dataModal]);

  const handleCancel = () => {
    form.resetFields();
    setModalVisible(false);
    dispatch(actionsModal.setDataModal(null));
  };

  const onFinish = async () => {
    try {
      const formData = form.getFieldsValue(true);
      onSubmit(formData);
      handleCancel();
    } catch (error) {}
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
      size="sm"
      onExited={handleCancel}
      keyboard={true}
      scrollable={true}
      onEscapeKeyDown={handleCancel}
    >
      <Modal.Header className="bg-primary px-4 py-3">
        <Modal.Title className="text-white">Chỉnh sửa điểm</Modal.Title>
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
                <div className="col-xl-12">
                  <FormItem
                    label="Nhập điểm"
                    name="score"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <Input placeholder="" />
                  </FormItem>
                  <FormItem label="Số thứ tự" name="order">
                    <InputNumber placeholder="" min={0} />
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
            Cập nhật
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
