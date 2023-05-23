import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';

import styles from './HowItWorksPage.module.sass';
import CONSTANTS from '../../constants';

const HowItWorksPage = () => {
  const IMAGES_PATH = `${CONSTANTS.STATIC_IMAGES_PATH}how_it_works/`;
  //TODO vimeo player
  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.banerSection}>
          <div className={styles.baner}>
            <span className={styles.banerNote}>World's #1 Naming Platform</span>
            <div>
              <h1>How Does Squadhelp Work?</h1>

              <p>
                Squadhelp helps you come up with a great name for your business
                by combining the power of crowdsourcing with sophisticated
                technology and Agency-level validation services.
              </p>
            </div>

            <a
              className={styles.button}
              data-fancybox=''
              href='https://vimeo.com/368584367'
            >
              <img className={styles.play} src={`${IMAGES_PATH}play.png`} />
              Play Video
            </a>
          </div>

          <img className={styles.banerImg} src={`${IMAGES_PATH}phoneguy.png`} />
        </div>
        <div className={styles.servicesSection}>
          <div className={styles.services}>
            <small className=''>Our Services</small>
            <h2 className=''>3 Ways To Use Squadhelp</h2>
            <p className=''>
              Squadhelp offers 3 ways to get you a perfect name for your
              business.
            </p>
          </div>

          <div className={styles.cardContainer}>
            <div className={styles.card}>
              <img src={`${IMAGES_PATH}contest.png`} />
              <h3 className=''>Launch a Contest</h3>
              <p>
                Work with hundreds of creative experts to get custom name
                suggestions for your business or brand. All names are
                auto-checked for URL availability.
              </p>
              <Link to='/startContest'>Launch a Contest</Link>
            </div>

            <div className={styles.card}>
              <img src={`${IMAGES_PATH}computer.png`} />

              <h3 className=''>Explore Names For Sale</h3>
              <p>
                Our branding team has curated thousands of pre-made names that
                you can purchase instantly. All names include a matching URL and
                a complimentary Logo Design
              </p>

              <Link to='/'>Explore Names For Sale</Link>
            </div>

            <div className={styles.card}>
              <img src={`${IMAGES_PATH}idea.png`} />

              <h3 className=''>Agency-level Managed Contests</h3>
              <p>
                Our Managed contests combine the power of crowdsourcing with the
                rich experience of our branding consultants. Get a complete
                agency-level experience at a fraction of Agency costs
              </p>

              <Link to='/'>Learn More</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HowItWorksPage;
