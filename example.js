// Store File
import { Web3StorageHelper } from "./storage/web3/index.js";

function generatePreserveMetadata() {
  return JSON.stringify({
    name: "This is content",
    description: "",
    cid: "",
  });
}

const storage = new Web3StorageHelper();

(async () => {
  // const fileCID = await storage.storeFiles("testdata/metadata.json");
  const metadataString = generatePreserveMetadata("", "", "fileCID");
  console.log("metadataString", metadataString);
  const metaCID = await storage.storeContent("test-file.json", metadataString);
  console.log(metaCID);
})().catch((e) => {
  console.log(e);
});
