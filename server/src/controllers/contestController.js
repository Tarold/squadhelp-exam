const db = require('../models');
const ServerError = require('../errors/ServerError');
const contestQueries = require('./queries/contestQueries');
const userQueries = require('./queries/userQueries');
const controller = require('../socketInit');
const emailController = require('../controllers/emailController');
const UtilFunctions = require('../utils/functions');
const CONSTANTS = require('../constants');

module.exports.dataForContest = async (req, res, next) => {
  const { characteristic1, characteristic2 } = req.query;
  const response = {};
  try {
    const types = [characteristic1, characteristic2, 'industry'].filter(
      Boolean
    );

    const characteristics = await db.Selects.findAll({
      where: {
        type: {
          [db.Sequelize.Op.or]: types,
        },
      },
    });
    if (!characteristics) {
      return next(new ServerError());
    }
    characteristics.forEach(characteristic => {
      if (!response[characteristic.type]) {
        response[characteristic.type] = [];
      }
      response[characteristic.type].push(characteristic.describe);
    });
    res.status(200).send(response);
  } catch (err) {
    next(new ServerError('cannot get contest preferences'));
  }
};

module.exports.getContestById = async (req, res, next) => {
  try {
    let contestInfo = await db.Contests.findOne({
      where: { id: req.params.contestId },
      order: [[db.Offers, 'id', 'asc']],
      include: [
        {
          model: db.Users,
          required: true,
          attributes: {
            exclude: ['password', 'role', 'balance', 'accessToken'],
          },
        },
        {
          model: db.Offers,
          required: false,
          where:
            req.tokenData.role === CONSTANTS.CREATOR
              ? { userId: req.tokenData.userId }
              : { approvedStatus: CONSTANTS.OFFER_APPROVED_ACCEPTED },
          attributes: { exclude: ['userId', 'contestId'] },
          include: [
            {
              model: db.Users,
              required: true,
              attributes: {
                exclude: ['password', 'role', 'balance', 'accessToken'],
              },
            },
            {
              model: db.Ratings,
              required: false,
              where: { userId: req.tokenData.userId },
              attributes: { exclude: ['userId', 'offerId'] },
            },
          ],
        },
      ],
    });
    contestInfo = contestInfo.get({ plain: true });
    contestInfo.Offers.forEach(offer => {
      if (offer.Rating) {
        offer.mark = offer.Rating.mark;
      }
      delete offer.Rating;
    });
    res.status(200).send(contestInfo);
  } catch (e) {
    next(new ServerError());
  }
};

module.exports.downloadFile = async (req, res, next) => {
  const file = CONSTANTS.CONTESTS_DEFAULT_DIR + req.params.fileName;
  res.status(200).download(file);
};

module.exports.updateContest = async (req, res, next) => {
  const { contestId } = req.params;

  if (req.file) {
    req.body.fileName = req.file.filename;
    req.body.originalFileName = req.file.originalname;
  }

  try {
    const updatedContest = await contestQueries.updateContest(req.body, {
      id: contestId,
      userId: req.tokenData.userId,
    });
    res.status(200).send(updatedContest);
  } catch (e) {
    next(e);
  }
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

module.exports.getCustomersContests = (req, res, next) => {
  db.Contests.findAll({
    where: { status: req.query.contestStatus, userId: req.tokenData.userId },
    limit: req.query.limit,
    offset: req.query.offset ? req.query.offset : 0,
    order: [['id', 'DESC']],
    include: [
      {
        model: db.Offers,
        required: false,
        attributes: ['id'],
      },
    ],
  })
    .then(contests => {
      contests.forEach(
        contest => (contest.dataValues.count = contest.dataValues.Offers.length)
      );
      let haveMore = true;
      if (contests.length === 0) {
        haveMore = false;
      }
      res.status(200).send({ contests, haveMore });
    })
    .catch(err => next(new ServerError(err)));
};

module.exports.getContests = (req, res, next) => {
  const {
    limit = 10,
    offset = 0,
    typeIndex,
    contestId,
    industry,
    awardSort,
    ownEntries,
  } = req.query;
  const { userId } = req.tokenData;
  const predicates = UtilFunctions.createWhereForAllContests(
    typeIndex,
    contestId,
    industry,
    awardSort
  );
  db.Contests.findAll({
    where: predicates.where,
    order: predicates.order,
    limit,
    offset,
    include: [
      {
        model: db.Offers,
        required: ownEntries,
        where: ownEntries ? { userId } : {},
        attributes: ['id'],
      },
    ],
  })
    .then(contests => {
      contests.forEach(
        contest => (contest.dataValues.count = contest.dataValues.Offers.length)
      );
      let haveMore = true;
      if (contests.length === 0) {
        haveMore = false;
      }
      res.status(200).send({ contests, haveMore });
    })
    .catch(err => {
      next(new ServerError());
    });
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
