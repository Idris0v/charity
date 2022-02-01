import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";

task('donate', 'Donates ether to the contract')
    .addParam('from', 'Address to donate from')
    .addParam('wei', 'amount in wei')
    .setAction(async ({ from, wei }, { ethers }) => {
        if (!process.env.CHARITY_ADDRESS) {
            throw new Error('process.env.CHARITY_ADDRESS is not provided');
        }

        const signer = await ethers.getSigner(from);
        const charity = await ethers.getContractAt(
            "Charity",
            process.env.CHARITY_ADDRESS
        );
        const tx = await charity.connect(signer).makeDonation({ value: wei });
        await tx.wait();
    })