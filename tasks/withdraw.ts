import { task } from "hardhat/config";
import Charity from "../artifacts/contracts/Charity.sol/Charity.json";

task('withdraw', 'Donates ether to the contract')
.addParam('to', 'destination account')
.addParam('wei', 'amount in wei')
.setAction(async ({to, wei}, {ethers, network}) => {
    if (!process.env.CHARITY_ADDRESS) {
        throw new Error('process.env.CHARITY_ADDRESS is not provided');
    }
    
    const provider = new ethers.providers.InfuraProvider(network.name);
    // const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC || '');
    const signer = await ethers.getSigner('0x08B208f5Dc12614c89512b5b2119aeCe3937569E');
    
    const charity = new ethers.Contract(process.env.CHARITY_ADDRESS, Charity.abi, provider);
    const tx = await charity.connect(signer).withdrawBalance(to, wei);
    await tx.wait();
})