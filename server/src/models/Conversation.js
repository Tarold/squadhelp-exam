module.exports = (sequelize, DataTypes) => {
  const Conversations = sequelize.define(
    'Conversations',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      interlocutor: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      recipient: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      blackListInterlocutor: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      blackListRecipient: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      favoriteListInterlocutor: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      favoriteListRecipient: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    },
    {
      timestamps: false,
    }
  );
  Conversations.associate = function (models) {
    Conversations.belongsTo(models.Users, { foreignKey: 'interlocutor' });
    Conversations.belongsTo(models.Users, { foreignKey: 'recipient' });
  };
  return Conversations;
};
