# Preserve Framework

Create an .env file in the root directory

The following keys are required

- WEB3_STORAGE_KEY=

- POLYGON_TEST_ADDRESS=
- POLYGON_TEST_KEY=
- POLYGON_TEST_ALCHEMY_API_KEY=
- POLYGON_TEST_CONTRACT=

- POLYGON_ADDRESS=
- POLYGON_KEY=
- POLYGON_ALCHEMY_API_KEY=
- POLYGON_CONTRACT=

## Compile Code

npx hardhat compile

## Deploy Smart Contract

First make sure the networks and private keys are setup correctly in the hardhat.config.js file.

Run to make sure we pick up any changes in the contract

> npx hardhat compile

Next, deploy the contract making sure you choose the correct network

> npx hardhat run --network mumbai scripts/deploy.js

Copy the contract address the deploy script returns and put that in your .env file.

## Possible use-cases

- Take screenshots to record history
- Preserve all tweets or posts from users
- Preserve government documents, rollcalls, voter records, etc
