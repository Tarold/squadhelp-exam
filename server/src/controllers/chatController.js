const controller = require('../socketInit');
const _ = require('lodash');
const conversationQueries = require('./queries/conversationQueries');
const messageQueries = require('./queries/messageQueries');
const userQueries = require('./queries/userQueries');
const catalogQueries = require('./queries/catalogQueries');
const chatQueries = require('./queries/chatQueries');

module.exports.addMessage = async (req, res, next) => {
  const { userId, firstName, lastName, displayName, avatar, email } =
    req.tokenData;
  const { recipient, messageBody, interlocutor } = req.body;
  const participants = [userId, recipient];

  participants.sort(
    (participant1, participant2) => participant1 - participant2
  );
  try {
    const newConversation =
      await conversationQueries.createOrUpdateConversation(participants);

    const message = await messageQueries.createMessage(
      userId,
      messageBody,
      newConversation.id
    );

    const interlocutorId = participants.find(
      participant => participant !== userId
    );

    const preview = {
      id: newConversation.id,
      sender: userId,
      text: messageBody,
      createAt: message.createdAt,
      participants,
      blockList: [newConversation.isBlock1, newConversation.isBlock2],
      favoriteList: [newConversation.isFavorite1, newConversation.isFavorite2],
    };

    controller.getChatController().emitNewMessage(interlocutorId, {
      message,
      preview: {
        preview,
        interlocutor: {
          id: userId,
          firstName: firstName,
          lastName: lastName,
          displayName: displayName,
          avatar: avatar,
          email: email,
        },
      },
    });

    res.status(201).send({
      message,
      preview: Object.assign(preview, { interlocutor }),
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getChat = async (req, res, next) => {
  const { userId } = req.tokenData;
  const { interlocutorId } = req.params;

  const participants = [userId, interlocutorId];
  participants.sort(
    (participant1, participant2) => participant1 - participant2
  );
  try {
    const messages = await messageQueries.findMessages(participants);

    const interlocutor = await userQueries.findUserByPk(interlocutorId);

    res.status(200).send({
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
    const { userId } = req.tokenData;
    const conversations = await conversationQueries.findConversations(userId);

    const preview = conversations.map(conversation => ({
      id: conversation.id,
      sender: conversation.Messages[0].sender,
      text: conversation.Messages[0].body,
      createAt: conversation.Messages[0].createdAt,
      participants: [conversation.participant1, conversation.participant2],
      blockList: [conversation.isBlock1, conversation.isBlock2],
      favoriteList: [conversation.isFavorite1, conversation.isFavorite2],
    }));

    const interlocutors = [];
    preview.map(conversation => {
      const interlocutor = conversation.participants.find(
        participant => participant !== userId
      );
      interlocutors.push(interlocutor);
      return (conversation.interlocutor = interlocutor);
    });

    const senders = await userQueries.findUsers(interlocutors);

    preview.forEach(conversation => {
      senders.forEach(sender => {
        if (conversation.participants.includes(sender.id)) {
          conversation.interlocutor = {
            id: sender.id,
            firstName: sender.firstName,
            lastName: sender.lastName,
            displayName: sender.displayName,
            avatar: sender.avatar,
          };
        }
      });
    });

    res.status(200).send(preview);
  } catch (err) {
    next(err);
  }
};

module.exports.blockList = async (req, res, next) => {
  const { userId } = req.tokenData;
  const { participants, blackListFlag } = req.body;

  const predicate = 'isBlock' + (participants.indexOf(userId) + 1);
  try {
    const chat = await conversationQueries.updateConcersation(
      predicate,
      blackListFlag,
      participants
    );

    const responseData = {
      participants: participants,
      blockList: [chat.isBlock1, chat.isBlock2],
      favoriteList: [chat.isFavorite1, chat.isFavorite2],
    };

    res.status(200).send(responseData);

    const interlocutorId = participants.filter(
      participant => participant !== userId
    )[0];

    controller
      .getChatController()
      .emitChangeBlockStatus(interlocutorId, responseData);
  } catch (err) {
    res.send(err);
  }
};

module.exports.favoriteChat = async (req, res, next) => {
  const { userId } = req.tokenData;
  const { participants, favoriteFlag } = req.body;

  const predicate = 'isFavorite' + (participants.indexOf(userId) + 1);
  try {
    const chat = await conversationQueries.updateConcersation(
      predicate,
      favoriteFlag,
      participants
    );

    const responseData = {
      participants: participants,
      blockList: [chat.isBlock1, chat.isBlock2],
      favoriteList: [chat.isFavorite1, chat.isFavorite2],
    };

    res.status(200).send(responseData);
  } catch (err) {
    res.send(err);
  }
};

module.exports.createCatalog = async (req, res, next) => {
  const { userId } = req.tokenData;
  const { catalogName, chatId } = req.body;

  try {
    const catalog = await catalogQueries.createCatalog(userId, catalogName);

    const chat = await chatQueries.createChat(catalog.id, chatId);

    catalog.dataValues.chats = [chat];

    res.status(201).send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.updateNameCatalog = async (req, res, next) => {
  const { userId } = req.tokenData;
  const { catalogId } = req.params;
  const { catalogName } = req.body;

  try {
    const catalog = await catalogQueries.updateCatalog(
      catalogId,
      userId,
      catalogName
    );
    const chats = await chatQueries.findChats(catalog.id);

    catalog.dataValues.chats = chats;

    res.status(200).send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.addNewChatToCatalog = async (req, res, next) => {
  const { userId } = req.tokenData;
  const { catalogId, chatId } = req.params;

  try {
    const catalog = await catalogQueries.findCatalog(catalogId, userId);

    const chats = await chatQueries.findChats(catalogId, chatId);

    const isExist = chats.some(chat => chat.conversationId === Number(chatId));
    if (!isExist) {
      chats.push(await chatQueries.createChat(catalogId, chatId));
    }
    catalog.dataValues.chats = chats;

    res.status(201).send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.removeChatFromCatalog = async (req, res, next) => {
  const { userId } = req.tokenData;
  const { catalogId, chatId } = req.params;

  try {
    const catalog = await catalogQueries.findCatalog(catalogId, userId);

    await chatQueries.removeChats(catalogId, chatId);

    const chats = await chatQueries.findChats(catalogId);

    catalog.dataValues.chats = chats;
    res.status(200).send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCatalog = async (req, res, next) => {
  const { catalogId } = req.params;
  const { userId } = req.tokenData;

  try {
    await chatQueries.removeChats(catalogId);

    await catalogQueries.removeCatalogs(catalogId, userId);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports.getCatalogs = async (req, res, next) => {
  const { userId } = req.tokenData;

  try {
    const catalogs = await catalogQueries.findCatalogs(userId);

    const keyMapping = {
      Chats: 'chats',
    };

    const prepCatalog = catalogs.map(catalog => {
      catalog.dataValues = _.mapKeys(
        catalog.dataValues,
        (value, key) => keyMapping[key] || key
      );
      return catalog;
    });

    res.status(200).send(prepCatalog);
  } catch (err) {
    next(err);
  }
};
