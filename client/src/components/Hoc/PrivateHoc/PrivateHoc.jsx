import React from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../../store/slices/userSlice';
import Spinner from '../../Spinner/Spinner';

const PrivateHoc = (Component, props) => {
  class Hoc extends React.Component {
    componentDidMount () {
      if (!this.props.data) {
        this.props.getUser();
      }
    }

    render () {
      if (this.props.isFetching) {
        return <Spinner />;
      } else if (this.props.data) {
        return (
          <Component
            history={this.props.history}
            match={this.props.match}
            {...props}
          />
        );
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

export default PrivateHoc;
