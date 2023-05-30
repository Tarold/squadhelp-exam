import { createSlice } from '@reduxjs/toolkit';
import * as restController from '../../api/rest/restController';
import { decorateAsyncThunk, pendingReducer } from '../../utils/store';

const OFFERS_SLICE_NAME = 'offers';

const initialState = {
  isFetching: true,
  error: null,
  offers: [],
  moderatorFilter: {
    typeIndex: 1,
    contestId: '',
    industry: '',
    awardSort: 'asc',
    ownEntries: false,
  },
  haveMore: true,
};

export const getOffers = decorateAsyncThunk({
  key: `${OFFERS_SLICE_NAME}/getOffers`,
  thunk: async ({ requestData }) => {
    const { data } = await restController.getNoVerifyingOffers(requestData);
    return data;
  },
});

const reducers = {
  clearOffersList: state => {
    state.error = null;
    state.offers = [];
  },
  setNewModeratorFilter: (state, { payload }) => ({
    ...initialState,
    isFetching: false,
    moderatorFilter: { ...state.moderatorFilter, ...payload },
  }),
};

const extraReducers = builder => {
  builder.addCase(getOffers.pending, pendingReducer);
  builder.addCase(getOffers.fulfilled, (state, { payload }) => {
    state.isFetching = false;
    state.offers = [...state.offers, ...payload.offers];
    state.haveMore = payload.haveMore;
  });
  builder.addCase(getOffers.rejected, (state, { payload }) => {
    state.isFetching = false;
    state.error = payload;
    state.offers = [];
  });
};

const offersSlice = createSlice({
  name: OFFERS_SLICE_NAME,
  initialState,
  reducers,
  extraReducers,
});

const { actions, reducer } = offersSlice;

export const { clearOffersList, setNewModeratorFilter } = actions;

export default reducer;
