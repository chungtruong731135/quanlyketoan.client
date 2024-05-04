import React, { useEffect, useState } from "react";
import { Select, Spin } from "antd";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { requestPOST } from "@/utils/baseAPI";
import _ from "lodash";
import moment from "moment";
import dayjs from "dayjs";

import weekOfYear from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat);
dayjs.extend(weekOfYear);
const RenderChartStatus = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState(0);
  const [typeDate, setTypeDate] = useState(0);

  const [optionLine, setOptionLine] = useState(null);
  const fromDateToDate = props?.fromDateToDate ?? {};

  const getOptionLine = (_data) => {
    setIsLoading(true);
    let arr_Data = [];
    let arr_Text = [];
    if (typeDate == 0) {
      let count = fromDateToDate.toDate.diff(fromDateToDate.fromDate, "day");
      for (let i = 0; i <= count; i++) {
        let time = fromDateToDate.fromDate.add(i, "day").format("YYYY-MM-DD");
        let item = _data?.find((item) => item?.name == time);
        let text = Date.UTC(
          moment(time).get("year"),
          moment(time).get("month"),
          moment(time).get("date")
        );

        arr_Data.push([text, type == 0 ? item?.amount ?? 0 : item?.count ?? 0]);
      }
    } else if (typeDate == 1) {
      let count = fromDateToDate.toDate.diff(fromDateToDate.fromDate, "week");
      for (let i = 0; i <= count; i++) {
        let time = fromDateToDate.fromDate.add(i, "w").format("YYYY-w");
        let item = _data?.find((item) => item?.name == time);
        arr_Text.push(time);

        arr_Data.push(type == 0 ? item?.amount ?? 0 : item?.count ?? 0);
      }
    } else {
      let count = fromDateToDate.toDate.diff(fromDateToDate.fromDate, "month");
      for (let i = 0; i <= count; i++) {
        let time = fromDateToDate.fromDate.add(i, "month").format("YYYY-M");
        let item = _data?.find((item) => item?.name == time);

        arr_Text.push(time);

        arr_Data.push(type == 0 ? item?.amount ?? 0 : item?.count ?? 0);
      }
    }

    var format = typeDate == 0 ? "%d/%m/%Y" : typeDate == 1 ? "%Y-%w" : "%Y-%m";
    setOptionLine({
      chart: {
        type: "spline",
      },
      title: {
        text: "",
      },
      yAxis: {
        title: null,
        min: 0,
      },

      xAxis:
        typeDate !== 0
          ? { categories: arr_Text }
          : {
              type: "datetime",
              labels: {
                formatter: function () {
                  return Highcharts.dateFormat(format, this.value);
                },
              },
            },
      tooltip: {
        crosshairs: true,
        shared: true,
        xDateFormat: format,
      },
      plotOptions: {
        series: {
          label: null,
        },
      },
      legend: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: type == 0 ? " Số tiền" : "Số lượt giao dịch",
          tooltip: {
            valueSuffix: type == 0 ? " VND" : " lượt",
          },
          data: arr_Data,
        },
      ],
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  useEffect(() => {
    const fetchData = async () => {
      const res = await requestPOST(`api/v1/dashboards/daily-bankhoahoc`, {
        fromDate: fromDateToDate.fromDate.format("YYYY-MM-DD"),
        toDate: fromDateToDate.toDate.format("YYYY-MM-DD"),
        type: typeDate,
      });

      var _data = res?.data ?? null;
      if (_data) {
        getOptionLine(_data);
      }
    };
    fetchData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDateToDate, type, typeDate]);
  console.log(optionLine);
  return (
    <div className="card card-xl-stretch mb-xl-5 p-5 border-0">
      <div className="card-header ribbon ribbon-top ribbon-vertical px-3">
        <div className="card-title ">
          <span className="fa fa-chart-bar me-3 "></span> Biểu đồ doanh thu thực
          nhận theo thời gian
        </div>
        <div className="card-toolbar">
          <div className="btn-group align-items-center mx-2">
            <span className="fw-bold">Lọc theo:</span>
            <div className="ms-3 w-100px">
              <Select
                placeholder="Chọn"
                style={{ width: "100%" }}
                options={[
                  {
                    value: 0,
                    label: "Ngày",
                  },
                  {
                    value: 1,
                    label: "Tuần",
                  },
                  {
                    value: 2,
                    label: "Tháng",
                  },
                ]}
                value={typeDate}
                onChange={(value) => {
                  setTypeDate(value);
                }}
              />
            </div>
          </div>
          <div className="mx-2 w-xl-200px w-lg-150px">
            <Select
              defaultValue={0}
              placeholder="Loại"
              style={{ width: "100%" }}
              options={[
                {
                  value: 0,
                  label: "Số tiền",
                },
                {
                  value: 1,
                  label: "Số lượt giao dịch",
                },
              ]}
              onChange={(value) => {
                setType(value);
              }}
            />
          </div>
        </div>
      </div>
      <div className="card-body">
        <Spin spinning={isLoading}>
          {isLoading ? (
            <div className="h-300px" />
          ) : (
            <HighchartsReact highcharts={Highcharts} options={optionLine} />
          )}
        </Spin>
      </div>
    </div>
  );
};

export default RenderChartStatus;
