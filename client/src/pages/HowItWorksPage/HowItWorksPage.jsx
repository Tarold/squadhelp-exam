import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';

import styles from './HowItWorksPage.module.sass';
import CONSTANTS from '../../constants';
import classNames from 'classnames';

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
              <i className={classNames('fas fa-play', styles.play)} />
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
      <div className={styles.namingContestsSection}></div>
      <h2>How Do Naming Contests Work?</h2>
      <div className={styles.namingContestsGrid}>
        <img className={styles.namingImg} src={`${IMAGES_PATH}chairguy.png`} />
        <ol className={styles.namingList}>
          <li>
            <p>
              Fill out your Naming Brief and begin receiving name ideas in
              minutes
            </p>
          </li>
          <li>
            <p>
              Rate the submissions and provide feedback to creatives. Creatives
              submit even more names based on your feedback.
            </p>
          </li>
          <li>
            <p>
              Our team helps you test your favorite names with your target
              audience. We also assist with Trademark screening.{' '}
            </p>
          </li>
          <li>
            <p>Pick a Winner. The winner gets paid for their submission. </p>
          </li>
        </ol>
      </div>
      <nav>
        <ul>
          <li>
            <a href='https://www.squadhelp.com/how-it-works#contests'>
              Launching A Contest
            </a>
          </li>
          <li>
            <a href='https://www.squadhelp.com/how-it-works#marketplace'>
              Buying From Marketplace
            </a>
          </li>
          <li>
            <a href='https://www.squadhelp.com/how-it-works#managed'>
              Managed Contests
            </a>
          </li>
          <li>
            <a href='https://www.squadhelp.com/how-it-works#creatives'>
              For Creatives
            </a>
          </li>
        </ul>
      </nav>
      <div>
        <div id='basicsHeadingOne'>
          <h5>
            <button>
              How long does it take to start receiving submissions?
              <span class='card-btn-arrow'></span>
            </button>
          </h5>
        </div>
        <div
          id='basicsCollapseOne'
          class='collapse show'
          aria-labelledby='basicsHeadingOne'
          data-parent='#basicsAccordion'
        >
          <div class='card-body'>
            For Naming contests, you will start receiving your submissions
            within few minutes of launching your contest. Since our creatives
            are located across the globe, you can expect to receive submissions
            24 X 7 throughout the duration of the brainstorming phase .
          </div>
        </div>
      </div>
      <div class='container space-1'>
        <h3 class='h2 text-info font-weight-semi-bold mb-2'>
          Ready to get started?
        </h3>
        <p class='lead text-white mb-3'>
          Fill out your contest brief and begin receiving custom name
          suggestions within minutes.
        </p>
        <a
          class='btn btn-white btn-wide transition-3d-hover'
          href='https://www.squadhelp.com/start-contest'
        >
          Start A Contest
        </a>
      </div>
      <div class='container space-1 space-lg-2'>
        <div class='row justify-content-lg-center'>
          <div class='col-md-4 mb-7 mb-lg-0'>
            <div class='u-indicator-vertical-line text-center px-md-3 px-lg-7'>
              <figure
                id='statsStars'
                class='ie-height-72 w-100 max-width-10 mx-auto mb-3'
              ></figure>
              <p class='mb-0'>
                <span class='text-dark font-weight-semi-bold'>
                  4.9 out of 5 stars
                </span>{' '}
                from 25,000+ customers.
              </p>
            </div>
          </div>
          <div class='col-md-4 mb-7 mb-lg-0'>
            <div class='u-indicator-vertical-line text-center px-md-3 px-lg-7'>
              <div class='max-width-11 mx-auto mb-3'></div>
              <p class='mb-0'>
                Our branding community stands{' '}
                <span class='text-dark font-weight-semi-bold'>200,000+</span>{' '}
                strong.
              </p>
            </div>
          </div>
          <div class='col-md-4'>
            <div class='text-center px-md-3 px-lg-7'>
              <figure
                id='statsSharingFiles'
                class='ie-height-72 w-100 max-width-10 mx-auto mb-3'
              ></figure>
              <p>
                <span class='text-dark font-weight-semi-bold'>
                  140+ Industries
                </span>
                supported across more than
                <span class='text-dark font-weight-semi-bold'>
                  85 countries
                </span>
                - and counting.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class='media-body'>
        <h4 class='h5 mb-1'>Pay a Fraction of cost vs hiring an agency</h4>
        <p class='small'>
          For as low as $199, our naming contests and marketplace allow you to
          get an amazing brand quickly and affordably.
        </p>
      </div>
      <div class='media-body'>
        <h4 class='h4 mb-1'>Satisfaction Guarantee</h4>
        <p class='small'>
          Of course! We have policies in place to ensure that you are satisfied
          with your experience.
          <a
            href='https://www.squadhelp.com/how-it-works#satisfactionGaurenteedModal'
            data-modal-target='#satisfactionGaurenteedModal'
            data-modal-effect='fadein'
          >
            Learn more
          </a>
        </p>
      </div>
      <div class='media-body'>
        <h4 class='h2 text-white mb-1'>Questions?</h4>
        <p class='text-white small'>
          Speak with a Squadhelp platform expert to learn more and get your
          questions answered.
        </p>
        <button
          onclick='if (!window.__cfRLUnblockHandlers) return false; scheduleConsultationClick()'
          class='btn btn-white btn-wide btn-pill text-primary shadow-soft transition-3d-hover'
        >
          Schedule Consultation
        </button>
        <a
          href='https://www.squadhelp.com/how-it-works'
          class='clus text-white small'
        >
          &nbsp; (877) 355-3585
        </a>
        <span class='text-white mt-2 d-inline-block small'>
          Call us for assistance
        </span>
      </div>
      <div>
        <div class='pl-md-4'>
          <h6 class='h3 pt-5'>Featured In</h6>
        </div>
        <img src='' alt='' />
        <img src='' alt='' />
        <img src='' alt='' />
        <img src='' alt='' />
      </div>
      <Footer />
    </>
  );
};

export default HowItWorksPage;
