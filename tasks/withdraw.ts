import { task } from "hardhat/config";

task('withdraw', 'Donates ether to the contract')
.addParam('to', 'destination account')
.addParam('wei', 'amount in wei')
.setAction(async ({to, wei}, hre) => {
    console.log(to, wei, hre);
})