const { Conversations, Messages } = require('../../models');
const ServerError = require('../../errors/ServerError');
const NotFound = require('../../errors/UserNotFoundError');

module.exports.createMessage = async (sender, body, conversationId) => {
  const message = await Messages.create({
    sender,
    body,
    conversationId,
  });

  if (!message) {
    throw new ServerError('cannot create message');
  }
  return message;
};

module.exports.findMessages = async participants => {
  const messages = await Messages.findAll({
    include: [
      {
        model: Conversations,
        as: 'Conversation',
        where: {
          participant1: participants[0],
          participant2: participants[1],
        },
      },
    ],
    order: [['createdAt', 'ASC']],
    attributes: ['id', 'sender', 'body', 'conversationId', 'createdAt'],
  });

  if (!messages) {
    throw new NotFound('messages with this data didn`t exist');
  }
  return messages;
};
