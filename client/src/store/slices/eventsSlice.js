import { createSlice } from '@reduxjs/toolkit';
import { compareAsc, parseISO } from 'date-fns';
import { v4 as uuid } from 'uuid';

const EVENT_SLICE_NAME = 'event';

const initialState = {
  events: [],
};

const reducers = {
  addEvent: (state, { payload }) => {
    payload.id = uuid();
    payload.startDate = String(new Date());
    payload.notification = '';
    state.events = [...state.events, payload].sort((a, b) =>
      compareAsc(parseISO(a.eventDate), parseISO(b.eventDate))
    );
  },
  removeEvent: (state, { payload }) => {
    state.events = state.events.filter(event => event.id !== payload);
  },
  updateEvent: (state, { payload }) => {
    state.events = state.events
      .map(event => (event.id === payload.id ? payload : event))
      .sort((a, b) => compareAsc(parseISO(a.eventDate), parseISO(b.eventDate)));
  },
  setNotification: (state, { payload }) => {
    state.events = state.events.map(event => {
      if (event.id === payload.id) {
        event.notification = payload.notification;
      }
      return event;
    });
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

export const {
  addEvent,
  removeEvent,
  updateEvent,
  clearEvents,
  setNotification,
} = actions;

export default reducer;
