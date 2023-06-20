const networkConfig = {
  11155111: {
    name: "sepolia",
    vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
    entranceFee: ethers.utils.parseEther("0.01"),
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    subsribtionId: 232,
    callBackGasLimit: 500000,
    interval: 30,
  },

  //hardhat
  31337: {
    name: "localhost",
    entranceFee: ethers.utils.parseEther("0.01"),
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    callBackGasLimit: 500000,
    interval: 30,
  },
};

const developmentChain = ["hardhat", "localhost"];

module.exports = {
  networkConfig,
  developmentChain,
};
