"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("limit_orders", {
      price: {
        type: Sequelize.FLOAT,
      },
      quantity: {
        type: Sequelize.FLOAT,
      },
      symbol: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      update_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
      },
      time: {
        type: Sequelize.BIGINT,
        primaryKey: true,
      },
      level: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      is_bid: {
        type: Sequelize.BOOLEAN,
        primaryKey: true,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("limit_orders");
  },
};
