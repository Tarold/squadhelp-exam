const express = require('express');
const cors = require('cors');
const router = require('./router');
const handlerError = require('./middlewares/handlerError');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/public/images', express.static('public/images'));
app.use(router);
app.use(handlerError);

module.exports = app;
