import React from 'react';
import HelpCard from './../HelpCard/HelpCard';

const HelpSection = ({ data }) => {
  const mapCards = data => <HelpCard data={data}></HelpCard>;

  return (
    <div id={data.id}>
      <h3>{data.title}</h3>
      <ul>{data.list.map(mapCards)}</ul>
    </div>
  );
};
export default HelpSection;
