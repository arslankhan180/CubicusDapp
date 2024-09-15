// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./nft.sol";
import "./token.sol";

contract Factory is Ownable {
    struct Collection {
        address owner;
        address tokenContract;
    }

    struct TokenERC {
        address owner;
        address tokenContract;
        string name;
        string symbol;
        uint256 totalSupply;
    }

    mapping(address => Collection) public collections;
    mapping(address => TokenERC) public tokens;

    uint256 public collectionCounter;
    uint256 public tokenCounter;

    event CollectionCreated(
        address owner,
        address collection,
        string name,
        string symbol
    );

    event TokenCreated(
        address owner,
        address token,
        string name,
        string symbol,
        uint256 totalSupply
    );

    constructor() Ownable(msg.sender) {}

    function createCollection(string memory name, string memory symbol, address initialOwner)
        external
    {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        NFT collection = new NFT(name, symbol);
        collection.transferOwnership(initialOwner);
        address tokenContract = address(collection);

        collections[tokenContract] = Collection({
            owner: initialOwner,
            tokenContract: tokenContract
        });

        emit CollectionCreated(initialOwner, address(collection), name, symbol);
        collectionCounter++;
    }

    function createToken(string memory name, string memory symbol, uint256 totalSupply, address initialOwner)
        external
    {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        Token token = new Token(name, symbol, totalSupply, initialOwner);
        address tokenContract = address(token);

        tokens[tokenContract] = TokenERC({
            owner: initialOwner,
            tokenContract: tokenContract,
            name: name,
            symbol: symbol,
            totalSupply: totalSupply
        });

        emit TokenCreated(initialOwner, address(tokenContract), name, symbol, totalSupply);
        tokenCounter++;
    }
}
