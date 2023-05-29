const { Router } = require('express');
const chatController = require('../controllers/chatController');
const chatRouter = Router();

chatRouter
  .route('/')
  .post(chatController.addMessage)
  .get(chatController.getPreview);

chatRouter
  .route('/catalog')
  .get(chatController.getCatalogs)
  .post(chatController.createCatalog);

chatRouter
  .route('/catalog/:catalogId/:chatId')
  .post(chatController.addNewChatToCatalog)
  .delete(chatController.removeChatFromCatalog);

chatRouter
  .route('/catalog/:catalogId')
  .delete(chatController.deleteCatalog)
  .patch(chatController.updateNameCatalog);

chatRouter.route('/:interlocutorId').get(chatController.getChat);
chatRouter.route('/block').post(chatController.blockList);
chatRouter.route('/fav').post(chatController.favoriteChat);

module.exports = chatRouter;
