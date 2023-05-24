import styles from './Event.module.sass';

function getDateBefore (now, length) {
  const millisecondsPerHour = 1000 * 60 * 60;
  const millisecondsPerDay = millisecondsPerHour * 24;

  const dateMilliseconds = length - now;
  const days = Math.round(dateMilliseconds / millisecondsPerDay);

  if (days === 0) {
    return 'today';
  }
  const hoursMilliseconds = dateMilliseconds - days * millisecondsPerDay;
  const hours = Math.round(hoursMilliseconds / millisecondsPerHour);
  if (hours === 0) {
    return `${days} days left`;
  }
  return `${days} days ${hours} hours left`;
}

function progressBarHelper (eventTime, notificationTime, startDate) {
  const getBetweenTime = (startDate, eventTime) => {
    const start = new Date(startDate).getTime();
    const event = new Date(eventTime).getTime();
    return event - start;
  };

  const length = getBetweenTime(startDate, eventTime);
  const triger = getBetweenTime(startDate, notificationTime);
  const now = getBetweenTime(startDate, new Date());

  const countDays = getDateBefore(now, length);

  const procentTriger = Math.round((triger / length) * 100);
  const procentNow = Math.round((now / length) * 100);
  const gradientStyle = {
    background: `linear-gradient(to right, green 0%, green ${procentNow}%, white ${procentNow}%, white ${procentTriger}%, yellow ${procentTriger}%, yellow 100%)`,
  };
  return [gradientStyle, countDays];
}
//TODO update per minute
const Event = ({
  event: { key, eventName, eventTime, notificationTime, startDate },
}) => {
  const [gradientStyle, countDays] = progressBarHelper(
    eventTime,
    notificationTime,
    startDate
  );

  return (
    <li className={styles.event} style={gradientStyle} key={key}>
      <span className={styles.name}>{eventName}</span>
      <span className={styles.countDays}>{countDays}</span>
    </li>
  );
};

export default Event;
