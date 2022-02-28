# Preserve Framework

By leveraging web3 and blockchain technology we build servicves to help preserve important digital information, forever.

![Preserve Framework Diagram](https://github.com/Preserve-Network/Preserve-Framework/blob/main/preserve-diagram.JPG?raw=true)

## Getting Started

This will guide you setting up the preserve smart contracts and the initial setup needed to interact with the various functions in the preserve framework.

### Polygon Network

To store the index files on the polygon blockchain you'll need to first deploy the smart contract.

#### Smart Contract Setup

To deploy the smart contract we'll first need to setup some enviroment variables.

Create an .env file in the root directory and add these four variables.

- POLYGON_TEST_ADDRESS=
- POLYGON_TEST_KEY=

- POLYGON_ADDRESS=
- POLYGON_KEY=

These will correspond to the public addresses and the secret keys for both the test network as well as the mainnet.
Each address should contain MATIC. If there isn't enough MATIC to complete the transaction the process will fail with an error.

#### Smart Contract Compile & Deploy

From the root directory run

```
npx hardhat compile
```

If you didn't get any errors, deploy the smart contract to the test network first

```
npx hardhat run scripts/deploy.js --network mumbai
```

If you get an error double check the addresses are correctly setup in the .env file and that the addresses have MATIC.
If everything works you should get back the address of the deployed contract.

Add this to the env file.

> - POLYGON_TEST_CONTRACT=

Repeat for mainnet

```
npx hardhat run scripts/deploy.js --network mainnet
```

And add that contract address to the env file.

> - POLYGON_CONTRACT=

#### Web3 API Setup

We also need a way to communicate with the blockchain. The Preserve framework is currently setup to work with two api gateways, alchemy and infura. Add which ever service you have an api key for in the .env file, or both if you have both. Alchemy has different api keys for each network while infura shares the same key. Both services have a free teir.

- POLYGON_TEST_ALCHEMY_API_KEY=
- POLYGON_ALCHEMY_API_KEY=
- POLYGON_INFURA_API_KEY=

#### Web3.storage Setup

Currently the only storage provider we have enabled is web3.storage. You'll need to signup for their free account and add the api key to the env file.

- WEB3_STORAGE_KEY=

## Using the Preserve framework

Once you've successfully added the correct settings we can test everything and start to interact with the preserve framework.

For this test we'll be using the testnet. Please verify that you have MATIC loaded into the testnet address that you setup early. You can find a matic facet by searching google.

Lets first test our connections are setup correctly.

```
const Preserve = require("./index.js");

(async () => {
  // This defaults to the mumbai network and will use the contract and addresses you've setup in your env file
  const preserve = new Preserve();
  const lastValue = await preserve.getIndexLength();
  console.log(`Last Value: ${lastValue}`);
})().catch((e) => {
  console.log("Error: ", e);
});

// When running the above code you should see output similar to this but the contract address will be different.
Using mumbai network, contract 0x31C82CFbB4D3F83995372eF837dc5711191DC4E7
Promise { <pending> }
> Last Value: 0
```

You just read data directly from the preserve contract! Because we haven't stored any data yet the last value is 0 which is what we'd expect. Lets add some data to the index!

Create a file called example-data.txt and put whatever you want in it.

```
echo "Hello from preserve" > example-data.txt
```

Now, lets preserve that file!

```
// This assumes we're in the root directory, if you're not you'll need to adjust the paths.

const Preserve = require("./index.js");
const { File } = require("web3.storage");

(async () => {
  const preserve = new Preserve();

  console.log("Preserving file...");
  const transactionHash = await preserve.preserveFiles({
    name: "First Preserve",
    description: "preserving my first file",
    files: ["example-data.txt"],
    attributes: {
      hello: "world",
    },
  });

  console.log(`Finished! Transaction Hash: ${transactionHash}`);
})().catch((e) => {
  console.log("Error", e);
});

```
