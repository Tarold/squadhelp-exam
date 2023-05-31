const express = require('express');
const checkToken = require('../middlewares/checkToken');
const contestsRouter = require('./contestRouter');
const chatRouter = require('./chatRouter');
const userRouter = require('./userRouter');
const offersRouter = require('./offerRouter');
const router = express.Router();

router.use('/user', userRouter);

router.use(checkToken.checkToken);

router.use('/offers', offersRouter);

router.use('/contests', contestsRouter);

router.use('/chat', chatRouter);

module.exports = router;
