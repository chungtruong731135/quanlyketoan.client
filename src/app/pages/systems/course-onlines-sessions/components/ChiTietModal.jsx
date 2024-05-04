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
  const dataModal = useSelector((state) => state.modal.dataModal);
  const modalVisible = useSelector((state) => state.modal.modalVisible);
  const id = dataModal?.id ?? null;

  const [form] = Form.useForm();
  const [image, setImage] = useState([]);

  const [loadding, setLoadding] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [typeVideo, setTypeVideo] = useState(0);
  const [videoList, setVideoList] = useState([]);
  const [fileDocuments, setFileDocuments] = useState([]);
  const [fileAssignments, setFileAssignments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadding(true);
      const res = await requestGET(`api/v1/classsessions/${id}`);

      var _data = res?.data ?? null;
      if (_data) {
        _data.courseClass = _data?.courseClassId
          ? {
              value: _data?.courseClassId,
              label: _data?.courseClassName,
            }
          : null;
        _data.startTime = _data?.startTime ? dayjs(_data?.startTime) : null;
        _data.endTime = _data?.endTime ? dayjs(_data?.endTime) : null;
        setVideoList(handleImage(_data?.videoUrl ?? "", FILE_URL));
        setFileDocuments(handleImage(_data?.fileDocuments ?? "", FILE_URL));
        setFileAssignments(handleImage(_data?.fileAssignments ?? "", FILE_URL));
        // if (_data?.gradeIds?.length > 0) {
        //   let temp = [];
        //   let tmpIds = _data?.gradeIds?.split("##");
        //   let tmpNames = _data?.gradeNames?.split("##");
        //   tmpIds?.map((i, index) => {
        //     temp.push({
        //       value: i,
        //       label: tmpNames[index],
        //     });
        //   });
        //   _data.grades = temp;
        // }
        form.setFieldsValue({ ..._data });
      }

      setLoadding(false);
    };
    if (id) {
      fetchData();
    } else if (dataModal?.courseClassId) {
      form.setFieldsValue({
        courseClassId: dataModal?.courseClassId,
        courseClass: {
          value: dataModal?.courseClassId,
          label: dataModal?.courseClassName,
        },
      });
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = () => {
    form.resetFields();
    /*  props.setDataModal(null);
    props.setModalVisible(false); */
    dispatch(actionsModal.setModalVisible(false));
    dispatch(actionsModal.setDataModal(null));
  };

  const onFinish = async () => {
    setBtnLoading(true);
    try {
      const formData = form.getFieldsValue(true);
      var body = { ...formData };
      // let arrImage = [];
      // image.forEach((i) => {
      //   if (i?.response) {
      //     arrImage.push(i?.response?.data[0]?.url);
      //   } else {
      //     arrImage.push(i?.path);
      //   }
      // });
      // body.avatar = arrImage?.join("##");
      let arrDocument = [];
      fileDocuments.forEach((i) => {
        if (i?.response) {
          arrDocument.push(i?.response?.data[0]?.url);
        } else {
          arrDocument.push(i?.path);
        }
      });
      body.fileDocuments = arrDocument?.join("##");
      let arrAssignment = [];
      fileAssignments.forEach((i) => {
        if (i?.response) {
          arrAssignment.push(i?.response?.data[0]?.url);
        } else {
          arrAssignment.push(i?.path);
        }
      });
      body.fileAssignments = arrAssignment?.join("##");
      if (typeVideo == 0) {
        let item = videoList?.length > 0 ? videoList[0] : null;
        body.videoUrl = item?.response?.data[0]?.url || item?.path;
      }
      body.gradeIds =
        body?.grades?.length > 0
          ? body?.grades?.map((i) => i.value)?.join("##")
          : null;
      body.startTime = `${dayjs(body.startTime).format("YYYY-MM-DD")}T${dayjs(
        body.startTime
      ).format("HH:mm:ss")}`;
      body.endTime = `${dayjs(body.endTime).format("YYYY-MM-DD")}T${dayjs(
        body.endTime
      ).format("HH:mm:ss")}`;

      body.meetingNumber = body?.meetingNumber?.replace(/\s/g, "") ?? "";
      body.zoomPassword = body?.zoomPassword?.replace(/\s/g, "") ?? "";
      if (id) {
        body.id = id;
      }
      // console.log(body);
      const res = id
        ? await requestPUT_NEW(`api/v1/classsessions/${id}`, body)
        : await requestPOST_NEW(`api/v1/classsessions`, body);

      if (res.status === 200) {
        toast.success("Cập nhật thành công!");
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
                    label="Khoá học"
                    name="courseClass"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <TDSelect
                      reload
                      showSearch
                      placeholder=""
                      disabled={dataModal?.courseClassId ? true : false}
                      fetchOptions={async (keyword) => {
                        const res = await requestPOST(
                          `api/v1/courseclasses/search`,
                          {
                            pageNumber: 1,
                            pageSize: 100,
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
                          form.setFieldValue("courseClassId", current?.id);
                        } else {
                          form.setFieldValue("courseClassId", null);
                        }
                      }}
                    />
                  </FormItem>
                </div>

                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label="Tên buổi học"
                    name="name"
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
                    label="Thời gian bắt đầu"
                    name="startTime"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                    ]}
                  >
                    <DatePicker
                      locale={locale}
                      showTime={true}
                      format={"DD/MM/YYYY HH:mm"}
                    />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label="Thời gian kết thúc"
                    name="endTime"
                    rules={[
                      { required: true, message: "Không được để trống!" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("startTime") < value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "Thời gian kết thúc phải lớn hơn hoặc bằng thời gian bắt đầu!"
                            )
                          );
                        },
                      }),
                    ]}
                  >
                    <DatePicker
                      locale={locale}
                      showTime={true}
                      format={"DD/MM/YYYY HH:mm"}
                    />
                  </FormItem>
                </div>

                <div className="col-xl-12">
                  <FormItem label="Nội dung buổi học" name="content">
                    <TextArea rows={4} placeholder="" />
                  </FormItem>
                </div>
                <div className="col-xl-12">
                  <FormItem label="Ghi chú" name="description">
                    <TextArea rows={4} placeholder="" />
                  </FormItem>
                </div>
                {/* <div className="col-xl-6 col-lg-6">
                  <FormItem label="zoomSDKKey" name="zoomSDKKey">
                    <Input placeholder="" />
                  </FormItem>
                </div> */}
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="meetingNumber" name="meetingNumber">
                    <Input placeholder="" />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="zoomPassword" name="zoomPassword">
                    <Input placeholder="" />
                  </FormItem>
                </div>

                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Thứ tự" name="sortOrder">
                    <InputNumber placeholder="" min={0} />
                  </FormItem>
                </div>
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
                <div className="col-xl-12">
                  <Form.Item label="Tài liệu">
                    <FileUpload
                      URL={`${API_URL}/api/v1/attachments/public`}
                      fileList={fileDocuments}
                      onChange={(e) => setFileDocuments(e.fileList)}
                      headers={{
                        Authorization: `Bearer ${token}`,
                      }}
                    />
                  </Form.Item>
                </div>
                <div className="col-xl-12">
                  <Form.Item label="Bài tập về nhà">
                    <FileUpload
                      URL={`${API_URL}/api/v1/attachments/public`}
                      fileList={fileAssignments}
                      onChange={(e) => setFileAssignments(e.fileList)}
                      headers={{
                        Authorization: `Bearer ${token}`,
                      }}
                    />
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
