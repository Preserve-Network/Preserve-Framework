require("dotenv").config();

const { Web3Storage, File, getFilesFromPath } = require("web3.storage");

const WEB3_STORAGE_KEY = process.env.WEB3_STORAGE_KEY;
const client = new Web3Storage({ token: WEB3_STORAGE_KEY });

class Web3StorageHelper {
  constructor() {}

  async storeFiles(filePath) {
    const files = await getFilesFromPath(filePath);
    const cid = await client.put(files);
    return cid;
  }

  async storeContent(name, content) {
    const buffer = Buffer.from(content);
    const file = [new File([buffer], name)];
    const cid = await client.put(file);
    return cid;
  }
}

module.exports = Web3StorageHelper;
