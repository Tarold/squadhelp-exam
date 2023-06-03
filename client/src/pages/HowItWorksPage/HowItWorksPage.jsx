import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import HelpList from '../../components/HelpList/HelpList';
import styles from './HowItWorksPage.module.sass';
import CONSTANTS from '../../constants';
import classNames from 'classnames';
import HELP_LIST_DATA from './helpListData';

const HowItWorksPage = () => {
  const IMAGES_PATH = `${CONSTANTS.STATIC_IMAGES_PATH}how_it_works/`;
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

          <img
            alt=''
            className={styles.banerImg}
            src={`${IMAGES_PATH}phoneguy.png`}
          />
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
              <img alt='contest' src={`${IMAGES_PATH}contest.png`} />
              <h3 className=''>Launch a Contest</h3>
              <p>
                Work with hundreds of creative experts to get custom name
                suggestions for your business or brand. All names are
                auto-checked for URL availability.
              </p>
              <Link to='/startContest'>Launch a Contest</Link>
            </div>

            <div className={styles.card}>
              <img alt='' src={`${IMAGES_PATH}computer.png`} />

              <h3 className=''>Explore Names For Sale</h3>
              <p>
                Our branding team has curated thousands of pre-made names that
                you can purchase instantly. All names include a matching URL and
                a complimentary Logo Design
              </p>

              <Link to='/'>Explore Names For Sale</Link>
            </div>

            <div className={styles.card}>
              <img alt='' src={`${IMAGES_PATH}idea.png`} />

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

      <div className={styles.greyContainer}>
        <div className={styles.namingContestsSection}>
          <div className={styles.namingContests}>
            <img src={`${IMAGES_PATH}reward.png`} />
            <h2>How Do Naming Contests Work?</h2>
          </div>

          <div className={styles.namingContestsGrid}>
            <img
              className={styles.namingImgGrid}
              src={`${IMAGES_PATH}chairguy.png`}
            />
            <ol className={styles.namingList}>
              <li>
                <p>
                  Fill out your Naming Brief and begin receiving name ideas in
                  minutes
                </p>
              </li>
              <li>
                <p>
                  Rate the submissions and provide feedback to creatives.
                  Creatives submit even more names based on your feedback.
                </p>
              </li>
              <li>
                <p>
                  Our team helps you test your favorite names with your target
                  audience. We also assist with Trademark screening.{' '}
                </p>
              </li>
              <li>
                <p>
                  Pick a Winner. The winner gets paid for their submission.{' '}
                </p>
              </li>
            </ol>
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <HelpList data={HELP_LIST_DATA}></HelpList>
      </div>
      <div>
        <div className={styles.contestStartSection}>
          <h3 className={styles.title}>Ready to get started?</h3>
          <p className={styles.text}>
            Fill out your contest brief and begin receiving custom name
            suggestions within minutes.
          </p>
          <a className={styles.link} href='/start-contest'>
            Start A Contest
          </a>
          <img className={styles.bgFirstImg} src={`${IMAGES_PATH}teeth.png`} />
          <img className={styles.bgSecondImg} src={`${IMAGES_PATH}apple.png`} />
        </div>
        <div className={styles.statisticSection}>
          <ul className={styles.statisticList}>
            <li>
              <img src={`${IMAGES_PATH}stars.png`} alt='' />
              <p>
                <span>4.9 out of 5 stars</span>
                from 25,000+ customers.
              </p>
            </li>
            <li>
              <img src={`${IMAGES_PATH}contacts.png`} alt='' />

              <p>
                Our branding community stands
                <span>200,000+</span>
                strong.
              </p>
            </li>
            <li>
              <img src={`${IMAGES_PATH}sharing-files.png`} alt='' />

              <p>
                <span>140+ Industries</span>
                supported across more than
                <span>85 countries</span>- and counting.
              </p>
            </li>
          </ul>
        </div>
        <div className={styles.factSection}>
          <div className={styles.facts}>
            <div className={styles.arrow}>
              <div className={styles.fact}>
                <h4>Pay a Fraction of cost vs hiring an agency</h4>
                <p>
                  For as low as $199, our naming contests and marketplace allow
                  you to get an amazing brand quickly and affordably.
                </p>
              </div>
            </div>
            <div className={styles.arrow}>
              <div className={styles.fact}>
                <h4>Satisfaction Guarantee</h4>
                <p>
                  Of course! We have policies in place to ensure that you are
                  satisfied with your experience.
                  <a href='https://www.google.com/'>Learn more</a>
                </p>
              </div>
            </div>
          </div>
          <div className={styles.questions}>
            <h4>Questions?</h4>
            <p>
              Speak with a Squadhelp platform expert to learn more and get your
              questions answered.
            </p>
            <a
              href='https://www.google.com/'
              className={styles.callConsultation}
            >
              Schedule Consultation
            </a>
            <a href='tel:8773553585' className={styles.telephoneConsultation}>
              <i className='fas fa-phone' /> (877) 355-3585
            </a>
            <span>Call us for assistance</span>
          </div>
        </div>
      </div>
      <div className={styles.featuredInSection}>
        <h6 className={styles.title}>Featured In</h6>
        <ul className={styles.clientsList}>
          <li>
            <a href='https://www.google.com/'>
              <img src={`${IMAGES_PATH}clients/forbes.png`} alt='' />
            </a>
          </li>
          <li>
            <a href='https://www.google.com/'>
              <img src={`${IMAGES_PATH}clients/tnw.png`} alt='' />
            </a>
          </li>
          <li>
            <a href='https://www.google.com/'>
              <img src={`${IMAGES_PATH}clients/chicago.png`} alt='' />
            </a>
          </li>
          <li>
            <a href='https://www.google.com/'>
              <img src={`${IMAGES_PATH}clients/mashable.png`} alt='' />
            </a>
          </li>
        </ul>
      </div>
      <Footer />
    </>
  );
};

export default HowItWorksPage;
