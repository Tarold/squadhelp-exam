import React, { useState } from 'react';
import EventForm from './EventForm/EventForm';
import styles from './EventList.module.sass';
import { connect } from 'react-redux';
import {
  clearEvents,
  addEvent,
  updateEvent,
  removeEvent,
  setNotification,
} from '../../store/slices/eventsSlice';
import Event from './Event/Event';

const EventList = ({ events, clear, add, del, edit, setAlarm }) => {
  const [isCreate, setIsCreate] = useState();
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
  const eventMap = event => (
    <Event
      key={event.id}
      eventsCount={events.length}
      {...event}
      setNotification={data => {
        setAlarm({ id: event.id, notification: data });
      }}
      del={() => del(event.id)}
      enableEdit={() => {
        setFormData(event);
        setIsCreate(true);
      }}
    />
  );
  return (
    <div>
      {isCreate ? (
        <div className={styles.formContainer}>
          <h2 className={styles.title}>Event Form</h2>
          <EventForm onSubmit={handleFormSubmit} formData={formData} />
          <button
            className={styles.formButtonForm}
            onClick={() => {
              setFormData();
              setIsCreate(false);
            }}
          >
            <span>&#10006;</span>
          </button>
        </div>
      ) : (
        <>
          <div className={styles.eventList}>
            <h2 className={styles.title}>Event List</h2>
            <ul className={styles.events}>
              {events.length > 1 ? (
                <>{events.map(eventMap)}</>
              ) : (
                <li key='nothing'>
                  <span>Nothing</span>
                </li>
              )}
            </ul>
            {events.length > 1 ? (
              <button className={styles.clearButton} onClick={() => clear()}>
                Clear All
              </button>
            ) : (
              ''
            )}

            <button
              className={styles.formButtonList}
              onClick={() => setIsCreate(true)}
            >
              <span> +</span>
            </button>
          </div>
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
  setAlarm: ({ id, notification }) =>
    dispatch(setNotification({ id, notification })),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventList);
