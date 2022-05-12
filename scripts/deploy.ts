// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const Commsaur = await ethers.getContractFactory("Commsaur");
  const saur = await Commsaur.deploy();

  // We get the contract to deploy
  const CommsaurPFP = await ethers.getContractFactory("CommsaurPFP");
  // const live = "0xBAcB34Bcf94442dbA033e9cf7216888B8170F0cE";

  const pfp = await CommsaurPFP.deploy(saur.address);

  console.log("Commsaur deployed to:", saur.address);
  console.log("CommsaurPFP deployed to:", pfp.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
