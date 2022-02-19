require("dotenv").config();

const web3 = require("web3");
const Web3StorageHelper = require("./storage/web3/index");

class Preserve {
  constructor() {
    this.storage = new Web3StorageHelper();

    // Hardcoded for polygon test network for now
    this.from_address = process.env.POLYGON_TEST_ADDRESS;
    this.key = process.env.POLYGON_TEST_KEY;
    this.url = `https://polygon-mumbai.g.alchemy.com/v2/${process.env.POLYGON_API_KEY}`;

    this.web3js = new web3(new web3.providers.HttpProvider(this.url));
  }

  generatePreserveMetadata(name, description, cid) {
    return JSON.stringify({
      name,
      description,
      cid,
    });
  }

  async preserve(name, description, filename) {
    // First we upload the actual files
    const fileCID = await this.storage.storeFiles(filename);

    // We use the CID of the uploaded files to upload the metadata file
    const metadataString = this.generatePreserveMetadata(
      name,
      description,
      fileCID
    );

    // Upload the metadata
    const metaCID = await this.storage.storeContent(
      `metadata.json`,
      metadataString
    );

    // Index the metadata file in the blockchain
    const signedTransaction = await this.signTransaction();
    const hash = await this.sendTransaction(signedTransaction);
    return hash;
  }

  async getTransactionCount() {
    return await this.web3js.eth.getTransactionCount(this.from_address);
  }

  async signTransaction() {
    const from = this.from_address;
    const key = this.key;
    const to = process.env.POLYGON_TEST_ADDRESS2;
    const nonce = await this.getTransactionCount();

    const amount = this.web3js.utils.toHex(1e16);
    const txData = {
      from,
      nonce: nonce,
      gasPrice: 2000000000,
      gasLimit: 28000,
      to,
      value: amount,
    };

    const signedTx = await this.web3js.eth.accounts.signTransaction(
      txData,
      key
    );
    return signedTx;
  }

  async sendTransaction(signedTx) {
    const receipt = await this.web3js.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    console.log(`Transaction hash: ${receipt.transactionHash}`);
    return receipt.transactionHash;
  }
}

module.exports = Preserve;
