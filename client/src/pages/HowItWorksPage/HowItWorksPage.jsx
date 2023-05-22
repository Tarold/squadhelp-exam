import React from 'react';

import styles from './HowItWorksPage.module.sass';

const HowItWorksPage = () => {
  return (
    <div>
      <div className={styles.container}>
        <section className={styles.section}>
          <h1 className={styles.sectionHeading}>How It Works</h1>
          <div className={styles.grid}>
            <div className={styles.gridColumn}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepDescription}>Create a Contest</div>
            </div>
            <div className={styles.gridColumn}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepDescription}>Receive Ideas</div>
            </div>
            <div className={styles.gridColumn}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepDescription}>Pick a Winner</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowItWorksPage;
