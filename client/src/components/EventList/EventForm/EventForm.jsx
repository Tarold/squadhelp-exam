import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// CSS Modules, react-datepicker-cssmodules.css//
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { setHours, setMinutes } from 'date-fns';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';

import styles from './EventForm.module.sass';
//TODO mix man Date picker. Exept time from date. Return values from form like then. Add key
const EventForm = ({ onSubmit }) => {
  const initialValues = {
    eventName: '',
    testDayTime: '',
    testDayTimeTnen: '',
    eventTime: '',
    notificationTime: '',
  };

  const validationSchema = yup.object().shape({
    eventName: yup.string().required('Event Name is required'),
    eventTime: yup
      .date()
      .min(new Date(), 'Date must be after current date')
      .required('Event Date is required'),
    notificationTime: yup
      .date()
      .required('Date is required')
      .min(new Date(), 'Date must be after current date')
      .max(yup.ref('eventTime'), 'Date must be before or equal to Event Date'),
  });

  const [startDate, setStartDate] = useState(
    setHours(setMinutes(new Date(), 0), 9)
  );
  const [startDateThen, setStartDateThen] = useState(
    setHours(setMinutes(new Date(), 0), 9)
  );
  const filterPassedTime = time => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };
  const filterPassedTimeThen = (time, after) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);
    const selectedDateAfter = new Date(after);
    console.log(time, after);
    return (
      currentDate.getTime() < selectedDate.getTime() &&
      selectedDate.getTime() <= selectedDateAfter
    );
  };
  const handleSubmit = (values, { resetForm }) => {
    values.testDayTime = startDate;
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
        <DatePicker
          name='testDayTime'
          selected={startDate}
          onChange={date => setStartDate(date)}
          showTimeSelect
          filterTime={filterPassedTime}
          dateFormat='MMMM d, yyyy h:mm aa'
        />
        <DatePicker
          name='testDayTimeThen'
          selected={startDateThen}
          onChange={date => setStartDateThen(date)}
          showTimeSelect
          filterTime={date => filterPassedTimeThen(date, startDate)}
          dateFormat='MMMM d, yyyy h:mm aa'
        />
        <button type='submit'>Create Timer</button>
      </Form>
    </Formik>
  );
};

export default EventForm;
