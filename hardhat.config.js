require("dotenv").config();

require("@nomiclabs/hardhat-waffle");

const POLYGON_TEST_KEY = process.env.POLYGON_TEST_KEY;
const POLYGON_TEST_ALCHEMY_API_KEY = process.env.POLYGON_TEST_ALCHEMY_API_KEY;

const POLYGON_KEY = process.env.POLYGON_KEY;
const POLYGON_ALCHEMY_API_KEY = process.env.POLYGON_ALCHEMY_API_KEY;

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {},
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${POLYGON_TEST_ALCHEMY_API_KEY}`,
      accounts: [POLYGON_TEST_KEY],
    },
    mainnet: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${POLYGON_ALCHEMY_API_KEY}`,
      accounts: [POLYGON_KEY],
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 20000,
  },
};
