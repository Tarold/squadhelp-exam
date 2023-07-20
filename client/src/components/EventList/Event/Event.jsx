import React, { useState, useEffect } from 'react';
import styles from './Event.module.sass';
import Notification from './Notification/Notification';
import formatDuration from 'date-fns/formatDuration';
import intervalToDuration from 'date-fns/intervalToDuration';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';
import variables from './progressBarColors.json';
import classNames from 'classnames';

const Event = props => {
  const {
    eventName,
    del,
    enableEdit,
    notification,
    setNotification,
    eventsCount,
    eventDate,
    notificationDate,
    startDate,
  } = props;

  const [countDays, setCountDays] = useState('');
  const [progressStyle, setProgressStyle] = useState(null);
  const [isFinish, setIsFinish] = useState(false);

  useEffect(() => {
    const updateEvent = () => {
      setCountDays(getDateBefore(eventDate));
      setProgressStyle(
        progressBarHelper(eventDate, notificationDate, startDate)
      );
    };

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
    }, Math.round(new Date(eventDate).getTime() * 0.01));

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
  }, [eventDate, notificationDate, startDate, setNotification]);

  const getDateBefore = date => {
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
  };

  const progressBarHelper = (eventDate, notificationDate, startDate) => {
    const getBetweenTime = (startDate, eventDate) => {
      return differenceInMilliseconds(new Date(startDate), new Date(eventDate));
    };

    const length = getBetweenTime(startDate, eventDate);
    const triger = getBetweenTime(startDate, notificationDate);
    const now = getBetweenTime(startDate, new Date());

    const procentTriger = Math.round((triger / length) * 100);
    const procentNow = Math.round((now / length) * 100);

    const green = classNames({
      [variables.going]: procentNow < procentTriger,
      [variables.goingTriger]: procentNow >= procentTriger,
    });
    const gradientStyle = {
      background: `linear-gradient(to right, ${green} 0%, ${green} ${procentNow}%, ${variables.bg} ${procentNow}%, ${variables.bg} ${procentTriger}%, ${variables.triger} ${procentTriger}%,  ${variables.triger} 100%)`,
    };
    return gradientStyle;
  };

  return (
    <li className={styles.event} style={progressStyle}>
      <span className={styles.name}>{eventName}</span>

      {isFinish ? (
        <>
          <span className={styles.badge}>eventsCount:{eventsCount}</span>
          <Notification
            notification={notification}
            setNotification={() => setNotification('')}
          />
        </>
      ) : (
        <>
          <span className={styles.countDays}>{countDays}</span>
          <Notification
            notification={notification}
            setNotification={() => setNotification('')}
          />
          <button onClick={enableEdit} className={styles.buttonEdit}>
            Edit
          </button>
        </>
      )}

      <button className={styles.buttonRemove} onClick={del}>
        Delete
      </button>
    </li>
  );
};

export default Event;
