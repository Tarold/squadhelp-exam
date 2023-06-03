import React from 'react';
import CONSTANTS from '../../../constants';
import reactStringReplace from 'react-string-replace';
import styles from './HelpCard.module.sass';
import classNames from 'classnames';

function replaceCustomLink (text, replacementList) {
  return reactStringReplace(
    text,
    CONSTANTS.CUSTOM_LINK_REPLACER,
    (match, i) => {
      const link = replacementList[i - 1];

      return <a href={link.link}>{link.text}</a>;
    }
  );
}

const HelpCard = ({ data, cardId, openCard, open, close }) => {
  const listMap = (item, i) => (
    <li key={i + 'CardList'}>
      {item.link ? <a href={item.link}>{item.text}</a> : <p>{item.text}</p>}
    </li>
  );

  const handleClick = () => (cardId === openCard ? close() : open());

  let preparedText = data.text;
  if (data.links) preparedText = replaceCustomLink(data.text, data.links);

  return (
    <li className={styles.helpCard}>
      <button className={styles.cardTitle} onClick={handleClick}>
        {data.title}
        <i
          className={classNames('fas fa-arrow-right', {
            'fa-rotate-90': cardId === openCard,
          })}
        ></i>
      </button>
      <div
        className={classNames(styles.cardContent, {
          [styles.isClosed]: cardId !== openCard,
        })}
      >
        <p>{preparedText}</p>
        {data.list && <ul>{data.list.map(listMap)}</ul>}
      </div>
    </li>
  );
};
export default HelpCard;
