module.exports = (sequelize, DataTypes) => {
  const Attitude = sequelize.define(
    'Attitudes',
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
      isBlock: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      isFavorite: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  Attitude.associate = function (models) {
    Attitude.belongsTo(models.Users, { foreignKey: 'userId' });
  };

  return Attitude;
};
