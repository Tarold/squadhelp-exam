const express = require('express');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const hashPass = require('../middlewares/hashPassMiddle');
const userController = require('../controllers/userController');
const contestController = require('../controllers/contestController');
const checkToken = require('../middlewares/checkToken');
const validators = require('../middlewares/validators');
const upload = require('../utils/fileUpload');
const contestsRouter = require('./contestRouter');
const chatRouter = require('./chatRouter');
const userRouter = require('./userRouter');
const router = express.Router();

router.get('/offers', contestController.getAllOffers);

router.post(
  '/registration',
  validators.validateRegistrationData,
  hashPass,
  userController.registration
);

router.post('/login', validators.validateLogin, userController.login);

router.use(checkToken.checkToken);

router.post('/getUser', checkToken.checkAuth);

router.use('/contests', contestsRouter);

router.get('/users/id/transactions', userController.getTransactions);

router.post('/dataForContest', contestController.dataForContest);

router.get('/downloadFile/:fileName', contestController.downloadFile);

router.post(
  '/setNewOffer',
  upload.uploadLogoFiles,
  basicMiddlewares.canSendOffer,
  contestController.setNewOffer
);

router.post(
  '/setOfferStatus',
  basicMiddlewares.onlyForCustomerWhoCreateContest,
  contestController.setOfferStatus
);

router.use('/user', userRouter);

router.use('/chat', chatRouter);

module.exports = router;
