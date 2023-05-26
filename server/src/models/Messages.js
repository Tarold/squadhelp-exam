module.exports = (sequelize, DataTypes) => {
  const Messages = sequelize.define(
    'Messages',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
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
  Messages.associate = function (models) {
    Messages.belongsTo(models.Conversations, { foreignKey: 'conversationId' });
  };

  return Messages;
};
