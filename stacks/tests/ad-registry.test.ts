import { describe, expect, it, beforeEach } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const publisher = accounts.get("wallet_1")!;
const advertiser = accounts.get("wallet_2")!;

describe("Ad Registry Tests", () => {
  beforeEach(() => {
    // Transfer tokens to publisher and advertiser for staking
    simnet.callPublicFn(
      "stackads-token",
      "transfer",
      [
        Cl.uint(200000000), // 200 SADS
        Cl.principal(deployer),
        Cl.principal(publisher),
        Cl.none(),
      ],
      deployer
    );

    simnet.callPublicFn(
      "stackads-token",
      "transfer",
      [
        Cl.uint(600000000), // 600 SADS
        Cl.principal(deployer),
        Cl.principal(advertiser),
        Cl.none(),
      ],
      deployer
    );
  });

  it("should allow publisher registration", () => {
    const register = simnet.callPublicFn(
      "ad-registry",
      "register-publisher",
      [Cl.stringUtf8("ipfs://publisher-metadata")],
      publisher
    );
    expect(register.result).toBe("(ok true)");

    const isActive = simnet.callReadOnlyFn(
      "ad-registry",
      "is-active-publisher",
      [Cl.principal(publisher)],
      deployer
    );
    expect(isActive.result).toBe("true");
  });

  it("should allow advertiser registration", () => {
    const register = simnet.callPublicFn(
      "ad-registry",
      "register-advertiser",
      [Cl.stringUtf8("ipfs://advertiser-metadata")],
      advertiser
    );
    expect(register.result).toBe("(ok true)");

    const isActive = simnet.callReadOnlyFn(
      "ad-registry",
      "is-active-advertiser",
      [Cl.principal(advertiser)],
      deployer
    );
    expect(isActive.result).toBe("true");
  });

  it("should prevent duplicate registration", () => {
    simnet.callPublicFn(
      "ad-registry",
      "register-publisher",
      [Cl.stringUtf8("ipfs://publisher-metadata")],
      publisher
    );

    const duplicate = simnet.callPublicFn(
      "ad-registry",
      "register-publisher",
      [Cl.stringUtf8("ipfs://publisher-metadata-2")],
      publisher
    );
    expect(duplicate.result).toContain("err");
  });

  it("should allow metadata updates", () => {
    simnet.callPublicFn(
      "ad-registry",
      "register-publisher",
      [Cl.stringUtf8("ipfs://publisher-metadata")],
      publisher
    );

    const update = simnet.callPublicFn(
      "ad-registry",
      "update-metadata",
      [Cl.stringUtf8("ipfs://new-metadata")],
      publisher
    );
    expect(update.result).toBe("(ok true)");
  });

  it("should allow owner to update reputation", () => {
    simnet.callPublicFn(
      "ad-registry",
      "register-publisher",
      [Cl.stringUtf8("ipfs://publisher-metadata")],
      publisher
    );

    const updateRep = simnet.callPublicFn(
      "ad-registry",
      "update-reputation",
      [Cl.principal(publisher), Cl.uint(800)],
      deployer
    );
    expect(updateRep.result).toBe("(ok true)");
  });

  it("should allow owner to record stats", () => {
    simnet.callPublicFn(
      "ad-registry",
      "register-publisher",
      [Cl.stringUtf8("ipfs://publisher-metadata")],
      publisher
    );

    const recordStats = simnet.callPublicFn(
      "ad-registry",
      "record-stats",
      [Cl.principal(publisher), Cl.uint(10000), Cl.uint(500)],
      deployer
    );
    expect(recordStats.result).toBe("(ok true)");
  });

  it("should calculate CTR correctly", () => {
    simnet.callPublicFn(
      "ad-registry",
      "register-publisher",
      [Cl.stringUtf8("ipfs://publisher-metadata")],
      publisher
    );

    simnet.callPublicFn(
      "ad-registry",
      "record-stats",
      [Cl.principal(publisher), Cl.uint(10000), Cl.uint(500)],
      deployer
    );

    const ctr = simnet.callReadOnlyFn(
      "ad-registry",
      "get-click-through-rate",
      [Cl.principal(publisher)],
      deployer
    );
    expect(ctr.result).toBe("u500"); // 5% CTR in basis points
  });

  it("should allow owner to suspend participant", () => {
    simnet.callPublicFn(
      "ad-registry",
      "register-publisher",
      [Cl.stringUtf8("ipfs://publisher-metadata")],
      publisher
    );

    const suspend = simnet.callPublicFn(
      "ad-registry",
      "suspend",
      [Cl.principal(publisher), Cl.stringUtf8("Policy violation")],
      deployer
    );
    expect(suspend.result).toBe("(ok true)");

    const isActive = simnet.callReadOnlyFn(
      "ad-registry",
      "is-active-publisher",
      [Cl.principal(publisher)],
      deployer
    );
    expect(isActive.result).toBe("false");
  });

  it("should allow owner to slash participant", () => {
    simnet.callPublicFn(
      "ad-registry",
      "register-publisher",
      [Cl.stringUtf8("ipfs://publisher-metadata")],
      publisher
    );

    const slash = simnet.callPublicFn(
      "ad-registry",
      "slash",
      [Cl.principal(publisher), Cl.uint(5000), Cl.stringUtf8("Fraud detected")],
      deployer
    );
    expect(slash.result).toContain("ok");
  });

  it("should allow unregistration and refund", () => {
    simnet.callPublicFn(
      "ad-registry",
      "register-publisher",
      [Cl.stringUtf8("ipfs://publisher-metadata")],
      publisher
    );

    const unregister = simnet.callPublicFn(
      "ad-registry",
      "unregister",
      [],
      publisher
    );
    expect(unregister.result).toContain("ok");
  });
});
