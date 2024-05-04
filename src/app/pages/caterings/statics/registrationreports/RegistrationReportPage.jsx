import { useState } from "react";
import { useDispatch } from "react-redux";
import * as actionsModal from "@/setup/redux/modal/Actions";

import ItemsList from "./components/ItemsList";
import TDSelect from "@/app/components/TDSelect";
import { requestPOST } from "@/utils/baseAPI";
import PageHeader from "./components/PageHeader";

const UsersPage = () => {
  const dispatch = useDispatch();

  const [dataSearch, setDataSearch] = useState(null);

  return (
    <>
      <PageHeader title="Báo cáo lượt đăng ký" />

      <ItemsList dataSearch={dataSearch} />
    </>
  );
};

export default UsersPage;
