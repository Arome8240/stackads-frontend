import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { ER2o, Staking } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Staking", () => {
  let token: ER2o;
  let staking: Staking;
  let owner: HardhatEthersSigner;
  let alice: HardhatEthersSigner;
  let bob: HardhatEthersSigner;

  const STAKE = ethers.parseEther("1000");
  const REWARD = ethers.parseEther("10000");
  const DURATION = 30 * 24 * 3600; // 30 days

  beforeEach(async () => {
    [owner, alice, bob] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("ER2o");
    token = (await Factory.deploy(owner.address, 10_000_000)) as ER2o;
    await token.waitForDeployment();

    const StakingFactory = await ethers.getContractFactory("Staking");
    staking = (await StakingFactory.deploy(
      await token.getAddress(),
      await token.getAddress(),
      owner.address,
    )) as Staking;
    await staking.waitForDeployment();

    // Distribute tokens
    await token.transfer(alice.address, STAKE * 10n);
    await token.transfer(bob.address, STAKE * 10n);

    // Approvals
    await token
      .connect(alice)
      .approve(await staking.getAddress(), ethers.MaxUint256);
    await token
      .connect(bob)
      .approve(await staking.getAddress(), ethers.MaxUint256);
    await token.approve(await staking.getAddress(), ethers.MaxUint256);
  });

  async function fundRewards() {
    await staking.notifyRewardAmount(REWARD, DURATION);
  }

  describe("Deployment", () => {
    it("sets staking and reward token", async () => {
      expect(await staking.stakingToken()).to.equal(await token.getAddress());
      expect(await staking.rewardToken()).to.equal(await token.getAddress());
    });

    it("starts with zero supply", async () => {
      expect(await staking.totalSupply()).to.equal(0n);
    });
  });

  describe("Staking", () => {
    it("allows staking tokens", async () => {
      await staking.connect(alice).stake(STAKE);
      expect(await staking.balances(alice.address)).to.equal(STAKE);
      expect(await staking.totalSupply()).to.equal(STAKE);
    });

    it("emits Staked event", async () => {
      await expect(staking.connect(alice).stake(STAKE))
        .to.emit(staking, "Staked")
        .withArgs(alice.address, STAKE);
    });

    it("reverts below minimum stake", async () => {
      await expect(
        staking.connect(alice).stake(ethers.parseEther("0.5")),
      ).to.be.revertedWith("Staking: below minimum");
    });
  });

  describe("Withdrawing", () => {
    beforeEach(async () => {
      await staking.connect(alice).stake(STAKE);
    });

    it("allows withdrawal", async () => {
      await staking.connect(alice).withdraw(STAKE);
      expect(await staking.balances(alice.address)).to.equal(0n);
    });

    it("emits Withdrawn event", async () => {
      await expect(staking.connect(alice).withdraw(STAKE))
        .to.emit(staking, "Withdrawn")
        .withArgs(alice.address, STAKE);
    });

    it("reverts on zero withdrawal", async () => {
      await expect(staking.connect(alice).withdraw(0n)).to.be.revertedWith(
        "Staking: zero amount",
      );
    });

    it("reverts on insufficient balance", async () => {
      await expect(
        staking.connect(alice).withdraw(STAKE + 1n),
      ).to.be.revertedWith("Staking: insufficient balance");
    });
  });

  describe("Rewards", () => {
    beforeEach(async () => {
      await fundRewards();
      await staking.connect(alice).stake(STAKE);
    });

    it("accrues rewards over time", async () => {
      await time.increase(DURATION / 2);
      const earned = await staking.earned(alice.address);
      expect(earned).to.be.gt(0n);
    });

    it("single staker earns all rewards", async () => {
      await time.increase(DURATION);
      const earned = await staking.earned(alice.address);
      // Should be close to full REWARD (small rounding)
      expect(earned).to.be.closeTo(REWARD, ethers.parseEther("1"));
    });

    it("two stakers split rewards proportionally", async () => {
      await staking.connect(bob).stake(STAKE);
      await time.increase(DURATION);

      const aliceEarned = await staking.earned(alice.address);
      const bobEarned = await staking.earned(bob.address);

      // Both staked equal amounts, so earnings should be roughly equal
      expect(aliceEarned).to.be.closeTo(bobEarned, ethers.parseEther("10"));
    });

    it("claimReward transfers tokens", async () => {
      await time.increase(DURATION);
      const earned = await staking.earned(alice.address);
      const before = await token.balanceOf(alice.address);

      await staking.connect(alice).claimReward();

      const after = await token.balanceOf(alice.address);
      expect(after - before).to.be.closeTo(earned, ethers.parseEther("0.01"));
    });

    it("emits RewardClaimed", async () => {
      await time.increase(DURATION);
      await expect(staking.connect(alice).claimReward()).to.emit(
        staking,
        "RewardClaimed",
      );
    });

    it("exit withdraws stake and claims rewards", async () => {
      await time.increase(DURATION / 2);
      const before = await token.balanceOf(alice.address);
      await staking.connect(alice).exit();
      const after = await token.balanceOf(alice.address);
      // Should have gotten back stake + rewards
      expect(after).to.be.gt(before + STAKE);
    });
  });

  describe("notifyRewardAmount", () => {
    it("only owner can call", async () => {
      await expect(
        staking.connect(alice).notifyRewardAmount(REWARD, DURATION),
      ).to.be.revertedWithCustomError(staking, "OwnableUnauthorizedAccount");
    });

    it("emits RewardAdded", async () => {
      await expect(staking.notifyRewardAmount(REWARD, DURATION))
        .to.emit(staking, "RewardAdded")
        .withArgs(REWARD, DURATION);
    });
  });
});
