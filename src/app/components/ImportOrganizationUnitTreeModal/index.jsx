import { useState, useEffect } from "react";
import _ from "lodash";

import { Spin, Tree } from "antd";
import { Modal, Button } from "react-bootstrap";

import { requestPOST } from "@/utils/baseAPI";

const ModalItem = ({
  modalVisible,
  dataModal,
  setModalVisible,
  importData,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await requestPOST(`api/v1/organizationunits/search`, {
          advancedSearch: {
            fields: ["name", "code"],
            keyword: null,
          },
          pageNumber: 1,
          pageSize: 100000,
          orderBy: ["name"],
        });

        const nest = (items, id = null, link = "parentId") =>
          items
            .filter((item) => item[link] === id)
            .map((item) => ({
              ...item,
              title: item.name,
              key: item.id,
              children: nest(items, item.id),
              disabled: (dataModal?.notInIds ?? []).includes(item.id),
            }));
        let tmp = nest(res?.data ?? []);
        setTreeData(tmp);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();

    return () => {};
  }, []);

  const handleCancel = () => {
    setModalVisible(false);
  };

  const onFinish = () => {
    importData({
      selectedRows: selectedRows,
      selectedRowKeys: selectedRowKeys,
    });
    handleCancel();
  };

  const onSelect = (selectedKeys, info) => {};
  const onCheck = (checkedKeysValue, info) => {
    setSelectedRowKeys(checkedKeysValue?.checked ?? []);
    setSelectedRows(info?.checkedNodes ?? []);
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
        <Modal.Title className="text-white">Lựa chọn đơn vị</Modal.Title>
        <button
          type="button"
          className="btn-close btn-close-white"
          aria-label="Close"
          onClick={handleCancel}
        />
      </Modal.Header>
      <Modal.Body>
        <Spin spinning={loading}>
          {!loading && (
            <div className="card-body card-dashboard px-3 py-3">
              <div className="card-dashboard-body table-responsive h-500px">
                <Tree
                  checkedKeys={selectedRowKeys}
                  onSelect={onSelect}
                  onCheck={onCheck}
                  treeData={treeData}
                  showLine={{ showLeafIcon: false }}
                  checkable={true}
                  checkStrictly={true}
                  defaultExpandAll={true}
                  height={500}
                />
              </div>
            </div>
          )}
        </Spin>
      </Modal.Body>
      <Modal.Footer className="bg-light px-4 py-2 align-items-center">
        <div className="d-flex justify-content-center  align-items-center">
          <Button
            className="btn-sm btn-primary rounded-1 py-2 px-5  ms-2"
            onClick={onFinish}
          >
            <i className="fa fa-save"></i>
            {"Chọn"}
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
