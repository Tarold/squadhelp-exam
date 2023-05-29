const express = require('express');
const userController = require('../controllers/userController');
const checkToken = require('../middlewares/checkToken');
const contestsRouter = require('./contestRouter');
const chatRouter = require('./chatRouter');
const userRouter = require('./userRouter');
const router = express.Router();

router.use('/user', userRouter);

router.use(checkToken.checkToken);

router.use('/contests', contestsRouter);

router.use('/chat', chatRouter);

module.exports = router;
