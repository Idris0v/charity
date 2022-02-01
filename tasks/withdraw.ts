import { task } from "hardhat/config";

task('withdraw', 'Donates ether to the contract')
    .addParam('to', 'destination account')
    .addParam('wei', 'amount in wei')
    .setAction(async ({ to, wei }, { ethers }) => {
        if (!process.env.CHARITY_ADDRESS) {
            throw new Error('process.env.CHARITY_ADDRESS is not provided');
        }

        const charity = await ethers.getContractAt(
            "Charity",
            process.env.CHARITY_ADDRESS
        );
        const tx = await charity.withdrawBalance(to, wei);
        await tx.wait();
    })