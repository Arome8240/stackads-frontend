import { expect } from "chai";
import { ethers } from "hardhat";
import { mine } from "@nomicfoundation/hardhat-network-helpers";
import { ER2o, Governance } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Governance", () => {
  let token: ER2o;
  let gov: Governance;
  let owner: HardhatEthersSigner;
  let proposer: HardhatEthersSigner;
  let voter1: HardhatEthersSigner;
  let voter2: HardhatEthersSigner;
  let other: HardhatEthersSigner;

  const THRESHOLD = ethers.parseEther("10000");
  const QUORUM = ethers.parseEther("100000");
  const VOTING_PERIOD = 50400n;

  beforeEach(async () => {
    [owner, proposer, voter1, voter2, other] = await ethers.getSigners();

    const TokenFactory = await ethers.getContractFactory("ER2o");
    token = (await TokenFactory.deploy(owner.address, 10_000_000)) as ER2o;
    await token.waitForDeployment();

    const GovFactory = await ethers.getContractFactory("Governance");
    gov = (await GovFactory.deploy(
      await token.getAddress(),
      owner.address,
    )) as Governance;
    await gov.waitForDeployment();

    // Give proposer enough to meet threshold
    await token.transfer(proposer.address, THRESHOLD);
    // Give voters enough for quorum
    await token.transfer(voter1.address, QUORUM);
    await token.transfer(voter2.address, QUORUM);
  });

  async function createProposal(): Promise<bigint> {
    const callData = gov.interface.encodeFunctionData("setVotingPeriod", [
      100n,
    ]);
    const tx = await gov
      .connect(proposer)
      .propose(
        await gov.getAddress(),
        callData,
        "Update voting period to 100 blocks",
      );
    const receipt = await tx.wait();
    const event = receipt?.logs
      .map((l) => {
        try {
          return gov.interface.parseLog(l as any);
        } catch {
          return null;
        }
      })
      .find((e) => e?.name === "ProposalCreated");
    return event!.args.id as bigint;
  }

  describe("propose", () => {
    it("creates a proposal", async () => {
      const id = await createProposal();
      const p = await gov.getProposal(id);
      expect(p.proposer).to.equal(proposer.address);
      expect(p.description).to.equal("Update voting period to 100 blocks");
    });

    it("emits ProposalCreated", async () => {
      const callData = gov.interface.encodeFunctionData("setVotingPeriod", [
        100n,
      ]);
      await expect(
        gov.connect(proposer).propose(await gov.getAddress(), callData, "Test"),
      ).to.emit(gov, "ProposalCreated");
    });

    it("reverts below threshold", async () => {
      const callData = "0x";
      // other has no tokens — below threshold
      await expect(
        gov.connect(other).propose(await gov.getAddress(), callData, "Test"),
      ).to.be.revertedWith("Governance: below proposal threshold");
    });

    it("reverts with empty description", async () => {
      const callData = "0x";
      await expect(
        gov.connect(proposer).propose(await gov.getAddress(), callData, ""),
      ).to.be.revertedWith("Governance: empty description");
    });

    it("increments proposal count", async () => {
      await createProposal();
      await createProposal();
      expect(await gov.proposalCount()).to.equal(2n);
    });
  });

  describe("castVote", () => {
    let proposalId: bigint;

    beforeEach(async () => {
      proposalId = await createProposal();
      await mine(2); // move past startBlock
    });

    it("casts a FOR vote", async () => {
      await gov.connect(voter1).castVote(proposalId, 1);
      const p = await gov.getProposal(proposalId);
      expect(p.forVotes).to.equal(QUORUM);
    });

    it("casts an AGAINST vote", async () => {
      await gov.connect(voter1).castVote(proposalId, 0);
      const p = await gov.getProposal(proposalId);
      expect(p.againstVotes).to.equal(QUORUM);
    });

    it("casts an ABSTAIN vote", async () => {
      await gov.connect(voter1).castVote(proposalId, 2);
      const p = await gov.getProposal(proposalId);
      expect(p.abstainVotes).to.equal(QUORUM);
    });

    it("emits VoteCast", async () => {
      await expect(gov.connect(voter1).castVote(proposalId, 1))
        .to.emit(gov, "VoteCast")
        .withArgs(proposalId, voter1.address, 1, QUORUM);
    });

    it("reverts on double vote", async () => {
      await gov.connect(voter1).castVote(proposalId, 1);
      await expect(
        gov.connect(voter1).castVote(proposalId, 1),
      ).to.be.revertedWith("Governance: already voted");
    });

    it("reverts with invalid support value", async () => {
      await expect(
        gov.connect(voter1).castVote(proposalId, 3),
      ).to.be.revertedWith("Governance: invalid support value");
    });
  });

  describe("state transitions", () => {
    let proposalId: bigint;

    beforeEach(async () => {
      proposalId = await createProposal();
    });

    it("is Pending before startBlock", async () => {
      expect(await gov.state(proposalId)).to.equal(0n); // Pending
    });

    it("is Active during voting period", async () => {
      await mine(2);
      expect(await gov.state(proposalId)).to.equal(1n); // Active
    });

    it("is Defeated if quorum not met", async () => {
      await mine(Number(VOTING_PERIOD) + 5);
      expect(await gov.state(proposalId)).to.equal(2n); // Defeated
    });

    it("is Succeeded after passing vote", async () => {
      await mine(2);
      await gov.connect(voter1).castVote(proposalId, 1);
      await gov.connect(voter2).castVote(proposalId, 1);
      await mine(Number(VOTING_PERIOD) + 5);
      expect(await gov.state(proposalId)).to.equal(3n); // Succeeded
    });

    it("is Queued after queue()", async () => {
      await mine(2);
      await gov.connect(voter1).castVote(proposalId, 1);
      await gov.connect(voter2).castVote(proposalId, 1);
      await mine(Number(VOTING_PERIOD) + 5);
      await gov.queue(proposalId);
      expect(await gov.state(proposalId)).to.equal(4n); // Queued
    });

    it("is Cancelled after cancel()", async () => {
      await gov.connect(proposer).cancel(proposalId);
      expect(await gov.state(proposalId)).to.equal(6n); // Cancelled
    });
  });

  describe("execute", () => {
    it("executes a passed proposal after timelock", async () => {
      // Transfer gov ownership to itself so the proposal can call setVotingPeriod
      await gov.transferOwnership(await gov.getAddress());

      const proposalId = await createProposal();
      await mine(2);
      await gov.connect(voter1).castVote(proposalId, 1);
      await gov.connect(voter2).castVote(proposalId, 1);
      await mine(Number(VOTING_PERIOD) + 5);
      await gov.queue(proposalId);

      // Advance past timelock
      const p = await gov.getProposal(proposalId);
      await ethers.provider.send("evm_setNextBlockTimestamp", [
        Number(p.eta) + 1,
      ]);
      await mine(1);

      await gov.execute(proposalId);
      expect(await gov.votingPeriod()).to.equal(100n);
      expect(await gov.state(proposalId)).to.equal(5n); // Executed
    });

    it("reverts if timelock not elapsed", async () => {
      const proposalId = await createProposal();
      await mine(2);
      await gov.connect(voter1).castVote(proposalId, 1);
      await gov.connect(voter2).castVote(proposalId, 1);
      await mine(Number(VOTING_PERIOD) + 5);
      await gov.queue(proposalId);

      await expect(gov.execute(proposalId)).to.be.revertedWith(
        "Governance: timelock not elapsed",
      );
    });
  });

  describe("admin params", () => {
    it("owner can set voting period", async () => {
      await gov.setVotingPeriod(1000n);
      expect(await gov.votingPeriod()).to.equal(1000n);
    });

    it("reverts voting period too short", async () => {
      await expect(gov.setVotingPeriod(50n)).to.be.revertedWith(
        "Governance: period too short",
      );
    });

    it("owner can set quorum", async () => {
      await gov.setQuorumVotes(ethers.parseEther("50000"));
      expect(await gov.quorumVotes()).to.equal(ethers.parseEther("50000"));
    });
  });
});
