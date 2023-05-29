const db = require('../../models');
const NotFound = require('../../errors/UserNotFoundError');
const ServerError = require('../../errors/ServerError');
const bcrypt = require('bcrypt');

module.exports.updateUser = async (data, userId, transaction) => {
  const [updatedCount, [updatedUser]] = await db.Users.update(data, {
    where: { id: userId },
    returning: true,
    transaction,
  });
  if (updatedCount !== 1) {
    throw new ServerError('cannot update user');
  }
  return updatedUser.dataValues;
};

module.exports.findUser = async (predicate, transaction) => {
  const result = await db.Users.findOne({ where: predicate, transaction });
  if (!result) {
    throw new NotFound('user with this data didn`t exist');
  }
  return result.get({ plain: true });
};
module.exports.findUserByPk = async interlocutorId => {
  const result = await db.Users.findByPk(interlocutorId);
  if (!result) {
    throw new NotFound('user with this data didn`t exist');
  }
  return result;
};
module.exports.findUserByPk = async interlocutorId => {
  const result = await db.Users.findByPk(interlocutorId);
  if (!result) {
    throw new NotFound('user with this data didn`t exist');
  }
  return result;
};
module.exports.findUsers = async interlocutors => {
  const result = await db.Users.findAll({
    where: {
      id: {
        [db.Sequelize.Op.in]: interlocutors,
      },
    },
    attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
  });
  if (!result) {
    throw new ServerError('server error on search users');
  }
  return result;
};

module.exports.passwordCompare = async (pass1, pass2) => {
  const passwordCompare = await bcrypt.compare(pass1, pass2);
  if (!passwordCompare) {
    throw new NotFound('Wrong password');
  }
};
