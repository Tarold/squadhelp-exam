import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import queryString from 'query-string';
import isEqual from 'lodash/isEqual';
import {
  getOffers,
  setNewModeratorFilter,
  clearOffersList,
} from '../../store/slices/offersSlice';
import { getDataForContest } from '../../store/slices/dataForContestSlice';
import OffersContainer from './OffersContainer/OffersContainer';
import Offer from './Offer/Offer';
import styles from './ModeratorDashboard.module.sass';
import TryAgain from '../TryAgain/TryAgain';
import CONSTANTS from '../../constants';
import { setOfferApprove } from '../../store/slices/offersSlice';

const types = [
  '',
  'name,tagline,logo',
  'name',
  'tagline',
  'logo',
  'name,tagline',
  'logo,tagline',
  'name,logo',
];

class ModeratorDashboard extends React.Component {
  renderSelectType = () => {
    const array = [];
    const { moderatorFilter } = this.props;
    types.forEach(
      (el, i) =>
        !i ||
        array.push(
          <option key={i - 1} value={el}>
            {el}
          </option>
        )
    );
    return (
      <select
        onChange={({ target }) =>
          this.changePredicate({
            name: 'typeIndex',
            value: types.indexOf(target.value),
          })
        }
        value={types[moderatorFilter.typeIndex]}
        className={styles.input}
      >
        {array}
      </select>
    );
  };

  renderIndustryType = () => {
    const array = [];
    const { moderatorFilter } = this.props;
    const { industry } = this.props.dataForContest.data;
    array.push(
      <option key={0} value={''}>
        Choose industry
      </option>
    );
    industry.forEach((industry, i) =>
      array.push(
        <option key={i + 1} value={industry}>
          {industry}
        </option>
      )
    );
    return (
      <select
        onChange={({ target }) =>
          this.changePredicate({
            name: 'industry',
            value: target.value,
          })
        }
        value={moderatorFilter.industry}
        className={styles.input}
      >
        {array}
      </select>
    );
  };

  UNSAFE_componentWillReceiveProps (nextProps, nextContext) {
    if (nextProps.location.search !== this.props.location.search) {
      this.parseUrlForParams(nextProps.location.search);
    }
  }

  componentDidMount () {
    this.props.getDataForContest();
    if (
      this.parseUrlForParams(this.props.location.search) &&
      !this.props.offers.length
    )
      this.getOffers(this.props.moderatorFilter);
  }

  getOffers = filter => {
    this.props.getOffers({
      limit: 8,
      offset: 0,
      ...filter,
    });
  };

  changePredicate = ({ name, value }) => {
    const { moderatorFilter } = this.props;
    this.props.newFilter({
      [name]: value === 'Choose industry' ? null : value,
    });
    this.parseParamsToUrl({
      ...moderatorFilter,
      ...{ [name]: value === 'Choose industry' ? null : value },
    });
  };

  parseParamsToUrl = moderatorFilter => {
    const obj = {};
    Object.keys(moderatorFilter).forEach(el => {
      if (moderatorFilter[el]) obj[el] = moderatorFilter[el];
    });
    this.props.history.push(`/offersApprove?${queryString.stringify(obj)}`);
  };

  parseUrlForParams = search => {
    const obj = queryString.parse(search);
    const filter = {
      typeIndex: obj.typeIndex || 1,
      contestId: obj.contestId ? obj.contestId : '',
      industry: obj.industry ? obj.industry : '',
      awardSort: obj.awardSort || 'asc',
    };
    if (!isEqual(filter, this.props.moderatorFilter)) {
      this.props.newFilter(filter);
      this.props.clearOffersList();
      this.getOffers(filter);
      return false;
    }
    return true;
  };

  getPredicateOfRequest = () => {
    const obj = {};
    const { moderatorFilter } = this.props;
    Object.keys(moderatorFilter).forEach(el => {
      if (moderatorFilter[el]) {
        obj[el] = moderatorFilter[el];
      }
    });
    return obj;
  };

  loadMore = startFrom => {
    this.props.getOffers({
      limit: 8,
      offset: startFrom,
      ...this.getPredicateOfRequest(),
    });
  };

  setOffersList = () => {
    const array = [];
    const { offers } = this.props;
    for (let i = 0; i < offers.length; i++) {
      array.push(
        <Offer
          data={offers[i]}
          key={offers[i].id}
          goToExtended={this.goToExtended}
          setOfferApprove={this.props.setOfferApprove}
        />
      );
    }
    return array;
  };

  goToExtended = contestId => {
    this.props.history.push(`/contest/${contestId}`);
  };

  tryLoadAgain = () => {
    this.props.clearOffersList();
    this.props.getOffers({
      limit: 8,
      offset: 0,
      ...this.getPredicateOfRequest(),
    });
  };

  render () {
    const { error, haveMore, moderatorFilter } = this.props;
    const { isFetching } = this.props.dataForContest;
    return (
      <div className={styles.mainContainer}>
        <div className={styles.filterContainer}>
          <span className={styles.headerFilter}>Filter Offers</span>
          <div className={styles.inputsContainer}>
            <div className={styles.inputContainer}>
              <span>By contest type</span>
              {this.renderSelectType()}
            </div>
            <div className={styles.inputContainer}>
              <span>By contest ID</span>
              <input
                type='text'
                onChange={({ target }) =>
                  this.changePredicate({
                    name: 'contestId',
                    value: target.value,
                  })
                }
                name='contestId'
                value={moderatorFilter.contestId}
                className={styles.input}
              />
            </div>
            {!isFetching && (
              <div className={styles.inputContainer}>
                <span>By industry</span>
                {this.renderIndustryType()}
              </div>
            )}
            <div className={styles.inputContainer}>
              <span>By amount award</span>
              <select
                onChange={({ target }) =>
                  this.changePredicate({
                    name: 'awardSort',
                    value: target.value,
                  })
                }
                value={moderatorFilter.awardSort}
                className={styles.input}
              >
                <option value='desc'>Descending</option>
                <option value='asc'>Ascending</option>
              </select>
            </div>
          </div>
        </div>
        {error ? (
          <div className={styles.messageContainer}>
            <TryAgain getData={this.tryLoadAgain} />
          </div>
        ) : (
          <OffersContainer
            isFetching={this.props.isFetching}
            loadMore={this.loadMore}
            history={this.props.history}
            haveMore={haveMore}
          >
            {this.setOffersList()}
          </OffersContainer>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { offersList, dataForContest } = state;
  return { ...offersList, dataForContest };
};

const mapDispatchToProps = dispatch => ({
  getOffers: data =>
    dispatch(getOffers({ requestData: data, role: CONSTANTS.MODERATOR })),
  clearOffersList: () => dispatch(clearOffersList()),
  newFilter: filter => dispatch(setNewModeratorFilter(filter)),
  getDataForContest: () => dispatch(getDataForContest()),
  setOfferApprove: data => dispatch(setOfferApprove(data)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ModeratorDashboard)
);
