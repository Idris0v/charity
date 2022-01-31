import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import CharityJson from "../artifacts/contracts/Charity.sol/Charity.json";

task('donate', 'Donates ether to the contract')
.addParam('wei', 'amount in wei')
.setAction(async ({wei}, {ethers, network}) => {
    if (!process.env.CHARITY_ADDRESS) {
        throw new Error('process.env.CHARITY_ADDRESS is not provided');
    }

    const provider = new ethers.providers.InfuraProvider(network.name);
    const signer = await ethers.getSigner('0x08B208f5Dc12614c89512b5b2119aeCe3937569E');
    
    const charity = new ethers.Contract(process.env.CHARITY_ADDRESS, CharityJson.abi, provider);
    const tx = await charity.connect(signer).makeDonation({value: wei});
    await tx.wait();
})