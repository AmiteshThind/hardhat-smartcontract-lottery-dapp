const { developmentChain } = require("../helper-hardhat-config");

const BASE_FEE = ethers.utils.parseEther("0.25");
const GAS_PRICE_LINK = 1e9;
module.exports = async ({ getNamedAccounts, deployments, network }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  if (developmentChain.includes(network.name)) {
    console.log("Local Network detected! Deploying mocks...");
    //deploy mock vrf coordinator contract
    await deploy("VRFCoordinatorV2Mock", {
      contract: "VRFCoordinatorV2Mock",
      from: deployer,
      log: true,
      args: [BASE_FEE, GAS_PRICE_LINK],
    });
    console.log("Mocks deployed");
    console.log("----------------------------------------");
  }
};

module.exports.tags = ["all", "mocks"];
