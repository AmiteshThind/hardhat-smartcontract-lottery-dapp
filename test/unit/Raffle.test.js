const { describe } = require("node:test");
const {
  developmentChain,
  networkConfig,
} = require("../../helper-hardhat-config");
const { getNamedAccounts, deployments } = require("hardhat");
const { assert, expect } = require("chai");

!developmentChain.includes(network.name)
  ? describe.skip
  : describe("Raffle Unit Tests", async function () {
      let raffle, vrfCoordinatorV2Mock, raffleEntranceFee, deployer;
      const chainId = network.config.chainId;

      beforeEach(async function () {
        deployer = await getNamedAccounts().deployer;
        await deployments.fixture("all");
        raffle = await ethers.getContract("Raffle", deployer); //conect to deloyer
        vrfCoordinatorV2Mock = await ethers.getContract(
          "VRFCoordinatorV2Mock",
          deployer
        );
        raffleEntranceFee = await raffle.getEntranceFee();
      });

      describe("constructor", async function () {
        it("intializes the raffle corrctly", async function () {
          const raffleState = await raffle.getRaffleState();
          const interval = await raffle.getInterval();
          assert.equal(raffleState.toString(), "0");
          assert.equal(interval.toString(), networkConfig[chainId]["interval"]);
        });
      });

      describe("enterRaffle", async function () {
        it("reverts when you dont pay enough", async function () {
          await expect(raffle.enterRaffle()).to.be.revertedWith(
            "Raffle__NotEnoughETHEntered"
          );
        });
        it("records players when the enter raffle", async function () {
          await raffle.enterRaffle({ value: raffleEntranceFee });
          const playerFromContract = await raffle.getPlayer(0);
          assert(playerFromContract, deployer);
        });

        it("emits even on enter", async function () {
          await expect(
            raffle.enterRaffle({ value: raffleEntranceFee })
          ).to.emit(raffle, "RaffleEnter");
        });
      });
    });

//finish lesson 9
//do some typescript
