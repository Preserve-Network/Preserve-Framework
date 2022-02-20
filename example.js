// Store File
const Preserve = require("./preserve.js");

(async () => {
  const preserve = new Preserve();
  // preserve.getNum();
  const hash = await preserve.preserve("name1", "desc", "testdata/i-icon.png");
  console.log(hash);
  console.log(await preserve.getLastValue());
})().catch((e) => {
  console.log(e);
});
