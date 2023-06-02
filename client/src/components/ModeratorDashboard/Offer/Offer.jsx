import React from 'react';
import { connect } from 'react-redux';
import Rating from 'react-rating';
import { withRouter } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';
import { confirmAlert } from 'react-confirm-alert';
import { goToExpandedDialog } from '../../../store/slices/chatSlice';
import {
  changeMark,
  clearChangeMarkError,
  changeShowImage,
} from '../../../store/slices/contestByIdSlice';
import CONSTANTS from '../../../constants';
import styles from './Offer.module.sass';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './confirmStyle.css';

const Offer = props => {
  const findConversationInfo = () => {
    const { messagesPreview, id } = props;
    const participants = [id, props.data.User.id];
    participants.sort(
      (participant1, participant2) => participant1 - participant2
    );
    for (let i = 0; i < messagesPreview.length; i++) {
      if (isEqual(participants, messagesPreview[i].participants)) {
        return {
          participants: messagesPreview[i].participants,
          id: messagesPreview[i].id,
          blockList: messagesPreview[i].blockList,
          favoriteList: messagesPreview[i].favoriteList,
        };
      }
    }
    return null;
  };

  const passsedOffer = () => {
    confirmAlert({
      title: 'confirm',
      message: 'Are u sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: () =>
            props.setOfferApprove({
              creatorId: props.data.User.id,
              email: props.data.User.email,
              offerId: props.data.id,
              command: CONSTANTS.OFFER_APPROVED_ACCEPTED,
            }),
        },
        {
          label: 'No',
        },
      ],
    });
  };

  const deniedOffer = () => {
    confirmAlert({
      title: 'confirm',
      message: 'Are u sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: () =>
            props.setOfferApprove({
              creatorId: props.data.User.id,
              email: props.data.User.email,
              offerId: props.data.id,
              command: CONSTANTS.OFFER_APPROVED_DENIED,
            }),
        },
        {
          label: 'No',
        },
      ],
    });
  };

  const offerStatus = () => {
    const { status } = props.data;
    if (status === CONSTANTS.OFFER_STATUS_REJECTED) {
      return (
        <i
          className={classNames('fas fa-times-circle reject', styles.reject)}
        />
      );
    }
    if (status === CONSTANTS.OFFER_STATUS_WON) {
      return (
        <i
          className={classNames('fas fa-check-circle resolve', styles.resolve)}
        />
      );
    }
    return null;
  };

  const goChat = () => {
    props.goToExpandedDialog({
      interlocutor: props.data.User,
      conversationData: findConversationInfo(),
    });
  };
  const { data } = props;
  const { contestType, industry } = props.data.Contest;
  const { avatar, firstName, lastName, email, rating } = props.data.User;
  return (
    <div className={styles.offerContainer}>
      {offerStatus()}
      <div className={styles.mainInfoContainer}>
        <div className={styles.userInfo}>
          <div className={styles.creativeInfoContainer}>
            <img
              src={
                avatar === 'anon.png'
                  ? CONSTANTS.ANONYM_IMAGE_PATH
                  : `${CONSTANTS.publicImagesURL}${avatar}`
              }
              alt='user'
            />
            <div className={styles.nameAndEmail}>
              <span>{`${firstName} ${lastName}`}</span>
              <span>{email}</span>
            </div>
          </div>
          <div className={styles.creativeRating}>
            <span className={styles.userScoreLabel}>Creative Rating </span>
            <Rating
              initialRating={rating}
              fractions={2}
              fullSymbol={
                <img
                  src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`}
                  alt='star'
                />
              }
              placeholderSymbol={
                <img
                  src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`}
                  alt='star'
                />
              }
              emptySymbol={
                <img
                  src={`${CONSTANTS.STATIC_IMAGES_PATH}star-outline.png`}
                  alt='star-outline'
                />
              }
              readonly
            />
          </div>
        </div>
        <div className={styles.responseConainer}>
          {CONSTANTS.LOGO_CONTEST !== contestType ? (
            <span className={styles.response}>Offer text: {data.text}</span>
          ) : (
            <div>
              <img
                className={styles.responseImg}
                src={`${CONSTANTS.publicImagesURL}${data.fileName}`}
                alt='offer'
              />
              <a
                target='_blank'
                className={styles.file}
                href={`${CONSTANTS.publicImagesURL}${data.fileName}`}
                download={data.originalFileName}
                rel='noreferrer'
              >
                Open file
              </a>
            </div>
          )}
          <div className={styles.contestData}>
            <p>Contest type: {contestType}</p>
            <p>Contest industry: {industry}</p>
          </div>
        </div>

        <i onClick={goChat} className='fas fa-comments' />
      </div>
      {
        <div className={styles.btnsContainer}>
          <div onClick={passsedOffer} className={styles.resolveBtn}>
            Pass
          </div>
          <div onClick={deniedOffer} className={styles.rejectBtn}>
            Denied
          </div>
        </div>
      }
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  changeMark: data => dispatch(changeMark(data)),
  clearError: () => dispatch(clearChangeMarkError()),
  goToExpandedDialog: data => dispatch(goToExpandedDialog(data)),
  changeShowImage: data => dispatch(changeShowImage(data)),
});

const mapStateToProps = state => {
  const { changeMarkError } = state.contestByIdStore;
  const { id, role } = state.userStore.data;
  const { messagesPreview } = state.chatStore;
  return {
    changeMarkError,
    id,
    role,
    messagesPreview,
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Offer));
