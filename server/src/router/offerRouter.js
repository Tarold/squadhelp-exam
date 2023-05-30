const { Router } = require('express');
const { queryParser } = require('express-query-parser');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const upload = require('../utils/fileUpload');
const contestController = require('../controllers/contestController');

const offersRouter = Router();

offersRouter
  .route('/approve')
  .patch(basicMiddlewares.onlyForModerator, contestController.setOfferApprove);

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
    contestController.getOffers
  )
  .post(
    upload.uploadLogoFiles,
    basicMiddlewares.canSendOffer,
    contestController.setNewOffer
  )
  .patch(
    basicMiddlewares.onlyForCustomerWhoCreateContest,
    contestController.setOfferStatus
  );

module.exports = offersRouter;
