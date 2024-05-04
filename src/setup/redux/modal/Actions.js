import {modalSlice, callTypes} from './Slice';

const {actions} = modalSlice;

export const setDataModal = (data) => (dispatch) => {
  dispatch(actions.setDataModal(data));
};

export const setDataModalPhuCap = (data) => (dispatch) => {
  dispatch(actions.setDataModalPhuCap(data));
};

export const setModalVisible = (data) => (dispatch) => {
  dispatch(actions.setModalVisible(data));
};

export const setModalPhuCapVisible = (data) => (dispatch) => {
  dispatch(actions.setModalPhuCapVisible(data));
};

export const setModalDanhSachChuyenDiVisible = (data) => (dispatch) => {
  dispatch(actions.setModalDanhSachChuyenDiVisible(data));
};

export const setDataSearch = (data) => (dispatch) => {
  dispatch(actions.setDataSearch(data));
};

export const resetData = () => (dispatch) => {
  dispatch(actions.resetData());
};

export const setRandom = () => (dispatch) => {
  dispatch(actions.setRandom());
};

export const setRandomUsers = () => (dispatch) => {
  dispatch(actions.setRandomUsers());
};

export const setDataTripModal = (data) => (dispatch) => {
  dispatch(actions.setDataTripModal(data));
};

export const setDataDatVe = (data) => (dispatch) => {
  dispatch(actions.setDataDatVe(data));
};

export const setDataDanhSachChuyenDiSearch = (data) => (dispatch) => {
  dispatch(actions.setDataDanhSachChuyenDiSearch(data));
};

export const setModalTripVisible = (data) => (dispatch) => {
  dispatch(actions.setModalTripVisible(data));
};

export const setModalDatVeVisible = (data) => (dispatch) => {
  dispatch(actions.setModalDatVeVisible(data));
};

export const setModalCategoryAttributeVisible = (data) => (dispatch) => {
  dispatch(actions.setModalCategoryAttributeVisible(data));
};

export const setModalAreaInfoVisible = (data) => (dispatch) => {
  dispatch(actions.setModalAreaInfoVisible(data));
};
export const setModalPermissionVisible = (data) => (dispatch) => {
  dispatch(actions.setModalPermissionVisible(data));
};
export const setCurrentRole = (data) => (dispatch) => {
  dispatch(actions.setCurrentRole(data));
};

export const setModalPhanHoiVisible = (data) => (dispatch) => {
  dispatch(actions.setModalPhanHoiVisible(data));
};
export const setDataPhanHoi = (data) => (dispatch) => {
  dispatch(actions.setDataPhanHoi(data));
};

export const setCurrentOrganizationUnit = (data) => (dispatch) => {
  dispatch(actions.setCurrentOrganizationUnit(data));
};

export const setModalOrganizationUnit = (data) => (dispatch) => {
  dispatch(actions.setModalOrganizationUnit(data));
};

export const setRandomPhuCap = () => (dispatch) => {
  dispatch(actions.setRandomPhuCap());
};

export const setRandomPhuLuc = () => (dispatch) => {
  dispatch(actions.setRandomPhuLuc());
};
