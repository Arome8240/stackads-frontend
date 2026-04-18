import { expect } from "chai";
import { ethers } from "hardhat";
import { ER2o, AdTreasury } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("AdTreasury", () => {
  let token: ER2o;
  let treasury: AdTreasury;
  let owner: HardhatEthersSigner;
  let advertiser: HardhatEthersSigner;
  let publisher: HardhatEthersSigner;
  let feeRecipient: HardhatEthersSigner;

  const BUDGET = ethers.parseEther("10000");
  const CPI = ethers.parseEther("1"); // 1 token per impression

  beforeEach(async () => {
    [owner, advertiser, publisher, feeRecipient] = await ethers.getSigners();

    const TokenFactory = await ethers.getContractFactory("ER2o");
    token = (await TokenFactory.deploy(owner.address, 10_000_000)) as ER2o;
    await token.waitForDeployment();

    const TreasuryFactory = await ethers.getContractFactory("AdTreasury");
    treasury = (await TreasuryFactory.deploy(
      await token.getAddress(),
      owner.address,
      feeRecipient.address,
    )) as AdTreasury;
    await treasury.waitForDeployment();

    // Fund advertiser
    await token.transfer(advertiser.address, BUDGET * 2n);
    await token
      .connect(advertiser)
      .approve(await treasury.getAddress(), ethers.MaxUint256);
  });

  async function createCampaign(): Promise<bigint> {
    const tx = await treasury.connect(advertiser).createCampaign(BUDGET, CPI);
    const receipt = await tx.wait();
    const event = receipt?.logs
      .map((l) => {
        try {
          return treasury.interface.parseLog(l as any);
        } catch {
          return null;
        }
      })
      .find((e) => e?.name === "CampaignCreated");
    return event!.args.id as bigint;
  }

  describe("createCampaign", () => {
    it("creates campaign and locks budget", async () => {
      const id = await createCampaign();
      const c = await treasury.campaigns(id);
      expect(c.advertiser).to.equal(advertiser.address);
      expect(c.budget).to.equal(BUDGET);
      expect(c.spent).to.equal(0n);
      expect(await token.balanceOf(await treasury.getAddress())).to.equal(
        BUDGET,
      );
    });

    it("emits CampaignCreated", async () => {
      await expect(
        treasury.connect(advertiser).createCampaign(BUDGET, CPI),
      ).to.emit(treasury, "CampaignCreated");
    });

    it("reverts on zero budget", async () => {
      await expect(
        treasury.connect(advertiser).createCampaign(0n, CPI),
      ).to.be.revertedWith("AdTreasury: zero budget");
    });

    it("reverts on zero CPI", async () => {
      await expect(
        treasury.connect(advertiser).createCampaign(BUDGET, 0n),
      ).to.be.revertedWith("AdTreasury: zero CPI");
    });

    it("reverts if budget < CPI", async () => {
      await expect(
        treasury.connect(advertiser).createCampaign(CPI - 1n, CPI),
      ).to.be.revertedWith("AdTreasury: budget < CPI");
    });

    it("increments campaign IDs", async () => {
      const id1 = await createCampaign();
      const id2 = await createCampaign();
      expect(id2).to.equal(id1 + 1n);
    });
  });

  describe("recordImpression", () => {
    let campaignId: bigint;

    beforeEach(async () => {
      campaignId = await createCampaign();
    });

    it("records impression and credits publisher", async () => {
      await treasury.recordImpression(campaignId, publisher.address, 10n);
      const fee = (CPI * 10n * 500n) / 10000n;
      const net = CPI * 10n - fee;
      expect(await treasury.claimable(publisher.address)).to.equal(net);
    });

    it("sends protocol fee to feeRecipient", async () => {
      const before = await token.balanceOf(feeRecipient.address);
      await treasury.recordImpression(campaignId, publisher.address, 100n);
      const after = await token.balanceOf(feeRecipient.address);
      const expectedFee = (CPI * 100n * 500n) / 10000n;
      expect(after - before).to.equal(expectedFee);
    });

    it("emits ImpressionRecorded", async () => {
      await expect(
        treasury.recordImpression(campaignId, publisher.address, 1n),
      ).to.emit(treasury, "ImpressionRecorded");
    });

    it("caps payout at remaining budget", async () => {
      // Record more impressions than budget allows
      const maxImpressions = BUDGET / CPI;
      await treasury.recordImpression(
        campaignId,
        publisher.address,
        maxImpressions + 100n,
      );
      const c = await treasury.campaigns(campaignId);
      expect(c.spent).to.equal(BUDGET);
    });

    it("marks campaign Completed when budget exhausted", async () => {
      const maxImpressions = BUDGET / CPI;
      await treasury.recordImpression(
        campaignId,
        publisher.address,
        maxImpressions,
      );
      const c = await treasury.campaigns(campaignId);
      expect(c.status).to.equal(3n); // Completed
    });

    it("only owner can record impressions", async () => {
      await expect(
        treasury
          .connect(advertiser)
          .recordImpression(campaignId, publisher.address, 1n),
      ).to.be.revertedWithCustomError(treasury, "OwnableUnauthorizedAccount");
    });

    it("reverts on paused campaign", async () => {
      await treasury.connect(advertiser).pauseCampaign(campaignId);
      await expect(
        treasury.recordImpression(campaignId, publisher.address, 1n),
      ).to.be.revertedWith("AdTreasury: not active");
    });
  });

  describe("claimRevenue", () => {
    let campaignId: bigint;

    beforeEach(async () => {
      campaignId = await createCampaign();
      await treasury.recordImpression(campaignId, publisher.address, 100n);
    });

    it("transfers claimable to publisher", async () => {
      const claimable = await treasury.claimable(publisher.address);
      const before = await token.balanceOf(publisher.address);
      await treasury.connect(publisher).claimRevenue();
      const after = await token.balanceOf(publisher.address);
      expect(after - before).to.equal(claimable);
    });

    it("resets claimable to zero after claim", async () => {
      await treasury.connect(publisher).claimRevenue();
      expect(await treasury.claimable(publisher.address)).to.equal(0n);
    });

    it("emits RevenueClaimed", async () => {
      await expect(treasury.connect(publisher).claimRevenue()).to.emit(
        treasury,
        "RevenueClaimed",
      );
    });

    it("reverts if nothing to claim", async () => {
      await treasury.connect(publisher).claimRevenue();
      await expect(
        treasury.connect(publisher).claimRevenue(),
      ).to.be.revertedWith("AdTreasury: nothing to claim");
    });
  });

  describe("pauseCampaign / resumeCampaign", () => {
    let campaignId: bigint;

    beforeEach(async () => {
      campaignId = await createCampaign();
    });

    it("advertiser can pause", async () => {
      await treasury.connect(advertiser).pauseCampaign(campaignId);
      expect((await treasury.campaigns(campaignId)).status).to.equal(1n); // Paused
    });

    it("advertiser can resume", async () => {
      await treasury.connect(advertiser).pauseCampaign(campaignId);
      await treasury.connect(advertiser).resumeCampaign(campaignId);
      expect((await treasury.campaigns(campaignId)).status).to.equal(0n); // Active
    });

    it("non-advertiser cannot pause", async () => {
      await expect(
        treasury.connect(publisher).pauseCampaign(campaignId),
      ).to.be.revertedWith("AdTreasury: not advertiser");
    });
  });

  describe("cancelCampaign", () => {
    let campaignId: bigint;

    beforeEach(async () => {
      campaignId = await createCampaign();
    });

    it("refunds unspent budget to advertiser", async () => {
      await treasury.recordImpression(campaignId, publisher.address, 100n);
      const spent = (await treasury.campaigns(campaignId)).spent;
      const refund = BUDGET - spent;
      const before = await token.balanceOf(advertiser.address);
      await treasury.connect(advertiser).cancelCampaign(campaignId);
      const after = await token.balanceOf(advertiser.address);
      expect(after - before).to.equal(refund);
    });

    it("emits CampaignCancelled", async () => {
      await expect(
        treasury.connect(advertiser).cancelCampaign(campaignId),
      ).to.emit(treasury, "CampaignCancelled");
    });
  });

  describe("Admin", () => {
    it("owner can update protocol fee", async () => {
      await treasury.setProtocolFee(300n);
      expect(await treasury.protocolFeeBps()).to.equal(300n);
    });

    it("reverts fee above 20%", async () => {
      await expect(treasury.setProtocolFee(2001n)).to.be.revertedWith(
        "AdTreasury: fee too high",
      );
    });

    it("owner can update fee recipient", async () => {
      await treasury.setFeeRecipient(advertiser.address);
      expect(await treasury.feeRecipient()).to.equal(advertiser.address);
    });

    it("maxImpressions returns correct value", async () => {
      const id = await createCampaign();
      expect(await treasury.maxImpressions(id)).to.equal(BUDGET / CPI);
    });
  });
});
