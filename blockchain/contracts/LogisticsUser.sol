// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

contract UserManager {
  struct User {
    address userAddress;
    string role; // "sender", "carrier", "receiver"
    bool isRegistered;
  }

  mapping(address => User) public users;

  event UserRegistered(address indexed user, string role);

  function registerUser(string memory _role) public {
    require(!users[msg.sender].isRegistered, 'User already registered');

    bytes32 roleHash = keccak256(abi.encodePacked(_role));
    require(
      roleHash == keccak256(abi.encodePacked('sender')) ||
        roleHash == keccak256(abi.encodePacked('carrier')) ||
        roleHash == keccak256(abi.encodePacked('receiver')),
      'Invalid role'
    );

    users[msg.sender] = User({
      userAddress: msg.sender,
      role: _role,
      isRegistered: true
    });

    emit UserRegistered(msg.sender, _role);
  }

  function isUserRegistered(address _user) public view returns (bool) {
    return users[_user].isRegistered;
  }
}
