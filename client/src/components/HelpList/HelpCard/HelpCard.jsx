import React from 'react';
import CONSTANTS from '../../../constants';
import reactStringReplace from 'react-string-replace';

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

const HelpList = ({ data }) => {
  let preparedText = [data.text];

  const textMap = item => item;

  const listMap = item => (
    <li>
      <p>{item}</p>
    </li>
  );

  if (data.links) preparedText = replaceCustomLink(data.text, data.links);

  return (
    <li>
      <p>{data.title}</p>

      <p>{preparedText.map(textMap)}</p>

      {data.list && <ul>{data.list.map(listMap)}</ul>}
    </li>
  );
};
export default HelpList;
