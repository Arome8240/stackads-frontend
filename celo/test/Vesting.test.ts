import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { ER2o, Vesting } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Vesting", () => {
  let token: ER2o;
  let vesting: Vesting;
  let owner: HardhatEthersSigner;
  let alice: HardhatEthersSigner;
  let bob: HardhatEthersSigner;

  const TOTAL = ethers.parseEther("1200"); // 1200 tokens
  const CLIFF = 30 * 24 * 3600; // 30 days
  const DURATION = 365 * 24 * 3600; // 1 year

  beforeEach(async () => {
    [owner, alice, bob] = await ethers.getSigners();

    const TokenFactory = await ethers.getContractFactory("ER2o");
    token = (await TokenFactory.deploy(owner.address, 10_000_000)) as ER2o;
    await token.waitForDeployment();

    const VestingFactory = await ethers.getContractFactory("Vesting");
    vesting = (await VestingFactory.deploy(
      await token.getAddress(),
      owner.address,
    )) as Vesting;
    await vesting.waitForDeployment();

    // Approve vesting contract to pull tokens
    await token.approve(await vesting.getAddress(), ethers.MaxUint256);
  });

  async function createSchedule(
    beneficiary: string,
    revocable = true,
    startOffset = 0,
  ): Promise<bytes32> {
    const start = BigInt(await time.latest()) + BigInt(startOffset) + 1n;
    const tx = await vesting.createSchedule(
      beneficiary,
      TOTAL,
      start,
      CLIFF,
      DURATION,
      revocable,
    );
    const receipt = await tx.wait();
    const event = receipt?.logs
      .map((l) => {
        try {
          return vesting.interface.parseLog(l as any);
        } catch {
          return null;
        }
      })
      .find((e) => e?.name === "ScheduleCreated");
    return event!.args.id as bytes32;
  }

  type bytes32 = string;

  describe("createSchedule", () => {
    it("creates a schedule and locks tokens", async () => {
      const id = await createSchedule(alice.address);
      const s = await vesting.schedules(id);
      expect(s.beneficiary).to.equal(alice.address);
      expect(s.total).to.equal(TOTAL);
      expect(s.released).to.equal(0n);
      expect(await token.balanceOf(await vesting.getAddress())).to.equal(TOTAL);
    });

    it("reverts for zero beneficiary", async () => {
      const start = BigInt(await time.latest()) + 1n;
      await expect(
        vesting.createSchedule(
          ethers.ZeroAddress,
          TOTAL,
          start,
          CLIFF,
          DURATION,
          true,
        ),
      ).to.be.revertedWith("Vesting: zero beneficiary");
    });

    it("reverts if cliff > duration", async () => {
      const start = BigInt(await time.latest()) + 1n;
      await expect(
        vesting.createSchedule(
          alice.address,
          TOTAL,
          start,
          DURATION + 1,
          DURATION,
          true,
        ),
      ).to.be.revertedWith("Vesting: cliff > duration");
    });

    it("only owner can create", async () => {
      const start = BigInt(await time.latest()) + 1n;
      await expect(
        vesting
          .connect(alice)
          .createSchedule(alice.address, TOTAL, start, CLIFF, DURATION, true),
      ).to.be.revertedWithCustomError(vesting, "OwnableUnauthorizedAccount");
    });
  });

  describe("release", () => {
    it("returns 0 before cliff", async () => {
      const id = await createSchedule(alice.address);
      expect(await vesting.releasable(id)).to.equal(0n);
    });

    it("releases partial tokens after cliff", async () => {
      const id = await createSchedule(alice.address);
      const s = await vesting.schedules(id);

      // Advance to cliff + 30 days
      await time.increaseTo(Number(s.cliff) + 30 * 24 * 3600);

      const before = await token.balanceOf(alice.address);
      await vesting.connect(alice).release(id);
      const after = await token.balanceOf(alice.address);

      expect(after).to.be.gt(before);
      expect(after - before).to.be.lte(TOTAL); // never more than total
    });

    it("releases full amount after duration", async () => {
      const id = await createSchedule(alice.address);
      const s = await vesting.schedules(id);

      await time.increaseTo(Number(s.start) + DURATION + 1);

      await vesting.connect(alice).release(id);
      expect(await token.balanceOf(alice.address)).to.equal(TOTAL);
    });

    it("only beneficiary can release", async () => {
      const id = await createSchedule(alice.address);
      const s = await vesting.schedules(id);
      await time.increaseTo(Number(s.cliff) + 1);

      await expect(vesting.connect(bob).release(id)).to.be.revertedWith(
        "Vesting: not beneficiary",
      );
    });

    it("emits TokensReleased", async () => {
      const id = await createSchedule(alice.address);
      const s = await vesting.schedules(id);
      await time.increaseTo(Number(s.start) + DURATION + 1);

      await expect(vesting.connect(alice).release(id))
        .to.emit(vesting, "TokensReleased")
        .withArgs(id, alice.address, TOTAL);
    });
  });

  describe("revoke", () => {
    it("owner can revoke and gets unvested tokens back", async () => {
      const id = await createSchedule(alice.address, true);
      const s = await vesting.schedules(id);

      // Advance to halfway
      await time.increaseTo(Number(s.start) + DURATION / 2);

      const ownerBefore = await token.balanceOf(owner.address);
      await vesting.revoke(id);
      const ownerAfter = await token.balanceOf(owner.address);

      expect(ownerAfter).to.be.gt(ownerBefore);
      expect((await vesting.schedules(id)).revoked).to.be.true;
    });

    it("cannot revoke non-revocable schedule", async () => {
      const id = await createSchedule(alice.address, false);
      await expect(vesting.revoke(id)).to.be.revertedWith(
        "Vesting: not revocable",
      );
    });

    it("cannot release after revoke", async () => {
      const id = await createSchedule(alice.address, true);
      const s = await vesting.schedules(id);
      await time.increaseTo(Number(s.cliff) + 1);
      await vesting.revoke(id);

      await expect(vesting.connect(alice).release(id)).to.be.revertedWith(
        "Vesting: revoked",
      );
    });
  });
});
