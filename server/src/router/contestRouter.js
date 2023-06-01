const { Router } = require('express');
const { queryParser } = require('express-query-parser');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const upload = require('../utils/fileUpload');
const validators = require('../middlewares/validators');
const userController = require('../controllers/userController');
const contestController = require('../controllers/contestController');
const checkToken = require('../middlewares/checkToken');

const contestsRouter = Router();

contestsRouter.use(checkToken.checkToken);

contestsRouter.get(
  '/data',
  queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true,
  }),
  contestController.dataForContest
);

contestsRouter.get('/file/:fileName', contestController.downloadFile);

contestsRouter.use(basicMiddlewares.onlyForCustomerOrCreator);

contestsRouter.get(
  '/byCustomer',
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
  .get(basicMiddlewares.canGetContest, contestController.getContestById)
  .patch(upload.updateContestFile, contestController.updateContest);

contestsRouter
  .route('/')
  .post(
    basicMiddlewares.onlyForCustomer,
    upload.uploadContestFiles,
    basicMiddlewares.parseBody,
    validators.validateContestCreation,
    userController.payment
  )
  .get(
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
