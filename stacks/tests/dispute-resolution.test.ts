import { describe, expect, it, beforeEach } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const advertiser = accounts.get("wallet_1")!;
const publisher = accounts.get("wallet_2")!;
const arbitrator = accounts.get("wallet_3")!;

describe("Dispute Resolution Tests", () => {
  beforeEach(() => {
    // Setup tokens and registrations
    simnet.callPublicFn(
      "stackads-token",
      "transfer",
      [Cl.uint(1000000000), Cl.principal(deployer), Cl.principal(advertiser), Cl.none()],
      deployer
    );
    simnet.callPublicFn(
      "stackads-token",
      "transfer",
      [Cl.uint(200000000), Cl.principal(deployer), Cl.principal(publisher), Cl.none()],
      deployer
    );

    simnet.callPublicFn(
      "ad-registry",
      "register-advertiser",
      [Cl.stringUtf8("ipfs://advertiser")],
      advertiser
    );
    simnet.callPublicFn(
      "ad-registry",
      "register-publisher",
      [Cl.stringUtf8("ipfs://publisher")],
      publisher
    );

    // Create campaign
    simnet.callPublicFn(
      "ad-treasury",
      "create-campaign",
      [
        Cl.uint(100000000),
        Cl.uint(1000),
        Cl.uint(10000),
        Cl.uint(1000),
        Cl.stringUtf8("ipfs://campaign"),
      ],
      advertiser
    );
  });

  it("should allow creating a dispute", () => {
    const dispute = simnet.callPublicFn(
      "dispute-resolution",
      "create-dispute",
      [
        Cl.uint(1), // Campaign ID
        Cl.principal(publisher),
        Cl.uint(1), // Payment dispute
        Cl.uint(10000000), // Amount disputed
        Cl.stringUtf8("Publisher claims unpaid earnings for 10k impressions"),
      ],
      advertiser
    );
    expect(dispute.result).toBe("(ok u1)"); // Dispute ID 1
  });

  it("should allow publisher to create dispute", () => {
    const dispute = simnet.callPublicFn(
      "dispute-resolution",
      "create-dispute",
      [
        Cl.uint(1),
        Cl.principal(advertiser),
        Cl.uint(2), // Fraud dispute
        Cl.uint(5000000),
        Cl.stringUtf8("Advertiser refusing to pay for valid impressions"),
      ],
      publisher
    );
    expect(dispute.result).toBe("(ok u1)");
  });

  it("should validate dispute type", () => {
    const dispute = simnet.callPublicFn(
      "dispute-resolution",
      "create-dispute",
      [
        Cl.uint(1),
        Cl.principal(publisher),
        Cl.uint(5), // Invalid type
        Cl.uint(10000000),
        Cl.stringUtf8("Test"),
      ],
      advertiser
    );
    expect(dispute.result).toContain("err");
  });

  it("should allow parties to submit evidence", () => {
    // Create dispute
    simnet.callPublicFn(
      "dispute-resolution",
      "create-dispute",
      [
        Cl.uint(1),
        Cl.principal(publisher),
        Cl.uint(1),
        Cl.uint(10000000),
        Cl.stringUtf8("Payment dispute"),
      ],
      advertiser
    );

    const evidenceHash = new Uint8Array(32).fill(1);

    const submit = simnet.callPublicFn(
      "dispute-resolution",
      "submit-evidence",
      [
        Cl.uint(1), // Dispute ID
        Cl.stringUtf8("ipfs://evidence-screenshot"),
        Cl.buffer(evidenceHash),
        Cl.stringUtf8("Screenshot of analytics dashboard showing impressions"),
      ],
      advertiser
    );
    expect(submit.result).toBe("(ok u1)"); // Evidence ID 1
  });

  it("should allow respondent to submit evidence", () => {
    simnet.callPublicFn(
      "dispute-resolution",
      "create-dispute",
      [Cl.uint(1), Cl.principal(publisher), Cl.uint(1), Cl.uint(10000000), Cl.stringUtf8("Test")],
      advertiser
    );

    const evidenceHash = new Uint8Array(32).fill(2);

    const submit = simnet.callPublicFn(
      "dispute-resolution",
      "submit-evidence",
      [
        Cl.uint(1),
        Cl.stringUtf8("ipfs://counter-evidence"),
        Cl.buffer(evidenceHash),
        Cl.stringUtf8("Payment transaction proof"),
      ],
      publisher
    );
    expect(submit.result).toBe("(ok u2)"); // Evidence ID 2
  });

  it("should prevent non-parties from submitting evidence", () => {
    simnet.callPublicFn(
      "dispute-resolution",
      "create-dispute",
      [Cl.uint(1), Cl.principal(publisher), Cl.uint(1), Cl.uint(10000000), Cl.stringUtf8("Test")],
      advertiser
    );

    const evidenceHash = new Uint8Array(32).fill(1);

    const submit = simnet.callPublicFn(
      "dispute-resolution",
      "submit-evidence",
      [Cl.uint(1), Cl.stringUtf8("ipfs://evidence"), Cl.buffer(evidenceHash), Cl.stringUtf8("Test")],
      arbitrator // Not a party to the dispute
    );
    expect(submit.result).toContain("err");
  });

  it("should allow owner to add arbitrator", () => {
    const add = simnet.callPublicFn(
      "dispute-resolution",
      "add-arbitrator",
      [Cl.principal(arbitrator)],
      deployer
    );
    expect(add.result).toBe("(ok true)");

    const isArbitrator = simnet.callReadOnlyFn(
      "dispute-resolution",
      "is-arbitrator",
      [Cl.principal(arbitrator)],
      deployer
    );
    expect(isArbitrator.result).toBe("true");
  });

  it("should allow owner to assign arbitrator to dispute", () => {
    simnet.callPublicFn(
      "dispute-resolution",
      "create-dispute",
      [Cl.uint(1), Cl.principal(publisher), Cl.uint(1), Cl.uint(10000000), Cl.stringUtf8("Test")],
      advertiser
    );

    simnet.callPublicFn(
      "dispute-resolution",
      "add-arbitrator",
      [Cl.principal(arbitrator)],
      deployer
    );

    const assign = simnet.callPublicFn(
      "dispute-resolution",
      "assign-arbitrator",
      [Cl.uint(1), Cl.principal(arbitrator)],
      deployer
    );
    expect(assign.result).toBe("(ok true)");
  });

  it("should update arbitrator stats when assigned", () => {
    simnet.callPublicFn(
      "dispute-resolution",
      "create-dispute",
      [Cl.uint(1), Cl.principal(publisher), Cl.uint(1), Cl.uint(10000000), Cl.stringUtf8("Test")],
      advertiser
    );

    simnet.callPublicFn(
      "dispute-resolution",
      "add-arbitrator",
      [Cl.principal(arbitrator)],
      deployer
    );

    simnet.callPublicFn(
      "dispute-resolution",
      "assign-arbitrator",
      [Cl.uint(1), Cl.principal(arbitrator)],
      deployer
    );

    const stats = simnet.callReadOnlyFn(
      "dispute-resolution",
      "get-arbitrator-stats",
      [Cl.principal(arbitrator)],
      deployer
    );
    expect(stats.result).toContain("cases-handled: u1");
  });

  it("should allow arbitrator to vote on dispute", () => {
    simnet.callPublicFn(
      "dispute-resolution",
      "create-dispute",
      [Cl.uint(1), Cl.principal(publisher), Cl.uint(1), Cl.uint(10000000), Cl.stringUtf8("Test")],
      advertiser
    );

    simnet.callPublicFn("dispute-resolution", "add-arbitrator", [Cl.principal(arbitrator)], deployer);
    simnet.callPublicFn("dispute-resolution", "assign-arbitrator", [Cl.uint(1), Cl.principal(arbitrator)], deployer);

    const vote = simnet.callPublicFn(
      "dispute-resolution",
      "vote-on-dispute",
      [
        Cl.uint(1),
        Cl.uint(3), // Vote for advertiser
        Cl.stringUtf8("Evidence supports advertiser's claim"),
      ],
      arbitrator
    );
    expect(vote.result).toBe("(ok true)");
  });

  it("should validate vote options", () => {
    simnet.callPublicFn(
      "dispute-resolution",
      "create-dispute",
      [Cl.uint(1), Cl.principal(publisher), Cl.uint(1), Cl.uint(10000000), Cl.stringUtf8("Test")],
      advertiser
    );

    simnet.callPublicFn("dispute-resolution", "add-arbitrator", [Cl.principal(arbitrator)], deployer);
    simnet.callPublicFn("dispute-resolution", "assign-arbitrator", [Cl.uint(1), Cl.principal(arbitrator)], deployer);

    const vote = simnet.callPublicFn(
      "dispute-resolution",
      "vote-on-dispute",
      [Cl.uint(1), Cl.uint(7), Cl.stringUtf8("Test")], // Invalid vote
      arbitrator
    );
    expect(vote.result).toContain("err");
  });

  it("should allow owner to resolve dispute", () => {
    simnet.callPublicFn(
      "dispute-resolution",
      "create-dispute",
      [Cl.uint(1), Cl.principal(publisher), Cl.uint(1), Cl.uint(10000000), Cl.stringUtf8("Test")],
      advertiser
    );

    simnet.callPublicFn("dispute-resolution", "add-arbitrator", [Cl.principal(arbitrator)], deployer);
    simnet.callPublicFn("dispute-resolution", "assign-arbitrator", [Cl.uint(1), Cl.principal(arbitrator)], deployer);

    const resolve = simnet.callPublicFn(
      "dispute-resolution",
      "resolve-dispute",
      [
        Cl.uint(1),
        Cl.uint(3), // Resolved in favor of advertiser
        Cl.stringUtf8("After reviewing evidence, advertiser's claim is valid"),
      ],
      deployer
    );
    expect(resolve.result).toBe("(ok true)");
  });

  it("should update arbitrator stats when dispute resolved", () => {
    simnet.callPublicFn(
      "dispute-resolution",
      "create-dispute",
      [Cl.uint(1), Cl.principal(publisher), Cl.uint(1), Cl.uint(10000000), Cl.stringUtf8("Test")],
      advertiser
    );

    simnet.callPublicFn("dispute-resolution", "add-arbitrator", [Cl.principal(arbitrator)], deployer);
    simnet.callPublicFn("dispute-resolution", "assign-arbitrator", [Cl.uint(1), Cl.principal(arbitrator)], deployer);
    simnet.callPublicFn("dispute-resolution", "resolve-dispute", [Cl.uint(1), Cl.uint(3), Cl.stringUtf8("Test")], deployer);

    const stats = simnet.callReadOnlyFn(
      "dispute-resolution",
      "get-arbitrator-stats",
      [Cl.principal(arbitrator)],
      deployer
    );
    expect(stats.result).toContain("cases-resolved: u1");
  });

  it("should allow parties to appeal resolution", () => {
    simnet.callPublicFn(
      "dispute-resolution",
      "create-dispute",
      [Cl.uint(1), Cl.principal(publisher), Cl.uint(1), Cl.uint(10000000), Cl.stringUtf8("Test")],
      advertiser
    );

    simnet.callPublicFn("dispute-resolution", "add-arbitrator", [Cl.principal(arbitrator)], deployer);
    simnet.callPublicFn("dispute-resolution", "assign-arbitrator", [Cl.uint(1), Cl.principal(arbitrator)], deployer);
    simnet.callPublicFn("dispute-resolution", "resolve-dispute", [Cl.uint(1), Cl.uint(3), Cl.stringUtf8("Test")], deployer);

    const appeal = simnet.callPublicFn(
      "dispute-resolution",
      "appeal-resolution",
      [Cl.uint(1), Cl.stringUtf8("New evidence has emerged that changes the case")],
      publisher
    );
    expect(appeal.result).toBe("(ok true)");
  });

  it("should allow owner to remove arbitrator", () => {
    simnet.callPublicFn("dispute-resolution", "add-arbitrator", [Cl.principal(arbitrator)], deployer);

    const remove = simnet.callPublicFn(
      "dispute-resolution",
      "remove-arbitrator",
      [Cl.principal(arbitrator)],
      deployer
    );
    expect(remove.result).toBe("(ok true)");

    const isArbitrator = simnet.callReadOnlyFn(
      "dispute-resolution",
      "is-arbitrator",
      [Cl.principal(arbitrator)],
      deployer
    );
    expect(isArbitrator.result).toBe("false");
  });

  it("should allow owner to update arbitrator reputation", () => {
    simnet.callPublicFn("dispute-resolution", "add-arbitrator", [Cl.principal(arbitrator)], deployer);
    
    // Assign to create stats
    simnet.callPublicFn(
      "dispute-resolution",
      "create-dispute",
      [Cl.uint(1), Cl.principal(publisher), Cl.uint(1), Cl.uint(10000000), Cl.stringUtf8("Test")],
      advertiser
    );
    simnet.callPublicFn("dispute-resolution", "assign-arbitrator", [Cl.uint(1), Cl.principal(arbitrator)], deployer);

    const update = simnet.callPublicFn(
      "dispute-resolution",
      "update-arbitrator-reputation",
      [Cl.principal(arbitrator), Cl.uint(850)],
      deployer
    );
    expect(update.result).toContain("ok");
  });

  it("should get dispute summary", () => {
    simnet.callPublicFn(
      "dispute-resolution",
      "create-dispute",
      [Cl.uint(1), Cl.principal(publisher), Cl.uint(1), Cl.uint(10000000), Cl.stringUtf8("Test")],
      advertiser
    );

    const summary = simnet.callReadOnlyFn(
      "dispute-resolution",
      "get-dispute-summary",
      [Cl.uint(1)],
      deployer
    );
    expect(summary.result).toContain("type:");
    expect(summary.result).toContain("amount:");
    expect(summary.result).toContain("status:");
    expect(summary.result).toContain("evidence-count:");
  });

  it("should track evidence count", () => {
    simnet.callPublicFn(
      "dispute-resolution",
      "create-dispute",
      [Cl.uint(1), Cl.principal(publisher), Cl.uint(1), Cl.uint(10000000), Cl.stringUtf8("Test")],
      advertiser
    );

    const evidenceHash = new Uint8Array(32).fill(1);
    simnet.callPublicFn(
      "dispute-resolution",
      "submit-evidence",
      [Cl.uint(1), Cl.stringUtf8("ipfs://evidence1"), Cl.buffer(evidenceHash), Cl.stringUtf8("Evidence 1")],
      advertiser
    );
    simnet.callPublicFn(
      "dispute-resolution",
      "submit-evidence",
      [Cl.uint(1), Cl.stringUtf8("ipfs://evidence2"), Cl.buffer(evidenceHash), Cl.stringUtf8("Evidence 2")],
      publisher
    );

    const count = simnet.callReadOnlyFn(
      "dispute-resolution",
      "get-evidence-count",
      [Cl.uint(1)],
      deployer
    );
    expect(count.result).toBe("u2");
  });
});
