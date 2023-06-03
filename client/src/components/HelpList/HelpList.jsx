import React from 'react';
import HelpSection from './HelpSection/HelpSection';

const HelpList = ({ data }) => {
  const mapList = data => <HelpSection data={data} />;
  return <div>{data.map(mapList)}</div>;
};
export default HelpList;
