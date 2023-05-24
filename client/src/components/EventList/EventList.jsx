import React, { useState } from 'react';
import EventForm from './EventForm/EventForm';
import { connect } from 'react-redux';
import { clearEvents, addEvent } from '../../store/slices/eventsSlice';
import Event from './Event/Event';

const EventList = ({ events, clear, add }) => {
  const [isCreate, setIsCreate] = useState(false);
  const handleFormSubmit = values => {
    values.startDate = String(new Date());
    add(values);
    setIsCreate(false);
  };

  return (
    <div>
      {isCreate ? (
        <>
          <EventForm onSubmit={handleFormSubmit} />
          <button onClick={() => setIsCreate(false)}>-</button>
        </>
      ) : (
        <>
          {events.map(event => (
            <Event event={event} />
          ))}
          {JSON.stringify(events)}
          <button onClick={() => clear()}>Clear All</button>
          <button onClick={() => setIsCreate(true)}>+</button>
        </>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  events: state.eventsStore.events,
});
const mapDispatchToProps = dispatch => ({
  clear: () => dispatch(clearEvents()),
  add: data => dispatch(addEvent(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventList);
