// Store File
const Preserve = require("./index.js");

(async () => {
  const preserve = new Preserve();

  const hash = await preserve.preserveFiles({
    name: "single file test",
    description: "desc",
    files: ["testdata/test1.txt", "testdata/test2.txt"],
    attributes: {
      hello: "world",
    },
  });

  console.log(hash);
  console.log(await preserve.getLastValue());
})().catch((e) => {
  console.log(e);
});
