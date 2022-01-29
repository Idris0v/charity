import { ethers } from "hardhat";

async function main() {
  const Charity = await ethers.getContractFactory("Charity");
  const charity = await Charity.deploy();

  await charity.deployed();

  console.log("Charity deployed to:", charity.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
