const db = require('../../models');
const ServerError = require('../../errors/ServerError');
const NotFound = require('../../errors/UserNotFoundError');
const UtilFunctions = require('../../utils/functions');
const CONSTANTS = require('../../constants');

module.exports.updateContest = async (data, predicate, transaction) => {
  const [updatedCount, [updatedContest]] = await db.Contests.update(data, {
    where: predicate,
    returning: true,
    transaction,
  });
  if (updatedCount !== 1) {
    throw new ServerError('cannot update Contest');
  }
  return updatedContest.dataValues;
};

module.exports.updateContestsStatus = async (data, predicate, transaction) => {
  const [updatedCount, updateResult] = await db.Contests.update(data, {
    where: predicate,
    returning: true,
    transaction,
  });
  if (updatedCount < 1) {
    throw new ServerError('cannot update Contest');
  }
  return updateResult;
};

module.exports.findContest = async data => {
  const contest = await db.Contests.findByPk(data);

  if (!contest) {
    throw new NotFound('contest with this data didn`t exist');
  }

  return contest;
};

module.exports.updateOffer = async (data, predicate, transaction) => {
  const [updatedCount, [updatedOffer]] = await db.Offers.update(data, {
    where: predicate,
    returning: true,
    transaction,
  });
  if (updatedCount !== 1) {
    throw new ServerError('cannot update offer!');
  }
  return updatedOffer.dataValues;
};

module.exports.updateOfferStatus = async (data, predicate, transaction) => {
  const [updatedCount, updatedOffer] = await db.Offers.update(data, {
    where: predicate,
    returning: true,
    transaction,
  });
  if (updatedCount < 1) {
    throw new ServerError('cannot update offer!');
  }
  return updatedOffer;
};

module.exports.createOffer = async data => {
  const result = await db.Offers.create(data);
  if (!result) {
    throw new ServerError('cannot create new Offer');
  }
  return result.get({ plain: true });
};

module.exports.findOffers = async data => {
  const {
    limit = 10,
    offset = 0,
    typeIndex,
    contestId,
    industry,
    awardSort,
  } = data;
  const predicates = UtilFunctions.createWhereForAllContests(
    typeIndex,
    contestId,
    industry,
    awardSort
  );
  const result = await db.Offers.findAll({
    where: {
      approvedStatus: CONSTANTS.OFFER_APPROVED_VERIFYING,
      status: CONSTANTS.OFFER_STATUS_PENDING,
    },
    limit,
    offset,
    include: [
      {
        model: db.Contests,
        where: predicates.where,
        order: predicates.order,
        attributes: ['contestType', 'industry'],
      },
      {
        model: db.Users,
        attributes: [
          'id',
          'firstName',
          'lastName',
          'displayName',
          'email',
          'avatar',
          'rating',
        ],
      },
    ],
  });
  if (!result) {
    throw new NotFound('Offers with this data didn`t exist');
  }
  return result;
};
