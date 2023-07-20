import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Logo from '../../components/Logo/Logo';
import RegistrationModeratorForm from '../../components/RegistrationModeratorForm/RegistrationModeratorForm';
import styles from './RegistrationModeratorPage.module.sass';
import { clearAuthError } from '../../store/slices/authSlice';
import CONSTANTS from '../../constants';

const RegistrationModeratorPage = props => {
  props.clearError();

  return (
    <div className={styles.signUpPage}>
      <div className={styles.signUpContainer}>
        <div className={styles.headerSignUpPage}>
          <Logo src={`${CONSTANTS.STATIC_IMAGES_PATH}logo.png`} />
          <div className={styles.linkLoginContainer}>
            <Link to='/' style={{ textDecoration: 'none' }}>
              <span>Return</span>
            </Link>
          </div>
        </div>
        <RegistrationModeratorForm history={props.history} />
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  clearError: () => dispatch(clearAuthError()),
});

export default connect(null, mapDispatchToProps)(RegistrationModeratorPage);
