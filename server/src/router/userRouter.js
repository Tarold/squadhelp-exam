const { Router } = require('express');
const upload = require('../utils/fileUpload');
const basicMiddlewares = require('../middlewares/basicMiddlewares');
const userController = require('../controllers/userController');
const userRouter = Router();

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

module.exports = userRouter;
