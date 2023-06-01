const CONSTANTS = require('../constants');
const db = require('../models');
const controller = require('../socketInit');
const userQueries = require('./queries/userQueries');

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
  const {
    limit = 10,
    offset = 0,
    typeIndex,
    contestId,
    industry,
    awardSort,
  } = req.query;
  const predicates = UtilFunctions.createWhereForAllContests(
    typeIndex,
    contestId,
    industry,
    awardSort
  );
  db.Offers.findAll({
    where: {
      approvedStatus: CONSTANTS.OFFER_APPROVED_VERIFYING,
      status: CONSTANTS.OFFER_STATUS_PENDING,
    },
    limit,
    offset,
    include: [
      {
        model: db.Contests,
        where: predicates.where,
        order: predicates.order,
        attributes: ['contestType', 'industry'],
      },
      {
        model: db.Users,
        attributes: [
          'id',
          'firstName',
          'lastName',
          'displayName',
          'email',
          'avatar',
          'rating',
        ],
      },
    ],
  })
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
    const result = await contestQueries.createOffer(obj);
    delete result.contestId;
    delete result.userId;
    controller
      .getNotificationController()
      .emitEntryCreated(req.body.customerId);
    const User = Object.assign({}, req.tokenData, { id: req.tokenData.userId });
    res.status(201).send(Object.assign({}, result, { User }));
  } catch (e) {
    return next(new ServerError());
  }
};

const rejectOffer = async (offerId, creatorId, contestId) => {
  const rejectedOffer = await contestQueries.updateOffer(
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
  const finishedContest = await contestQueries.updateContestStatus(
    {
      status: db.sequelize.literal(`
        CASE
          WHEN "id"=${contestId} AND "orderId"='${orderId}' 
            THEN '${CONSTANTS.CONTEST_STATUS_FINISHED}'
          WHEN "orderId"='${orderId}' AND "priority"=${priority + 1} 
            THEN '${CONSTANTS.CONTEST_STATUS_ACTIVE}'
            ELSE '${CONSTANTS.CONTEST_STATUS_PENDING}' END
    `),
    },
    { orderId },
    transaction
  );
  await userQueries.updateUser(
    { balance: db.sequelize.literal('balance + ' + finishedContest.prize) },
    creatorId,
    transaction
  );
  const updatedOffers = await contestQueries.updateOfferStatus(
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
  updatedOffers.forEach(offer => {
    if (
      offer.status === CONSTANTS.OFFER_STATUS_REJECTED &&
      creatorId !== offer.userId
    ) {
      arrayRoomsId.push(offer.userId);
    }
  });
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
  return updatedOffers[0].dataValues;
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
  const acceptedOffer = await contestQueries.updateOffer(
    { approvedStatus: CONSTANTS.OFFER_APPROVED_ACCEPTED },
    { id: offerId }
  );
  controller
    .getNotificationController()
    .emitChangeOfferStatus(creatorId, 'Someone of yours offers was accepted');
  emailController.sendOfferMessage({
    email,
    offer: acceptedOffer,
  });
  return acceptedOffer;
};

const deniedOffer = async (offerId, creatorId, email) => {
  const deniedOffer = await contestQueries.updateOffer(
    { approvedStatus: CONSTANTS.OFFER_APPROVED_DENIED },
    { id: offerId }
  );
  controller
    .getNotificationController()
    .emitChangeOfferStatus(creatorId, 'Someone of yours offers was denied');
  emailController.sendOfferMessage({
    email,
    offer: deniedOffer,
  });

  return deniedOffer;
};
