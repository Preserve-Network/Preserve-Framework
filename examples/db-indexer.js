// Purpose
// Scan through blockchain data and generate local index files so the data is easier to browse
// This will create a site-db.json file which lists all the various sites and their size.
// Each site gets it's own  json file with a list of it's files, created, and cid

// This is used as an example on how to build indexes based off blockchain indexes.
// It's a starting point for you to create your own

const axios = require("axios");
const fs = require("fs").promises;

const Preserve = require("../index.js");
const { File } = require("web3.storage");

const ipfsgateway = "ipfs.infura-ipfs.io";

const cidToUrl = async (cid, filename = "metadata.json") => {
  const url = `https://${cid}.${ipfsgateway}/${filename}`;
  const response = await axios.get(url);
  return response.data;
};

/**
 * We want just the TLD, no protocol, www subdomain, filename, etc.
 * TODO: This isn't great but it works for my situation
 * */
const normazlieFilename = (filename) => {
  var normFilename = filename
    .replace(".jpg", "")
    .replace(".png", "")
    .toLowerCase();
  normFilename = normFilename.replace("http://", "").replace("https://");
  normFilename = normFilename.replace("www.", "");
  return normFilename;
};

(async () => {
  const preserve = new Preserve(
    (network = "mainnet"),
    (contractAddress = "0x7db36be76c97fdb9d15fdfd7331ef29ed8bcb742"),
    (gateway = "alchemy")
  );

  var indexNum = await preserve.getIndexLength();
  console.log(`Size: ${indexNum}`);

  const siteIndexData = {};

  while (indexNum-- > 0) {
    const cid = await preserve.getValueAtIndex(indexNum);
    const metadata = await cidToUrl(cid);

    const created = metadata.created;
    const filenames = metadata.filenames;

    for (const idx in filenames) {
      const filename = filenames[idx];
      const normFilename = normazlieFilename(filename);

      if (!(normFilename in siteIndexData)) {
        siteIndexData[normFilename] = {
          files: [],
        };
      }

      siteIndexData[normFilename].files.push({
        cid,
        filename,
        created,
      });
    }
  }

  const siteList = [];
  for (const [name, data] of Object.entries(siteIndexData)) {
    siteList.push({
      name,
      size: data.files.length,
    });
    await fs.writeFile(`./data/${name}-db.json`, JSON.stringify(data));
  }

  await fs.writeFile("./data/site-db.json", JSON.stringify(siteList));
})().catch((e) => {
  console.log(e);
});
