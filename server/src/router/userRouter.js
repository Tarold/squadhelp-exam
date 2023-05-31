const { Router } = require('express');
const upload = require('../utils/fileUpload');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const userController = require('../controllers/userController');
const userRouter = Router();
const validators = require('../middlewares/validators');
const hashPass = require('../middlewares/hashPassMiddle');
const checkToken = require('../middlewares/checkToken');

userRouter.post(
  '/registration',
  validators.validateRegistrationData,
  hashPass,
  userController.registration
);

userRouter.post('/login', validators.validateLogin, userController.login);

userRouter.post(
  '/create',
  validators.validateRegistrationData,
  hashPass,
  userController.create
);

userRouter.use(checkToken.checkToken);

userRouter.post(
  '/cashout',
  basicMiddlewares.onlyForCreative,
  userController.cashout
);

userRouter.patch(
  '/changeMark',
  basicMiddlewares.onlyForCustomer,
  userController.changeMark
);

userRouter.patch('/', upload.uploadAvatar, userController.updateUser);

userRouter.get('/', checkToken.checkAuth);

module.exports = userRouter;
