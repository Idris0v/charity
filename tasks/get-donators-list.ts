import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import Charity from "../artifacts/contracts/Charity.sol/Charity.json";

task('donators-list', 'Get list of all donators', async (taskArgs, {ethers, network}) => {
    if (!process.env.CHARITY_ADDRESS) {
        throw new Error('process.env.CHARITY_ADDRESS is not provided');
    }
    
    const provider = new ethers.providers.InfuraProvider(network.name);
    const charity = new ethers.Contract(process.env.CHARITY_ADDRESS, Charity.abi, provider);
    const donators = await charity.getAllDonators();
    console.log(donators);
})