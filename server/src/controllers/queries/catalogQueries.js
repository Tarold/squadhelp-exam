const { Chats, Catalogs, Sequelize } = require('../../models');
const { Op } = Sequelize;
const ServerError = require('../../errors/ServerError');
const NotFound = require('../../errors/UserNotFoundError');

module.exports.createCatalog = async (userId, catalogName) => {
  const catalog = await Catalogs.create(
    {
      userId,
      catalogName,
    },
    {
      returning: true,
    }
  );

  if (!catalog) {
    throw new ServerError('cannot create new Catalog');
  }

  return catalog;
};

module.exports.updateCatalog = async (catalogId, userId, catalogName) => {
  const [updatedCount, [updatedConversation]] = await Catalogs.update(
    {
      catalogName,
    },
    {
      where: {
        id: catalogId,
        userId: userId,
      },
      returning: true,
    }
  );

  if (!updatedCount) {
    throw new ServerError('cannot update catalog');
  }

  return updatedConversation;
};
module.exports.findCatalog = async (catalogId, userId) => {
  const catalog = await Catalogs.findByPk(catalogId);

  if (!catalog) {
    throw new NotFound('catalog with this data didn`t exist');
  }

  if (catalog.userId !== userId) {
    throw new Error('unauthorized');
  }

  return catalog;
};
module.exports.removeCatalogs = async (id, userId) => {
  const chat = await Catalogs.destroy({
    where: {
      id,
      userId,
    },
  });

  if (!chat) {
    throw new ServerError('not removed. chat with this data didn`t exist');
  }

  return chat;
};
module.exports.findCatalogs = async userId => {
  const catalog = await Catalogs.findAll({
    where: {
      userId,
    },
    include: [
      {
        model: Chats,
        as: 'Chats',
        where: {
          catalogId: { [Op.col]: 'Catalogs.id' },
        },
        attributes: ['conversationId'],
        required: false,
      },
    ],
    attributes: ['id', 'catalogName'],
  });

  if (catalog.lenght) {
    throw new NotFound('catalogs with this data didn`t exist');
  }

  return catalog;
};
