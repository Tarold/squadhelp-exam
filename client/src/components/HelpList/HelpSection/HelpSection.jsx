import React from 'react';
import HelpCard from '../HelpCard/HelpCard';
import styles from './HelpSection.module.sass';

const HelpSection = ({ data, sectionId, openCard, setOpenCard }) => {
  const mapCards = (data, id) => (
    <HelpCard
      key={sectionId + id + 'HelpCard'}
      data={data}
      cardId={'' + sectionId + id}
      openCard={openCard}
      open={() => setOpenCard('' + sectionId + id)}
      close={() => setOpenCard('')}
    ></HelpCard>
  );

  return (
    <div id={data.id} className={styles.helpSection}>
      <h3 className={styles.titleSection}>{data.title}</h3>
      <ul className={styles.listSection}>{data.list.map(mapCards)}</ul>
    </div>
  );
};
export default HelpSection;
