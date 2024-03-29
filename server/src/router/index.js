const express = require('express');
const contestsRouter = require('./contestRouter');
const chatRouter = require('./chatRouter');
const userRouter = require('./userRouter');
const offersRouter = require('./offerRouter');
const router = express.Router();

router.use('/user', userRouter);

router.use('/offers', offersRouter);

router.use('/contests', contestsRouter);

router.use('/chat', chatRouter);

module.exports = router;
