import { createSlice } from '@reduxjs/toolkit';
import * as restController from './../../api/rest/restController';
import {
  decorateAsyncThunk,
  pendingReducer,
  rejectedReducer,
} from '../../utils/store';

const TRANSACTIONS_SLICE_NAME = 'transactions';

const initialState = {
  transactions: [],
  isFetching: false,
  error: null,
};

export const getTransactions = decorateAsyncThunk({
  key: `${TRANSACTIONS_SLICE_NAME}/get`,
  thunk: async () => {
    const { data } = await restController.getTransactions();
    return data;
  },
});

const transactionsSlice = createSlice({
  name: TRANSACTIONS_SLICE_NAME,
  initialState,
  extraReducers: builder => {
    builder.addCase(getTransactions.pending, pendingReducer);
    builder.addCase(getTransactions.fulfilled, (state, { payload }) => {
      state.isFetching = false;
      state.transactions = [...payload];
    });
    builder.addCase(getTransactions.rejected, rejectedReducer);
  },
});

const { reducer } = transactionsSlice;

export default reducer;
