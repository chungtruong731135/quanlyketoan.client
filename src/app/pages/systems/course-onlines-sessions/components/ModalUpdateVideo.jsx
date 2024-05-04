import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Form,
  Input,
  Spin,
  Checkbox,
  InputNumber,
  DatePicker,
  Radio,
} from "antd";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import _ from "lodash";

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
import locale from "antd/es/date-picker/locale/vi_VN";
import dayjs from "dayjs";
import FileUpload from "@/app/components/FileUpload";

const FormItem = Form.Item;

const { TextArea } = Input;

const ModalItem = (props) => {
  const dispatch = useDispatch();
  const { token } = authHelper.getAuth();
  const { modalVisible, setModalVisible } = props;
  const dataModal = useSelector((state) => state.modal.dataModal);
  const id = dataModal?.id ?? null;

  const [form] = Form.useForm();

  const [loadding, setLoadding] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [typeVideo, setTypeVideo] = useState(0);
  const [videoList, setVideoList] = useState([]);

  useEffect(() => {
    if (dataModal) {
      setVideoList(handleImage(dataModal?.videoUrl ?? "", FILE_URL));
      form.setFieldsValue({ ...dataModal });
    }
    return () => {};
  }, [id]);

  const handleCancel = () => {
    form.resetFields();

    setModalVisible(false);
    dispatch(actionsModal.setDataModal(null));
  };

  const onFinish = async () => {
    setBtnLoading(true);
    try {
      const formData = form.getFieldsValue(true);
      var body = { ...formData };
      if (typeVideo == 0) {
        let item = videoList?.length > 0 ? videoList[0] : null;
        body.videoUrl = item?.response?.data[0]?.url || item?.path;
      }

      const res = await requestPUT_NEW(
        `api/v1/classsessions/${dataModal?.id}`,
        body
      );

      if (res.status === 200) {
        toast.success("Cập nhật thành công!");
        dispatch(actionsModal.setRandom());
        handleCancel();
      } else {
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
      size="lg"
      onExited={handleCancel}
      keyboard={true}
      scrollable={true}
      onEscapeKeyDown={handleCancel}
    >
      <Modal.Header className="bg-primary px-4 py-3">
        <Modal.Title className="text-white">Cập nhật video</Modal.Title>
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
                  <FormItem label="Video nội dung buổi học (Khi buổi học kết thúc)">
                    <Radio.Group
                      className="mb-3"
                      onChange={(e) => setTypeVideo(e.target.value)}
                      value={typeVideo}
                    >
                      <Radio value={0}>Đính kèm</Radio>
                      <Radio value={1}>Đường dẫn</Radio>
                    </Radio.Group>
                    {typeVideo == 0 ? (
                      <Form.Item noStyle>
                        <FileUpload
                          maxCount={1}
                          accept="video/*"
                          URL={`${API_URL}/api/v1/attachments/public`}
                          fileList={videoList}
                          onChange={(e) => {
                            if (e?.file?.status === "error") {
                              toast.warning("Dung lượng quá lớn");
                            }
                            setVideoList(e.fileList);
                          }}
                          headers={{
                            Authorization: `Bearer ${token}`,
                          }}
                        />
                      </Form.Item>
                    ) : (
                      <Form.Item name="videoUrl" noStyle>
                        <Input placeholder="" />
                      </Form.Item>
                    )}
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
            <i className="fa fa-save"></i>
            {"Lưu"}
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
