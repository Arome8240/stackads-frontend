import { describe, expect, it, beforeEach } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const voter1 = accounts.get("wallet_1")!;
const voter2 = accounts.get("wallet_2")!;
const voter3 = accounts.get("wallet_3")!;

describe("Governance Tests", () => {
  beforeEach(() => {
    // Distribute tokens for voting power
    simnet.callPublicFn(
      "stackads-token",
      "transfer",
      [Cl.uint(5000000000), Cl.principal(deployer), Cl.principal(voter1), Cl.none()],
      deployer
    );
    simnet.callPublicFn(
      "stackads-token",
      "transfer",
      [Cl.uint(8000000000), Cl.principal(deployer), Cl.principal(voter2), Cl.none()],
      deployer
    );
    simnet.callPublicFn(
      "stackads-token",
      "transfer",
      [Cl.uint(3000000000), Cl.principal(deployer), Cl.principal(voter3), Cl.none()],
      deployer
    );
  });

  it("should allow creating a proposal with sufficient tokens", () => {
    const propose = simnet.callPublicFn(
      "governance",
      "propose",
      [
        Cl.stringUtf8("Increase platform fee to 3%"),
        Cl.stringUtf8("ipfs://proposal-details"),
      ],
      voter1
    );
    expect(propose.result).toBe("(ok u1)"); // Proposal ID 1
  });

  it("should prevent proposal creation without threshold", () => {
    const propose = simnet.callPublicFn(
      "governance",
      "propose",
      [
        Cl.stringUtf8("Test proposal"),
        Cl.stringUtf8("ipfs://proposal"),
      ],
      voter3 // Has less than threshold
    );
    expect(propose.result).toContain("err");
  });

  it("should return correct proposal state", () => {
    simnet.callPublicFn(
      "governance",
      "propose",
      [
        Cl.stringUtf8("Test proposal"),
        Cl.stringUtf8("ipfs://proposal"),
      ],
      voter1
    );

    const state = simnet.callReadOnlyFn(
      "governance",
      "get-proposal-state",
      [Cl.uint(1)],
      deployer
    );
    expect(state.result).toBe("u1"); // Pending state
  });

  it("should allow voting on active proposal", () => {
    // Create proposal
    simnet.callPublicFn(
      "governance",
      "propose",
      [
        Cl.stringUtf8("Test proposal"),
        Cl.stringUtf8("ipfs://proposal"),
      ],
      voter1
    );

    // Wait for voting delay
    const votingDelay = simnet.callReadOnlyFn(
      "governance",
      "get-voting-delay",
      [],
      deployer
    );
    const delay = parseInt(votingDelay.result.replace("u", ""));
    simnet.mineEmptyBlocks(delay + 1);

    // Vote for (1)
    const vote = simnet.callPublicFn(
      "governance",
      "cast-vote",
      [Cl.uint(1), Cl.uint(1)], // Proposal 1, vote for
      voter2
    );
    expect(vote.result).toBe("(ok true)");
  });

  it("should prevent double voting", () => {
    simnet.callPublicFn(
      "governance",
      "propose",
      [Cl.stringUtf8("Test"), Cl.stringUtf8("ipfs://test")],
      voter1
    );

    const delay = 144; // Default voting delay
    simnet.mineEmptyBlocks(delay + 1);

    // First vote
    simnet.callPublicFn(
      "governance",
      "cast-vote",
      [Cl.uint(1), Cl.uint(1)],
      voter2
    );

    // Try to vote again
    const secondVote = simnet.callPublicFn(
      "governance",
      "cast-vote",
      [Cl.uint(1), Cl.uint(1)],
      voter2
    );
    expect(secondVote.result).toContain("err");
  });

  it("should track votes correctly", () => {
    simnet.callPublicFn(
      "governance",
      "propose",
      [Cl.stringUtf8("Test"), Cl.stringUtf8("ipfs://test")],
      voter1
    );

    simnet.mineEmptyBlocks(145);

    // Vote for
    simnet.callPublicFn(
      "governance",
      "cast-vote",
      [Cl.uint(1), Cl.uint(1)],
      voter1
    );

    // Vote against
    simnet.callPublicFn(
      "governance",
      "cast-vote",
      [Cl.uint(1), Cl.uint(0)],
      voter3
    );

    const votes = simnet.callReadOnlyFn(
      "governance",
      "get-proposal-votes",
      [Cl.uint(1)],
      deployer
    );
    expect(votes.result).toContain("for:");
    expect(votes.result).toContain("against:");
  });

  it("should allow abstain votes", () => {
    simnet.callPublicFn(
      "governance",
      "propose",
      [Cl.stringUtf8("Test"), Cl.stringUtf8("ipfs://test")],
      voter1
    );

    simnet.mineEmptyBlocks(145);

    const vote = simnet.callPublicFn(
      "governance",
      "cast-vote",
      [Cl.uint(1), Cl.uint(2)], // Abstain
      voter2
    );
    expect(vote.result).toBe("(ok true)");
  });

  it("should mark proposal as succeeded with quorum", () => {
    simnet.callPublicFn(
      "governance",
      "propose",
      [Cl.stringUtf8("Test"), Cl.stringUtf8("ipfs://test")],
      voter1
    );

    simnet.mineEmptyBlocks(145);

    // Vote with enough tokens to reach quorum
    simnet.callPublicFn(
      "governance",
      "cast-vote",
      [Cl.uint(1), Cl.uint(1)],
      voter1
    );
    simnet.callPublicFn(
      "governance",
      "cast-vote",
      [Cl.uint(1), Cl.uint(1)],
      voter2
    );

    // Wait for voting period to end
    simnet.mineEmptyBlocks(1500);

    const state = simnet.callReadOnlyFn(
      "governance",
      "get-proposal-state",
      [Cl.uint(1)],
      deployer
    );
    expect(state.result).toBe("u4"); // Succeeded
  });

  it("should mark proposal as defeated without quorum", () => {
    simnet.callPublicFn(
      "governance",
      "propose",
      [Cl.stringUtf8("Test"), Cl.stringUtf8("ipfs://test")],
      voter1
    );

    simnet.mineEmptyBlocks(145);

    // Vote with insufficient tokens
    simnet.callPublicFn(
      "governance",
      "cast-vote",
      [Cl.uint(1), Cl.uint(1)],
      voter3
    );

    simnet.mineEmptyBlocks(1500);

    const state = simnet.callReadOnlyFn(
      "governance",
      "get-proposal-state",
      [Cl.uint(1)],
      deployer
    );
    expect(state.result).toBe("u3"); // Defeated
  });

  it("should allow executing succeeded proposal", () => {
    simnet.callPublicFn(
      "governance",
      "propose",
      [Cl.stringUtf8("Test"), Cl.stringUtf8("ipfs://test")],
      voter1
    );

    simnet.mineEmptyBlocks(145);

    simnet.callPublicFn("governance", "cast-vote", [Cl.uint(1), Cl.uint(1)], voter1);
    simnet.callPublicFn("governance", "cast-vote", [Cl.uint(1), Cl.uint(1)], voter2);

    simnet.mineEmptyBlocks(1500);

    const execute = simnet.callPublicFn(
      "governance",
      "execute-proposal",
      [Cl.uint(1)],
      deployer
    );
    expect(execute.result).toBe("(ok true)");
  });

  it("should prevent executing proposal twice", () => {
    simnet.callPublicFn(
      "governance",
      "propose",
      [Cl.stringUtf8("Test"), Cl.stringUtf8("ipfs://test")],
      voter1
    );

    simnet.mineEmptyBlocks(145);
    simnet.callPublicFn("governance", "cast-vote", [Cl.uint(1), Cl.uint(1)], voter1);
    simnet.callPublicFn("governance", "cast-vote", [Cl.uint(1), Cl.uint(1)], voter2);
    simnet.mineEmptyBlocks(1500);

    simnet.callPublicFn("governance", "execute-proposal", [Cl.uint(1)], deployer);

    const secondExecute = simnet.callPublicFn(
      "governance",
      "execute-proposal",
      [Cl.uint(1)],
      deployer
    );
    expect(secondExecute.result).toContain("err");
  });

  it("should allow proposer to cancel proposal", () => {
    simnet.callPublicFn(
      "governance",
      "propose",
      [Cl.stringUtf8("Test"), Cl.stringUtf8("ipfs://test")],
      voter1
    );

    const cancel = simnet.callPublicFn(
      "governance",
      "cancel-proposal",
      [Cl.uint(1)],
      voter1
    );
    expect(cancel.result).toBe("(ok true)");
  });

  it("should prevent non-proposer from canceling", () => {
    simnet.callPublicFn(
      "governance",
      "propose",
      [Cl.stringUtf8("Test"), Cl.stringUtf8("ipfs://test")],
      voter1
    );

    const cancel = simnet.callPublicFn(
      "governance",
      "cancel-proposal",
      [Cl.uint(1)],
      voter2
    );
    expect(cancel.result).toContain("err");
  });

  it("should allow owner to update voting parameters", () => {
    const setVotingPeriod = simnet.callPublicFn(
      "governance",
      "set-voting-period",
      [Cl.uint(2000)],
      deployer
    );
    expect(setVotingPeriod.result).toBe("(ok true)");

    const setVotingDelay = simnet.callPublicFn(
      "governance",
      "set-voting-delay",
      [Cl.uint(200)],
      deployer
    );
    expect(setVotingDelay.result).toBe("(ok true)");

    const setThreshold = simnet.callPublicFn(
      "governance",
      "set-proposal-threshold",
      [Cl.uint(2000000000)],
      deployer
    );
    expect(setThreshold.result).toBe("(ok true)");

    const setQuorum = simnet.callPublicFn(
      "governance",
      "set-quorum-votes",
      [Cl.uint(20000000000)],
      deployer
    );
    expect(setQuorum.result).toBe("(ok true)");
  });
});
