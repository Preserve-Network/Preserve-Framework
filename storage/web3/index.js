import "dotenv/config";
import { Web3Storage, File, getFilesFromPath } from "web3.storage";

const WEB3_STORAGE_KEY = process.env.WEB3_STORAGE_KEY;
const client = new Web3Storage({ token: WEB3_STORAGE_KEY });

export class Web3StorageHelper {
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
