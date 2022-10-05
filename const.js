const { Interface } = require("@ethersproject/abi");
const { Contract } = require("@ethersproject/contracts");
const { JsonRpcProvider } = require("@ethersproject/providers");
const { Wallet } = require("@ethersproject/wallet");

// Addresses
const MTS = require("@ithil-protocol/deployed/goerli/deployments/MarginTradingStrategy.json");
const YS = require("@ithil-protocol/deployed/goerli/deployments/YearnStrategy.json");

// ABIs
const MTSABI = require("@ithil-protocol/deployed/goerli/abi/MarginTradingStrategy.json");
const YSABI = require("@ithil-protocol/deployed/goerli/abi/YearnStrategy.json");

const RPC_URL = `https://eth-${process.env.CHAIN_NAME}.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`;

const provider = new JsonRpcProvider(RPC_URL);

const wallet = Wallet.createRandom();

wallet.connect(provider);

const STRATEGIES = {
  MarginTradingStrategy: new Contract(
    MTS.address,
    new Interface(MTSABI),
    provider
  ),
  YearnStrategy: new Contract(YS.address, new Interface(YSABI), provider),
};

module.exports = {
  STRATEGIES,
  wallet,
  provider,
};
