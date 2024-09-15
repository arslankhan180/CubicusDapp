// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721, Ownable {
    uint256 private _nextTokenId = 1;
    mapping(uint256 => string) private _tokenURIs;

    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) Ownable(msg.sender) {}

    function safeMint(address to, string memory _tokenURI) public {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return _tokenURIs[tokenId];
    }
}
