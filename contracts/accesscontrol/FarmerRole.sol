// // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

// Define a contract 'FarmerRole' to manage this role - add, remove, check
contract FarmerRole is AccessControl {
  // Define 2 events, one for Adding, and other for Removing
  event FarmerAdded(address indexed account);
  event FarmerRemoved(address indexed account);

  // In the constructor make the address that deploys this contract the 1st farmers
  constructor() {
    _setupRole('farmers', msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyFarmer() 
  {
    require(isFarmer(msg.sender));
    _;
  }

  // Define a function 'isFarmer' to check this role
  function isFarmer(address account) public view returns (bool) 
  {
    return hasRole('farmers', account);
  }

  // Define a function 'addFarmer' that adds this role
  function addFarmer(address account) public onlyFarmer() 
  {
    grantRole('farmers', account);
    emit FarmerAdded(account);
  }

  // Define a function 'renounceFarmer' to renounce this role
  function renounceFarmer(address account) public 
  {
    renounceRole('farmers', account);
    emit FarmerRemoved(account);
  }

  function checkFarmer() onlyFarmer() public view returns (address) 
  {
    return msg.sender;
  }
}