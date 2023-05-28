const db = require('../models');
const {
  Conversations,
  Messages,
  Users,
  Chats,
  Catalogs,
  Sequelize,
} = require('../models');
const userQueries = require('./queries/userQueries');
const controller = require('../socketInit');
const _ = require('lodash');

module.exports.addMessage = async (req, res, next) => {
  const participants = [req.tokenData.userId, req.body.recipient];
  participants.sort(
    (participant1, participant2) => participant1 - participant2
  );
  try {
    const [newConversation, created] = await Conversations.findOrCreate({
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

    const message = await Messages.create({
      sender: req.tokenData.userId,
      body: req.body.messageBody,
      conversationId: newConversation.id,
    });
    const interlocutorId = participants.find(
      participant => participant !== req.tokenData.userId
    );

    const preview = {
      id: newConversation.id,
      sender: req.tokenData.userId,
      text: req.body.messageBody,
      createAt: message.createdAt,
      participants,
      blackList: [newConversation.isBlock1, newConversation.isBlock2],
      favoriteList: [newConversation.isFavorite1, newConversation.isFavorite2],
    };
    controller.getChatController().emitNewMessage(interlocutorId, {
      message,
      preview: {
        preview,
        interlocutor: {
          id: req.tokenData.userId,
          firstName: req.tokenData.firstName,
          lastName: req.tokenData.lastName,
          displayName: req.tokenData.displayName,
          avatar: req.tokenData.avatar,
          email: req.tokenData.email,
        },
      },
    });
    res.send({
      message,
      preview: Object.assign(preview, { interlocutor: req.body.interlocutor }),
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.getChat = async (req, res, next) => {
  const participants = [req.tokenData.userId, req.body.interlocutorId];
  participants.sort(
    (participant1, participant2) => participant1 - participant2
  );
  try {
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
      attributes: [
        'id',
        'sender',
        'body',
        'conversationId',
        'createdAt',
        'updatedAt',
      ],
    });
    const interlocutor = await Users.findByPk(req.body.interlocutorId);

    res.send({
      messages,
      interlocutor: {
        firstName: interlocutor.firstName,
        lastName: interlocutor.lastName,
        displayName: interlocutor.displayName,
        id: interlocutor.id,
        avatar: interlocutor.avatar,
      },
    });
  } catch (err) {
    console.log('err :>> ', err);
    next(err);
  }
};

module.exports.getPreview = async (req, res, next) => {
  try {
    const conversations = await Conversations.findAll({
      where: {
        [Sequelize.Op.or]: [
          { participant1: req.tokenData.userId },
          { participant2: req.tokenData.userId },
        ],
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
      ],
    });
    const preview = conversations.map(conversation => ({
      id: conversation.id,
      sender: conversation.Messages[0].sender,
      text: conversation.Messages[0].body,
      createAt: conversation.Messages[0].createdAt,
      participants: [conversation.participant1, conversation.participant2],
      blackList: [conversation.isBlock1, conversation.isBlock2],
      favoriteList: [conversation.isFavorite1, conversation.isFavorite2],
    }));

    const interlocutors = [];
    preview.map(conversation => {
      const interlocutor = conversation.participants.find(
        participant => participant !== req.tokenData.userId
      );
      interlocutors.push(interlocutor);
      return (conversation.interlocutor = interlocutor);
    });
    const senders = await Users.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: interlocutors,
        },
      },
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
    });

    preview.forEach(conversation => {
      senders.forEach(sender => {
        if (conversation.participants.includes(sender.dataValues.id)) {
          conversation.interlocutor = {
            id: sender.dataValues.id,
            firstName: sender.dataValues.firstName,
            lastName: sender.dataValues.lastName,
            displayName: sender.dataValues.displayName,
            avatar: sender.dataValues.avatar,
          };
        }
      });
    });
    res.send(preview);
  } catch (err) {
    console.log('err :>> ', err);
    next(err);
  }
};

module.exports.blackList = async (req, res, next) => {
  const predicate =
    'isBlock' + req.body.participants.indexOf(req.tokenData.userId);
  try {
    const chat = await Conversations.update(
      { [predicate]: req.body.blackListFlag },
      {
        where: {
          [Sequelize.Op.and]: [
            { participant1: req.body.participants[0] },
            { participant2: req.body.participants[1] },
          ],
        },
        returning: true,
      }
    );
    res.send(chat);
    const interlocutorId = req.body.participants.filter(
      participant => participant !== req.tokenData.userId
    )[0];
    controller.getChatController().emitChangeBlockStatus(interlocutorId, chat);
  } catch (err) {
    res.send(err);
  }
};

module.exports.favoriteChat = async (req, res, next) => {
  const predicate =
    'isFavorite' + req.body.participants.indexOf(req.tokenData.userId);
  try {
    const chat = await Conversations.update(
      { [predicate]: req.body.favoriteFlag },
      {
        where: {
          [Sequelize.Op.and]: [
            { participant1: req.body.participants[0] },
            { participant2: req.body.participants[1] },
          ],
        },
        returning: true,
      }
    );
    res.send(chat);
  } catch (err) {
    console.log('err :>> ', err);
    res.send(err);
  }
};

module.exports.createCatalog = async (req, res, next) => {
  try {
    const catalog = await Catalogs.create(
      {
        userId: req.tokenData.userId,
        catalogName: req.body.catalogName,
      },
      {
        returning: true,
      }
    );

    const chat = await Chats.create(
      {
        catalogId: catalog.id,
        conversationId: req.body.chatId,
      },
      {
        attributes: ['conversationId'],
      },
      {
        returning: true,
      }
    );

    catalog.dataValues.Chats = [chat];

    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.updateNameCatalog = async (req, res, next) => {
  try {
    const catalog = await Catalogs.update(
      {
        catalogName: req.body.catalogName,
      },
      {
        where: {
          [Sequelize.Op.and]: [
            { id: req.body.catalogId },
            { userId: req.tokenData.userId },
          ],
        },
        returning: true,
      }
    );
    const chats = await Chats.findAll({
      where: {
        catalogId: catalog[1][0].id,
      },
      attributes: ['conversationId'],
    });

    catalog[1][0].dataValues.Chats = chats;
    res.send(catalog[1][0]);
  } catch (err) {
    next(err);
  }
};

module.exports.addNewChatToCatalog = async (req, res, next) => {
  try {
    const catalog = await Catalogs.findByPk(req.body.catalogId);

    if (catalog.userId !== req.tokenData.userId) {
      throw new Error('Unauthorized');
    }

    const chat = await Chats.create(
      {
        catalogId: req.body.catalogId,
        conversationId: req.body.chatId,
      },
      {
        attributes: ['conversationId'],
      },
      {
        returning: true,
      }
    );

    catalog.dataValues.Chats = [chat];

    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.removeChatFromCatalog = async (req, res, next) => {
  try {
    const catalog = await Catalogs.findByPk(req.body.catalogId);

    if (catalog.userId !== req.tokenData.userId) {
      throw new Error('Unauthorized');
    }

    await Chats.destroy({
      where: {
        catalogId: req.body.catalogId,
        conversationId: req.body.chatId,
      },
    });

    const chats = await Chats.findAll({
      where: {
        catalogId: catalog.id,
      },
      attributes: ['conversationId'],
    });

    catalog.dataValues.Chats = chats;
    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCatalog = async (req, res, next) => {
  try {
    await Chats.destroy({
      where: {
        catalogId: req.body.catalogId,
      },
    });

    await Catalogs.destroy({
      where: {
        id: req.body.catalogId,
        userId: req.tokenData.userId,
      },
    });

    res.end();
  } catch (err) {
    next(err);
  }
};

module.exports.getCatalogs = async (req, res, next) => {
  try {
    const catalogs = await Catalogs.findAll({
      where: {
        userId: req.tokenData.userId,
      },
      include: [
        {
          model: Chats,
          where: {
            catalogId: { [Sequelize.Op.col]: 'Catalogs.id' },
          },
          attributes: ['conversationId'],
          required: false,
        },
      ],
      attributes: ['id', 'catalogName'],
    });

    res.send(catalogs);
  } catch (err) {
    next(err);
  }
};
