import React, { useEffect, useState } from 'react';
import EventForm from './EventForm/EventForm';
import { connect } from 'react-redux';
import {
  clearEvents,
  addEvent,
  updateEvent,
  removeEvent,
} from '../../store/slices/eventsSlice';
import Event from './Event/Event';

const EventList = ({ events, clear, add, del, edit }) => {
  const [isCreate, setIsCreate] = useState(); //TODO false->setformData();
  const [formData, setFormData] = useState();

  const handleFormSubmit = values => {
    if (formData) {
      edit(values);
      setFormData();
    } else {
      add(values);
    }
    setIsCreate(false);
  };

  return (
    <div>
      {isCreate ? (
        <>
          <EventForm onSubmit={handleFormSubmit} formData={formData} />
          <button onClick={() => setIsCreate(false)}>-</button>
        </>
      ) : (
        <>
          <ul>
            {events.map(event => (
              <Event
                key={event.id}
                {...event}
                del={() => del(event.id)}
                enableEdit={() => {
                  setFormData(event);
                  setIsCreate(true);
                }}
              />
            ))}
          </ul>
          <button onClick={() => clear()}>Clear All</button>
          <button onClick={() => setIsCreate(true)}>+</button>

          {JSON.stringify(events)}
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
  del: id => dispatch(removeEvent(id)),
  edit: data => dispatch(updateEvent(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventList);
