const Sequelize = require("sequelize");
const DepthCache = require("./DepthCache");
const logger = require("./logger");

class LimitOrderRecorder {
  constructor(binanceClient, depthModel, symbols = ["BNBUSDT"]) {
    this.binanceClient = binanceClient;
    this.depthModel = depthModel;
    this.symbols = symbols;
    this.depthCaches = Object.fromEntries(
      new Map(
        symbols.map((symbol) => [symbol, new DepthCache(binanceClient, symbol)])
      )
    );
    this.subscription = null;
    this.depthBuffer = [];
    this.isDepthSnapshotDone = false;
  }

  start() {
    const streamNames = this.symbols.map(
      (symbol) => `${symbol.toLowerCase()}@depth@1000ms`
    );
    this.subscription = this.binanceClient.combinedStreams(streamNames, {
      open: () => {
        logger.info("Depth stream opened");
        Promise.all(
          Object.values(this.depthCaches).map((depthCache) =>
            depthCache.initFromRest()
          )
        ).then(() => {
          this.isDepthSnapshotDone = true;
          this.depthBuffer.map((depth) =>
            this.depthCaches[depth.s].update(depth)
          );
        });
      },
      close: () => logger.info("Depth stream closed"),
      message: (msg) => {
        const depth = JSON.parse(msg).data;

        if (this.isDepthSnapshotDone) {
          this.depthCaches[depth.s].update(depth);
          this._record(this.depthCaches[depth.s]);
        } else {
          this.depthBuffer.push(depth);
        }
      },
    });
  }

  async _record(depthCache) {
    try {
      await this.depthModel.bulkCreate(depthCache.getOrders());
    } catch (error) {
      logger.error(error);
    }
  }

  stop() {
    this.binanceClient.unsubscribe(this.subscription);
  }
}

module.exports = LimitOrderRecorder;
