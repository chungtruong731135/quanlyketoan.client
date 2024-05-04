import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Form, Input, Spin, Checkbox, InputNumber, DatePicker } from "antd";
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

  useEffect(() => {
    const fetchData = async () => {
      setLoadding(true);
      const res = await requestGET(`api/v1/articles/${id}`);

      var _data = res?.data ?? null;
      if (_data) {
        _data.publishingDate = _data?.publishingDate
          ? dayjs(_data.publishingDate)
          : null;
        _data.articlecatalog = _data?.articlecatalogId
          ? {
              value: _data?.articlecatalogId ?? null,
              label: _data?.articlecatalogName ?? null,
            }
          : null;
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

      form.setFieldsValue({ imageUri: arrImage.join("##") });

      const formData = form.getFieldsValue(true);
      if (id) {
        formData.id = id;
      }

      const res = id
        ? await requestPUT_NEW(`api/v1/articles/${id}`, formData)
        : await requestPOST_NEW(`api/v1/articles`, formData);

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
                  <FormItem
                    label="Tiêu đề"
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
                  <FormItem label="Mã" name="code">
                    <Input placeholder="" />
                  </FormItem>
                </div>
                <div className="col-xl- col-lg-6">
                  <FormItem label="Chuyên mục" name="articlecatalog">
                    <TDSelect
                      placeholder=""
                      fetchOptions={async (keyword) => {
                        const res = await requestPOST(
                          `api/v1/articlecatalogs/search`,
                          {
                            pageNumber: 1,
                            pageSize: 1000,
                            advancedSearch: {
                              fields: ["name"],
                              keyword: keyword || null,
                            },
                          }
                        );
                        return res.data.map((item) => ({
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
                          form.setFieldValue("articlecatalogId", current?.id);
                          form.setFieldValue(
                            "articlecatalogName",
                            current?.name
                          );
                        } else {
                          form.setFieldValue("articlecatalogId", null);
                          form.setFieldValue("articlecatalogName", null);
                        }
                      }}
                    />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Tác giả" name="author">
                    <Input placeholder="" />
                  </FormItem>
                </div>
                <div className="col col-xl-12">
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
                <div className="col-xl-12 col-lg-12">
                  <FormItem label="Ghi chú" name="description">
                    <TextArea rows={4} placeholder="" />
                  </FormItem>
                </div>
                <div className="col-xl-12 col-lg-12">
                  <FormItem label="Nội dung" name="content">
                    <TDEditorNew
                      data={
                        form.getFieldValue("content")
                          ? form.getFieldValue("content")
                          : ""
                      }
                      onChange={(value) => {
                        form.setFieldValue("content", value);
                      }}
                    />
                    {/* <CKEditor
                      editor={ClassicEditor}
                      data={
                        form.getFieldValue("content")
                          ? form.getFieldValue("content")
                          : ""
                      }
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        // console.log({ event, editor, data });
                        form.setFieldValue("content", data);
                      }}
                    /> */}
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Mức độ ưu tiên" name="sortOrder">
                    <InputNumber
                      placeholder=""
                      min={0}
                      max={1000}
                      style={{ width: "100%" }}
                    />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label="Thời gian phát hành" name="publishingDate">
                    <DatePicker
                      locale={locale}
                      format="DD/MM/YYYY"
                      style={{ width: "100%" }}
                    />
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem label=" " name="isActive" valuePropName="checked">
                    <Checkbox>Phát hành</Checkbox>
                  </FormItem>
                </div>
                <div className="col-xl-6 col-lg-6">
                  <FormItem
                    label=" "
                    name="isOutstanding"
                    valuePropName="checked"
                  >
                    <Checkbox>Là bài viết nổi bật</Checkbox>
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
