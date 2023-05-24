import React from 'react';
import { Formik, Form, Field } from 'formik';

const EventForm = ({ onSubmit }) => {
  const initialValues = {
    eventName: '',
    eventDate: '',
    eventTime: '10:00',
    notificationTime: '',
  };

  const handleSubmit = (values, { resetForm }) => {
    onSubmit(values);
    resetForm();
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      <Form>
        <label htmlFor='eventName'>Event Name</label>
        <Field type='text' id='eventName' name='eventName' />

        <label htmlFor='eventDate'>Event Date</label>
        <Field type='date' id='eventDate' name='eventDate' />

        <label htmlFor='eventTime'>Event Time</label>
        <Field type='time' id='eventTime' name='eventTime' />

        <label htmlFor='notificationTime'>Notification Time (in seconds)</label>
        <Field type='number' id='notificationTime' name='notificationTime' />

        <button type='submit'>Create Timer</button>
      </Form>
    </Formik>
  );
};

export default EventForm;
