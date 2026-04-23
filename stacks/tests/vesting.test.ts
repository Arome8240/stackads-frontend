import { describe, expect, it, beforeEach } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const beneficiary1 = accounts.get("wallet_1")!;
const beneficiary2 = accounts.get("wallet_2")!;

describe("Vesting Contract Tests", () => {
  it("should allow owner to create vesting schedule", () => {
    const create = simnet.callPublicFn(
      "vesting",
      "create-vesting-schedule",
      [
        Cl.principal(beneficiary1),
        Cl.uint(100000000), // 100 SADS
        Cl.uint(100), // Cliff duration
        Cl.uint(1000), // Vesting duration
        Cl.bool(true), // Revocable
      ],
      deployer
    );
    expect(create.result).toBe("(ok true)");
  });

  it("should prevent duplicate vesting schedules", () => {
    simnet.callPublicFn(
      "vesting",
      "create-vesting-schedule",
      [
        Cl.principal(beneficiary1),
        Cl.uint(100000000),
        Cl.uint(100),
        Cl.uint(1000),
        Cl.bool(true),
      ],
      deployer
    );

    const duplicate = simnet.callPublicFn(
      "vesting",
      "create-vesting-schedule",
      [
        Cl.principal(beneficiary1),
        Cl.uint(50000000),
        Cl.uint(50),
        Cl.uint(500),
        Cl.bool(false),
      ],
      deployer
    );
    expect(duplicate.result).toContain("err");
  });

  it("should calculate releasable amount correctly before cliff", () => {
    simnet.callPublicFn(
      "vesting",
      "create-vesting-schedule",
      [
        Cl.principal(beneficiary1),
        Cl.uint(100000000),
        Cl.uint(100),
        Cl.uint(1000),
        Cl.bool(true),
      ],
      deployer
    );

    // Before cliff
    const releasable = simnet.callReadOnlyFn(
      "vesting",
      "compute-releasable-amount",
      [Cl.principal(beneficiary1)],
      deployer
    );
    expect(releasable.result).toBe("u0");
  });

  it("should calculate releasable amount correctly after cliff", () => {
    simnet.callPublicFn(
      "vesting",
      "create-vesting-schedule",
      [
        Cl.principal(beneficiary1),
        Cl.uint(100000000),
        Cl.uint(100),
        Cl.uint(1000),
        Cl.bool(true),
      ],
      deployer
    );

    // Mine blocks past cliff
    simnet.mineEmptyBlocks(150);

    const releasable = simnet.callReadOnlyFn(
      "vesting",
      "compute-releasable-amount",
      [Cl.principal(beneficiary1)],
      deployer
    );
    const amount = parseInt(releasable.result.replace("u", ""));
    expect(amount).toBeGreaterThan(0);
  });

  it("should allow beneficiary to release vested tokens", () => {
    simnet.callPublicFn(
      "vesting",
      "create-vesting-schedule",
      [
        Cl.principal(beneficiary1),
        Cl.uint(100000000),
        Cl.uint(100),
        Cl.uint(1000),
        Cl.bool(true),
      ],
      deployer
    );

    simnet.mineEmptyBlocks(150);

    const release = simnet.callPublicFn(
      "vesting",
      "release",
      [],
      beneficiary1
    );
    expect(release.result).toContain("ok");
  });

  it("should prevent releasing before cliff", () => {
    simnet.callPublicFn(
      "vesting",
      "create-vesting-schedule",
      [
        Cl.principal(beneficiary1),
        Cl.uint(100000000),
        Cl.uint(100),
        Cl.uint(1000),
        Cl.bool(true),
      ],
      deployer
    );

    const release = simnet.callPublicFn(
      "vesting",
      "release",
      [],
      beneficiary1
    );
    expect(release.result).toContain("err");
  });

  it("should calculate vested amount linearly", () => {
    simnet.callPublicFn(
      "vesting",
      "create-vesting-schedule",
      [
        Cl.principal(beneficiary1),
        Cl.uint(1000000000), // 1000 SADS
        Cl.uint(100),
        Cl.uint(1000),
        Cl.bool(true),
      ],
      deployer
    );

    // At 50% of vesting period
    simnet.mineEmptyBlocks(500);

    const vested = simnet.callReadOnlyFn(
      "vesting",
      "get-vested-amount",
      [Cl.principal(beneficiary1)],
      deployer
    );
    const amount = parseInt(vested.result.replace("u", ""));
    // Should be approximately 50% vested
    expect(amount).toBeGreaterThan(400000000);
    expect(amount).toBeLessThan(600000000);
  });

  it("should allow owner to revoke revocable schedule", () => {
    simnet.callPublicFn(
      "vesting",
      "create-vesting-schedule",
      [
        Cl.principal(beneficiary1),
        Cl.uint(100000000),
        Cl.uint(100),
        Cl.uint(1000),
        Cl.bool(true), // Revocable
      ],
      deployer
    );

    simnet.mineEmptyBlocks(150);

    const revoke = simnet.callPublicFn(
      "vesting",
      "revoke",
      [Cl.principal(beneficiary1)],
      deployer
    );
    expect(revoke.result).toContain("ok");
  });

  it("should prevent revoking non-revocable schedule", () => {
    simnet.callPublicFn(
      "vesting",
      "create-vesting-schedule",
      [
        Cl.principal(beneficiary1),
        Cl.uint(100000000),
        Cl.uint(100),
        Cl.uint(1000),
        Cl.bool(false), // Non-revocable
      ],
      deployer
    );

    const revoke = simnet.callPublicFn(
      "vesting",
      "revoke",
      [Cl.principal(beneficiary1)],
      deployer
    );
    expect(revoke.result).toContain("err");
  });

  it("should release vested tokens before revoking", () => {
    simnet.callPublicFn(
      "vesting",
      "create-vesting-schedule",
      [
        Cl.principal(beneficiary1),
        Cl.uint(100000000),
        Cl.uint(100),
        Cl.uint(1000),
        Cl.bool(true),
      ],
      deployer
    );

    simnet.mineEmptyBlocks(200);

    const revoke = simnet.callPublicFn(
      "vesting",
      "revoke",
      [Cl.principal(beneficiary1)],
      deployer
    );
    expect(revoke.result).toContain("ok");
  });

  it("should allow owner to update beneficiary", () => {
    simnet.callPublicFn(
      "vesting",
      "create-vesting-schedule",
      [
        Cl.principal(beneficiary1),
        Cl.uint(100000000),
        Cl.uint(100),
        Cl.uint(1000),
        Cl.bool(true),
      ],
      deployer
    );

    const update = simnet.callPublicFn(
      "vesting",
      "update-beneficiary",
      [Cl.principal(beneficiary1), Cl.principal(beneficiary2)],
      deployer
    );
    expect(update.result).toBe("(ok true)");

    // Check new beneficiary has schedule
    const hasSchedule = simnet.callReadOnlyFn(
      "vesting",
      "has-schedule",
      [Cl.principal(beneficiary2)],
      deployer
    );
    expect(hasSchedule.result).toBe("true");
  });

  it("should prevent non-owner from creating schedule", () => {
    const create = simnet.callPublicFn(
      "vesting",
      "create-vesting-schedule",
      [
        Cl.principal(beneficiary2),
        Cl.uint(100000000),
        Cl.uint(100),
        Cl.uint(1000),
        Cl.bool(true),
      ],
      beneficiary1
    );
    expect(create.result).toContain("err");
  });

  it("should get complete schedule info", () => {
    simnet.callPublicFn(
      "vesting",
      "create-vesting-schedule",
      [
        Cl.principal(beneficiary1),
        Cl.uint(100000000),
        Cl.uint(100),
        Cl.uint(1000),
        Cl.bool(true),
      ],
      deployer
    );

    simnet.mineEmptyBlocks(150);

    const info = simnet.callReadOnlyFn(
      "vesting",
      "get-schedule-info",
      [Cl.principal(beneficiary1)],
      deployer
    );
    expect(info.result).toContain("total:");
    expect(info.result).toContain("vested:");
    expect(info.result).toContain("releasable:");
  });

  it("should allow release-for by anyone", () => {
    simnet.callPublicFn(
      "vesting",
      "create-vesting-schedule",
      [
        Cl.principal(beneficiary1),
        Cl.uint(100000000),
        Cl.uint(100),
        Cl.uint(1000),
        Cl.bool(true),
      ],
      deployer
    );

    simnet.mineEmptyBlocks(150);

    const releaseFor = simnet.callPublicFn(
      "vesting",
      "release-for",
      [Cl.principal(beneficiary1)],
      beneficiary2 // Different user releasing for beneficiary1
    );
    expect(releaseFor.result).toContain("ok");
  });

  it("should handle full vesting period", () => {
    simnet.callPublicFn(
      "vesting",
      "create-vesting-schedule",
      [
        Cl.principal(beneficiary1),
        Cl.uint(100000000),
        Cl.uint(100),
        Cl.uint(1000),
        Cl.bool(true),
      ],
      deployer
    );

    // Mine blocks past full vesting period
    simnet.mineEmptyBlocks(1100);

    const vested = simnet.callReadOnlyFn(
      "vesting",
      "get-vested-amount",
      [Cl.principal(beneficiary1)],
      deployer
    );
    expect(vested.result).toBe("u100000000"); // Fully vested
  });
});
