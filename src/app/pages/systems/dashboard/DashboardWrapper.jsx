import React, { useState, useEffect } from "react";
import moment from "moment";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import locale from "antd/es/date-picker/locale/vi_VN";
import { DatePicker, Space } from "antd";

import {
  RenderChartActiveType,
  RenderOverview,
  RenderChartLine,
  RenderChartMoney,
  RenderChartCourse,
  RenderChartCourseOnline,
  RenderChartRevenue,
} from "./components";
import { useAuth } from "@/app/modules/auth";

const { RangePicker } = DatePicker;

const DashboardWrapper = () => {
  const dateFormat = "DD/MM/YYYY";
  const { currentUser } = useAuth();
  const [fromDateToDate, setFromDateToDate] = useState({
    fromDate: dayjs().startOf("month"),
    toDate: dayjs().endOf("month"),
  });

  const onChange = (date, dateString) => {
    setFromDateToDate({
      fromDate: date[0],
      toDate: date[1],
    });
  };

  return currentUser?.type == 0 || currentUser?.type == null ? (
    <div className="mb-xl-9">
      <div className="mb-5">
        <RenderOverview />
      </div>
      <div className={`card card-xl-stretch mb-xl-5`}>
        <div className="card-header min-h-50px">
          <h3 className="card-title fw-bold text-primary">
            Thống kê chung theo thời gian
          </h3>
          <div className="card-toolbar">
            <RangePicker
              locale={locale}
              onChange={onChange}
              //defaultValue={[dayjs().startOf('month'), dayjs().endOf('month')]}
              value={[fromDateToDate?.fromDate, fromDateToDate?.toDate]}
              format={dateFormat}
            />
          </div>
        </div>
        <div className="card-body">
          <div className="row ">
            {/* <div className="col-xl-4">
              <RenderChartActiveType />
            </div>
            <div className="col-xl-8">
              <RenderChartLine />
            </div> */}
            <div className="col-12">
              <RenderChartMoney fromDateToDate={fromDateToDate} />
            </div>
            <div className="col-12">
              <RenderChartRevenue fromDateToDate={fromDateToDate} />
            </div>
            <div className="col-12">
              <RenderChartCourse fromDateToDate={fromDateToDate} />
            </div>
            <div className="col-12">
              <RenderChartCourseOnline fromDateToDate={fromDateToDate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default DashboardWrapper;
