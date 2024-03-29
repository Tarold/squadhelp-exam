const bcrypt = require('bcrypt');
const {
  CUSTOMER,
  CREATOR,
  MODERATOR,
  SALT_ROUNDS,
  ADMIN,
} = require('../constants');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          firstName: 'buyerfn',
          lastName: 'buyerln',
          displayName: 'buyerdn',
          password: bcrypt.hashSync('123456', SALT_ROUNDS),
          email: 'buyer@gmail.com',
          role: CUSTOMER,
        },
        {
          firstName: 'creativefn',
          lastName: 'creativeln',
          displayName: 'creativedn',
          password: bcrypt.hashSync('123456', SALT_ROUNDS),
          email: 'creative@gmail.com',
          role: CREATOR,
        },
        {
          firstName: 'moderatorfn',
          lastName: 'moderatorln',
          displayName: 'moderator',
          password: bcrypt.hashSync('123456', SALT_ROUNDS),
          email: 'moderator@gmail.com',
          role: MODERATOR,
        },
        {
          firstName: 'admin',
          lastName: 'admin',
          displayName: 'admin',
          password: bcrypt.hashSync('123456', SALT_ROUNDS),
          email: 'admin@gmail.com',
          role: ADMIN,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
