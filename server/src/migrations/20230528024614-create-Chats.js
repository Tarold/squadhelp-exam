module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('Chats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      catalogId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Catalogs',
          key: 'id',
        },
      },
      conversationId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: 'Conversations',
          key: 'id',
        },
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Chats');
  },
};
