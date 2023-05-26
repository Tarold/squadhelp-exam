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
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      opponentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      blackList: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      favoriteList: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: 'CURRENT_TIMESTAMP',
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: 'CURRENT_TIMESTAMP',
      },
    },
    {
      timestamps: false,
    }
  );
  Conversations.associate = function (models) {
    Conversations.belongsTo(models.Users, { foreignKey: 'userId' });
    Conversations.belongsTo(models.Users, { foreignKey: 'opponentId' });
  };
  return Conversations;
};
