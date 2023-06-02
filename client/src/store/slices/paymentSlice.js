import { createSlice } from '@reduxjs/toolkit';
import * as restController from '../../api/rest/restController';
import { clearContestStore } from './contestCreationSlice';
import { changeProfileViewMode } from './userProfileSlice';
import { updateUser } from './userSlice';
import CONSTANTS from '../../constants';
import {
  decorateAsyncThunk,
  pendingReducer,
  rejectedReducer,
} from '../../utils/store';

const PAYMENT_SLICE_NAME = 'payment';

const initialState = {
  isFetching: false,
  error: null,
  focusOnElement: 'number',
};

export const pay = decorateAsyncThunk({
  key: `${PAYMENT_SLICE_NAME}/pay`,
  thunk: async ({ data, history }, { dispatch }) => {
    const contests = JSON.parse(data.formData.get('contests'));

    const files = [];

    if (contests && Array.isArray(contests)) {
      await Promise.all(
        contests.map(async contest => {
          console.log('contest :>> ', contest);
          if (contest.file) {
            const imgBlob = await fetch(contest.file).then(r => r.blob());
            imgBlob.name = contest.fileName;

            files.push(imgBlob);
          }
        })
      );
    } else {
      console.log('contests is not defined or not an array');
    }

    if (files.length > 0) {
      files.forEach(file => data.formData.append('files', file, file.name));
    }

    await restController.payMent(data.formData);
    history.replace('dashboard');
    dispatch(clearContestStore());
  },
});

export const cashOut = decorateAsyncThunk({
  key: `${PAYMENT_SLICE_NAME}/cashOut`,
  thunk: async (payload, { dispatch }) => {
    const { data } = await restController.cashOut(payload);
    dispatch(updateUser.fulfilled(data));
    dispatch(changeProfileViewMode(CONSTANTS.USER_INFO_MODE));
  },
});

const reducers = {
  changeFocusOnCard: (state, { payload }) => {
    state.focusOnElement = payload;
  },
  clearPaymentStore: () => initialState,
};

const extraReducers = builder => {
  builder.addCase(pay.pending, pendingReducer);
  builder.addCase(pay.fulfilled, () => initialState);
  builder.addCase(pay.rejected, rejectedReducer);

  builder.addCase(cashOut.pending, pendingReducer);
  builder.addCase(cashOut.fulfilled, () => initialState);
  builder.addCase(cashOut.rejected, rejectedReducer);
};

const paymentSlice = createSlice({
  name: PAYMENT_SLICE_NAME,
  initialState,
  reducers,
  extraReducers,
});

const { actions, reducer } = paymentSlice;

export const { changeFocusOnCard, clearPaymentStore } = actions;

export default reducer;
