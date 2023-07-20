import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Logo from '../../components/Logo/Logo';
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm';
import styles from './RegistrationPage.module.sass';
import { clearAuthError } from '../../store/slices/authSlice';
import CONSTANTS from '../../constants';
import QuestionList from '../../components/QuestionList/QuestionList';

const RegistrationPage = props => {
  props.clearError();

  return (
    <div className={styles.signUpPage}>
      <div className={styles.signUpContainer}>
        <div className={styles.headerSignUpPage}>
          <Logo src={`${CONSTANTS.STATIC_IMAGES_PATH}logo.png`} />
          <Link to='/login' className={styles.linkLoginContainer}>
            <span>Login</span>
          </Link>
        </div>
        <RegistrationForm history={props.history} />
      </div>
      <div className={styles.footer}>
        <QuestionList>
          Check out our <span>FAQs</span> or send us a <span>message</span>. For
          assistance with launching a contest, you can also call us at (877)
          355-3585 or schedule a <span>Branding Consultation</span>
        </QuestionList>
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  clearError: () => dispatch(clearAuthError()),
});

export default connect(null, mapDispatchToProps)(RegistrationPage);
