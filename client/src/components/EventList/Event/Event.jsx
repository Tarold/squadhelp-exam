import { useEffect, useState } from 'react';
import styles from './Event.module.sass';
import Notification from './Notification/Notification';
import formatDuration from 'date-fns/formatDuration';
import intervalToDuration from 'date-fns/intervalToDuration';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';

import classNames from 'classnames';

function getDateBefore (date) {
  const start = new Date();
  const end = new Date(date);

  if (start >= end) {
    return 'now';
  }

  const duration = intervalToDuration({ start: start, end: end });
  const formattedDuration = formatDuration(duration, {
    format: ['days', 'hours'],
  });

  if (!formattedDuration) {
    return (
      'Soon! ' +
      formatDuration(duration, {
        format: ['minutes'],
      })
    );
  }

  return formattedDuration;
}

function progressBarHelper (eventDate, notificationDate, startDate) {
  const getBetweenTime = (startDate, eventDate) => {
    return differenceInMilliseconds(new Date(startDate), new Date(eventDate));
  };

  const length = getBetweenTime(startDate, eventDate);
  const triger = getBetweenTime(startDate, notificationDate);
  const now = getBetweenTime(startDate, new Date());

  const procentTriger = Math.round((triger / length) * 100);
  const procentNow = Math.round((now / length) * 100);

  let green = '#d1e9cf';
  const yellow = 'rgb(255, 250, 114)';
  if (procentNow >= procentTriger) {
    green = 'lightgreen';
  }
  const gradientStyle = {
    background: `linear-gradient(to right, ${green} 0%, ${green} ${procentNow}%, rgba(0, 0, 0, 0) ${procentNow}%, rgba(0, 0, 0, 0) ${procentTriger}%, ${yellow} ${procentTriger}%,  ${yellow} 100%)`,
  };
  return gradientStyle;
}

const Event = ({
  eventName,
  eventDate,
  notificationDate,
  startDate,
  del,
  enableEdit,
  notification,
  setNotification,
  eventsCount,
}) => {
  const [countDays, setCountDays] = useState();
  const [progresStyle, setProgresStyle] = useState();
  const [eventStyle, setEventStyle] = useState();
  const [isFinish, setIsFinish] = useState(false);
  const updateStyles = () => {
    setEventStyle(
      classNames(
        [styles.event],
        { [styles.finish]: new Date() >= eventDate },
        {
          [styles.notification]: notification,
        }
      )
    );
  };
  const updateEvent = () => {
    setCountDays(getDateBefore(eventDate));
    setProgresStyle(progressBarHelper(eventDate, notificationDate, startDate));
    updateStyles();
  };

  useEffect(() => {
    updateEvent();
    const millisecondsToFinish = differenceInMilliseconds(
      new Date(eventDate),
      new Date()
    );
    const millisecondsToNotification = differenceInMilliseconds(
      new Date(notificationDate),
      new Date()
    );

    const interval = setInterval(() => {
      updateEvent();
    }, Math.round(new Date(eventDate).getTime * 0.01));

    const timeoutNotification =
      millisecondsToNotification > 0
        ? setTimeout(() => {
            setNotification('task is soon');
          }, millisecondsToNotification)
        : '';

    const timeoutFinish =
      millisecondsToFinish > 0
        ? setTimeout(() => {
            updateEvent();
            setIsFinish(true);
            setNotification('timer finish');
            clearInterval(interval);
          }, millisecondsToFinish)
        : '';

    if (millisecondsToFinish <= 0) {
      setIsFinish(true);
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutFinish);
      clearTimeout(timeoutNotification);
    };
  }, []);

  return (
    <li style={progresStyle} className={eventStyle}>
      <span className={styles.name}>{eventName}</span>

      {isFinish ? (
        <>
          <span className={styles.badge}>eventsCount:{eventsCount}</span>
          <Notification
            notification={notification}
            setNotification={() => {
              updateStyles();
              setNotification('');
            }}
          />
        </>
      ) : (
        <>
          <span className={styles.countDays}>{countDays}</span>
          <Notification
            notification={notification}
            setNotification={setNotification}
          />
          <button onClick={enableEdit} className={styles.edit}>
            Edit
          </button>
        </>
      )}

      <button onClick={del}>Delete</button>
    </li>
  );
};

export default Event;
