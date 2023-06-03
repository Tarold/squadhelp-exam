import React, { Component } from 'react';
import styles from './Event.module.sass';
import Notification from './Notification/Notification';
import formatDuration from 'date-fns/formatDuration';
import intervalToDuration from 'date-fns/intervalToDuration';
import differenceInMilliseconds from 'date-fns/differenceInMilliseconds';
import variables from './progressBarColors.json';
import classNames from 'classnames';

class Event extends Component {
  constructor (props) {
    super(props);
    this.state = {
      countDays: '',
      progressStyle: null,
      isFinish: false,
    };
  }

  componentDidMount () {
    this.updateEvent();

    const { eventDate, notificationDate, setNotification } = this.props;

    const millisecondsToFinish = differenceInMilliseconds(
      new Date(eventDate),
      new Date()
    );
    const millisecondsToNotification = differenceInMilliseconds(
      new Date(notificationDate),
      new Date()
    );

    const interval = setInterval(() => {
      this.updateEvent();
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
            this.updateEvent();
            this.setState({ isFinish: true });
            setNotification('timer finish');
            clearInterval(interval);
          }, millisecondsToFinish)
        : '';

    if (millisecondsToFinish <= 0) {
      this.setState({ isFinish: true });
      clearInterval(interval);
    }

    this.interval = interval;
    this.timeoutFinish = timeoutFinish;
    this.timeoutNotification = timeoutNotification;
  }

  componentWillUnmount () {
    clearInterval(this.interval);
    clearTimeout(this.timeoutFinish);
    clearTimeout(this.timeoutNotification);
  }

  updateEvent = () => {
    const { eventDate, notificationDate, startDate } = this.props;

    this.setState({
      countDays: this.getDateBefore(eventDate),
      progressStyle: this.progressBarHelper(
        eventDate,
        notificationDate,
        startDate
      ),
    });
  };

  getDateBefore (date) {
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

  progressBarHelper (eventDate, notificationDate, startDate) {
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
  }

  render () {
    const {
      eventName,
      del,
      enableEdit,
      notification,
      setNotification,
      eventsCount,
    } = this.props;
    const { countDays, progressStyle, isFinish } = this.state;

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
  }
}

export default Event;
