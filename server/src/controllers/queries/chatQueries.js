const { Chats } = require('../../models');
const ServerError = require('../../errors/ServerError');

module.exports.createChat = async (catalogId, conversationId) => {
  const chat = await Chats.create(
    {
      catalogId,
      conversationId,
    },
    {
      attributes: ['conversationId'],
    },
    {
      returning: true,
    }
  );

  if (!chat) {
    throw new ServerError('cannot create chat');
  }

  return chat;
};

module.exports.findChats = async (catalogId, conversationId) => {
  const whereParams = conversationId
    ? {
        catalogId,
        conversationId,
      }
    : {
        catalogId,
      };
  const chats = await Chats.findAll({
    where: { ...whereParams },
    attributes: ['conversationId'],
  });

  if (!chats) {
    throw new ServerError('chats with this data didn`t exist');
  }

  return chats;
};
module.exports.removeChats = async (catalogId, conversationId) => {
  const whereParams = conversationId
    ? {
        catalogId,
        conversationId,
      }
    : {
        catalogId,
      };
  try {
    const chat = await Chats.destroy({
      where: {
        ...whereParams,
      },
    });
    return chat;
  } catch {
    throw new ServerError('cannot destroy Chats');
  }
};
