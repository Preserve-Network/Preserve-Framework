require("dotenv").config();

const Web3 = require("web3");
const Web3StorageHelper = require("./storage/web3/index");
const generatePreserveMetadata = require("./storage/utils");

class Preserve {
  constructor(network = "mumbai", contractAddress = null) {
    this.storage = new Web3StorageHelper();

    if (network === "mainnet") {
      this.from_address = process.env.POLYGON_ADDRESS;
      this.key = process.env.POLYGON_KEY;
      this.url = `https://polygon-mainnet.g.alchemy.com/v2/${process.env.POLYGON_ALCHEMY_API_KEY}`;
      this.contractAddress = contractAddress ?? process.env.POLYGON_CONTRACT;
    } else {
      this.from_address = process.env.POLYGON_TEST_ADDRESS;
      this.key = process.env.POLYGON_TEST_KEY;
      this.url = `https://polygon-mumbai.g.alchemy.com/v2/${process.env.POLYGON_TEST_ALCHEMY_API_KEY}`;
      this.contractAddress =
        contractAddress ?? process.env.POLYGON_TEST_CONTRACT;
    }

    console.log(`Using ${network} network, contract ${this.contractAddress}`);

    this.web3js = new Web3(new Web3.providers.HttpProvider(this.url));
    this.account = this.web3js.eth.accounts.privateKeyToAccount(this.key);

    this.web3js.eth.accounts.wallet.add(this.account);
    this.web3js.eth.defaultAccount = this.account.address;
  }

  /***
   * Preserves a list of files
   */
  async preserveFiles({ name, description, files, attributes }) {
    const metadataString = generatePreserveMetadata(
      name,
      description,
      files,
      attributes
    );

    console.log("Uploading files");
    const fileCID = await this.storage.storeFiles(files, metadataString);
    console.log(`Files uploaded, cid: ${fileCID}`);

    return await this.addValueToIndex(fileCID);
  }

  async getTransactionCount(pending = false) {
    return await this.web3js.eth.getTransactionCount(
      this.from_address,
      pending ? "pending" : "latest"
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
    console.log(`Nonce ${nonce}`);

    const jsonInterface =
      require("./artifacts/contracts/preserve.sol/Preserve.json").abi;
    const contract = new this.web3js.eth.Contract(
      jsonInterface,
      this.contractAddress
    );

    // TODO Figure out failures
    // TODO Figure out gas prices
    const txData = {
      from: this.web3js.eth.defaultAccount,
      to: this.contractAddress,
      nonce: nonce,
      gasPrice: 35000000000,
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
    try {
      const jsonInterface =
        require("./artifacts/contracts/preserve.sol/Preserve.json").abi;
      const contract = new this.web3js.eth.Contract(
        jsonInterface,
        this.contractAddress
      );
      const res = await contract.methods.returnIndexLen().call({
        from: this.web3js.eth.defaultAccount,
        gas: 200000,
        gasPrice: 200000,
      });

      return res;
    } catch (e) {
      console.error("Could not fetch the index length");
      return null;
    }
  }

  async getValueAtIndex(index) {
    try {
      const jsonInterface =
        require("./artifacts/contracts/preserve.sol/Preserve.json").abi;
      const contract = new this.web3js.eth.Contract(
        jsonInterface,
        this.contractAddress
      );
      //TODO fix gas prices, are they needed for calls
      const res = await contract.methods.returnValueAtIndex(index).call({
        from: this.web3js.eth.defaultAccount,
        gas: 200000,
        gasPrice: 200000,
      });
      return res;
    } catch (e) {
      console.error("Could not fetch last value");
      return null;
    }
  }

  async getLastValue() {
    const lastIndex = (await this.getIndexLength()) - 1;
    return this.getValueAtIndex(lastIndex);
  }
}

module.exports = Preserve;
