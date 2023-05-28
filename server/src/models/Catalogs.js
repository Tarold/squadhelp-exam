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
    },
    {
      timestamps: false,
    }
  );
  Catalogs.associate = function (models) {
    Catalogs.hasMany(models.Chats, { foreignKey: 'catalogId' });
    Catalogs.belongsTo(models.Users, { foreignKey: 'userId' });
  };

  return Catalogs;
};
