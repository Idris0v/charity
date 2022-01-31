// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Charity is Initializable, OwnableUpgradeable {

    mapping(address => uint) public donations;
    address[] public donators;

    event DonationSuccessful();
    error ImproperFunctionCall(string);

    function initialize() public initializer {
        __Ownable_init();
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function makeDonation() external payable {
        uint sum = donations[msg.sender] + msg.value;
        require(donations[msg.sender] < sum, "Donation overflows uint256"); // TODO How to handle overflow errors?
        if (donations[msg.sender] == 0) {
            donators.push(msg.sender);
        }
        donations[msg.sender] = sum;

        emit DonationSuccessful();
    }

    function withdrawBalance(address to, uint amount) external onlyOwner { // TODO Do I need ReentrancyGuard?
        require(address(this).balance > amount, "Not enough funds");
        payable(to).transfer(amount);
    }

    function getAllDonators() external view returns (address[] memory) {
        return donators;
    }

    receive() external payable {
        revert ImproperFunctionCall("Use makeDonation() function to donate");
    }

    fallback () external {
        revert ImproperFunctionCall("No function matches this call");
    }
}