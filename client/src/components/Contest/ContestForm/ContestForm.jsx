import React from 'react';
import { Form, Formik } from 'formik';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import CONSTANTS from '../../../constants';
import { getDataForContest } from '../../../store/slices/dataForContestSlice';
import styles from './ContestForm.module.sass';
import Spinner from '../../Spinner/Spinner';
import FormInput from '../../FormInput/FormInput';
import SelectInput from '../../SelectInput/SelectInput';
import FieldFileInput from '../../InputComponents/FieldFileInput/FieldFileInput';
import FormTextArea from '../../InputComponents/FormTextArea/FormTextArea';
import TryAgain from '../../TryAgain/TryAgain';
import Schems from '../../../utils/validators/validationSchems';
import OptionalSelects from '../../OptionalSelects/OptionalSelects';

const variableOptions = {
  [CONSTANTS.NAME_CONTEST]: {
    values: { styleName: '', typeOfName: '' },
    shema: Schems.ContestSchem.concat(Schems.ContestNameSchem),
  },
  [CONSTANTS.LOGO_CONTEST]: {
    values: {
      nameVenture: '',
      brandStyle: '',
    },
    shema: Schems.ContestSchem.concat(Schems.ContestLogoSchem),
  },
  [CONSTANTS.TAGLINE_CONTEST]: {
    values: {
      nameVenture: '',
      typeOfTagline: '',
    },
    shema: Schems.ContestSchem.concat(Schems.ContestTaglineSchem),
  },
};

class ContestForm extends React.Component {
  getPreference = () => {
    const { contestType } = this.props;
    switch (contestType) {
      case CONSTANTS.NAME_CONTEST: {
        this.props.getData({
          characteristic1: 'nameStyle',
          characteristic2: 'typeOfName',
        });
        break;
      }
      case CONSTANTS.TAGLINE_CONTEST: {
        this.props.getData({ characteristic1: 'typeOfTagline' });
        break;
      }
      case CONSTANTS.LOGO_CONTEST: {
        this.props.getData({ characteristic1: 'brandStyle' });
        break;
      }
      default: {
        break;
      }
    }
  };

  componentDidMount () {
    this.getPreference();
  }

  render () {
    const { isFetching, error } = this.props.dataForContest;

    if (error) {
      return <TryAgain getData={this.getPreference} />;
    }
    if (isFetching) {
      return <Spinner />;
    }
    return (
      <>
        <div className={styles.formContainer}>
          <Formik
            initialValues={{
              title: '',
              industry: '',
              focusOfWork: '',
              targetCustomer: '',
              file: null,
              fileName: null,
              ...variableOptions[this.props.contestType].values,
              ...this.props.initialValues,
            }}
            onSubmit={this.props.handleSubmit}
            validationSchema={variableOptions[this.props.contestType].shema}
            innerRef={this.props.formRef}
            enableReinitialize
          >
            {({ values, setFieldValue, errors }) => (
              <Form>
                <div className={styles.inputContainer}>
                  <span className={styles.inputHeader}>Title of contest</span>
                  <FormInput
                    name='title'
                    type='text'
                    label='Title'
                    classes={{
                      container: styles.componentInputContainer,
                      input: styles.input,
                      warning: styles.warning,
                    }}
                  />
                </div>
                <div className={styles.inputContainer}>
                  <SelectInput
                    name='industry'
                    classes={{
                      inputContainer: styles.selectInputContainer,
                      inputHeader: styles.selectHeader,
                      selectInput: styles.select,
                      warning: styles.warning,
                    }}
                    header='Describe industry associated with your venture'
                    optionsArray={this.props.dataForContest.data.industry}
                  />
                </div>
                <div className={styles.inputContainer}>
                  <span className={styles.inputHeader}>
                    What does your company / business do?
                  </span>
                  <FormTextArea
                    name='focusOfWork'
                    type='text'
                    label='e.g. We`re an online lifestyle brand that provides stylish and high quality apparel to the expert eco-conscious shopper'
                    classes={{
                      container: styles.componentInputContainer,
                      inputStyle: styles.textArea,
                      warning: styles.warning,
                    }}
                  />
                </div>
                <div className={styles.inputContainer}>
                  <span className={styles.inputHeader}>
                    Tell us about your customers
                  </span>
                  <FormTextArea
                    name='targetCustomer'
                    type='text'
                    label='customers'
                    classes={{
                      container: styles.componentInputContainer,
                      inputStyle: styles.textArea,
                      warning: styles.warning,
                    }}
                  />
                </div>
                <OptionalSelects {...this.props} />
                <FieldFileInput
                  classes={{
                    fileUploadContainer: styles.fileUploadContainer,
                    labelClass: styles.label,
                    fileNameClass: styles.fileName,
                    fileInput: styles.fileInput,
                    clearButton: styles.clearButton,
                  }}
                  setFieldValue={setFieldValue}
                  fileName={values.fileName}
                  type='file'
                />
                {this.props.isEditContest ? (
                  <button type='submit' className={styles.changeData}>
                    Set Data
                  </button>
                ) : null}
              </Form>
            )}
          </Formik>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { isEditContest } = state.contestByIdStore;
  return {
    isEditContest,
    contestCreationStore: state.contestCreationStore,
    dataForContest: state.dataForContest,
    initialValues: ownProps.defaultData,
  };
};
const mapDispatchToProps = dispatch => ({
  getData: data => dispatch(getDataForContest(data)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ContestForm)
);
