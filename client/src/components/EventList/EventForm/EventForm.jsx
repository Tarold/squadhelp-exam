import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DatePickerComponent from '../../InputComponents/DatePicker/DatePicker';
import Schems from '../../../utils/validators/validationSchems';
import styles from './EventForm.module.sass';
import { setHours } from 'date-fns';

const EventForm = ({ onSubmit, formData }) => {
  const cleanValue = {
    eventName: '',
    eventDate: String(setHours(new Date(), 48)),
    notificationDate: String(setHours(new Date(), 24)),
  };
  const initialValues = formData ? formData : cleanValue;
  const validationSchema = Schems.EventSchema;
  const [dateEvent, setDateEvent] = useState(initialValues.eventDate);

  const handleSubmit = values => {
    if (!values.id) {
    }
    onSubmit(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <Form className={styles.eventForm}>
        <div className={styles.field}>
          <label htmlFor='eventName'>Event Name</label>
          <Field type='text' id='eventName' name='eventName'></Field>
          <ErrorMessage
            name='eventName'
            component='div'
            className={styles.error}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor='eventDate'>Event Date</label>
          <DatePickerComponent
            id='eventDate'
            name='eventDate'
            initialValue={initialValues.eventDate}
            setChange={setDateEvent}
          ></DatePickerComponent>
          <ErrorMessage
            name='eventDate'
            component='div'
            className={styles.error}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor='notificationDate'>Notification Date</label>
          <DatePickerComponent
            id='notificationDate'
            name='notificationDate'
            initialValue={initialValues.notificationDate}
            after={dateEvent}
          ></DatePickerComponent>
          <ErrorMessage
            name='notificationDate'
            component='div'
            className={styles.error}
          />
        </div>

        <button type='submit'>Save Timer</button>
      </Form>
    </Formik>
  );
};

export default EventForm;
