import {toAbsoluteUrl} from '@/utils/AssetHelpers';
import clsx from 'clsx';

export const employeeViewColumns = [
  {
    title: 'Họ và tên',
    dataIndex: 'name',
    key: 'name',
    render: (text, record, index) => {
      const nameArray = record.fullName.match(/\S+/g);
      const lastName = nameArray[nameArray.length - 1];
      const firstChar = lastName.charAt(0);
      let arr = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'muted'];
      const color = arr[index % arr.length];

      return (
        <>
          <div className='d-flex align-items-center'>
            {/* begin:: Avatar */}
            <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'>
              <a href='#'>
                {record?.imageUrl ? (
                  <div className='symbol-label'>
                    <img
                      src={toAbsoluteUrl(`${record?.imageUrl}`)}
                      alt={record?.fullName}
                      className='w-100'
                    />
                  </div>
                ) : (
                  <div className={`symbol-label fs-3 bg-light-${color} text-${color}`}>
                    {` ${firstChar} `}
                  </div>
                )}
              </a>
            </div>
            <div className='d-flex flex-column'>
              <a href='#' className='text-gray-800 text-hover-primary mb-1 fw-bolder'>
                {record?.fullName}
              </a>
              <span>{record?.employeeCode}</span>
            </div>
          </div>
        </>
      );
    },
  },
  {
    title: 'Mã nhân viên',
    dataIndex: 'employeeCode',
    key: 'employeeCode',
  },
  {
    title: 'Đơn vị công tác',
    dataIndex: 'organizationUnitName',
    key: 'organizationUnitName',
  },
  {
    title: 'Vị trí công việc',
    dataIndex: 'jobPositionName',
    key: 'jobPositionName',
  },
];
