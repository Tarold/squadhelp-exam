import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DatePickerComponent from '../../InputComponents/DatePicker/DatePicker';
import { v4 as uuid } from 'uuid';
import Schems from '../../../utils/validators/validationSchems';
import styles from './EventForm.module.sass';

const EventForm = ({ onSubmit }) => {
  const validationSchema = Schems.EventSchema;
  const initialValues = {
    eventName: '',
    eventDate: '',
    notificationDate: '',
  };

  const [date, setDate] = useState(initialValues.eventDate);

  const handleSubmit = (values, { resetForm }) => {
    values.id = uuid();
    onSubmit(values);
    resetForm(initialValues);
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
            setChange={setDate}
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
            after={date}
          ></DatePickerComponent>
          <ErrorMessage
            name='notificationDate'
            component='div'
            className={styles.error}
          />
        </div>

        <button type='submit'>Create Timer</button>
      </Form>
    </Formik>
  );
};

export default EventForm;
