import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';

import styles from './Events.module.sass';
import CONSTANTS from '../../constants';

const Events = () => {
  const IMAGES_PATH = `${CONSTANTS.STATIC_IMAGES_PATH}how_it_works/`;
  //TODO vimeo player
  return (
    <>
      <Header />
      <div className={styles.container}>
        <p>aaaaaaaa</p>
      </div>
      <Footer />
    </>
  );
};

export default Events;
