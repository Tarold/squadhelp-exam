const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate (models) {
      Transaction.belongsTo(models.Users, {
        foreignKey: 'userId',
      });
    }
  }
  Transaction.init(
    {
      amount: {
        type: DataTypes.NUMERIC,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      operationType: {
        // ToDo ['EXPENSE', 'INCOME'] to constants
        type: DataTypes.ENUM(['EXPENSE', 'INCOME']),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Transactions',
    }
  );
  return Transaction;
};
