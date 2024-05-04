import {modalSlice, callTypes} from './Slice';

const {actions} = modalSlice;

export const setDataModal = (data) => (dispatch) => {
  dispatch(actions.setDataModal(data));
};

export const setModalVisible = (data) => (dispatch) => {
  dispatch(actions.setModalVisible(data));
};

export const setDataModalCongViec = (data) => (dispatch) => {
  dispatch(actions.setDataModalCongViec(data));
};

export const setModalCongViecVisible = (data) => (dispatch) => {
  dispatch(actions.setModalCongViecVisible(data));
};

export const setRandom = () => (dispatch) => {
  dispatch(actions.setRandom());
};

export const setDataSearch = (data) => (dispatch) => {
  dispatch(actions.setDataSearch(data));
};

export const setLstCongViec = (data) => (dispatch) => {
  dispatch(actions.setLstCongViec(data));
};
