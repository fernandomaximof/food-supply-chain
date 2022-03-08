// // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

// Define a contract 'ConsumerRole' to manage this role - add, remove, check
contract ConsumerRole is AccessControl {
  // Define 2 events, one for Adding, and other for Removing
  event ConsumerAdded(address indexed account);
  event ConsumerRemoved(address indexed account);

  // In the constructor make the address that deploys this contract the 1st consumers
  constructor() {
    _setupRole('consumers', msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyConsumer() 
  {
    require(isConsumer(msg.sender));
    _;
  }

  // Define a function 'isConsumer' to check this role
  function isConsumer(address account) public view returns (bool) 
  {
    return hasRole('consumers', account);
  }

  // Define a function 'addConsumer' that adds this role
  function addConsumer(address account) public onlyConsumer() 
  {
    grantRole('consumers', account);
    emit ConsumerAdded(account);
  }

  // Define a function 'renounceConsumer' to renounce this role
  function renounceConsumer(address account) public 
  {
    renounceRole('consumers', account);
    emit ConsumerRemoved(account);
  }

  function checkConsumer() onlyConsumer() public view returns (address) 
  {
    return msg.sender;
  }
}