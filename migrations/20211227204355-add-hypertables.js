"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "SELECT create_hypertable('trades', 'time', chunk_time_interval => 60000000);"
    );
    await queryInterface.sequelize.query(
      "SELECT create_hypertable('limit_orders', 'time', chunk_time_interval => 60000000);"
    );
  },

  down: async (queryInterface, Sequelize) => {},
};
