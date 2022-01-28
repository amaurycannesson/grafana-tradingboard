"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Trade extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Trade.init(
    {
      symbol: { type: DataTypes.STRING, primaryKey: true },
      price: DataTypes.FLOAT,
      quantity: DataTypes.FLOAT,
      isBuy: { type: DataTypes.BOOLEAN, field: "is_buy" },
      time: { type: DataTypes.BIGINT, primaryKey: true },
    },
    {
      sequelize,
      timestamps: false,
      tableName: "trades",
    }
  );
  return Trade;
};
