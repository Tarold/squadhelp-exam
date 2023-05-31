import React from 'react';
import { connect } from 'react-redux';
import Header from '../../components/Header/Header';
import ModeratorDashboard from '../../components/ModeratorDashboard/ModeratorDashboard';

const Dashboard = props => {
  const { history } = props;
  return (
    <div>
      <Header />
      <ModeratorDashboard history={history} match={props.match} />
    </div>
  );
};

const mapStateToProps = state => state.userStore.data;

export default connect(mapStateToProps)(Dashboard);
