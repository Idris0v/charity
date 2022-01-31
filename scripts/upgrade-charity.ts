import { ethers, upgrades } from "hardhat";

async function main() {
    if (!process.env.CHARITY_ADDRESS) {
        throw new Error('process.env.CHARITY_ADDRESS is not provided');
    }
    const Charity = await ethers.getContractFactory("Charity");
    console.log('Upgrading Charity...');

    const charity = await upgrades.upgradeProxy(process.env.CHARITY_ADDRESS, Charity);
    await charity.deployed();

    console.log("Charity upgraded");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
