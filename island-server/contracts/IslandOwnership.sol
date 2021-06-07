// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


/// @author Winnie X
/// @title A simple contract for Island Quest Game
contract IslandOwnership is ERC721 {
  uint numberOfIslands = 5;
  uint modulus = 10;
  uint randNonce = 0;
  mapping (address => uint[]) ownerToIslands;

  constructor() ERC721("IslandQuest", "ILQ") {}
  
  /// Return pseudorandom number between 1 and 5
  function getRandomNumber() internal returns (uint) {
    randNonce++;
    uint rand = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % modulus;
    if (rand >= 5) {
        rand -= 5; // ex. 5 -> 0; 9 => 4
    }
    return rand + 1; 
  }

  // Assign one of five island randomly to caller, does not permit co-ownership of islands
  function getIsland() public returns (uint) {
    uint island = getRandomNumber();
    _safeMint(msg.sender, island);
    return island;
  }  

  // Return address of owner of islandTokenId
  function getIslandOwner(uint256 tokenId) public view returns (address) {
    return ownerOf(tokenId);
  }
    
  // Return list of islands owned by caller
  function getCallerIslands() public view returns(uint[] memory) {
      uint[] memory islands = new uint[](getCallerBalance());
      uint counter = 0;
      for (uint i = 0; i < numberOfIslands; i++) {
          
          if (_exists(i) && ownerOf(i) == msg.sender) {
              islands[counter] = i;
              counter++;
          }
      } 
      return islands;
  }
    
  // Return number of Islands owned by caller
  function getCallerBalance() internal view returns (uint) {
    return balanceOf(msg.sender);
  }
}
