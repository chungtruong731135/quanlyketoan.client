import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Spin } from "antd";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";

import { requestGET } from "@/utils/baseAPI";
import { useAuth } from "@/app/modules/auth/core/Auth";
import { getUserByToken, login } from "@/app/modules/auth/core/_requests";

const ModalItem = (props) => {
  const { dataModal, modalVisible, setModalVisible } = props;

  const [currentTenantId, setCurrentTenantId] = useState(dataModal?.id ?? null);

  const [lstTenant, setLstTenant] = useState([]);
  const [loadding, setLoadding] = useState(false);

  const { saveAuth, setCurrentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoadding(true);
      const res = await requestGET(`api/personal/tenants`);

      if (res && res.data) {
        console.log(res.data);
        setLstTenant(res.data);
      }
      setLoadding(false);
    };
    fetchData();
    return () => {};
  }, []);

  const handleCancel = () => {
    setModalVisible(false);
  };

  const onFinish = async () => {
    try {
      const res = await requestGET(
        `api/tokens/changetenant?tenant=${currentTenantId}`
      );
      console.log(res);
      if (res) {
        toast.success("Thay đổi công ty thành công!");
        //  handleCancel();
        try {
          saveAuth(res);
          const { data: user } = await getUserByToken();
          setCurrentUser(user);
          window.location.reload(false);
        } catch (error) {
          console.error(error);
          saveAuth(undefined);
        }
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
        <Modal.Title className="text-white">
          Lựa chọn công ty của bạn
        </Modal.Title>
        <button
          type="button"
          className="btn-close btn-close-white me-0"
          aria-label="Close"
          onClick={handleCancel}
        ></button>
      </Modal.Header>
      <Modal.Body>
        <Spin spinning={loadding}>
          {!loadding && (
            <>
              <div className="mb-13 text-center">
                <h1 className="mb-3">Lựa chọn công ty của bạn</h1>

                <div className="text-muted fw-semibold fs-5">
                  Công ty đang làm việc
                  <span className="fw-bold link-primary">
                    {" "}
                    {dataModal?.name}
                  </span>
                  .
                </div>
              </div>
              <div>
                {lstTenant.map((item, index) => (
                  <div className="mb-10" key={item?.id ?? index}>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        checked={item.id === currentTenantId}
                        name="tenantId"
                        id={item.id}
                        onChange={() => {
                          setCurrentTenantId(item.id);
                        }}
                      ></input>
                      <label
                        className="form-check-label text-gray-600 fw-bold"
                        htmlFor={item.id}
                      >
                        {item.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Spin>
      </Modal.Body>
      <Modal.Footer className="bg-light px-4 py-2 align-items-center">
        <button
          type="button"
          className="btn btn-secondary btn-sm "
          onClick={handleCancel}
        >
          <i className="fa fa-times me-2"></i>Huỷ bỏ
        </button>
        <button className="btn btn-primary btn-sm " onClick={onFinish}>
          <i className="fa fa-save me-2"></i>
          Đồng ý
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalItem;
