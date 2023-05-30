const { Router } = require('express');
const { queryParser } = require('express-query-parser');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const upload = require('../utils/fileUpload');
const validators = require('../middlewares/validators');
const userController = require('../controllers/userController');
const contestController = require('../controllers/contestController');

const contestsRouter = Router();

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

contestsRouter.post('/data', contestController.dataForContest);

contestsRouter.get('/file/:fileName', contestController.downloadFile);

module.exports = contestsRouter;
