# Preserve Framework

A collection of software and services aimed at preserving historically important digital information forever. We accomplish this by using various decentralized storage providers and multiple blockchains to create an immutable persistent network.

![Preserve Framework Diagram](https://github.com/Preserve-Network/Preserve-Framework/blob/main/preserve-diagram.JPG?raw=true)


## Getting Started
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

> npx hardhat run scripts/deploy.js --network mumbai 

Copy the contract address the deploy script returns and put that in your .env file.

## Possible use-cases

- Take screenshots to record history
- Preserve all tweets or posts from users
- Preserve government documents, rollcalls, voter records, etc
