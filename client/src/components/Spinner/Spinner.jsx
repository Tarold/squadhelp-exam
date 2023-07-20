import React from 'react';
import { ClipLoader } from 'react-spinners';
import styles from './Spinner.module.sass';

const override = {
  borderColor: '#46568a',
};

const SpinnerLoader = () => (
  <div className={styles.loaderContainer}>
    <ClipLoader
      sizeUnit='px'
      css={override}
      size={50}
      color='#46568a'
      loading
    />
  </div>
);

export default SpinnerLoader;
