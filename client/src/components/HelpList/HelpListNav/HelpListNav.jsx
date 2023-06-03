import React from 'react';
import styles from './HelpListNav.module.sass';
const HelpListNav = ({ data }) => {
  const headerListMap = (section, id) => (
    <li key={id + 'HeaderList'}>
      <a href={'#' + section.id} className={styles.navLink}>
        {section.title}
      </a>
    </li>
  );
  return <ul className={styles.HelpListNav}>{data.map(headerListMap)}</ul>;
};
export default HelpListNav;
