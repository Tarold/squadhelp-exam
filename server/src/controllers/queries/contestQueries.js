const bd = require('../../models');
const ServerError = require('../../errors/ServerError');

module.exports.updateContest = async (data, predicate, transaction) => {
  const [updatedCount, [updatedContest]] = await bd.Contests.update(data, {
    where: predicate,
    returning: true,
    transaction,
  });
  if (updatedCount !== 1) {
    throw new ServerError('cannot update Contest');
  }
  return updatedContest.dataValues;
};

module.exports.updateContestStatus = async (data, predicate, transaction) => {
  const [updatedCount, [updateResult]] = await bd.Contests.update(data, {
    where: predicate,
    returning: true,
    transaction,
  });
  if (updatedCount < 1) {
    throw new ServerError('cannot update Contest');
  }
  return updateResult.dataValues;
};

module.exports.updateOffer = async (data, predicate, transaction) => {
  const [updatedCount, [updatedOffer]] = await bd.Offers.update(data, {
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
  const [updatedCount, updatedOffer] = await bd.Offers.update(data, {
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
  const result = await bd.Offers.create(data);
  if (!result) {
    throw new ServerError('cannot create new Offer');
  }
  return result.get({ plain: true });
};
