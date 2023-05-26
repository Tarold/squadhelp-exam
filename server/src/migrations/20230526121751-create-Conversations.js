module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Conversations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      interlocutor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      recipient: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      blackListInterlocutor: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      blackListRecipient: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      favoriteListInterlocutor: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      favoriteListRecipient: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Conversations');
  },
};
