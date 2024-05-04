import { useState } from "react";
import { useDispatch } from "react-redux";

import * as actionsModal from "@/setup/redux/modal/Actions";

import ItemsList from "./components/ItemsList";
import TDSelect from "@/app/components/TDSelect";
import { requestPOST } from "@/utils/baseAPI";

const UsersPage = () => {
  const dispatch = useDispatch();

  const [dataSearch, setDataSearch] = useState(null);

  return (
    <>
      <div className="card card-xl-stretch mb-xl-9">
        <div className="px-3 py-3 border-bottom border-secondary border-bottom-solid d-flex align-items-center justify-content-between flex-wrap">
          <h3 className="card-title fw-bold text-header-td fs-4 mb-0 mb-lg-2">
            {"Bài viết"}
          </h3>
          <div className="card-toolbar">
            <div className="btn-group me-2 w-xl-250px w-lg-200px">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Nhập từ khoá tìm kiếm"
                onChange={(e) => {
                  setDataSearch({ ...dataSearch, keyword: e.target.value });
                }}
              />
            </div>
            <div className="btn-group mx-2 align-items-center w-xl-300px w-lg-250px">
              <span className="fw-bold  w-100px">Chuyên mục:</span>
              <div className="ms-2 w-100">
                <TDSelect
                  reload={true}
                  showSearch
                  placeholder="Chọn chuyên mục"
                  fetchOptions={async (keyword) => {
                    const res = await requestPOST(
                      `api/v1/articlecatalogs/search`,
                      {
                        pageNumber: 1,
                        pageSize: 100,
                        keyword: keyword,
                      }
                    );
                    return res?.data?.map((item) => ({
                      ...item,
                      label: `${item.name}`,
                      value: item.id,
                    }));
                  }}
                  style={{
                    width: "100%",
                  }}
                  onChange={(value, current) => {
                    if (value) {
                      setDataSearch({
                        ...dataSearch,
                        articleCatalogId: current?.id,
                      });
                    } else {
                      setDataSearch({ ...dataSearch, articleCatalogId: null });
                    }
                  }}
                />
              </div>
            </div>
            <button
              className="btn btn-primary btn-sm py-2 me-2"
              onClick={() => {
                dispatch(
                  actionsModal.setDataModal({ ...null, readOnly: false })
                );
                dispatch(actionsModal.setModalVisible(true));
              }}
            >
              <span>
                <i className="fas fa-plus"></i>
                <span className="">Thêm mới</span>
              </span>
            </button>
          </div>
        </div>
        <ItemsList dataSearch={dataSearch} />
      </div>
    </>
  );
};

export default UsersPage;
