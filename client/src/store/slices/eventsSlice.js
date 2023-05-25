import { createSlice } from '@reduxjs/toolkit';
import { compareAsc } from 'date-fns';
import { v4 as uuid } from 'uuid';

const EVENT_SLICE_NAME = 'event';

const initialState = {
  events: [
    {
      eventName: 'moms day',
      eventDate:
        'Thu May 25 2023 03:30:00 GMT+0300 (Eastern European Summer Time)',
      notificationDate:
        'Thu May 25 2023 03:00:00 GMT+0300 (Eastern European Summer Time)',
      id: '3ab28ea8-392d-4301-843c-9b8d1dfbdf76',
      startDate:
        'Thu May 25 2023 02:45:16 GMT+0300 (Eastern European Summer Time)',
      notification: '',
    },
    {
      eventName: 'moms day1',
      eventDate:
        'Thu May 25 2023 03:00:00 GMT+0300 (Eastern European Summer Time)',
      notificationDate:
        'Thu May 25 2023 02:45:00 GMT+0300 (Eastern European Summer Time)',
      id: '3ab28ea8-392d-4301-843c-9b8d1dfbdf78',
      startDate:
        'Thu May 25 2023 02:45:16 GMT+0300 (Eastern European Summer Time)',
      notification: '',
    },
  ],
};

const reducers = {
  addEvent: (state, { payload }) => {
    payload.id = uuid();
    payload.startDate = String(new Date());
    payload.notification = '';
    state.events = [...state.events, payload].sort((a, b) =>
      compareAsc(a.eventDate, b.eventDate)
    );
  },
  removeEvent: (state, { payload }) => {
    state.events = state.events.filter(event => event.id !== payload);
  },
  updateEvent: (state, { payload }) => {
    state.events = state.events
      .map(event => (event.id === payload.id ? payload : event))
      .sort((a, b) => compareAsc(a.eventDate, b.eventDate));
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
