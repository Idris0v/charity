import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";

task('donate', 'Donates ether to the contract')
.addParam('wei', 'amount in wei')
.setAction(async ({wei}, hre) => {
    process.env
    console.log(wei, hre);
})