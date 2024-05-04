/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {requestPOST, requestPOST_NEW} from '@/utils/baseAPI';
import {toast} from 'react-toastify';
import * as actionsModal from '@/setup/redux/modal/Actions';
import _ from 'lodash';

const profileDetailsSchema = Yup.object().shape({
  Portal_Email: Yup.string().required('Trường bắt buộc nhập'),
  Portal_Company: Yup.string().required('Trường bắt buộc nhập'),
  Portal_Address: Yup.string().required('Trường bắt buộc nhập'),
  Portal_Hotline: Yup.string().required('Trường bắt buộc nhập'),
  VietQRSettings_ClientId: Yup.string().required('Trường bắt buộc nhập'),
  VietQRSettings_APIKey: Yup.string().required('Trường bắt buộc nhập'),
  VietQRSettings_ChecksumKey: Yup.string().required('Trường bắt buộc nhập'),
});
const initialValues = {
  Portal_Email: '',
  Portal_Company: '',
  Portal_Address: '',
  Portal_Hotline: '',
  VietQRSettings_ClientId:'',
  VietQRSettings_APIKey:'',
  VietQRSettings_ChecksumKey:'',
  EmailReceiveNotifications:'',
  EmailReceiveDiscussion:''
};

const UsersPage = () => {
  const dispatch = useDispatch();
  const random = useSelector((state) => state.modal.random);

  const [data, setData] = useState(initialValues);

  const [loading, setLoading] = useState(false);
  const updateData = (fieldsToUpdate) => {
    const updatedData = Object.assign(data, fieldsToUpdate);
    setData(updatedData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await requestPOST(`api/v1/appconfigs/search`, {
          pageNumber: 1,
          pageSize: 1000,
        });

        if (res && res.data) {
          const myObj = (res?.data ?? []).reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
          }, {});

          console.log('myObj', myObj);
          setData(myObj);
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();

    return () => {};
  }, [random]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: data,
    validationSchema: profileDetailsSchema,
    onSubmit: async (values) => {
      setLoading(true);
      var arrSettings = Object.entries(values).map(([key, value]) => ({key, value}));

      const res = await requestPOST_NEW(`api/v1/appconfigs/createall`, {data: arrSettings});

      if (res.status === 200) {
        toast.success('Cập nhật thành công!');
        dispatch(actionsModal.setRandom());
      } else {
        //toast.error('Thất bại, vui lòng thử lại!');
        const errors = Object.values(res?.data?.errors ?? {});
        let final_arr = [];
        errors.forEach((item) => {
          final_arr = _.concat(final_arr, item);
        });
        toast.error('Thất bại, vui lòng thử lại! ' + final_arr.join(' '));
      }

      setLoading(false);
    },
  });

  return (
    <>
      <div className='card card-xl-stretch mb-xl-9'>
        <div className='card-header border-0 cursor-pointer'>
          <h3 className='card-title fw-bold text-header-td fs-4 mb-0'>{'Cấu hình hệ thống'}</h3>
          <div className='d-flex align-items-center'></div>
        </div>
        <form onSubmit={formik.handleSubmit} noValidate className='form'>
          <div className='card-body border-top p-9'>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label required fw-bold fs-6'>Số điện thoại hỗ trợ</label>
              <div className='col-lg-8 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Số điện thoại hỗ trợ - hiển thị trên app'
                  {...formik.getFieldProps('Portal_Hotline')}
                />
                {formik.touched.Systems_Phone && formik.errors.Portal_Hotline && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.Portal_Hotline}</div>
                  </div>
                )}
              </div>
            </div>
          
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                <span className='required'>Tên công ty</span>
              </label>

              <div className='col-lg-8 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Các mệnh giá cách nhau bởi dấu ;'
                  {...formik.getFieldProps('Portal_Company')}
                />
                {formik.touched.Portal_Company && formik.errors.Portal_Company && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.Portal_Company}</div>
                  </div>
                )}
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                <span className='required'>Email</span>
              </label>

              <div className='col-lg-8 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='AppId'
                  {...formik.getFieldProps('Portal_Email')}
                />
                {formik.touched.Portal_Email && formik.errors.Portal_Email && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.Portal_Email}</div>
                  </div>
                )}
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                <span className='required'>Địa chỉ</span>
              </label>

              <div className='col-lg-8 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='MerchantName'
                  {...formik.getFieldProps('Portal_Address')}
                />
                {formik.touched.Portal_Address && formik.errors.Portal_Address && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.Portal_Address}</div>
                  </div>
                )}
              </div>
            </div>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                <span className=''>Email nhận thông báo khi có thảo luận</span>
              </label>

              <div className='col-lg-8 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Danh sách email, cách nhau bởi dấu ,'
                  {...formik.getFieldProps('EmailReceiveDiscussion')}
                />
               
              </div>
            </div>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                <span className=''>Email nhận thông báo khi có đăng ký khoá học</span>
              </label>

              <div className='col-lg-8 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='Danh sách email cách nhau bởi dấu ,'
                  {...formik.getFieldProps('EmailReceiveNotifications')}
                />
           
              </div>
            </div>
  
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                <span className='required'>VietQR Client ID</span>
              </label>

              <div className='col-lg-8 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='VietQR Client ID'
                  {...formik.getFieldProps('VietQRSettings_ClientId')}
                />
                {formik.touched.VietQRSettings_ClientId && formik.errors.VietQRSettings_ClientId && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.VietQRSettings_ClientId}</div>
                  </div>
                )}
              </div>
            </div>
            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                <span className='required'>VietQR API Key</span>
              </label>

              <div className='col-lg-8 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='VietQR API Key'
                  {...formik.getFieldProps('VietQRSettings_APIKey')}
                />
                {formik.touched.VietQRSettings_APIKey && formik.errors.VietQRSettings_APIKey && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.VietQRSettings_APIKey}</div>
                  </div>
                )}
              </div>
            </div>

            <div className='row mb-6'>
              <label className='col-lg-4 col-form-label fw-bold fs-6'>
                <span className='required'>VietQR Checksum Key</span>
              </label>

              <div className='col-lg-8 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid'
                  placeholder='ChecksumKey'
                  {...formik.getFieldProps('VietQRSettings_ChecksumKey')}
                />
                {formik.touched.VietQRSettings_ChecksumKey && formik.errors.VietQRSettings_ChecksumKey && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>{formik.errors.VietQRSettings_ChecksumKey}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='card-footer d-flex justify-content-end py-6 px-9'>
            <button type='button' className='btn btn-primary' disabled={loading} onClick={formik.handleSubmit}>
              {!loading && 'Lưu thay đổi'}
              {loading && (
                <span className='indicator-progress' style={{display: 'block'}}>
                  Please wait... <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UsersPage;
