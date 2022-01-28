const logger = require("./logger");

class DepthCache {
  constructor(client, symbol) {
    this.client = client;
    this.symbol = symbol;
    this.timestamp = null;
    this.lastUpdateId = null;
    this.asks = {};
    this.bids = {};
    this.isUpdating = false;
  }

  async initFromRest() {
    this.isUpdating = true;
    const { data } = await this.client.depth(this.symbol);

    data.asks.map(([price, qty]) => this.addAsk(price, qty));
    data.bids.map(([price, qty]) => this.addBid(price, qty));

    this.timestamp = Date.now() * 1000;
    this.lastUpdateId = data.lastUpdateId;
    this.isUpdating = false;
  }

  async update(msg) {
    if (msg.u <= this.lastUpdateId) {
      logger.debug("Outdated update");
      return;
    } else if (msg.U != this.lastUpdateId + 1 && !this.isUpdating) {
      logger.debug("Missing updates");
      await this.initFromRest();
    }

    msg.a.map(([price, qty]) => this.addAsk(price, qty));
    msg.b.map(([price, qty]) => this.addBid(price, qty));

    this.timestamp = msg.E * 1000;
    this.lastUpdateId = msg.u;
  }

  addBid(price, qty) {
    qty = parseFloat(qty);
    this.bids[price] = qty;

    if (price === 0) {
      delete this.bids[price];
    }
  }

  addAsk(price, qty) {
    qty = parseFloat(qty);
    this.asks[price] = qty;

    if (price === 0) {
      delete this.asks[price];
    }
  }

  getOrders() {
    const bids = Object.entries(this.bids)
      .sort((a, b) => b[0] - a[0])
      .map(([price, quantity], level) => ({
        price,
        quantity,
        symbol: this.symbol,
        updateId: this.lastUpdateId,
        time: this.timestamp,
        isBid: true,
        level,
      }));
    const asks = Object.entries(this.asks)
      .sort((a, b) => a[0] - b[0])
      .map(([price, quantity], level) => ({
        price,
        quantity,
        symbol: this.symbol,
        updateId: this.lastUpdateId,
        time: this.timestamp,
        isBid: false,
        level,
      }));

    logger.info(
      `[${this.symbol}] Ask: ${asks[0].price} / Bid: ${bids[0].price}`
    );

    return [...asks, ...bids];
  }
}

module.exports = DepthCache;
