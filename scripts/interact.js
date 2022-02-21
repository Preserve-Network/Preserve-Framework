const API_KEY = process.env.POLYGON_ALCHEMY_API_KEY;
const PRIVATE_KEY = process.env.POLYGON_KEY;
const CONTRACT_ADDRESS = process.env.POLYGON_CONTRACT;

const contract = require("../artifacts/contracts/preserve.sol/Preserve.json");

// provider - Alchemy
const alchemyProvider = new ethers.providers.AlchemyProvider(
  (network = "matic"),
  API_KEY
);

// signer - you
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

// contract instance
const preserveContract = new ethers.Contract(
  CONTRACT_ADDRESS,
  contract.abi,
  signer
);

async function main() {
  const count = await preserveContract.returnIndexLen();
  console.log("Count: " + count);

  // console.log("Adding a value to the index");
  // const value = Math.random()
  //   .toString(36)
  //   .replace(/[^a-z]+/g, "")
  //   .substr(0, 5);
  // const tx = await preserveContract.addValueToIndex(value);
  // await tx.wait();

  // const count2 = await preserveContract.returnIndexLen();
  // console.log("Count: " + count2);

  //Get the values
  for (let idx = 0; idx < parseInt(count); idx++) {
    const value = await preserveContract.returnValueAtIndex(idx);
    console.log("idx: " + idx, value);
  }
}

main();
