import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

describe("StackAds Token Tests", () => {
  it("should have correct token metadata", () => {
    const name = simnet.callReadOnlyFn(
      "stackads-token",
      "get-name",
      [],
      deployer
    );
    expect(name.result).toBe('(ok "StackAds Token")');

    const symbol = simnet.callReadOnlyFn(
      "stackads-token",
      "get-symbol",
      [],
      deployer
    );
    expect(symbol.result).toBe('(ok "SADS")');

    const decimals = simnet.callReadOnlyFn(
      "stackads-token",
      "get-decimals",
      [],
      deployer
    );
    expect(decimals.result).toBe("(ok u6)");
  });

  it("should mint initial supply to deployer", () => {
    const balance = simnet.callReadOnlyFn(
      "stackads-token",
      "get-balance",
      [Cl.principal(deployer)],
      deployer
    );
    expect(balance.result).toBe("(ok u100000000000000)"); // 100M tokens
  });

  it("should allow token transfers", () => {
    const transfer = simnet.callPublicFn(
      "stackads-token",
      "transfer",
      [
        Cl.uint(1000000), // 1 SADS
        Cl.principal(deployer),
        Cl.principal(wallet1),
        Cl.none(),
      ],
      deployer
    );
    expect(transfer.result).toBe("(ok true)");

    const balance = simnet.callReadOnlyFn(
      "stackads-token",
      "get-balance",
      [Cl.principal(wallet1)],
      deployer
    );
    expect(balance.result).toBe("(ok u1000000)");
  });

  it("should allow owner to mint tokens", () => {
    const mint = simnet.callPublicFn(
      "stackads-token",
      "mint",
      [Cl.uint(5000000), Cl.principal(wallet1)],
      deployer
    );
    expect(mint.result).toBe("(ok true)");
  });

  it("should prevent non-owner from minting", () => {
    const mint = simnet.callPublicFn(
      "stackads-token",
      "mint",
      [Cl.uint(5000000), Cl.principal(wallet2)],
      wallet1
    );
    expect(mint.result).toContain("err");
  });

  it("should allow token burning", () => {
    // First transfer some tokens to wallet1
    simnet.callPublicFn(
      "stackads-token",
      "transfer",
      [
        Cl.uint(10000000),
        Cl.principal(deployer),
        Cl.principal(wallet1),
        Cl.none(),
      ],
      deployer
    );

    const burn = simnet.callPublicFn(
      "stackads-token",
      "burn",
      [Cl.uint(5000000)],
      wallet1
    );
    expect(burn.result).toBe("(ok true)");
  });

  it("should enforce max supply", () => {
    const maxSupply = 1000000000000000; // 1B tokens
    const currentSupply = 100000000000000; // 100M initial
    const attemptMint = maxSupply - currentSupply + 1;

    const mint = simnet.callPublicFn(
      "stackads-token",
      "mint",
      [Cl.uint(attemptMint), Cl.principal(wallet1)],
      deployer
    );
    expect(mint.result).toContain("err");
  });
});
