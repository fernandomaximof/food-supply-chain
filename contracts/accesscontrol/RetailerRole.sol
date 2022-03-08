// // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

// Define a contract 'RetailerRole' to manage this role - add, remove, check
contract RetailerRole is AccessControl {
  // Define 2 events, one for Adding, and other for Removing
  event RetailerAdded(address indexed account);
  event RetailerRemoved(address indexed account);

  // In the constructor make the address that deploys this contract the 1st retailers
  constructor() {
    _setupRole('retailers', msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyRetailer() 
  {
    require(isRetailer(msg.sender));
    _;
  }

  // Define a function 'isRetailer' to check this role
  function isRetailer(address account) public view returns (bool) 
  {
    return hasRole('retailers', account);
  }

  // Define a function 'addRetailer' that adds this role
  function addRetailer(address account) public onlyRetailer() 
  {
    grantRole('retailers', account);
    emit RetailerAdded(account);
  }

  // Define a function 'renounceRetailer' to renounce this role
  function renounceRetailer(address account) public 
  {
    renounceRole('retailers', account);
    emit RetailerRemoved(account);
  }

  function checkRetailer() onlyRetailer() public view returns (address) 
  {
    return msg.sender;
  }
}