// Store File
const Preserve = require("./preserve.js");

(async () => {
  const preserve = new Preserve();

  const hash = await preserve.preserveFiles({
    name: "single file test",
    description: "desc",
    files: ["testdata/test1.txt", "testdata/test2.txt"],
  });

  console.log(hash);
  console.log(await preserve.getLastValue());
})().catch((e) => {
  console.log(e);
});
