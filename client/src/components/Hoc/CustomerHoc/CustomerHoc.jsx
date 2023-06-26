import React from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../../store/slices/userSlice';
import Spinner from '../../Spinner/Spinner';
import CONSTANTS from '../../../constants';
import NotAccess from '../../NotAccess/NotAccess';

const CustomerHoc = (Component, props) => {
  class Hoc extends React.Component {
    componentDidMount () {
      if (!this.props.data) {
        this.props.getUser();
      }
    }

    render () {
      if (this.props.isFetching) {
        return <Spinner />;
      }

      if (this.props.data && this.props.data.role === CONSTANTS.CUSTOMER) {
        return (
          <Component
            history={this.props.history}
            match={this.props.match}
            {...props}
          />
        );
      } else if (
        this.props.data &&
        (this.props.data.role === CONSTANTS.MODERATOR ||
          this.props.data.role === CONSTANTS.CREATOR)
      ) {
        return NotAccess();
      }

      return null;
    }
  }

  const mapStateToProps = state => state.userStore;

  const mapDispatchToProps = dispatch => ({
    getUser: () => dispatch(getUser()),
  });

  return connect(mapStateToProps, mapDispatchToProps)(Hoc);
};

export default CustomerHoc;
