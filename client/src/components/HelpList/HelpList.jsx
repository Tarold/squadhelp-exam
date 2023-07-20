import React, { useState } from 'react';
import HelpSection from './HelpSection/HelpSection';
import HelpListNav from './HelpListNav/HelpListNav';
import styles from './HelpList.module.sass';

const HelpList = ({ data }) => {
  const mapList = (data, id) => (
    <HelpSection
      key={id + 'HelpSection'}
      data={data}
      sectionId={id}
      openCard={openCard}
      setOpenCard={setOpenCard}
    />
  );

  const [openCard, setOpenCard] = useState('');

  return (
    <div className={styles.helpList}>
      <div className={styles.helpListNavContainer}>
        <HelpListNav data={data} />
      </div>
      <div className={styles.helpSectionContainer}>{data.map(mapList)}</div>
    </div>
  );
};
export default HelpList;
