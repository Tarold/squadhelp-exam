const db = require('../../models');
const ServerError = require('../../errors/ServerError');
const NotFound = require('../../errors/UserNotFoundError');

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
