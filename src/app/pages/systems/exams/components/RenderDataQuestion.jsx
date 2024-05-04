import React, { useState, useEffect, useRef } from "react";
import { shallowEqual, useSelector, useDispatch } from "react-redux";

import {
  Form,
  Input,
  Select,
  Spin,
  Checkbox,
  InputNumber,
  Empty,
  Popconfirm,
} from "antd";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import _ from "lodash";

import * as actionsModal from "@/setup/redux/modal/Actions";
import {
  requestPOST,
  requestGET,
  requestPOST_NEW,
  requestPUT_NEW,
  API_URL,
  FILE_URL,
  requestDELETE,
} from "@/utils/baseAPI";
import { removeAccents } from "@/utils/slug";
import TDSelect from "@/app/components/TDSelect";
import ImageUpload from "@/app/components/ImageUpload";
import * as authHelper from "@/app/modules/auth/core/AuthHelpers";
import { handleImage } from "@/utils/utils";
import ModalAddQuestions from "./ModalAddQuestions";
import ModalEditScore from "./ModalEditScore";
import ModalEditQuestion from "../../questions/components/ChiTietModal";
const DATA_CHAR = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
const RenderDataQuestion = (props) => {
  const {
    currentVariation,
    setCurrentVariation,
    setModalVariationVisible,
    examId,
  } = props;
  const dispatch = useDispatch();
  const modalVisible = useSelector((state) => state.modal.modalVisible);

  const [dataQuestion, setDataQuestion] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalQuestionsVisible, setModalQuestionsVisible] = useState(false);
  const [modalEditScoreVisible, setModalEditScoreVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await requestPOST(`api/v1/examquestionorders/search`, {
        pageNumber: 1,
        pageSize: 1000,
        examVariationId: currentVariation?.id,
        orderBy: ["Order desc"],
      });
      var _data = res?.data ?? [];
      if (_data?.length > 0) {
        // _data = _.orderBy(_data, ["order"], "asc");
        setDataQuestion(_data);
      } else {
        setDataQuestion([]);
      }
      setIsLoading(false);
    };
    if (refreshing) {
      fetchData();
      setRefreshing(false);
    }
  }, [refreshing]);
  useEffect(() => {
    if (currentVariation?.id && !refreshing) {
      setRefreshing(true);
    }

    return () => {};
  }, [currentVariation]);

  const handleAddData = (dataSelect) => {
    var temp = [...dataQuestion];
    temp = temp.concat(dataSelect);
    temp = _.orderBy(temp, ["order"], ["asc"]);
    console.log(temp);
    setDataQuestion(temp);
  };
  const handleReplaceQuest = (questId, item) => {
    var temp = [...dataQuestion];
    var ind = temp.findIndex((i) => i.questionId == questId);
    temp.splice(ind, 1, item);
    setDataQuestion(temp);
  };
  const handleEditScore = (newData) => {
    var _data = [...dataQuestion];
    _data?.map((i) => {
      if (i?.questionId == newData?.id) {
        i.score = newData?.score;
        i.order = newData?.order;
      }
    });
    setDataQuestion(_data);
  };
  const handleDeleteQuest = (questId) => {
    var _data = [...dataQuestion];
    setDataQuestion(_data?.filter((i) => i.questionId !== questId));
  };
  const handleDeleteVariation = async () => {
    var res = await requestDELETE(
      `api/v1/examvariations/${currentVariation.id}`
    );
    if (res) {
      toast.success("Thao tác thành công!");
      setCurrentVariation(null);
      dispatch(actionsModal.setRandom());
    } else {
      toast.error("Thất bại, vui lòng thử lại!");
    }
  };

  const onFinish = async () => {
    if (dataQuestion?.length > 0) {
      var listQuest = [];
      dataQuestion?.map((i) => {
        listQuest.push({
          id: i?.id ?? null,
          order: i?.order ?? 0,
          score: i?.score ?? 0,
          questionId: i?.questionId,
        });
      });
    }
    var body = {
      code: currentVariation?.code,
      examId: examId,
      isDefault: currentVariation?.isDefault,
      isScoreQuestion: currentVariation?.isScoreQuestion,
      examQuestionOrders: listQuest,
      id: currentVariation?.id,
    };
    // if (currentVariation?.id) {
    //   body.id = currentVariation?.id;
    // }
    const res = currentVariation?.id
      ? await requestPUT_NEW(
          `api/v1/examvariations/${currentVariation?.id}`,
          body
        )
      : await requestPOST_NEW(`api/v1/examvariations`, body);

    if (res?.status === 200) {
      toast.success("Thao tác thành công!");
      setRefreshing(true);
    } else {
      const errors = Object.values(res?.data?.errors ?? {});
      let final_arr = [];
      errors.forEach((item) => {
        final_arr = _.concat(final_arr, item);
      });
      toast.error("Thất bại, vui lòng thử lại! " + final_arr.join(" "));
    }
  };
  return (
    <div className="">
      <div className="card-header d-flex align-items-center justify-content-between px-5 min-h-60px">
        <div className="card-title fs-3 mb-0">
          Đề:{" "}
          <span className="fw-bold text-primary ms-2">
            {currentVariation?.code ?? currentVariation?.id}
          </span>
        </div>
        <div className="card-toolbar">
          <a
            className="btn btn-info btn-sm btn-active-color-primary d-flex align-items-center py-2 me-2"
            data-toggle="m-tooltip"
            title="Lưu"
            onClick={onFinish}
          >
            <i className="fas fa-save fs-4 text-white"></i>
            <span className="fw-bold text-white ms-1 fs-5">Lưu</span>
          </a>
          <a
            className="btn  btn-secondary btn-sm btn-active-color-primary me-2"
            data-toggle="m-tooltip"
            title="Tải xuống"
            onClick={() => {
              toast.info("Chức năng đang cập nhật!");
            }}
          >
            <i className="fas fa-download fs-4 p-0"></i>
          </a>
          <a
            className="btn  btn-secondary btn-sm btn-active-color-primary me-2"
            data-toggle="m-tooltip"
            title="Chỉnh sửa"
            onClick={() => {
              dispatch(actionsModal.setDataModal(currentVariation));
              setModalVariationVisible(true);
            }}
          >
            <i className="fas fa-edit fs-4 p-0"></i>
          </a>
          {currentVariation?.id && !currentVariation?.isDefault ? (
            <Popconfirm
              title="Xoá mã đề?"
              onConfirm={() => {
                handleDeleteVariation();
              }}
              okText="Xoá"
              cancelText="Huỷ"
            >
              <a
                className="btn  btn-secondary btn-sm btn-active-color-primary me-2"
                data-toggle="m-tooltip"
                title="Xoá mã đề"
              >
                <i className="fas fa-trash text-danger fs-4 p-0"></i>
              </a>
            </Popconfirm>
          ) : (
            <></>
          )}

          <a
            className="btn  btn-secondary btn-sm btn-active-color-primary me-2"
            data-toggle="m-tooltip"
            title="Thêm câu hỏi"
            onClick={() => {
              dispatch(actionsModal.setDataModal({ type: "checkbox" }));
              setModalQuestionsVisible(true);
            }}
          >
            <i className="fas fa-plus fs-4 p-0"></i>
          </a>
        </div>
      </div>
      <div className="card-body p-5">
        <Spin spinning={isLoading}>
          {dataQuestion?.length > 0 ? (
            <div>
              {dataQuestion?.map((item, index) => (
                <div key={index} className="border mb-5">
                  <div className="flex-grow-1 p-3 border-bottom">
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                      <div className="fs-3 fw-bold ">Câu {index + 1}</div>
                      <div className="ms-2">
                        <a
                          className="btn btn-bg-light btn-icon btn-sm btn-active-color-primary me-2"
                          data-toggle="m-tooltip"
                          title="Sửa câu hỏi"
                          onClick={() => {
                            dispatch(
                              actionsModal.setDataModal({
                                id: item?.questionId,
                              })
                            );
                            dispatch(actionsModal.setModalVisible(true));
                          }}
                        >
                          <i className="fas fa-edit p-0"></i>
                        </a>
                        <a
                          className="btn btn-bg-light btn-icon btn-sm btn-active-color-primary me-2"
                          data-toggle="m-tooltip"
                          title="Sửa diểm"
                          onClick={() => {
                            dispatch(
                              actionsModal.setDataModal({
                                id: item?.questionId,
                                score: item?.score,
                                order: item?.order,
                              })
                            );
                            setModalEditScoreVisible(true);
                          }}
                        >
                          <i className="fas fa-pencil-alt p-0"></i>
                        </a>
                        <a
                          className="btn btn-bg-light btn-icon btn-sm btn-active-color-primary me-2"
                          data-toggle="m-tooltip"
                          title="Đổi câu hỏi"
                          onClick={() => {
                            dispatch(
                              actionsModal.setDataModal({
                                type: "radio",
                                questId: item?.questionId,
                              })
                            );
                            setModalQuestionsVisible(true);
                          }}
                        >
                          <i className="fas fa-sync p-0"></i>
                        </a>
                        <Popconfirm
                          title="Xoá câu hỏi?"
                          onConfirm={() => {
                            handleDeleteQuest(item?.questionId);
                          }}
                          okText="Xoá"
                          cancelText="Huỷ"
                        >
                          <a
                            className="btn btn-danger btn-icon btn-sm me-2"
                            data-toggle="m-tooltip"
                            title="Xoá câu hỏi"
                          >
                            <i className="fas fa-times p-0"></i>
                          </a>
                        </Popconfirm>
                      </div>
                    </div>
                    <div className="">
                      <span>Số thứ tự:</span>
                      <span className="ms-2 fs-4 fw-semibold">
                        {item?.order}
                      </span>
                    </div>
                    <div className="">
                      <span>Điểm trong bài thi:</span>
                      <span className="ms-2 fs-4 fw-semibold">
                        {item?.score}
                      </span>
                    </div>
                  </div>
                  <div className="flex-grow-1 p-5 border-bottom">
                    <div
                      className="fw-semibold fs-6 text-gray-600"
                      dangerouslySetInnerHTML={{ __html: item?.questionTitle }}
                    />
                    <div
                      className="fw-semibold fs-6"
                      dangerouslySetInnerHTML={{
                        __html: item?.questionTitleEn,
                      }}
                    />
                    {item?.questionContent ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item?.questionContent,
                        }}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="flex-grow-1">
                    {item?.questionType == 0 && item?.answers?.length > 0 ? (
                      <div className="d-flex flex-column ">
                        {item?.answers?.map((ans, ind) => (
                          <div className="p-5 border-bottom d-flex align-items-center">
                            <div
                              className={`mx-3 w-30px h-30px d-flex align-items-center justify-content-center ${
                                ans?.isRight
                                  ? "border border-success rounded-circle"
                                  : ""
                              }`}
                            >
                              <span className="fs-6  fw-semibold">
                                {DATA_CHAR[ind]}
                              </span>
                            </div>
                            <div
                              className="ms-2"
                              dangerouslySetInnerHTML={{ __html: ans?.content }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-5">
                        Đáp án:{" "}
                        <span className="fw-semibold ms-2 fs-5">
                          {item?.questionAnswerString}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty />
          )}
        </Spin>
      </div>
      {modalQuestionsVisible ? (
        <ModalAddQuestions
          modalVisible={modalQuestionsVisible}
          setModalVisible={setModalQuestionsVisible}
          handleAddData={handleAddData}
          handleReplaceQuest={handleReplaceQuest}
          notInIds={dataQuestion?.map((i) => i.questionId)}
          maxOrder={_.maxBy(dataQuestion, "order")?.order}
        />
      ) : (
        <></>
      )}
      {modalEditScoreVisible ? (
        <ModalEditScore
          modalVisible={modalEditScoreVisible}
          setModalVisible={setModalEditScoreVisible}
          onSubmit={handleEditScore}
        />
      ) : (
        <></>
      )}
      {modalVisible ? <ModalEditQuestion /> : <></>}
    </div>
  );
};

export default RenderDataQuestion;
