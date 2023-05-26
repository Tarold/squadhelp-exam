const { Router } = require('express');
const { queryParser } = require('express-query-parser');
const checkToken = require('../middlewares/checkToken');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const upload = require('../utils/fileUpload');
const validators = require('../middlewares/validators');
const userController = require('../controllers/userController');
const contestController = require('../controllers/contestController');

const contestsRouter = Router();

contestsRouter.get(
  '/byCustomer',
  checkToken.checkToken,
  queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true,
  }),
  contestController.getCustomersContests
);

contestsRouter
  .route('/:contestId')
  .get(
    checkToken.checkToken,
    basicMiddlewares.canGetContest,
    contestController.getContestById
  )
  .patch(
    // /updateContest
    checkToken.checkToken,
    upload.updateContestFile,
    contestController.updateContest
  );

contestsRouter
  .route('/')
  .post(
    checkToken.checkToken,
    basicMiddlewares.onlyForCustomer,
    upload.uploadContestFiles,
    basicMiddlewares.parseBody,
    validators.validateContestCreation,
    userController.payment
  )
  .get(
    //getAllContests
    checkToken.checkToken,
    basicMiddlewares.onlyForCreative,
    queryParser({
      parseNull: true,
      parseUndefined: true,
      parseBoolean: true,
      parseNumber: true,
    }),
    contestController.getContests
  );

module.exports = contestsRouter;
