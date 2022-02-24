require("dotenv").config();

const Web3 = require("web3");

class Gateway {
  constructor({ network, gateway = "alchemy" }) {
    /* 
      Setup what web3 gateway to use 
      If a gateway was passed in, attempt to use that one.
      If not, try to access each and choose one that works.
    */
    this.network = network;
    this.gateway = gateway;
  }

  async getBestGateway() {
    const alchemyUrl = await this.getAlchemyUrl();
    const infuraUrl = await this.getInfuraUrl();

    if (this.gateway === "alchemy" && alchemyUrl) {
      this.url = alchemyUrl;
    } else if (this.gateway === "infura" && infuraUrl) {
      this.url = infuraUrl;
    } else {
      this.url = !!alchemyUrl ? alchemyUrl : infuraUrl ? infuraUrl : null;
    }
    return this.url;
  }

  // Check if we have a valid key.
  // Check if we can hit the api endpoint (it's active)
  async getAlchemyUrl() {
    const apiKey =
      this.network === "mainnet"
        ? process.env.POLYGON_ALCHEMY_API_KEY
        : process.env.POLYGON_TEST_ALCHEMY_API_KEY;

    if (!apiKey) {
      return null;
    }

    const url =
      this.network === "mainnet"
        ? `https://polygon-mainnet.g.alchemy.com/v2/${apiKey}`
        : `https://polygon-mumbai.g.alchemy.com/v2/${apiKey}`;

    const blockNumber = await this.getBlockNumber(url);
    return blockNumber ? url : null;
  }

  async getInfuraUrl() {
    const apiKey = process.env.POLYGON_INFURA_API_KEY;

    if (!apiKey) {
      return null;
    }

    const url =
      this.network === "mainnet"
        ? `https://polygon-mainnet.infura.io/v3/${apiKey}`
        : `https://polygon-mumbai.infura.io/v3/${apiKey}`;

    const blockNumber = await this.getBlockNumber(url);
    return blockNumber ? url : null;
  }

  // Used to check connectivity
  async getBlockNumber(url) {
    const web3 = new Web3(new Web3.providers.HttpProvider(url));
    try {
      return await web3.eth.getBlockNumber();
    } catch (e) {
      return null;
    }
  }
}

module.exports = Gateway;
