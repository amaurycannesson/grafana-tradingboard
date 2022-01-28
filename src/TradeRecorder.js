const Sequelize = require("sequelize");
const logger = require("./logger");

class TradeRecorder {
  constructor(binanceClient, tradesModel, symbols = ["BNBUSDT"]) {
    this.binanceClient = binanceClient;
    this.tradesModel = tradesModel;
    this.symbols = symbols;
    this.subscription = null;
  }

  start() {
    const streamNames = this.symbols.map(
      (symbol) => `${symbol.toLowerCase()}@trade`
    );
    this.subscription = this.binanceClient.combinedStreams(streamNames, {
      open: () => logger.info("Trade stream opened"),
      close: () => logger.info("Trade stream closed"),
      message: (msg) => this._record(JSON.parse(msg).data),
    });
  }

  async _record(tradeData) {
    const trade = this.tradesModel.build({
      time: tradeData.T * 1000, // to ns
      symbol: tradeData.s,
      price: parseFloat(tradeData.p),
      quantity: parseFloat(tradeData.q),
      isBuy: !tradeData.m,
    });

    await this._save(trade);
  }

  async _save(trade) {
    try {
      await trade.save();
      logger.info(`[${trade.symbol}] Trade price: ${trade.price}`);
    } catch (err) {
      if (err instanceof Sequelize.UniqueConstraintError) {
        this._incrementAndSave(trade);
      } else {
        logger.error(err);
      }
    }
  }

  async _incrementAndSave(trade) {
    const _trade = this.tradesModel.build({
      ...trade.get(),
      time: trade.time + 1,
    });

    await this._save(_trade);
  }

  stop() {
    this.binanceClient.unsubscribe(this.subscription);
  }
}

module.exports = TradeRecorder;
