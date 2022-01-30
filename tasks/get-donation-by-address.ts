import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import Charity from "../artifacts/contracts/Charity.sol/Charity.json";

task('donation', 'Get donation by particular address')
.addParam('address', 'address of a donator')
.setAction(async ({address}, {ethers, network}) => {
    if (!process.env.CHARITY_ADDRESS) {
        throw new Error('process.env.CHARITY_ADDRESS is not provided');
    }
    
    const provider = new ethers.providers.InfuraProvider(network.name);
    const charity = new ethers.Contract(process.env.CHARITY_ADDRESS, Charity.abi, provider);
    const donation = await charity.donations(address);
    console.log(ethers.utils.formatEther(donation));
})