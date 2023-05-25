import styles from './Notification.module.sass';

const Notification = ({ notification, setNotification }) => {
  return notification ? (
    <div className={styles.notification}>
      <button className={styles.button} onClick={setNotification}>
        &#10006;
      </button>
      <span>Notification!!! {notification}</span>
    </div>
  ) : (
    ''
  );
};

export default Notification;
