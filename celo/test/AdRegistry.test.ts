import { expect } from "chai";
import { ethers } from "hardhat";
import { ER2o, AdRegistry } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("AdRegistry", () => {
  let token: ER2o;
  let registry: AdRegistry;
  let owner: HardhatEthersSigner;
  let publisher: HardhatEthersSigner;
  let advertiser: HardhatEthersSigner;
  let other: HardhatEthersSigner;

  const PUB_STAKE = ethers.parseEther("100");
  const ADV_STAKE = ethers.parseEther("500");
  const META = "ipfs://QmTestHash";

  beforeEach(async () => {
    [owner, publisher, advertiser, other] = await ethers.getSigners();

    const TokenFactory = await ethers.getContractFactory("ER2o");
    token = (await TokenFactory.deploy(owner.address, 10_000_000)) as ER2o;
    await token.waitForDeployment();

    const RegistryFactory = await ethers.getContractFactory("AdRegistry");
    registry = (await RegistryFactory.deploy(
      await token.getAddress(),
      owner.address,
    )) as AdRegistry;
    await registry.waitForDeployment();

    await token.transfer(publisher.address, PUB_STAKE * 10n);
    await token.transfer(advertiser.address, ADV_STAKE * 10n);

    await token
      .connect(publisher)
      .approve(await registry.getAddress(), ethers.MaxUint256);
    await token
      .connect(advertiser)
      .approve(await registry.getAddress(), ethers.MaxUint256);
  });

  describe("registerPublisher", () => {
    it("registers publisher and stakes tokens", async () => {
      await registry.connect(publisher).registerPublisher(META);
      const p = await registry.participants(publisher.address);
      expect(p.status).to.equal(1n); // Active
      expect(p.stakedAmount).to.equal(PUB_STAKE);
      expect(p.reputationScore).to.equal(500n);
    });

    it("emits Registered", async () => {
      await expect(registry.connect(publisher).registerPublisher(META))
        .to.emit(registry, "Registered")
        .withArgs(publisher.address, 0n, PUB_STAKE); // 0 = Publisher
    });

    it("increments publisherCount", async () => {
      await registry.connect(publisher).registerPublisher(META);
      expect(await registry.publisherCount()).to.equal(1n);
    });

    it("reverts on double registration", async () => {
      await registry.connect(publisher).registerPublisher(META);
      await expect(
        registry.connect(publisher).registerPublisher(META),
      ).to.be.revertedWith("AdRegistry: already registered");
    });

    it("reverts with empty metadata", async () => {
      await expect(
        registry.connect(publisher).registerPublisher(""),
      ).to.be.revertedWith("AdRegistry: empty metadata");
    });
  });

  describe("registerAdvertiser", () => {
    it("registers advertiser and stakes tokens", async () => {
      await registry.connect(advertiser).registerAdvertiser(META);
      const p = await registry.participants(advertiser.address);
      expect(p.status).to.equal(1n);
      expect(p.stakedAmount).to.equal(ADV_STAKE);
    });

    it("increments advertiserCount", async () => {
      await registry.connect(advertiser).registerAdvertiser(META);
      expect(await registry.advertiserCount()).to.equal(1n);
    });
  });

  describe("unregister", () => {
    it("refunds stake on unregister", async () => {
      await registry.connect(publisher).registerPublisher(META);
      const before = await token.balanceOf(publisher.address);
      await registry.connect(publisher).unregister();
      const after = await token.balanceOf(publisher.address);
      expect(after - before).to.equal(PUB_STAKE);
    });

    it("sets status to Unregistered", async () => {
      await registry.connect(publisher).registerPublisher(META);
      await registry.connect(publisher).unregister();
      expect((await registry.participants(publisher.address)).status).to.equal(
        0n,
      );
    });

    it("reverts if not active", async () => {
      await expect(registry.connect(publisher).unregister()).to.be.revertedWith(
        "AdRegistry: not active",
      );
    });
  });

  describe("updateMetadata", () => {
    it("updates metadata URI", async () => {
      await registry.connect(publisher).registerPublisher(META);
      await registry.connect(publisher).updateMetadata("ipfs://NewHash");
      expect(
        (await registry.participants(publisher.address)).metadataURI,
      ).to.equal("ipfs://NewHash");
    });

    it("emits MetadataUpdated", async () => {
      await registry.connect(publisher).registerPublisher(META);
      await expect(
        registry.connect(publisher).updateMetadata("ipfs://NewHash"),
      ).to.emit(registry, "MetadataUpdated");
    });
  });

  describe("reputation", () => {
    it("owner can update reputation score", async () => {
      await registry.connect(publisher).registerPublisher(META);
      await registry.updateReputation(publisher.address, 800n);
      expect(
        (await registry.participants(publisher.address)).reputationScore,
      ).to.equal(800n);
    });

    it("emits ReputationUpdated", async () => {
      await registry.connect(publisher).registerPublisher(META);
      await expect(registry.updateReputation(publisher.address, 800n))
        .to.emit(registry, "ReputationUpdated")
        .withArgs(publisher.address, 500n, 800n);
    });

    it("reverts score > 1000", async () => {
      await registry.connect(publisher).registerPublisher(META);
      await expect(
        registry.updateReputation(publisher.address, 1001n),
      ).to.be.revertedWith("AdRegistry: score out of range");
    });
  });

  describe("recordStats", () => {
    it("records impressions and clicks", async () => {
      await registry.connect(publisher).registerPublisher(META);
      await registry.recordStats(publisher.address, 1000n, 50n);
      const p = await registry.participants(publisher.address);
      expect(p.totalImpressions).to.equal(1000n);
      expect(p.totalClicks).to.equal(50n);
    });

    it("calculates CTR correctly", async () => {
      await registry.connect(publisher).registerPublisher(META);
      await registry.recordStats(publisher.address, 1000n, 50n);
      // 50/1000 = 5% = 500 bps
      expect(await registry.getClickThroughRate(publisher.address)).to.equal(
        500n,
      );
    });

    it("reverts if clicks > impressions", async () => {
      await registry.connect(publisher).registerPublisher(META);
      await expect(
        registry.recordStats(publisher.address, 100n, 200n),
      ).to.be.revertedWith("AdRegistry: clicks > impressions");
    });
  });

  describe("suspend / reinstate", () => {
    it("owner can suspend a participant", async () => {
      await registry.connect(publisher).registerPublisher(META);
      await registry.suspend(publisher.address, "ToS violation");
      expect((await registry.participants(publisher.address)).status).to.equal(
        2n,
      ); // Suspended
    });

    it("owner can reinstate", async () => {
      await registry.connect(publisher).registerPublisher(META);
      await registry.suspend(publisher.address, "Test");
      await registry.reinstate(publisher.address);
      expect((await registry.participants(publisher.address)).status).to.equal(
        1n,
      ); // Active
    });
  });

  describe("slash", () => {
    it("slashes 50% of stake", async () => {
      await registry.connect(publisher).registerPublisher(META);
      await registry.slash(publisher.address, 5000n, "Fraud");
      const p = await registry.participants(publisher.address);
      expect(p.stakedAmount).to.equal(PUB_STAKE / 2n);
      expect(p.status).to.equal(3n); // Slashed
      expect(p.reputationScore).to.equal(0n);
    });

    it("sends slashed tokens to owner", async () => {
      await registry.connect(publisher).registerPublisher(META);
      const before = await token.balanceOf(owner.address);
      await registry.slash(publisher.address, 10000n, "Full slash");
      const after = await token.balanceOf(owner.address);
      expect(after - before).to.equal(PUB_STAKE);
    });

    it("emits ParticipantSlashed", async () => {
      await registry.connect(publisher).registerPublisher(META);
      await expect(registry.slash(publisher.address, 5000n, "Fraud")).to.emit(
        registry,
        "ParticipantSlashed",
      );
    });
  });

  describe("view helpers", () => {
    it("isActivePublisher returns true for active publisher", async () => {
      await registry.connect(publisher).registerPublisher(META);
      expect(await registry.isActivePublisher(publisher.address)).to.be.true;
    });

    it("isActiveAdvertiser returns false for publisher", async () => {
      await registry.connect(publisher).registerPublisher(META);
      expect(await registry.isActiveAdvertiser(publisher.address)).to.be.false;
    });

    it("getClickThroughRate returns 0 with no impressions", async () => {
      expect(await registry.getClickThroughRate(other.address)).to.equal(0n);
    });
  });
});
