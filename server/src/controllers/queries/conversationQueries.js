const { Conversations, Messages, Sequelize } = require('../../models');
const { Op } = Sequelize;
const ServerError = require('../../errors/ServerError');
const NotFound = require('../../errors/UserNotFoundError');

module.exports.createOrUpdateConversation = async participants => {
  const [newConversation] = await Conversations.findOrCreate({
    where: {
      participant1: participants[0],
      participant2: participants[1],
    },
    defaults: {
      participant1: participants[0],
      participant2: participants[1],
      isBlock1: false,
      isBlock2: false,
      isFavorite1: false,
      isFavorite2: false,
    },
  });

  if (!newConversation) {
    throw new ServerError('cannot update or create Conversation');
  }

  return newConversation;
};
module.exports.findConversations = async userId => {
  const conversations = await Conversations.findAll({
    where: {
      [Op.or]: [{ participant1: userId }, { participant2: userId }],
    },
    include: [
      {
        model: Messages,
        attributes: ['sender', 'body', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: 1,
      },
    ],
    attributes: [
      'id',
      'participant1',
      'participant2',
      'isBlock1',
      'isBlock2',
      'isFavorite1',
      'isFavorite2',
    ],
  });

  if (!conversations) {
    throw new NotFound('conversations with this data didn`t exist');
  }

  return conversations;
};
module.exports.updateConcersation = async (predicate, value, participants) => {
  const [updatedCount, [updatedConversation]] = await Conversations.update(
    { [predicate]: value },
    {
      where: {
        participant1: participants[0],
        participant2: participants[1],
      },
      returning: true,
    }
  );
  if (!updatedCount) {
    throw new ServerError(
      'not updated. conversations with this data didn`t exist'
    );
  }

  return updatedConversation;
};
