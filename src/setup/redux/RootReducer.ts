import {all} from 'redux-saga/effects';
import {combineReducers} from 'redux';

import {modalSlice} from './modal/Slice';
import {globalSlice} from './global/Slice';

import {modalSlice as modalThongTinGiaDinh} from './modalThongTinGiaDinh/Slice';
import {modalSlice as modalSettings} from './modalSettings/Slice';

//import * as auth from '../../app/modules/auth'

export const rootReducer = combineReducers({
  //auth: auth.reducer,
  modal: modalSlice.reducer,
  global: globalSlice.reducer,
  modalThongTinGiaDinh: modalThongTinGiaDinh.reducer,
  modalSettings: modalSettings.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function* rootSaga() {
  yield all([]);
}
