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
  Tabs,
  Table,
  Popconfirm,
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
import TableList from "@/app/components/TableList";
const FormItem = Form.Item;

const { TextArea } = Input;

const ModalItem = (props) => {
  const dispatch = useDispatch();
  const { token } = authHelper.getAuth();
  const { modalVisible, setModalVisible } = props;
  const dataModal = useSelector((state) => state.modal.dataModal);

  const [form] = Form.useForm();
  const [offset, setOffset] = useState(1);
  const [size, setSize] = useState(10);

  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [dataTable, setDataTable] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const resTemp = await requestPOST(
        `api/v1/classsessionattendances/search`,
        _.assign({
          pageNumber: 1,
          pageSize: 1000,
          classSessionId: dataModal?.classSessionId,
        })
      );
      var _dataTemp = resTemp?.data ?? [];
      if (_dataTemp?.length > 0) {
        setDataTable(_dataTemp);
      } else {
        const res = await requestGET(
          `api/v1/courseclasses/${dataModal?.courseClassId}`
        );
        var _data = res?.data?.students ?? [];
        _data?.map((i) => (i.studentId = i?.userId));
        setDataTable(_data);
      }
      setLoading(false);
    };
    if (dataModal?.classSessionId) {
      fetchData();
    }
    return () => {};
  }, [dataModal?.classSessionId]);
  const handleCancel = () => {
    form.resetFields();
    setModalVisible(false);
    dispatch(actionsModal.setDataModal(null));
  };

  const onFinish = async () => {
    setBtnLoading(true);
    var arrStudent = [];
    dataTable?.map((i) => {
      arrStudent.push({
        studentId: i?.studentId,
        status: i?.status ?? 0,
      });
    });
    try {
      var body = {
        classSessionId: dataModal?.classSessionId,
        students: arrStudent,
      };
      const res = await requestPOST_NEW(`api/v1/classsessionattendances`, body);

      if (res.status === 200) {
        toast.success("Thao tác thành công!");
        // dispatch(actionsModal.setRandom());
      } else {
        toast.error("Thất bại, vui lòng thử lại!");
      }
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
    setBtnLoading(false);
  };

  const handleCheck = (userId, value) => {
    var temp = [...dataTable];
    var ind = temp.findIndex((i) => i.studentId == userId);
    if (ind > -1) {
      var item = temp[ind];
      item.status = value == true ? 1 : 0;
    }
    setDataTable(temp);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 80,
      render: (text, record, index) => (
        <div>{(offset - 1) * size + index + 1}</div>
      ),
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Tài khoản",
      dataIndex: "userName",
      key: "userName",
    },

    {
      title: "Điểm danh",
      dataIndex: "status",
      key: "status",
      width: 80,
      render: (text, record) => {
        return (
          <div className="text-center">
            <Checkbox
              checked={text == 1 ? true : false}
              onChange={(e) => handleCheck(record?.studentId, e.target.checked)}
            />
          </div>
        );
      },
    },
  ];
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
          <Modal.Title className="text-white">Danh sách điểm danh</Modal.Title>
          <button
            type="button"
            className="btn-close btn-close-white"
            aria-label="Close"
            onClick={handleCancel}
          ></button>
        </Modal.Header>
        <Modal.Body>
          <Spin spinning={loading}>
            <div className="table-responsive  min-h-300px">
              {/* <div className="mb-3 d-flex justify-content-end">
                <button
                  className="btn btn-primary btn-sm py-2"
                  onClick={() => {
                  }}
                >
                  <span>
                    <i className="fas fa-plus"></i>
                    <span className="">Thêm mới</span>
                  </span>
                </button>
              </div> */}

              <TableList
                loading={loading}
                dataTable={dataTable}
                columns={columns}
                isPagination={true}
                offset={offset}
                setOffset={setOffset}
                size={size}
                setSize={setSize}
                // scroll={{
                //   y: 500,
                // }}
              />
            </div>
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
    </>
  );
};

export default ModalItem;
