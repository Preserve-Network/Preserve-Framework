import "dotenv/config";
import { Web3Storage, getFilesFromPath } from "web3.storage";

const WEB3_STORAGE_KEY = process.env.WEB3_STORAGE_KEY;
const client = new Web3Storage({ token: WEB3_STORAGE_KEY });

async function storeFiles(filePath) {
  const files = await getFilesFromPath(filePath);
  const cid = await client.put(files);
  return cid;
}

(async () => {
  const cid = await storeFiles("testdata/metadata.json");
})().catch((e) => {
  console.log(e);
});
