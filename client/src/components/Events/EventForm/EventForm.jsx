import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';

import styles from './EventForm.module.sass';

const EventForm = ({ onSubmit }) => {
  const initialValues = {
    eventName: '',
    eventTime: '',
    notificationTime: '',
  };

  const validationSchema = yup.object().shape({
    eventName: yup.string().required('Event Name is required'),
    eventTime: yup.date().required('Event Date is required'),
    notificationTime: yup
      .date()
      .required('Notification Date is required')
      .min(new Date(), 'Notification Date must be after current date')
      .max(
        yup.ref('eventTime'),
        'Notification Date must be before or equal to Event Date'
      ),
  });

  const handleSubmit = (values, { resetForm }) => {
    onSubmit(values);
    resetForm();
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
          <Field type='datetime-local' id='eventTime' name='eventTime'></Field>
          <ErrorMessage
            name='eventTime'
            component='div'
            className={styles.error}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor='notificationTime'>Notification Date</label>
          <Field
            type='datetime-local'
            id='notificationTime'
            name='notificationTime'
          ></Field>
          <ErrorMessage
            name='notificationTime'
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
