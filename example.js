// Store File
const Preserve = require("./preserve.js");

(async () => {
  const preserve = new Preserve();
  // preserve.getNum();
  const hash = await preserve.preserveFile(
    "single file test",
    "desc",
    "testdata/test1.txt"
  );
  console.log(hash);
  console.log(await preserve.getLastValue());
})().catch((e) => {
  console.log(e);
});
