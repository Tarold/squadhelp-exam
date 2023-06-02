import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  updateContest,
  clearContestUpdationStore,
} from '../../store/slices/contestUpdationSlice';
import { changeEditContest } from '../../store/slices/contestByIdSlice';
import ContestForm from '../Contest/ContestForm/ContestForm';
import styles from './Brief.module.sass';
import ContestInfo from '../Contest/ContestInfo/ContestInfo';
import Error from '../Error/Error';

const Brief = props => {
  const setNewContestData = async values => {
    const data = new FormData();
    Object.keys(values).forEach(key => {
      if (key !== 'file' && values[key]) data.append(key, values[key]);
    });

    if (values.file) {
      const imgBlob = await fetch(values.file).then(r => r.blob());

      data.append('file', imgBlob, values.fileName);
    }
    props.update(props.contestData.id, data);
  };

  const getContestObjInfo = () => {
    const data = { ...props.contestData };
    const defaultData = {};

    Object.keys(data).forEach(key => {
      if (data[key]) {
        console.log(key, ' :>> ', data[key]);
        if (key === 'originalFileName') {
          defaultData.fileName = data[key];
        } else {
          defaultData[key] = data[key];
        }
      }
    });
    return defaultData;
  };

  const {
    isEditContest,
    contestData,
    changeEditContest,
    role,
    goChat,
    clearContestUpdationStore,
  } = props;
  const { error } = props.contestUpdationStore;
  const { id } = props.userStore.data;
  if (!isEditContest) {
    return (
      <ContestInfo
        userId={id}
        contestData={contestData}
        changeEditContest={changeEditContest}
        role={role}
        goChat={goChat}
      />
    );
  }
  return (
    <div className={styles.contestForm}>
      {error && (
        <Error
          data={error.data}
          status={error.status}
          clearError={clearContestUpdationStore}
        />
      )}
      <ContestForm
        contestType={contestData.contestType}
        defaultData={getContestObjInfo()}
        handleSubmit={setNewContestData}
      />
    </div>
  );
};

const mapStateToProps = state => {
  const { isEditContest } = state.contestByIdStore;
  const { contestUpdationStore, userStore } = state;
  return { contestUpdationStore, userStore, isEditContest };
};

const mapDispatchToProps = dispatch => ({
  update: (contestId, data) => dispatch(updateContest({ contestId, data })),
  changeEditContest: data => dispatch(changeEditContest(data)),
  clearContestUpdationStore: () => dispatch(clearContestUpdationStore()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Brief));
