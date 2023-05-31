import React from 'react';
import { connect } from 'react-redux';
import { Form, Formik } from 'formik';
import Error from '../Error/Error';
import { checkAuth, clearAuth } from '../../store/slices/authSlice';
import styles from './RegistrationModeratorForm.module.sass';
import FormInput from '../FormInput/FormInput';
import CONSTANTS from '../../constants';
import Schems from '../../utils/validators/validationSchems';

class RegistrationModeratorForm extends React.Component {
  componentWillUnmount () {
    this.props.authClear();
  }

  clicked = values => {
    this.props.register({
      data: {
        firstName: values.firstName,
        lastName: values.lastName,
        displayName: values.displayName,
        email: values.email,
        password: values.password,
        role: values.role,
      },
      history: this.props.history,
    });
  };

  render () {
    const { auth, authClear } = this.props;
    const { error } = auth;

    const formInputClasses = {
      container: styles.inputContainer,
      input: styles.input,
      warning: styles.fieldWarning,
      notValid: styles.notValid,
      valid: styles.valid,
    };
    return (
      <div className={styles.signUpFormContainer}>
        {error && (
          <Error
            data={error.data}
            status={error.status}
            clearError={authClear}
          />
        )}
        <div className={styles.headerFormContainer}>
          <h2>CREATE MODERATOR</h2>
        </div>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            displayName: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: CONSTANTS.MODERATOR,
            agreeOfTerms: true,
          }}
          onSubmit={this.clicked}
          validationSchema={Schems.RegistrationModeratorSchem}
        >
          <Form>
            <div className={styles.row}>
              <FormInput
                name='firstName'
                classes={formInputClasses}
                type='text'
                label='First name'
              />
              <FormInput
                name='lastName'
                classes={formInputClasses}
                type='text'
                label='Last name'
              />
            </div>
            <div className={styles.row}>
              <FormInput
                name='displayName'
                classes={formInputClasses}
                type='text'
                label='Display Name'
              />
              <FormInput
                name='email'
                classes={formInputClasses}
                type='text'
                label='Email Address'
              />
            </div>
            <div className={styles.row}>
              <FormInput
                name='password'
                classes={formInputClasses}
                type='password'
                label='Password'
              />
              <FormInput
                name='confirmPassword'
                classes={formInputClasses}
                type='password'
                label='Password confirmation'
              />
            </div>

            <button type='submit' className={styles.submitContainer}>
              <span className={styles.inscription}>Create Account</span>
            </button>
          </Form>
        </Formik>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  initialValues: {
    role: CONSTANTS.CUSTOMER,
  },
});

const mapDispatchToProps = dispatch => ({
  register: ({ data, history }) =>
    dispatch(
      checkAuth({ data, history, authMode: CONSTANTS.AUTH_MODE.REGISTER })
    ),
  authClear: () => dispatch(clearAuth()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistrationModeratorForm);
