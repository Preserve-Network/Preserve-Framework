// Store File
const Preserve = require("../index.js");
const { File } = require("web3.storage");

(async () => {
  const preserve = new Preserve();

  const buffer = Buffer.from("test");
  const testfile = [new File([buffer], "testfile")];

  const hash = await preserve.preserveFiles({
    name: "single file test",
    description: "desc",
    files: [],
    attributes: {
      hello: "world",
    },
  });

  console.log(hash);
  console.log(await preserve.getLastValue());
})().catch((e) => {
  console.log(e);
});
