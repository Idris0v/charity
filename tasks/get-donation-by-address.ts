import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";

task('donation', 'Get donation by particular address')
    .addParam('address', 'address of a donator')
    .setAction(async ({ address }, { ethers }) => {
        if (!process.env.CHARITY_ADDRESS) {
            throw new Error('process.env.CHARITY_ADDRESS is not provided');
        }

        const charity = await ethers.getContractAt(
            "Charity",
            process.env.CHARITY_ADDRESS
        );
        const donation = await charity.donations(address);
        console.log(ethers.utils.formatEther(donation) + ' ETH');
    })