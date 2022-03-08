// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

// Define a contract 'DistributorRole' to manage this role - add, remove, check
contract DistributorRole is AccessControl {
  // Define 2 events, one for Adding, and other for Removing
  event DistributorAdded(address indexed account);
  event DistributorRemoved(address indexed account);

  // In the constructor make the address that deploys this contract the 1st distributor
  constructor() {
    _setupRole('distributors', msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyDistributor() 
  {
    require(isDistributor(msg.sender));
    _;
  }

  // Define a function 'isDistributor' to check this role
  function isDistributor(address account) public view returns (bool) 
  {
    return hasRole('distributors', account);
  }

  // Define a function 'addDistributor' that adds this role
  function addDistributor(address account) public onlyDistributor 
  {
    grantRole('distributors', account);
    emit DistributorAdded(account);
  }

  // Define a function 'renounceDistributor' to renounce this role
  function renounceDistributor(address account) public 
  {
    renounceRole('distributors', account);
    emit DistributorRemoved(account);
  }

  function checkDistributor() onlyDistributor() public view returns (address) 
  {
    return msg.sender;
  }
}