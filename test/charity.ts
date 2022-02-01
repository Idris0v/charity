import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers, upgrades } from "hardhat";
import { it } from "mocha";
import { Charity, Charity__factory } from "../typechain";

describe("Charity", function () {
  let charity: Charity;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    user1 = signers[1];
    user2 = signers[2];
    const Charity: Charity__factory = await ethers.getContractFactory("Charity");
    charity = (await upgrades.deployProxy(Charity)) as Charity;
    await charity.deployed();
  });

  it('should return 0 donators on init', async () => {
    const donators = await charity.getAllDonators();
    expect(donators.length).to.equal(0);
    expect(await charity.owner()).to.equal(owner.address);
  });

  it('should accept donation and record info', async () => {
    const oneEtherInWei = ethers.utils.parseUnits('1', 'ether');
    await donate(user1, oneEtherInWei);

    let donators = await charity.getAllDonators();
    expect(donators.length).to.equal(1);
    expect(donators[0]).to.equal(user1.address);
    expect(await charity.donations(user1.address)).to.equal(oneEtherInWei);
  });

  it('should add a donator to donators array only once', async () => {
    const oneEtherInWei = ethers.utils.parseUnits('1', 'ether');

    await donate(user1, oneEtherInWei);
    let donators = await charity.getAllDonators();
    expect(donators.length).to.equal(1);

    await donate(user1, oneEtherInWei);
    donators = await charity.getAllDonators();
    expect(donators.length).to.equal(1);
  });

  it('should allow to only owner to withdraw balance to an external account', async () => {
    const twoEtherInWei = ethers.utils.parseUnits('2', 'ether');
    const oneEtherInWei = ethers.utils.parseUnits('1', 'ether');
    const user2InitialBalance = await user2.getBalance();
    await donate(user1, twoEtherInWei);

    const withdrawTx = await charity.withdrawBalance(user2.address, oneEtherInWei);
    await withdrawTx.wait();
    expect(await user2.getBalance()).to.equal(user2InitialBalance.add(oneEtherInWei));
  });

  it('should forbid non owner to withdraw balance', async () => {
    const twoEtherInWei = ethers.utils.parseUnits('2', 'ether');
    await donate(user1, twoEtherInWei);
 
    expect(charity.connect(user1).withdrawBalance(user2.address, twoEtherInWei)).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it('should handle to withdraw more balances than remains', async () => {
    const oneEtherInWei = ethers.utils.parseUnits('1', 'ether');
    const twoEtherInWei = ethers.utils.parseUnits('2', 'ether');
    await donate(user1, oneEtherInWei);
 
    expect(charity.withdrawBalance(user2.address, twoEtherInWei)).to.be.revertedWith('Not enough funds');
  });

  it('should trigger receive fallback function', async () => {
    const oneEtherInWei = ethers.utils.parseUnits('1', 'ether');
 
    expect(user1.sendTransaction({ to: charity.address, value: oneEtherInWei })).to.be.revertedWith('Use makeDonation() function to donate');
  });

  it('should trigger fallback function', async () => {
    expect(user1.sendTransaction({ to: charity.address })).to.be.revertedWith('No function matches this call');
  });

  async function donate(signer: SignerWithAddress, wei: BigNumber) {
    let donationTx = await charity.connect(signer).makeDonation({ value: wei });
    await donationTx.wait();
  }
});
