import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";

task('donators-list', 'Get list of all donators', async (_, { ethers }) => {
    if (!process.env.CHARITY_ADDRESS) {
        throw new Error('process.env.CHARITY_ADDRESS is not provided');
    }

    const charity = await ethers.getContractAt(
        "Charity",
        process.env.CHARITY_ADDRESS
    );
    const donators = await charity.getAllDonators();
    console.log(donators);
})