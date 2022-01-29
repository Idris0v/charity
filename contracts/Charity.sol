// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Charity is Ownable {

    mapping(address => uint) public donations;
    address[] public donators;

    event DonationSuccessful();
    error ImproperFunctionCall(string);

    constructor() {}

    function makeDonation() external payable {

        uint sum = donations[msg.sender] + msg.value;
        require(donations[msg.sender] < sum, "Donation overflows uint256"); //TODO Handle overflow errors
        if (donations[msg.sender] == 0) {
            donators.push(msg.sender);
        }
        donations[msg.sender] = sum;
    }

    function withdrawBalance(address to, uint amount) external onlyOwner { // TODO Do I need ReentrancyGuard
        require(address(this).balance > amount, "Not enough funds");
        payable(to).transfer(amount);
    }

    function getAllDonators() external view returns(address[] memory) {
        return donators;
    }

    receive() external payable {
        revert ImproperFunctionCall("use makeDonation() function to donate");
    }
}