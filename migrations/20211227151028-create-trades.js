"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("trades", {
      symbol: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      price: {
        type: Sequelize.FLOAT,
      },
      quantity: {
        type: Sequelize.FLOAT,
      },
      is_buy: {
        type: Sequelize.BOOLEAN,
      },
      time: {
        type: Sequelize.BIGINT,
        primaryKey: true,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("trades");
  },
};
