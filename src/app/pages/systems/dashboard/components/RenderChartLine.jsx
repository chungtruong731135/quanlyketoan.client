import React, { useEffect, useState } from "react";
import { Card, List, Popover, Spin } from "antd";
import clsx from "clsx";
import Chart from "react-apexcharts";
import { requestPOST } from "@/utils/baseAPI";
import { getColumnOptions } from "@/utils/chart";
import dayjs from "dayjs";
const RenderChartStatus = () => {
  const [options, setOptions] = useState(null);
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      var temp = [];
      for (let index = 0; index < 7; index++) {
        temp.push(dayjs().subtract(index, "day").format("DD/MM/YYYY"));
      }
      temp = temp.reverse();
      setOptions({
        chart: {
          height: 380,
          type: "line",
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
          width: 1.5,
        },
        title: {
          text: "",
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"],
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: temp,
          tickAmount: 10,
        },
        colors: [
          "#368ffb",
          "#f8b01c",
          "#f44561",
          "#4de396",
          "#775dd0",
          "#9CCC65",
          "#f4511e",
          "#33b2df",
          "#ab47bc",
          "#d4526e",
          "#13d8aa",
          "#A5978B",
          "#2b908f",
          "#f9a3a4",
          "#90ee7e",
          "#f48024",
          "#69d2e7",
        ],
      });
      setSeries([
        {
          name: "Số lượng tài khoản học sinh đăng ký mới",
          data: Array.from({ length: 7 }, () =>
            Math.floor(Math.random() * 100 + 50)
          ),
        },
        {
          name: "Số lượng tài khoản phụ huynh đăng ký mới",
          data: Array.from({ length: 7 }, () =>
            Math.floor(Math.random() * 100 + 50)
          ),
        },
        {
          name: "Số lượng khoá học được mua mới",
          data: Array.from({ length: 7 }, () =>
            Math.floor(Math.random() * 100 + 50)
          ),
        },
        {
          name: "Số lượng key kích hoạt",
          data: Array.from({ length: 7 }, () =>
            Math.floor(Math.random() * 100 + 50)
          ),
        },
        {
          name: "Số lượng key kích hoạt được cấp mới",
          data: Array.from({ length: 7 }, () =>
            Math.floor(Math.random() * 100 + 50)
          ),
        },
      ]);
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
        Biểu đồ thống kê theo ngày
      </h3>
      <Spin spinning={isLoading}>
        {options && series ? (
          <Chart
            options={options}
            type="line"
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
