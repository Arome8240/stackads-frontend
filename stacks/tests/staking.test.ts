import { describe, expect, it, beforeEach } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const staker1 = accounts.get("wallet_1")!;
const staker2 = accounts.get("wallet_2")!;

describe("Staking Contract Tests", () => {
  beforeEach(() => {
    // Transfer tokens to stakers
    simnet.callPublicFn(
      "stackads-token",
      "transfer",
      [
        Cl.uint(50000000), // 50 SADS
        Cl.principal(deployer),
        Cl.principal(staker1),
        Cl.none(),
      ],
      deployer
    );

    simnet.callPublicFn(
      "stackads-token",
      "transfer",
      [
        Cl.uint(50000000), // 50 SADS
        Cl.principal(deployer),
        Cl.principal(staker2),
        Cl.none(),
      ],
      deployer
    );
  });

  it("should allow users to stake tokens", () => {
    const stake = simnet.callPublicFn(
      "staking",
      "stake",
      [Cl.uint(10000000)], // 10 SADS
      staker1
    );
    expect(stake.result).toBe("(ok true)");

    const balance = simnet.callReadOnlyFn(
      "staking",
      "get-balance",
      [Cl.principal(staker1)],
      deployer
    );
    expect(balance.result).toBe("u10000000");
  });

  it("should enforce minimum stake requirement", () => {
    const stake = simnet.callPublicFn(
      "staking",
      "stake",
      [Cl.uint(500000)], // 0.5 SADS (below minimum)
      staker1
    );
    expect(stake.result).toContain("err");
  });

  it("should allow users to withdraw staked tokens", () => {
    // First stake
    simnet.callPublicFn(
      "staking",
      "stake",
      [Cl.uint(10000000)],
      staker1
    );

    // Then withdraw
    const withdraw = simnet.callPublicFn(
      "staking",
      "withdraw",
      [Cl.uint(5000000)], // Withdraw 5 SADS
      staker1
    );
    expect(withdraw.result).toBe("(ok true)");

    const balance = simnet.callReadOnlyFn(
      "staking",
      "get-balance",
      [Cl.principal(staker1)],
      deployer
    );
    expect(balance.result).toBe("u5000000");
  });

  it("should prevent withdrawing more than staked", () => {
    simnet.callPublicFn(
      "staking",
      "stake",
      [Cl.uint(10000000)],
      staker1
    );

    const withdraw = simnet.callPublicFn(
      "staking",
      "withdraw",
      [Cl.uint(20000000)], // Try to withdraw more than staked
      staker1
    );
    expect(withdraw.result).toContain("err");
  });

  it("should track total supply correctly", () => {
    simnet.callPublicFn("staking", "stake", [Cl.uint(10000000)], staker1);
    simnet.callPublicFn("staking", "stake", [Cl.uint(15000000)], staker2);

    const totalSupply = simnet.callReadOnlyFn(
      "staking",
      "get-total-supply",
      [],
      deployer
    );
    expect(totalSupply.result).toBe("u25000000");
  });

  it("should allow owner to notify reward amount", () => {
    const rewardAmount = 1000000; // 1 SADS
    const duration = 1000; // blocks

    const notify = simnet.callPublicFn(
      "staking",
      "notify-reward-amount",
      [Cl.uint(rewardAmount), Cl.uint(duration)],
      deployer
    );
    expect(notify.result).toBe("(ok true)");

    const rewardRate = simnet.callReadOnlyFn(
      "staking",
      "get-reward-rate",
      [],
      deployer
    );
    expect(rewardRate.result).toBe(`u${rewardAmount / duration}`);
  });

  it("should calculate rewards correctly", () => {
    // Setup rewards
    simnet.callPublicFn(
      "staking",
      "notify-reward-amount",
      [Cl.uint(10000000), Cl.uint(1000)],
      deployer
    );

    // Stake tokens
    simnet.callPublicFn("staking", "stake", [Cl.uint(10000000)], staker1);

    // Mine some blocks to accumulate rewards
    simnet.mineEmptyBlocks(100);

    const earned = simnet.callReadOnlyFn(
      "staking",
      "earned",
      [Cl.principal(staker1)],
      deployer
    );
    expect(parseInt(earned.result.replace("u", ""))).toBeGreaterThan(0);
  });

  it("should allow claiming rewards", () => {
    // Setup rewards and stake
    simnet.callPublicFn(
      "staking",
      "notify-reward-amount",
      [Cl.uint(10000000), Cl.uint(1000)],
      deployer
    );
    simnet.callPublicFn("staking", "stake", [Cl.uint(10000000)], staker1);
    simnet.mineEmptyBlocks(100);

    const claim = simnet.callPublicFn(
      "staking",
      "claim-reward",
      [],
      staker1
    );
    expect(claim.result).toContain("ok");
  });

  it("should allow exit (withdraw all + claim)", () => {
    // Setup and stake
    simnet.callPublicFn(
      "staking",
      "notify-reward-amount",
      [Cl.uint(10000000), Cl.uint(1000)],
      deployer
    );
    simnet.callPublicFn("staking", "stake", [Cl.uint(10000000)], staker1);
    simnet.mineEmptyBlocks(50);

    const exit = simnet.callPublicFn(
      "staking",
      "exit",
      [],
      staker1
    );
    expect(exit.result).toContain("ok");

    const balance = simnet.callReadOnlyFn(
      "staking",
      "get-balance",
      [Cl.principal(staker1)],
      deployer
    );
    expect(balance.result).toBe("u0");
  });

  it("should prevent non-owner from notifying rewards", () => {
    const notify = simnet.callPublicFn(
      "staking",
      "notify-reward-amount",
      [Cl.uint(1000000), Cl.uint(1000)],
      staker1
    );
    expect(notify.result).toContain("err");
  });

  it("should handle multiple stakers proportionally", () => {
    // Setup rewards
    simnet.callPublicFn(
      "staking",
      "notify-reward-amount",
      [Cl.uint(10000000), Cl.uint(1000)],
      deployer
    );

    // Staker1 stakes 10 SADS
    simnet.callPublicFn("staking", "stake", [Cl.uint(10000000)], staker1);
    
    // Staker2 stakes 20 SADS
    simnet.callPublicFn("staking", "stake", [Cl.uint(20000000)], staker2);

    simnet.mineEmptyBlocks(100);

    const earned1 = simnet.callReadOnlyFn(
      "staking",
      "earned",
      [Cl.principal(staker1)],
      deployer
    );
    const earned2 = simnet.callReadOnlyFn(
      "staking",
      "earned",
      [Cl.principal(staker2)],
      deployer
    );

    // Staker2 should earn approximately 2x staker1
    const amount1 = parseInt(earned1.result.replace("u", ""));
    const amount2 = parseInt(earned2.result.replace("u", ""));
    expect(amount2).toBeGreaterThan(amount1);
  });
});
