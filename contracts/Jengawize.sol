// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.3;

contract Jengawize {
    // State variable to store the owner of the contract
    address public owner;

    // Struct to represent an item
    struct Item {
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    // Mapping to store items by their ID
    mapping(uint256 => Item) public items;

    // Events for listing and buying items
    event List(uint256 id, string name, uint256 cost, uint256 stock);
    event Buy(uint256 id, address buyer, uint256 cost);

    // Modifier to restrict access to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    // Constructor to set the initial owner of the contract
    constructor() {
        owner = msg.sender;
    }

    // Function to list a new product
    function list(
        uint256 _id,
        string memory _name,
        string memory _category,
        string memory _image,
        uint256 _cost,
        uint256 _rating,
        uint256 _stock
    ) public onlyOwner {
        // Ensure the product does not already exist
        require(items[_id].id == 0, "Item with this ID already exists");

        // Create the item
        Item memory item = Item(_id, _name, _category, _image, _cost, _rating, _stock);

        // Save the item in the mapping
        items[_id] = item;

        // Emit the List event
        emit List(_id, _name, _cost, _stock);
    }

    // Function to buy a product
    function buy(uint256 _id) public payable {
        // Fetch the item
        Item storage item = items[_id];

        // Ensure the item exists and has stock
        require(item.id != 0, "Item does not exist");
        require(item.stock > 0, "Item is out of stock");

        // Ensure the buyer sent enough ETH
        require(msg.value >= item.cost, "Insufficient payment");

        // Reduce the stock
        item.stock--;

        // Emit the Buy event
        emit Buy(_id, msg.sender, item.cost);
    }

    // Function to withdraw contract funds (for the owner)
    function withdraw() public onlyOwner {
        // Transfer the balance to the owner
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    // Fallback function to receive ETH
    receive() external payable {}
}
