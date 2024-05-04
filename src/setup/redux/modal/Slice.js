import {createSlice} from '@reduxjs/toolkit';
const initialState = {
  random: null,
  randomPhuCap: null,
  randomPhuLuc: null,
  randomUsers: null,
  dataModal: null,
  dataModalPhuCap: null,

  modalVisible: false,
  modalPhuCapVisible: false,

  dataSearch: null,

  modalDanhSachChuyenDiVisible: false,
  dataDanhSachChuyenDiSearch: null,

  dataTripModal: null,
  modalTripVisible: false,

  dataDatXe: null,
  modalDatXeVisible: false,

  modalCategoryAttributeVisible: false,

  modalAreaInfoVisible: false,
  modalPermissionVisible: false,

  modalPhanHoiVisible: false,
  dataPhanHoi: null,

  currentRole: null,

  currentOrganizationUnit: null,
  modalOrganizationUnit: null,

  listLoading: false,
  actionsLoading: false,
  error: null,
};
export const callTypes = {
  list: 'list',
  action: 'action',
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState: initialState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    startCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },

    setDataModal: (state, action) => {
      const payload = action.payload;
      state.dataModal = payload;
    },

    setDataModalPhuCap: (state, action) => {
      const payload = action.payload;
      state.dataModalPhuCap = payload;
    },

    setCurrentRole: (state, action) => {
      const payload = action.payload;
      state.currentRole = payload;
    },

    setCurrentOrganizationUnit: (state, action) => {
      const payload = action.payload;
      state.currentOrganizationUnit = payload;
    },

    setModalOrganizationUnit: (state, action) => {
      const payload = action.payload;
      state.modalOrganizationUnit = payload;
      if (!state.modalOrganizationUnit) {
        state.currentOrganizationUnit = null;
      }
    },

    setDataTripModal: (state, action) => {
      const payload = action.payload;
      state.dataTripModal = payload;
    },

    setDataDatVe: (state, action) => {
      const payload = action.payload;
      state.dataDatVe = payload;
    },

    setModalVisible: (state, action) => {
      const payload = action.payload;
      state.modalVisible = payload;
      if (!state.modalVisible) {
        state.dataModal = null;
      }
    },

    setModalPhuCapVisible: (state, action) => {
      const payload = action.payload;
      state.modalPhuCapVisible = payload;
      if (!state.modalPhuCapVisible) {
        state.dataModalPhuCap = null;
      }
    },

    setModalPermissionVisible: (state, action) => {
      const payload = action.payload;
      state.modalPermissionVisible = payload;
      if (!state.modalPermissionVisible) {
        state.dataModal = null;
      }
    },

    setModalTripVisible: (state, action) => {
      const payload = action.payload;
      state.modalTripVisible = payload;
      if (!state.modalTripVisible) {
        state.dataTripModal = null;
      }
    },

    setModalDatVeVisible: (state, action) => {
      const payload = action.payload;
      state.modalDatVeVisible = payload;
      if (!state.modalDatVeVisible) {
        state.dataDatVe = null;
      }
    },

    setModalAreaInfoVisible: (state, action) => {
      const payload = action.payload;
      state.modalAreaInfoVisible = payload;
      if (!state.modalAreaInfoVisible) {
        state.dataModal = null;
      }
    },

    setModalCategoryAttributeVisible: (state, action) => {
      const payload = action.payload;
      state.modalCategoryAttributeVisible = payload;
      if (!state.modalCategoryAttributeVisible) {
        state.dataModal = null;
      }
    },

    setModalPhanHoiVisible: (state, action) => {
      const payload = action.payload;
      state.modalPhanHoiVisible = payload;
      if (!state.modalPhanHoiVisible) {
        state.dataPhanHoi = null;
      }
    },

    setDataPhanHoi: (state, action) => {
      const payload = action.payload;
      state.dataPhanHoi = payload;
    },

    setModalDanhSachChuyenDiVisible: (state, action) => {
      const payload = action.payload;
      state.modalDanhSachChuyenDiVisible = payload;
      if (!state.modalDanhSachChuyenDiVisible) {
        state.dataTripModal = null;
        state.dataModal = null;
      }
    },

    setDataSearch: (state, action) => {
      const payload = action.payload;
      state.dataSearch = payload;
    },
    setDataDanhSachChuyenDiSearch: (state, action) => {
      const payload = action.payload;
      state.dataDanhSachChuyenDiSearch = payload;
    },
    resetData: (state, action) => {
      state = initialState;
    },
    setRandom: (state, action) => {
      state.random = Math.random().toString(32);
    },
    setRandomUsers: (state, action) => {
      state.randomUsers = Math.random().toString(32);
    },
    setRandomPhuCap: (state, action) => {
      state.randomPhuCap = Math.random().toString(32);
    },
    setRandomPhuLuc: (state, action) => {
      state.randomPhuLuc = Math.random().toString(32);
    },
  },
});
