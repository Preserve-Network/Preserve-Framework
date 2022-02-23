// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Preserve {
  uint256 constant versionNumber = 2;

  address owner;
  uint256 indexLen;
  string indexName;

  event IndexUpdated(address indexed _from, string _value, uint256 _indexLen);

  /*
    1 - Full permissions
  */
  mapping(address => uint256) permissions;

  /* 
    You could possibly have multiple indexes depending on the usecase.
    This could either be explicit (new mapping) or by having a mapping of a mapping
    */
  mapping(uint256 => string) mainIndex;

  /*** Modifiers  ***/
  modifier fullPermissions() {
    require(permissions[msg.sender] == 1, "Action not allowed by user");
    _;
  }

  constructor() {
    owner = msg.sender;
    permissions[msg.sender] = 1;
    indexName = "Unnamed";
  }

  /***
   Functions
  */
  function returnIndexLen() external view returns (uint256) {
    return indexLen;
  }

  function returnVersion() external pure returns (uint256) {
    return versionNumber;
  }

  function returnValueAtIndex(uint256 _idx)
    external
    view
    returns (string memory)
  {
    return mainIndex[_idx];
  }

  /* State changing functions */
  function setUserPermissions(address _user, uint256 _permission)
    external
    fullPermissions
  {
    require(_user != owner, "Can't modify owner permissions");
    require(_user != msg.sender, "Can't modify your own permissions");

    permissions[_user] = _permission;
  }

  function setIndexName(string memory newName) external fullPermissions {
    indexName = newName;
  }

  function addValueToIndex(string memory _value) external fullPermissions {
    mainIndex[indexLen] = _value;
    indexLen++;
    emit IndexUpdated(msg.sender, _value, indexLen);
  }
}
