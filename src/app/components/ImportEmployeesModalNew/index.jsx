import {useState, useEffect} from 'react';
import _ from 'lodash';

import {Spin, Input} from 'antd';
import {Modal, Button} from 'react-bootstrap';

import {requestPOST} from '@/utils/baseAPI';
import TableList from '@/app/components/TableList';
import {employeeViewColumns} from '@/app/components/GlobalColumnsTable';

const ModalItem = ({modalVisible, dataModal, setModalVisible, importData}) => {
  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState(10);
  const [count, setCount] = useState('');
  const [offset, setOffset] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [keySearch, setKeySearch] = useState('');

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
    },
  };
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await requestPOST(
          `api/v1/employees/search`,
          _.assign({
            pageNumber: offset,
            pageSize: size,
            orderBy: ['createdOn DESC'],
            notInIds: dataModal?.notInIds ?? [],
            advancedSearch: {
              fields: ['name', 'code'],
              keyword: keySearch || null,
            },
          })
        );
        setDataTable(res?.data ?? []);
        setCount(res?.totalCount ?? 0);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();

    return () => {};
  }, [offset, size, keySearch, dataModal]);

  const handleCancel = () => {
    setModalVisible(false);
  };

  const onFinish = () => {
    importData({selectedRows: selectedRows, selectedRowKeys: selectedRowKeys});
    handleCancel();
  };

  return (
    <Modal
      show={modalVisible}
      fullscreen={'lg-down'}
      size='xl'
      onExited={handleCancel}
      keyboard={true}
      scrollable={true}
      onEscapeKeyDown={handleCancel}
    >
      <Modal.Header className='bg-primary px-4 py-3'>
        <Modal.Title className='text-white'>Lựa chọn nhân viên</Modal.Title>
        <button
          type='button'
          className='btn-close btn-close-white'
          aria-label='Close'
          onClick={handleCancel}
        ></button>
      </Modal.Header>
      <Modal.Body>
        <Spin spinning={isLoading}>
          {!isLoading && (
            <div className='card-body card-dashboard px-3 py-3'>
              <div className='card-dashboard-body table-responsive'>
                <div className='mb-3'>
                  <Input
                    placeholder='Tìm kiếm'
                    value={keySearch}
                    onChange={(e) => setKeySearch(e.target.value)}
                    prefix={<i className='fas fa-search me-2'></i>}
                  />
                </div>
                <TableList
                  dataTable={dataTable}
                  columns={employeeViewColumns}
                  isPagination={true}
                  size={size}
                  count={count}
                  setOffset={setOffset}
                  setSize={setSize}
                  loading={loading}
                  rowSelection={rowSelection}
                  scroll={{y: 500}}
                />
              </div>
            </div>
          )}
        </Spin>
      </Modal.Body>
      <Modal.Footer className='bg-light px-4 py-2 align-items-center'>
        <div className='d-flex justify-content-center  align-items-center'>
          <Button className='btn-sm btn-primary rounded-1 py-2 px-5  ms-2' onClick={onFinish}>
            <i className='fa fa-save'></i>
            {'Chọn'}
          </Button>
        </div>
        <div className='d-flex justify-content-center  align-items-center'>
          <Button className='btn-sm btn-secondary rounded-1 p-2  ms-2' onClick={handleCancel}>
            <i className='fa fa-times'></i>Đóng
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalItem;
