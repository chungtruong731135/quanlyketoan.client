/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from "react";

import ItemsList from "./components/ItemsList";

const UsersPage = () => {
  const [dataSearch, setDataSearch] = useState(null);

  return (
    <>
      <div className="card card-xl-stretch mb-xl-9">
        <div className="px-3 py-3 border-bottom border-secondary border-bottom-solid d-flex align-items-center justify-content-between">
          <h3 className="card-title fw-bold text-header-td fs-4 mb-0">
            {"Khóa học"}
          </h3>
          <div className="card-toolbar">
            <div className="btn-group me-2 w-xl-250px w-lg-200px">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Nhập từ khoá tìm kiếm"
                onChange={(e) => {
                  setDataSearch({
                    ...dataSearch,
                    keywordSearch: e.target.value,
                  });
                }}
              />
            </div>
          </div>
        </div>

        <ItemsList dataSearch={dataSearch} />
      </div>
    </>
  );
};

export default UsersPage;
