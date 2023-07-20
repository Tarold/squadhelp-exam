const db = require('../models');
const controller = require('../socketInit');
const emailController = require('../controllers/emailController');
const contestQueries = require('./queries/contestQueries');
const userQueries = require('./queries/userQueries');
const offerQueries = require('./queries/offerQueries');
const ServerError = require('../errors/ServerError');
const CONSTANTS = require('../constants');

module.exports.setOfferApprove = async (req, res, next) => {
  const { creatorId, email, offerId, command } = req.query;
  let proccesOffer;
  if (command === CONSTANTS.OFFER_APPROVED_DENIED) {
    proccesOffer = deniedOffer;
  } else if (command === CONSTANTS.OFFER_APPROVED_ACCEPTED) {
    proccesOffer = acceptedOffer;
  }
  try {
    const offer = await proccesOffer(offerId, creatorId, email);
    res.status(200).send(offer);
  } catch (err) {
    next(err);
  }
};

module.exports.getOffers = (req, res, next) => {
  offerQueries
    .findOffers(req.query)
    .then(offers => {
      let haveMore = true;
      if (offers.length === 0) {
        haveMore = false;
      }
      res.status(200).send({ offers, haveMore });
    })
    .catch(err => {
      next(new ServerError());
    });
};

module.exports.setNewOffer = async (req, res, next) => {
  const obj = {};
  if (req.body.contestType === CONSTANTS.LOGO_CONTEST) {
    obj.fileName = req.file.filename;
    obj.originalFileName = req.file.originalname;
  } else {
    obj.text = req.body.offerData;
  }
  obj.userId = req.tokenData.userId;
  obj.contestId = req.body.contestId;
  try {
    const result = await offerQueries.createOffer(obj);
    delete result.contestId;
    delete result.userId;
    const User = Object.assign({}, req.tokenData, { id: req.tokenData.userId });
    res.status(201).send(Object.assign({}, result, { User }));
  } catch (e) {
    return next(new ServerError());
  }
};

const rejectOffer = async (offerId, creatorId, contestId) => {
  const rejectedOffer = await offerQueries.updateOffer(
    { status: CONSTANTS.OFFER_STATUS_REJECTED },
    { id: offerId }
  );
  controller
    .getNotificationController()
    .emitChangeOfferStatus(
      creatorId,
      'Someone of yours offers was rejected',
      contestId
    );
  return rejectedOffer;
};

const resolveOffer = async (
  contestId,
  creatorId,
  orderId,
  offerId,
  priority,
  transaction
) => {
  const updatedContests = await contestQueries.updateContestsStatus(
    {
      status: db.sequelize.literal(`
        CASE
          WHEN "orderId"='${orderId}' AND "priority"=${priority + 1} 
            THEN '${CONSTANTS.CONTEST_STATUS_ACTIVE}' 
          WHEN "orderId"='${orderId}' AND "priority"<=${priority} 
            THEN '${CONSTANTS.CONTEST_STATUS_FINISHED}' 
          ELSE '${CONSTANTS.CONTEST_STATUS_PENDING}' END
    `),
    },
    { orderId },
    transaction
  );
  const finishedContestPrize = updatedContests.find(
    contest => contest.id === contestId
  ).prize;
  await userQueries.updateUser(
    { balance: db.sequelize.literal('balance + ' + finishedContestPrize) },
    creatorId,
    transaction
  );
  const updatedOffers = await offerQueries.updateOfferStatus(
    {
      status: db.sequelize.literal(` 
      CASE
        WHEN "id"=${offerId} 
          THEN '${CONSTANTS.OFFER_STATUS_WON}'
          ELSE '${CONSTANTS.OFFER_STATUS_REJECTED}' END
    `),
    },
    {
      contestId,
    },
    transaction
  );
  transaction.commit();

  const arrayRoomsId = [];
  let winOffer;
  updatedOffers.forEach(offer => {
    if (
      offer.status === CONSTANTS.OFFER_STATUS_REJECTED &&
      creatorId !== offer.userId
    ) {
      arrayRoomsId.push(offer.userId);
    } else if (offer.status === CONSTANTS.OFFER_STATUS_WON) {
      winOffer = offer.dataValues;
    }
  });
  if (arrayRoomsId.length)
    controller
      .getNotificationController()
      .emitChangeOfferStatus(
        arrayRoomsId,
        'Someone of yours offers was rejected',
        contestId
      );
  controller
    .getNotificationController()
    .emitChangeOfferStatus(creatorId, 'Someone of your offers WIN', contestId);

  return winOffer;
};

module.exports.setOfferStatus = async (req, res, next) => {
  let transaction;
  if (req.body.command === 'reject') {
    try {
      const offer = await rejectOffer(
        req.body.offerId,
        req.body.creatorId,
        req.body.contestId
      );
      res.status(200).send(offer);
    } catch (err) {
      next(err);
    }
  } else if (req.body.command === 'resolve') {
    try {
      transaction = await db.sequelize.transaction();
      const winningOffer = await resolveOffer(
        req.body.contestId,
        req.body.creatorId,
        req.body.orderId,
        req.body.offerId,
        req.body.priority,
        transaction
      );
      res.status(200).send(winningOffer);
    } catch (err) {
      transaction.rollback();
      next(err);
    }
  }
};

const acceptedOffer = async (offerId, creatorId, email) => {
  const acceptedOffer = await offerQueries.updateOffer(
    { approvedStatus: CONSTANTS.OFFER_APPROVED_ACCEPTED },
    { id: offerId }
  );
  emailController.sendOfferMessage({
    email,
    offer: acceptedOffer,
  });

  const contest = await contestQueries.findContest(acceptedOffer.contestId);
  controller.getNotificationController().emitEntryCreated(contest.userId);

  return acceptedOffer;
};

const deniedOffer = async (offerId, creatorId, email) => {
  const deniedOffer = await offerQueries.updateOffer(
    { approvedStatus: CONSTANTS.OFFER_APPROVED_DENIED },
    { id: offerId }
  );
  emailController.sendOfferMessage({
    email,
    offer: deniedOffer,
  });

  return deniedOffer;
};
