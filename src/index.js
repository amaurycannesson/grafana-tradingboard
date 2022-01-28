const { Spot } = require("@binance/connector");
const open = require("open");
const logger = require("./logger");
const TradeRecorder = require("./TradeRecorder");
const db = require("./models");
const LimitOrderRecorder = require("./LimitOrderRecorder");
const { symbols } = require(__dirname + "/../config/app.json");

const client = new Spot("", "", { logger });
const tradeRecorder = new TradeRecorder(client, db.Trade, symbols);
const limiteOrderRecorder = new LimitOrderRecorder(
  client,
  db.LimitOrder,
  symbols
);

process.on("SIGINT", function () {
  tradeRecorder.stop();
  limiteOrderRecorder.stop();
  process.exit();
});

(async () => {
  try {
    await db.sequelize.authenticate();
    await open("http://localhost:3000");
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }

  tradeRecorder.start();
  // WIP: limiteOrderRecorder.start();
})();
