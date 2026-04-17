import { expect } from "chai";
import { ethers } from "hardhat";
import { ER2o } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("ER2o", () => {
  let token: ER2o;
  let owner: HardhatEthersSigner;
  let alice: HardhatEthersSigner;
  let bob: HardhatEthersSigner;

  const INITIAL_SUPPLY = 100_000_000n;
  const ONE = ethers.parseEther("1");
  const MAX_SUPPLY = ethers.parseEther("1000000000");

  beforeEach(async () => {
    [owner, alice, bob] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("ER2o");
    token = (await Factory.deploy(owner.address, INITIAL_SUPPLY)) as ER2o;
    await token.waitForDeployment();
  });

  describe("Deployment", () => {
    it("sets correct name and symbol", async () => {
      expect(await token.name()).to.equal("ER2o");
      expect(await token.symbol()).to.equal("ER2O");
    });

    it("sets 18 decimals", async () => {
      expect(await token.decimals()).to.equal(18);
    });

    it("mints initial supply to owner", async () => {
      const expected = ethers.parseEther(INITIAL_SUPPLY.toString());
      expect(await token.balanceOf(owner.address)).to.equal(expected);
      expect(await token.totalSupply()).to.equal(expected);
    });

    it("sets MAX_SUPPLY to 1 billion", async () => {
      expect(await token.MAX_SUPPLY()).to.equal(MAX_SUPPLY);
    });

    it("sets deployer as owner", async () => {
      expect(await token.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", () => {
    it("owner can mint tokens", async () => {
      await token.mint(alice.address, ONE);
      expect(await token.balanceOf(alice.address)).to.equal(ONE);
    });

    it("emits Minted event", async () => {
      await expect(token.mint(alice.address, ONE))
        .to.emit(token, "Minted")
        .withArgs(alice.address, ONE);
    });

    it("non-owner cannot mint", async () => {
      await expect(
        token.connect(alice).mint(alice.address, ONE),
      ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });

    it("cannot mint beyond MAX_SUPPLY", async () => {
      const remaining = MAX_SUPPLY - (await token.totalSupply());
      await expect(
        token.mint(alice.address, remaining + ONE),
      ).to.be.revertedWith("ER2o: exceeds max supply");
    });

    it("cannot mint to zero address", async () => {
      await expect(token.mint(ethers.ZeroAddress, ONE)).to.be.revertedWith(
        "ER2o: mint to zero address",
      );
    });
  });

  describe("Burning", () => {
    it("holder can burn their own tokens", async () => {
      await token.transfer(alice.address, ONE);
      await token.connect(alice).burn(ONE);
      expect(await token.balanceOf(alice.address)).to.equal(0n);
    });

    it("burnFrom requires allowance", async () => {
      await token.transfer(alice.address, ONE);
      await token.connect(alice).approve(bob.address, ONE);
      await token.connect(bob).burnFrom(alice.address, ONE);
      expect(await token.balanceOf(alice.address)).to.equal(0n);
    });

    it("burnFrom fails without allowance", async () => {
      await token.transfer(alice.address, ONE);
      await expect(
        token.connect(bob).burnFrom(alice.address, ONE),
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientAllowance");
    });
  });

  describe("Transfers", () => {
    it("transfers tokens between accounts", async () => {
      await token.transfer(alice.address, ONE);
      expect(await token.balanceOf(alice.address)).to.equal(ONE);
    });

    it("fails if sender has insufficient balance", async () => {
      await expect(
        token.connect(alice).transfer(bob.address, ONE),
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
    });
  });

  describe("Permit (EIP-2612)", () => {
    it("has a valid DOMAIN_SEPARATOR", async () => {
      const domain = await token.DOMAIN_SEPARATOR();
      expect(domain).to.be.a("string").with.length(66);
    });
  });
});
