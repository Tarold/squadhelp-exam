import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { setHours, setMinutes } from 'date-fns';
import { useFormikContext } from 'formik';

const DatePickerComponent = ({
  name,
  setFieldValue,
  after,
  setChange,
  ...props
}) => {
  const [startDate, setStartDate] = useState(
    setHours(setMinutes(new Date(), 0), 9)
  );
  const formikProps = useFormikContext();

  const setField = date => {
    if (setChange) {
      setChange(date);
    }
    formikProps.setFieldValue(name, String(date));
  };

  const filterPassedTime = time => {
    const currentDate = new Date();
    const selectedDate = new Date(time);
    const selectedDateAfter = new Date(after);

    return after
      ? currentDate.getTime() < selectedDate.getTime() &&
          selectedDate.getTime() <= selectedDateAfter.getTime()
      : currentDate.getTime() < selectedDate.getTime();
  };
  return (
    <>
      <div>
        <DatePicker
          name={name}
          selected={startDate}
          showTimeSelect
          minDate={new Date()}
          maxDate={new Date(after)}
          filterTime={filterPassedTime}
          dateFormat='MMMM d, yyyy h:mm aa'
          onChange={date => {
            setField(date);
            return setStartDate(date);
          }}
          {...props}
        />
      </div>
    </>
  );
};

export default DatePickerComponent;
