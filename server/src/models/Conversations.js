module.exports = (sequelize, DataTypes) => {
  const Conversations = sequelize.define('Conversations', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    participant1: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    participant2: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isBlock1: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isBlock2: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isFavorite1: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isFavorite2: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
  });
  Conversations.associate = function (models) {
    Conversations.hasMany(models.Messages, { foreignKey: 'conversationId' });
    Conversations.hasMany(models.Chats, { foreignKey: 'conversationId' });
    Conversations.belongsTo(models.Users, { foreignKey: 'participant1' });
    Conversations.belongsTo(models.Users, { foreignKey: 'participant2' });
  };
  return Conversations;
};
