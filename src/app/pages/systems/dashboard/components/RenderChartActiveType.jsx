import React, { useState, useEffect } from "react";
import { Card, DatePicker, List, Popover, Spin } from "antd";
import Chart from "react-apexcharts";
import { requestPOST } from "@/utils/baseAPI";
import { getPieOptions } from "@/utils/chart";
const RenderChartStatus = () => {
  const [options, setOptions] = useState(null);
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // const res = await requestPOST(`api/v1/datasets/report`, {
        //   reportType: "loaihinh",
        //   sourceType: 0,
        // });
        var _data = [
          {
            name: "Thông qua Đại lý",
            value: 324,
          },
          {
            name: "Thông qua Cộng tác viên",
            value: 456,
          },
          {
            name: "Tự động kích hoạt",
            value: 639,
          },
          {
            name: "Thông qua Sale",
            value: 124,
          },
        ];
        if (_data?.length > 0) {
          var temp = _data?.map((i) => i?.name ?? "Khác");
          if (temp?.length > 0) {
            setOptions(getPieOptions(temp));
          }

          setSeries(_data?.map((i) => i?.value ?? 0));
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {};
  }, []);
  const DropdownTime = () => {
    return (
      <div className="d-grid min-w-200px">
        <span className="text-primary fw-bold">Từ ngày</span>
        <DatePicker
          format="DD/MM/YYYY"
          placeholder="Từ ngày"
          style={{ width: "100%", marginTop: 5, marginBottom: 10 }}
          value={fromDate ? moment(fromDate, "DD/MM/YYYY") : ""}
          onChange={(date, dateString) => {
            setFromDate(dateString);
          }}
        />
        <span className="text-primary fw-bold">Đến ngày</span>
        <DatePicker
          format="DD/MM/YYYY"
          placeholder="Đến ngày"
          style={{ width: "100%", marginTop: 5, marginBottom: 10 }}
          value={toDate ? moment(toDate, "DD/MM/YYYY") : ""}
          disabledDate={(d) => d.isBefore(moment(fromDate, "DD/MM/YYYY"))}
          onChange={(date, dateString) => {
            setToDate(dateString);
          }}
        />

        <div className="d-flex align-items-center justify-content-center mt-2">
          <a
            className="btn btn-primary btn-sm m-btn m-btn--icon py-2 me-1"
            onClick={() => {
              setRefreshing(true);
            }}
          >
            <span>
              <i className="fas fa-search me-1"></i>
              <span className="">Xem</span>
            </span>
          </a>
          <a
            className="btn btn-secondary btn-sm m-btn m-btn--icon py-2 ms-1"
            onClick={() => {
              setFromDate("");
              setToDate("");
              setRefreshing(true);
            }}
          >
            <span>
              <i className="fas fa-sync me-1"></i>
              <span className="">Xoá</span>
            </span>
          </a>
        </div>
      </div>
    );
  };
  return (
    <div className="card card-xl-stretch mb-xl-5 p-5 border-0">
      <h3 className="card-title fw-bold mb-3 text-center">
        Biểu đồ thống kê phương thức kích hoạt khoá học
      </h3>
      <Spin spinning={isLoading}>
        {options && series ? (
          <Chart
            options={options}
            type="donut"
            series={series}
            height={400}
            width={"100%"}
          />
        ) : (
          <div className="h-300" />
        )}
      </Spin>
    </div>
  );
};

export default RenderChartStatus;
