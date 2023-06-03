import React from 'react';

const HelpListNav = ({ data }) => {
  const headerList = data.map(section => (
    <div>
      <a href={'#' + section.id}>
        <p>{section.title}</p>
      </a>
    </div>
  ));
  return <div>{headerList}</div>;
};
export default HelpListNav;
