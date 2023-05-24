import React from 'react';
import EventForm from './EventForm/EventForm';

const ParentComponent = () => {
  const handleFormSubmit = values => {
    // Do something with the form values, such as saving them or creating a new timer
    console.log(values);
  };

  return (
    <div>
      <h2>Create Timer</h2>
      <EventForm onSubmit={handleFormSubmit} />
    </div>
  );
};

export default ParentComponent;
