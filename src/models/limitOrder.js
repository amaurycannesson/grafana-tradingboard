"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LimitOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LimitOrder.init(
    {
      price: DataTypes.FLOAT,
      quantity: DataTypes.FLOAT,
      symbol: { type: DataTypes.STRING, primaryKey: true },
      updateId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        field: "update_id",
      },
      time: { type: DataTypes.BIGINT, primaryKey: true },
      level: { type: DataTypes.INTEGER, primaryKey: true },
      isBid: { type: DataTypes.BOOLEAN, primaryKey: true, field: "is_bid" },
    },
    {
      sequelize,
      timestamps: false,
      tableName: "limit_orders",
    }
  );
  return LimitOrder;
};
