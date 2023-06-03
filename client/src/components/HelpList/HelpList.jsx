import React from 'react';
import HelpSection from './HelpSection/HelpSection';
import HelpListNav from './HelpListNav/HelpListNav';

const HelpList = ({ data }) => {
  const mapList = data => <HelpSection data={data} />;

  return (
    <div>
      <HelpListNav data={data} />
      <div>{data.map(mapList)}</div>
    </div>
  );
};
export default HelpList;
