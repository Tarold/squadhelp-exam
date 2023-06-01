const { Router } = require('express');
const { queryParser } = require('express-query-parser');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const upload = require('../utils/fileUpload');
const offerController = require('../controllers/offerController');
const checkToken = require('../middlewares/checkToken');

const offersRouter = Router();

offersRouter.use(checkToken.checkToken);

offersRouter.route('/approve').patch(
  basicMiddlewares.onlyForModerator,
  queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true,
  }),
  offerController.setOfferApprove
);
offersRouter
  .route('/')
  .get(
    basicMiddlewares.onlyForModerator,
    queryParser({
      parseNull: true,
      parseUndefined: true,
      parseBoolean: true,
      parseNumber: true,
    }),
    offerController.getOffers
  )
  .post(
    upload.uploadLogoFiles,
    basicMiddlewares.canSendOffer,
    offerController.setNewOffer
  )
  .patch(
    basicMiddlewares.onlyForCustomerWhoCreateContest,
    offerController.setOfferStatus
  );

module.exports = offersRouter;
