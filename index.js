require("dotenv").config();

const Web3 = require("web3");
const Web3StorageHelper = require("./storage/web3/index");
const generatePreserveMetadata = require("./storage/utils");

class Preserve {
  constructor() {
    this.storage = new Web3StorageHelper();

    // Hardcoded for polygon test network for now
    this.from_address = process.env.POLYGON_TEST_ADDRESS;
    this.key = process.env.POLYGON_TEST_KEY;
    this.url = `https://polygon-mumbai.g.alchemy.com/v2/${process.env.POLYGON_API_KEY}`;

    this.web3js = new Web3(new Web3.providers.HttpProvider(this.url));
    this.account = this.web3js.eth.accounts.privateKeyToAccount(this.key);

    this.web3js.eth.accounts.wallet.add(this.account);
    this.web3js.eth.defaultAccount = this.account.address;
  }

  /***
   * Preserves a list of files
   */
  async preserveFiles({ name, description, files }) {
    const metadataString = generatePreserveMetadata(name, description, files);

    const fileCID = await this.storage.storeFiles(files, metadataString);
    return await this.addValueToIndex(fileCID);
  }

  async getTransactionCount() {
    return await this.web3js.eth.getTransactionCount(
      this.from_address,
      "pending"
    );
  }

  async sendTransaction(signedTx) {
    const receipt = await this.web3js.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    return receipt.transactionHash;
  }

  async addValueToIndex(value) {
    const nonce = await this.getTransactionCount();
    const contractAddress = process.env.POLYGON_TEST_CONTRACT;
    const jsonInterface =
      require("./artifacts/contracts/preserve.sol/Preserve.json").abi;
    const contract = new this.web3js.eth.Contract(
      jsonInterface,
      contractAddress
    );

    // TODO Figure out failures
    // TODO Figure out gas prices
    const txData = {
      from: this.web3js.eth.defaultAccount,
      to: contractAddress,
      nonce: nonce,
      gasPrice: 2000000000,
      gasLimit: 500000,
      data: contract.methods.addValueToIndex(value).encodeABI(),
    };

    const signedTx = await this.web3js.eth.accounts.signTransaction(
      txData,
      this.key
    );

    return await this.sendTransaction(signedTx);
  }

  async getIndexLength() {
    const contractAddress = process.env.POLYGON_TEST_CONTRACT;
    const jsonInterface =
      require("./artifacts/contracts/preserve.sol/Preserve.json").abi;
    const contract = new this.web3js.eth.Contract(
      jsonInterface,
      contractAddress
    );
    const res = await contract.methods.returnIndexLen().call({
      from: this.web3js.eth.defaultAccount,
      gas: 200000,
      gasPrice: 200000,
    });
    return res;
  }

  async getLastValue() {
    const lastIndex = (await this.getIndexLength()) - 1;
    const contractAddress = process.env.POLYGON_TEST_CONTRACT;
    const jsonInterface =
      require("./artifacts/contracts/preserve.sol/Preserve.json").abi;
    const contract = new this.web3js.eth.Contract(
      jsonInterface,
      contractAddress
    );
    //TODO fix gas prices, are they needed for calls
    const res = await contract.methods.returnValueAtIndex(lastIndex).call({
      from: this.web3js.eth.defaultAccount,
      gas: 200000,
      gasPrice: 200000,
    });
    return res;
  }
}

module.exports = Preserve;
