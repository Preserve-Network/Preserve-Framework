require("dotenv").config();

const { Web3Storage, File, getFilesFromPath } = require("web3.storage");

const WEB3_STORAGE_KEY = process.env.WEB3_STORAGE_KEY;
const client = new Web3Storage({ token: WEB3_STORAGE_KEY });

class Web3StorageHelper {
  constructor() {}

  async storeFiles(fileList, metadataString) {
    const buffer = Buffer.from(metadataString);
    const metadataFile = [new File([buffer], "metadata.json")];
    const files = await getFilesFromPath(fileList);
    const cid = await client.put(files.concat(metadataFile));
    return cid;
  }
}

module.exports = Web3StorageHelper;
