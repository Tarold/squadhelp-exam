import React from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../store/slices/userSlice';
import Spinner from '../Spinner/Spinner';
import CONSTANTS from '../../constants';
import NotFound from '../NotFound/NotFound';

const AdminHoc = (Component, props) => {
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

      if (this.props.data && this.props.data.role === CONSTANTS.ADMIN) {
        return (
          <Component
            history={this.props.history}
            match={this.props.match}
            {...props}
          />
        );
      }
      return NotFound();
    }
  }

  const mapStateToProps = state => state.userStore;

  const mapDispatchToProps = dispatch => ({
    getUser: () => dispatch(getUser()),
  });

  return connect(mapStateToProps, mapDispatchToProps)(Hoc);
};

export default AdminHoc;
