import { createSlice } from '@reduxjs/toolkit';

const EVENT_SLICE_NAME = 'event';

const initialState = {
  events: [],
};

const reducers = {
  addEvent: (state, { payload }) => {
    state.events = [...state.events, payload];
  },
  removeEvent: (state, { payload }) => {
    state.events = state.events.filter(event => event.id !== payload);
  },
  updateEvent: (state, { payload }) => {
    state.events = state.events.map(event =>
      event.id === payload.id ? payload : event
    );
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

export const { addEvent, removeEvent, updateEvent, clearEvents } = actions;

export default reducer;
