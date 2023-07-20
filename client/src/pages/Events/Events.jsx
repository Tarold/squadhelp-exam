import EventList from '../../components/EventList/EventList';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import styles from './Events.module.sass';
const Events = () => {
  return (
    <>
      <Header />
      <h1 className={styles.title}>Your Events</h1>
      <EventList />
      <Footer />
    </>
  );
};

export default Events;
