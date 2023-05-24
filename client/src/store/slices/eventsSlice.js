import { createSlice } from '@reduxjs/toolkit';

const EVENT_SLICE_NAME = 'event';

const initialState = {
  events: [],
};

const reducers = {
  addEvent: (state, { payload }) => {
    state.events = [...state.events, payload];
  },
  clearEvents: state => {
    state.events = [];
  },
};

const eventSlice = createSlice({
  name: `${EVENT_SLICE_NAME}`,
  initialState,
  reducers,
});

const { actions, reducer } = eventSlice;

export const { addEvent, getEvents, clearEvents } = actions;

export default reducer;
