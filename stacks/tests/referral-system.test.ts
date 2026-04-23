import { describe, expect, it, beforeEach } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const referrer = accounts.get("wallet_1")!;
const referee1 = accounts.get("wallet_2")!;
const referee2 = accounts.get("wallet_3")!;

describe("Referral System Tests", () => {
  it("should allow creating referral code", () => {
    const create = simnet.callPublicFn(
      "referral-system",
      "create-referral-code",
      [Cl.stringAscii("REF123")],
      referrer
    );
    expect(create.result).toBe("(ok true)");
  });

  it("should prevent creating duplicate referral codes", () => {
    simnet.callPublicFn(
      "referral-system",
      "create-referral-code",
      [Cl.stringAscii("REF123")],
      referrer
    );

    const duplicate = simnet.callPublicFn(
      "referral-system",
      "create-referral-code",
      [Cl.stringAscii("REF123")],
      referee1
    );
    expect(duplicate.result).toContain("err");
  });

  it("should prevent creating short referral codes", () => {
    const create = simnet.callPublicFn(
      "referral-system",
      "create-referral-code",
      [Cl.stringAscii("AB")], // Too short
      referrer
    );
    expect(create.result).toContain("err");
  });

  it("should allow using referral code", () => {
    simnet.callPublicFn(
      "referral-system",
      "create-referral-code",
      [Cl.stringAscii("REF123")],
      referrer
    );

    const use = simnet.callPublicFn(
      "referral-system",
      "use-referral-code",
      [Cl.stringAscii("REF123")],
      referee1
    );
    expect(use.result).toBe("(ok true)");
  });

  it("should prevent self-referral", () => {
    simnet.callPublicFn(
      "referral-system",
      "create-referral-code",
      [Cl.stringAscii("REF123")],
      referrer
    );

    const selfRef = simnet.callPublicFn(
      "referral-system",
      "use-referral-code",
      [Cl.stringAscii("REF123")],
      referrer
    );
    expect(selfRef.result).toContain("err");
  });

  it("should prevent using referral code twice", () => {
    simnet.callPublicFn(
      "referral-system",
      "create-referral-code",
      [Cl.stringAscii("REF123")],
      referrer
    );

    simnet.callPublicFn(
      "referral-system",
      "use-referral-code",
      [Cl.stringAscii("REF123")],
      referee1
    );

    const secondUse = simnet.callPublicFn(
      "referral-system",
      "use-referral-code",
      [Cl.stringAscii("REF456")],
      referee1
    );
    expect(secondUse.result).toContain("err");
  });

  it("should update referrer stats when code is used", () => {
    simnet.callPublicFn(
      "referral-system",
      "create-referral-code",
      [Cl.stringAscii("REF123")],
      referrer
    );

    simnet.callPublicFn(
      "referral-system",
      "use-referral-code",
      [Cl.stringAscii("REF123")],
      referee1
    );

    const stats = simnet.callReadOnlyFn(
      "referral-system",
      "get-referral-stats",
      [Cl.principal(referrer)],
      deployer
    );
    expect(stats.result).toContain("total-referrals: u1");
  });

  it("should calculate tier correctly", () => {
    const bronzeTier = simnet.callReadOnlyFn(
      "referral-system",
      "calculate-tier",
      [Cl.uint(5)],
      deployer
    );
    expect(bronzeTier.result).toBe("u1"); // Bronze

    const silverTier = simnet.callReadOnlyFn(
      "referral-system",
      "calculate-tier",
      [Cl.uint(15)],
      deployer
    );
    expect(silverTier.result).toBe("u2"); // Silver

    const goldTier = simnet.callReadOnlyFn(
      "referral-system",
      "calculate-tier",
      [Cl.uint(60)],
      deployer
    );
    expect(goldTier.result).toBe("u3"); // Gold

    const platinumTier = simnet.callReadOnlyFn(
      "referral-system",
      "calculate-tier",
      [Cl.uint(150)],
      deployer
    );
    expect(platinumTier.result).toBe("u4"); // Platinum
  });

  it("should upgrade tier with more referrals", () => {
    simnet.callPublicFn(
      "referral-system",
      "create-referral-code",
      [Cl.stringAscii("REF123")],
      referrer
    );

    // Add multiple referrals
    for (let i = 0; i < 12; i++) {
      const wallet = accounts.get(`wallet_${i + 2}`)!;
      simnet.callPublicFn(
        "referral-system",
        "use-referral-code",
        [Cl.stringAscii("REF123")],
        wallet
      );
    }

    const stats = simnet.callReadOnlyFn(
      "referral-system",
      "get-referral-stats",
      [Cl.principal(referrer)],
      deployer
    );
    expect(stats.result).toContain("tier: u2"); // Should be Silver
  });

  it("should allow owner to record referral activity", () => {
    simnet.callPublicFn(
      "referral-system",
      "create-referral-code",
      [Cl.stringAscii("REF123")],
      referrer
    );

    simnet.callPublicFn(
      "referral-system",
      "use-referral-code",
      [Cl.stringAscii("REF123")],
      referee1
    );

    const record = simnet.callPublicFn(
      "referral-system",
      "record-referral-activity",
      [Cl.principal(referee1), Cl.uint(20000000)], // 20 SADS activity
      deployer
    );
    expect(record.result).toBe("(ok true)");
  });

  it("should enforce minimum activity threshold", () => {
    simnet.callPublicFn(
      "referral-system",
      "create-referral-code",
      [Cl.stringAscii("REF123")],
      referrer
    );

    simnet.callPublicFn(
      "referral-system",
      "use-referral-code",
      [Cl.stringAscii("REF123")],
      referee1
    );

    const record = simnet.callPublicFn(
      "referral-system",
      "record-referral-activity",
      [Cl.principal(referee1), Cl.uint(5000000)], // Below threshold
      deployer
    );
    expect(record.result).toContain("err");
  });

  it("should calculate rewards based on tier", () => {
    const bronzeRewards = simnet.callReadOnlyFn(
      "referral-system",
      "calculate-referral-rewards",
      [Cl.uint(1), Cl.uint(100000000)], // Bronze tier, 100 SADS activity
      deployer
    );
    expect(bronzeRewards.result).toContain("referrer-reward:");
    expect(bronzeRewards.result).toContain("referee-reward:");
  });

  it("should allow referrer to claim rewards", () => {
    // Setup referral and activity
    simnet.callPublicFn(
      "referral-system",
      "create-referral-code",
      [Cl.stringAscii("REF123")],
      referrer
    );

    simnet.callPublicFn(
      "referral-system",
      "use-referral-code",
      [Cl.stringAscii("REF123")],
      referee1
    );

    simnet.callPublicFn(
      "referral-system",
      "record-referral-activity",
      [Cl.principal(referee1), Cl.uint(20000000)],
      deployer
    );

    const claim = simnet.callPublicFn(
      "referral-system",
      "claim-referral-rewards",
      [Cl.principal(referee1)],
      referrer
    );
    expect(claim.result).toContain("ok");
  });

  it("should allow referee to claim bonus", () => {
    simnet.callPublicFn(
      "referral-system",
      "create-referral-code",
      [Cl.stringAscii("REF123")],
      referrer
    );

    simnet.callPublicFn(
      "referral-system",
      "use-referral-code",
      [Cl.stringAscii("REF123")],
      referee1
    );

    simnet.callPublicFn(
      "referral-system",
      "record-referral-activity",
      [Cl.principal(referee1), Cl.uint(20000000)],
      deployer
    );

    const claim = simnet.callPublicFn(
      "referral-system",
      "claim-referee-bonus",
      [Cl.principal(referrer)],
      referee1
    );
    expect(claim.result).toContain("ok");
  });

  it("should prevent claiming rewards twice", () => {
    simnet.callPublicFn(
      "referral-system",
      "create-referral-code",
      [Cl.stringAscii("REF123")],
      referrer
    );

    simnet.callPublicFn(
      "referral-system",
      "use-referral-code",
      [Cl.stringAscii("REF123")],
      referee1
    );

    simnet.callPublicFn(
      "referral-system",
      "record-referral-activity",
      [Cl.principal(referee1), Cl.uint(20000000)],
      deployer
    );

    simnet.callPublicFn(
      "referral-system",
      "claim-referral-rewards",
      [Cl.principal(referee1)],
      referrer
    );

    const secondClaim = simnet.callPublicFn(
      "referral-system",
      "claim-referral-rewards",
      [Cl.principal(referee1)],
      referrer
    );
    expect(secondClaim.result).toContain("err");
  });

  it("should allow owner to update referral bonus", () => {
    const update = simnet.callPublicFn(
      "referral-system",
      "set-referral-bonus",
      [Cl.uint(10000000)], // 10 SADS
      deployer
    );
    expect(update.result).toBe("(ok true)");
  });

  it("should allow owner to update activity threshold", () => {
    const update = simnet.callPublicFn(
      "referral-system",
      "set-activity-threshold",
      [Cl.uint(15000000)], // 15 SADS
      deployer
    );
    expect(update.result).toBe("(ok true)");
  });

  it("should allow owner to update tier config", () => {
    const update = simnet.callPublicFn(
      "referral-system",
      "update-tier-config",
      [
        Cl.uint(2), // Silver tier
        Cl.uint(15), // Min referrals
        Cl.uint(1000), // Referrer bonus bps
        Cl.uint(500), // Referee bonus bps
      ],
      deployer
    );
    expect(update.result).toBe("(ok true)");
  });

  it("should allow owner to deactivate referral code", () => {
    simnet.callPublicFn(
      "referral-system",
      "create-referral-code",
      [Cl.stringAscii("REF123")],
      referrer
    );

    const deactivate = simnet.callPublicFn(
      "referral-system",
      "deactivate-referral-code",
      [Cl.stringAscii("REF123")],
      deployer
    );
    expect(deactivate.result).toBe("(ok true)");
  });

  it("should prevent using deactivated code", () => {
    simnet.callPublicFn(
      "referral-system",
      "create-referral-code",
      [Cl.stringAscii("REF123")],
      referrer
    );

    simnet.callPublicFn(
      "referral-system",
      "deactivate-referral-code",
      [Cl.stringAscii("REF123")],
      deployer
    );

    const use = simnet.callPublicFn(
      "referral-system",
      "use-referral-code",
      [Cl.stringAscii("REF123")],
      referee1
    );
    expect(use.result).toContain("err");
  });
});
