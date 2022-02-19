// Store File
import { Preserve } from "./preserve.js";

(async () => {
  const preserve = new Preserve();
  const hash = await preserve.preserve("name1", "desc", "testdata/i-icon.png");
  console.log(hash);
})().catch((e) => {
  console.log(e);
});
