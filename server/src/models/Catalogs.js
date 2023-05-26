module.exports = (sequelize, DataTypes) => {
  const Catalogs = sequelize.define(
    'Catalogs',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      catalogName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      conversationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
  Catalogs.associate = function (models) {
    Catalogs.belongsTo(models.Users, { foreignKey: 'userId' });
    Catalogs.belongsTo(models.Conversations, { foreignKey: 'conversationId' });
  };

  return Catalogs;
};
