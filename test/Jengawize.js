const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
};

const ID = 1;
const NAME = "Building Stones";
const CATEGORY = "Stones";
const IMAGE = "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg";
const COST = tokens(1);
const RATING = 4;
const STOCK = 5000;

describe("Jengawize", () => {
  let jengawize;
  let deployer, buyer;

  beforeEach(async () => {
    // Get the signers
    [deployer, buyer] = await ethers.getSigners();

    // Deploy the contract
    const Jengawize = await ethers.getContractFactory("Jengawize");
    jengawize = await Jengawize.deploy();
    await jengawize.deployed();
  });

  describe("Deployment", () => {
    it("Sets the owner", async () => {
      expect(await jengawize.owner()).to.equal(deployer.address);
    });
  });

  describe("Listing", () => {
    let transaction;

    beforeEach(async () => {
      // List an item with deployer's account
      transaction = await jengawize.connect(deployer).list(
        ID,
        NAME,
        CATEGORY,
        IMAGE,
        COST,
        RATING,
        STOCK
      );
      await transaction.wait();
    });

    it("Returns Items Attributes", async () => {
      const item = await jengawize.items(ID);

      expect(item.id).to.equal(ID);
      expect(item.name).to.equal(NAME);
      expect(item.category).to.equal(CATEGORY);
      expect(item.image).to.equal(IMAGE);
      expect(item.cost).to.equal(COST);
      expect(item.rating).to.equal(RATING);
      expect(item.stock).to.equal(STOCK);
    });

    it("Emits List Event", async () => {
      const NEW_ID = 2; // Use a different ID
      await expect(
        jengawize.connect(deployer).list(
          NEW_ID,
          NAME,
          CATEGORY,
          IMAGE,
          COST,
          RATING,
          STOCK
        )
      ).to.emit(jengawize, "List").withArgs(
        NEW_ID,      // ID
        NAME,        // Name
        CATEGORY,    // Category
        IMAGE,       // Image URL
        COST,        // Cost
        RATING,      // Rating
        STOCK        // Stock
      );
    });
    
    it("Updates the contract balance", async () => {
      // Buy an item with buyer's account
      transaction = await jengawize.connect(buyer).buy(ID, { value: COST });
      await transaction.wait();

      const result = await ethers.provider.getBalance(jengawize.address);
      expect(result).to.equal(COST);
    });
  });
});
