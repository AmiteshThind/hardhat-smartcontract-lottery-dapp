const { developmentChain, networkConfig } = require("../helper-hardhat-config");
const { network } = require("hardhat");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let vrfCoordinatorV2Address, subscribtionId;
  const VRF_SUB_FUND_AMOUNT = 2;

  if (developmentChain.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    );
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
    const TransactionResponse = await vrfCoordinatorV2Mock.createSubscription();
    const TransactionReciept = await TransactionResponse.wait(1);
    subscribtionId = TransactionReciept.events[0].args.subId;
    //fund subsribtion
    //we usually  need the link token on a real network
    await vrfCoordinatorV2Mock.fundSubscription(
      subscribtionId,
      VRF_SUB_FUND_AMOUNT
    );
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"];
    subscribtionId = networkConfig[chainId]["subscribtionId"];
  }
  const entranceFee = networkConfig[chainId]["entranceFee"];
  const gasLane = networkConfig[chainId]["gasLane"];
  const callBackGasLimit = networkConfig[chainId]["callBackGasLimit"];
  const interval = networkConfig[chainId]["interval"];

  const raffle = await deploy("Raffle", {
    from: deployer,
    args: [
      vrfCoordinatorV2Address,
      entranceFee,
      gasLane,
      subscribtionId,
      callBackGasLimit,
      interval,
    ],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developmentChain.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(raffle.address, args);
  }
};

module.exports.tags = ["all"];
