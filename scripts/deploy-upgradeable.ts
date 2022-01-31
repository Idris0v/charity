import { ethers, upgrades } from "hardhat";

async function main() {
  const Charity = await ethers.getContractFactory("Charity");
  console.log('Deploying upgradable Charity...');
  
  const charity = await upgrades.deployProxy(Charity);
  await charity.deployed();

  console.log("Charity deployed to:", charity.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
