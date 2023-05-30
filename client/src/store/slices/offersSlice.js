import { createSlice } from '@reduxjs/toolkit';
import * as restController from '../../api/rest/restController';
import {
  decorateAsyncThunk,
  pendingReducer,
  createExtraReducers,
} from '../../utils/store';
import CONSTANTS from '../../constants';

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

const getOffersExtraReducers = createExtraReducers({
  thunk: getOffers,
  pendingReducer: pendingReducer,
  fulfilledReducer: (state, { payload }) => {
    state.isFetching = false;
    state.offers = [...state.offers, ...payload.offers];
    state.haveMore = payload.haveMore;
  },
  rejectedReducer: (state, { payload }) => {
    state.isFetching = false;
    state.error = payload;
    state.offers = [];
  },
});

export const setOfferApprove = decorateAsyncThunk({
  key: `${OFFERS_SLICE_NAME}/setOfferApprove`,
  thunk: async payload => {
    const { data } = await restController.setOfferApprove(payload);
    return data;
  },
});

const setOfferApproveExtraReducers = createExtraReducers({
  thunk: setOfferApprove,
  fulfilledReducer: (state, { payload }) => {
    state.offers.forEach(offer => {
      if (payload.isAppoved === CONSTANTS.OFFER_APPROVED_ACCEPTED) {
        offer.isAppoved =
          payload.id === offer.id
            ? CONSTANTS.OFFER_APPROVED_ACCEPTED
            : CONSTANTS.OFFER_APPROVED_DENIED;
      } else if (payload.id === offer.id) {
        offer.status = CONSTANTS.OFFER_APPROVED_DENIED;
      }
    });
    state.error = null;
  },
  rejectedReducer: (state, { payload }) => {
    state.setOfferApproveError = payload;
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
  getOffersExtraReducers(builder);
  setOfferApproveExtraReducers(builder);
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
