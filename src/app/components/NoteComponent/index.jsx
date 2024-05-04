import React, {useEffect, useState} from 'react';
import HeaderTitle from '@/app/components/HeaderTitle';
import {Modal, Button, Tab, Nav} from 'react-bootstrap';
import {Input} from 'antd';
import {useAuth} from '@/app/modules/auth';
import moment from 'moment';
import {requestPOST} from '@/utils/baseAPI';
import {toast} from 'react-toastify';
import _ from 'lodash';
const demo = [
  {
    id: 0,
    name: 'Nguyen Van A',
    time: '2022-10-04T01:40:22.818Z',
    content: 'Đơn xin nghỉ',
    type: 'note',
  },
  {
    id: 1,
    name: 'Nguyen Van A',
    time: '2022-10-04T01:33:22.818Z',
    content: 'đã gửi Đơn xin nghỉ cho Nguyễn Việt Hùng duyệt',
    type: 'action',
  },
];
const NoteComponent = ({parentId}) => {
  const {currentUser} = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  var firstName = currentUser?.firstName ?? '';
  var lastName = currentUser?.lastName ?? '';
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await requestPOST(
          `api/v1/timesheetlogs/search`,
          _.assign({
            pageNumber: 1,
            pageSize: 1000,
            parentId: parentId,
          })
        );
        setData(res?.data ?? []);
      } catch (error) {}
      setLoading(false);
    };
    if (loading) {
      fetchData();
    }

    return () => {};
  }, [loading]);
  useEffect(() => {
    if (!loading) {
      setLoading(true);
    }

    return () => {};
  }, [parentId]);

  const onFinish = async () => {
    try {
      var body = {
        content: inputValue,
        fileAttachs: null,
        isLogSystem: false,
        parentId: parentId,
      };

      const res = await requestPOST(`api/v1/timesheetlogs`, body);
      if (res) {
        toast.success('Cập nhật thành công!');
        setLoading(true);
        setInputValue('');
      } else {
        toast.error('Thất bại, vui lòng thử lại!');
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };
  return (
    <div className='mt-2'>
      <HeaderTitle title='Nhật ký hoạt động' />
      <div className='d-flex flex-row align-items-center'>
        <div className='symbol symbol-circle symbol-40px overflow-hidden me-3'>
          <div className={`symbol-label fs-3 bg-light-secondary text-primary`}>{`${
            firstName.toLocaleUpperCase().charAt(0) + lastName.toLocaleUpperCase().charAt(0)
          }`}</div>
        </div>
        <div className='flex-grow-1'>
          <Input
            placeholder='Nhập nội dung'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <div className=''>
          <Button
            disabled={inputValue?.trim().length > 0 ? false : true}
            className='btn btn-primary rounded-1 p-2  ms-2'
            onClick={() => {
              onFinish();
            }}
          >
            <i className='fas fa-paper-plane me-1'></i>Gửi
          </Button>
        </div>
      </div>
      <div className='scroll-y me-n5 pe-5 max-h-500px h-lg-auto mx-5 my-10'>
        {data?.map((item, index) => (
          <div key={index} className='d-flex justify-content-start mb-5 border-bottom pb-5'>
            <div className='d-flex flex-column align-items-start ms-2 mb-2'>
              <div className='d-flex align-items-center'>
                <a className='fs-5 fw-bold text-gray-900 text-hover-primary me-2'>
                  {item?.employeeName ?? ''}
                </a>
                <span className='text-muted fs-7 '>
                  {moment(item?.createdOn).format('DD/MM/YYYY HH:mm')}
                </span>
              </div>
              <div className='px-3 py-2 rounded bg-light-secondary text-dark mw-lg-400px text-start'>
                {item?.content ?? ''}
              </div>
            </div>
          </div>
        ))}
        {/* {data?.map((item, index) =>
          item?.type == 'note' ? (
            <div className='d-flex justify-content-start mb-5 border-bottom pb-5'>
              <div className='d-flex flex-column align-items-start ms-2'>
                <div className='d-flex align-items-center mb-2'>
                  <a className='fs-5 fw-bold text-gray-900 text-hover-primary me-2'>
                    {item?.name ?? ''}
                  </a>
                  <span className='text-muted fs-7 mb-1'>
                    {moment(item?.time).format('DD/MM/YYYY HH:mm')}
                  </span>
                </div>
                <div className='p-3 rounded bg-light-secondary text-dark mw-lg-400px text-start'>
                  {item?.content ?? ''}
                </div>
              </div>
            </div>
          ) : (
            <div className='d-flex justify-content-start mb-5 border-bottom pb-5'>
              <div className='d-flex flex-column align-items-start  ms-2'>
                <div className='d-flex align-items-center'>
                  <a className='fs-5 fw-bold text-gray-900 text-hover-primary'>
                    {item?.name ?? ''}
                  </a>
                  <span className='ms-3 rounded text-dark mw-lg-400px text-start'>
                    {item?.content ?? ''}
                  </span>
                </div>
                <span className='text-muted fs-7 '>
                  {moment(item?.time).format('DD/MM/YYYY HH:mm')}
                </span>
              </div>
            </div>
          )
        )} */}
      </div>
    </div>
  );
};

export default NoteComponent;
