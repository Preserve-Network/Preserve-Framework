require("dotenv").config();

const { Web3Storage, File, getFilesFromPath } = require("web3.storage");

const WEB3_STORAGE_KEY = process.env.WEB3_STORAGE_KEY;
const client = new Web3Storage({ token: WEB3_STORAGE_KEY });

class Web3StorageHelper {
  constructor() {
    this.uploaded = 0;
    this.totalSize = 0;
  }

  onStoredChunk(size) {
    this.uploaded += size;
    const pct = this.uploaded / this.totalSize;
    console.log(
      `Uploading... ${Math.min(pct * 100, 100).toFixed(2)}% complete`
    );
  }

  async storeFiles(fileList, metadataString) {
    const buffer = Buffer.from(metadataString);
    const metadataFile = [new File([buffer], "metadata.json")];
    const files = await getFilesFromPath(fileList);

    this.totalSize = files.map((f) => f.size).reduce((a, b) => a + b, 0);
    const cid = await client.put(files.concat(metadataFile), {
      onStoredChunk: this.onStoredChunk.bind(this),
    });
    return cid;
  }
}

module.exports = Web3StorageHelper;
