import { describe, expect, it, beforeEach } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const advertiser = accounts.get("wallet_1")!;
const publisher = accounts.get("wallet_2")!;

describe("Campaign Manager Tests", () => {
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

    // Create a campaign
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

  it("should allow setting campaign targeting", () => {
    const setTargeting = simnet.callPublicFn(
      "campaign-manager",
      "set-campaign-targeting",
      [
        Cl.uint(1), // Campaign ID
        Cl.list([Cl.stringAscii("US"), Cl.stringAscii("UK")]), // Geo locations
        Cl.list([Cl.uint(1), Cl.uint(2)]), // Device types (mobile, desktop)
        Cl.uint(500), // Min reputation
        Cl.uint(10000000), // Max daily budget
        Cl.list([Cl.uint(1), Cl.uint(2), Cl.uint(3)]), // Time restrictions
      ],
      advertiser
    );
    expect(setTargeting.result).toBe("(ok true)");
  });

  it("should prevent non-owner from setting targeting", () => {
    const setTargeting = simnet.callPublicFn(
      "campaign-manager",
      "set-campaign-targeting",
      [
        Cl.uint(1),
        Cl.list([Cl.stringAscii("US")]),
        Cl.list([Cl.uint(1)]),
        Cl.uint(500),
        Cl.uint(10000000),
        Cl.list([Cl.uint(1)]),
      ],
      publisher // Not the advertiser
    );
    expect(setTargeting.result).toContain("err");
  });

  it("should allow adding campaign creative", () => {
    const addCreative = simnet.callPublicFn(
      "campaign-manager",
      "add-campaign-creative",
      [
        Cl.uint(1),
        Cl.stringUtf8("ipfs://creative-banner"),
        Cl.stringAscii("banner"),
        Cl.uint(728), // Width
        Cl.uint(90), // Height
      ],
      advertiser
    );
    expect(addCreative.result).toBe("(ok u1)"); // Creative ID 1
  });

  it("should track creative count", () => {
    simnet.callPublicFn(
      "campaign-manager",
      "add-campaign-creative",
      [
        Cl.uint(1),
        Cl.stringUtf8("ipfs://creative1"),
        Cl.stringAscii("banner"),
        Cl.uint(728),
        Cl.uint(90),
      ],
      advertiser
    );

    simnet.callPublicFn(
      "campaign-manager",
      "add-campaign-creative",
      [
        Cl.uint(1),
        Cl.stringUtf8("ipfs://creative2"),
        Cl.stringAscii("video"),
        Cl.uint(1920),
        Cl.uint(1080),
      ],
      advertiser
    );

    const count = simnet.callReadOnlyFn(
      "campaign-manager",
      "get-creative-count",
      [Cl.uint(1)],
      deployer
    );
    expect(count.result).toBe("u2");
  });

  it("should allow toggling creative active status", () => {
    simnet.callPublicFn(
      "campaign-manager",
      "add-campaign-creative",
      [
        Cl.uint(1),
        Cl.stringUtf8("ipfs://creative"),
        Cl.stringAscii("banner"),
        Cl.uint(728),
        Cl.uint(90),
      ],
      advertiser
    );

    const toggle = simnet.callPublicFn(
      "campaign-manager",
      "toggle-creative",
      [Cl.uint(1), Cl.uint(1), Cl.bool(false)], // Deactivate
      advertiser
    );
    expect(toggle.result).toBe("(ok true)");
  });

  it("should allow setting up A/B test", () => {
    // Add two creatives
    simnet.callPublicFn(
      "campaign-manager",
      "add-campaign-creative",
      [
        Cl.uint(1),
        Cl.stringUtf8("ipfs://creative-a"),
        Cl.stringAscii("banner"),
        Cl.uint(728),
        Cl.uint(90),
      ],
      advertiser
    );

    simnet.callPublicFn(
      "campaign-manager",
      "add-campaign-creative",
      [
        Cl.uint(1),
        Cl.stringUtf8("ipfs://creative-b"),
        Cl.stringAscii("banner"),
        Cl.uint(728),
        Cl.uint(90),
      ],
      advertiser
    );

    const setupAB = simnet.callPublicFn(
      "campaign-manager",
      "setup-ab-test",
      [
        Cl.uint(1), // Campaign ID
        Cl.uint(1), // Variant A
        Cl.uint(2), // Variant B
        Cl.uint(50), // 50% weight A
        Cl.uint(50), // 50% weight B
      ],
      advertiser
    );
    expect(setupAB.result).toBe("(ok true)");
  });

  it("should enforce weight sum equals 100 for A/B test", () => {
    simnet.callPublicFn(
      "campaign-manager",
      "add-campaign-creative",
      [Cl.uint(1), Cl.stringUtf8("ipfs://a"), Cl.stringAscii("banner"), Cl.uint(728), Cl.uint(90)],
      advertiser
    );
    simnet.callPublicFn(
      "campaign-manager",
      "add-campaign-creative",
      [Cl.uint(1), Cl.stringUtf8("ipfs://b"), Cl.stringAscii("banner"), Cl.uint(728), Cl.uint(90)],
      advertiser
    );

    const setupAB = simnet.callPublicFn(
      "campaign-manager",
      "setup-ab-test",
      [Cl.uint(1), Cl.uint(1), Cl.uint(2), Cl.uint(60), Cl.uint(50)], // Sum = 110
      advertiser
    );
    expect(setupAB.result).toContain("err");
  });

  it("should allow owner to record creative impression", () => {
    simnet.callPublicFn(
      "campaign-manager",
      "add-campaign-creative",
      [Cl.uint(1), Cl.stringUtf8("ipfs://creative"), Cl.stringAscii("banner"), Cl.uint(728), Cl.uint(90)],
      advertiser
    );

    const record = simnet.callPublicFn(
      "campaign-manager",
      "record-creative-impression",
      [Cl.uint(1), Cl.uint(1)],
      deployer
    );
    expect(record.result).toBe("(ok true)");
  });

  it("should allow owner to record creative click", () => {
    simnet.callPublicFn(
      "campaign-manager",
      "add-campaign-creative",
      [Cl.uint(1), Cl.stringUtf8("ipfs://creative"), Cl.stringAscii("banner"), Cl.uint(728), Cl.uint(90)],
      advertiser
    );

    const record = simnet.callPublicFn(
      "campaign-manager",
      "record-creative-click",
      [Cl.uint(1), Cl.uint(1)],
      deployer
    );
    expect(record.result).toBe("(ok true)");
  });

  it("should calculate CTR correctly", () => {
    const ctr = simnet.callReadOnlyFn(
      "campaign-manager",
      "calculate-ctr",
      [Cl.uint(10000), Cl.uint(500)], // 10k impressions, 500 clicks
      deployer
    );
    expect(ctr.result).toBe("u500"); // 5% in basis points
  });

  it("should calculate conversion rate correctly", () => {
    const cvr = simnet.callReadOnlyFn(
      "campaign-manager",
      "calculate-conversion-rate",
      [Cl.uint(1000), Cl.uint(100)], // 1k clicks, 100 conversions
      deployer
    );
    expect(cvr.result).toBe("u1000"); // 10% in basis points
  });

  it("should allow recording conversions for A/B test", () => {
    // Setup A/B test
    simnet.callPublicFn(
      "campaign-manager",
      "add-campaign-creative",
      [Cl.uint(1), Cl.stringUtf8("ipfs://a"), Cl.stringAscii("banner"), Cl.uint(728), Cl.uint(90)],
      advertiser
    );
    simnet.callPublicFn(
      "campaign-manager",
      "add-campaign-creative",
      [Cl.uint(1), Cl.stringUtf8("ipfs://b"), Cl.stringAscii("banner"), Cl.uint(728), Cl.uint(90)],
      advertiser
    );
    simnet.callPublicFn(
      "campaign-manager",
      "setup-ab-test",
      [Cl.uint(1), Cl.uint(1), Cl.uint(2), Cl.uint(50), Cl.uint(50)],
      advertiser
    );

    const recordConversion = simnet.callPublicFn(
      "campaign-manager",
      "record-conversion",
      [Cl.uint(1), Cl.uint(1)], // Campaign 1, Variant A
      deployer
    );
    expect(recordConversion.result).toBe("(ok true)");
  });

  it("should allow recording daily performance", () => {
    const record = simnet.callPublicFn(
      "campaign-manager",
      "record-daily-performance",
      [
        Cl.uint(1), // Campaign ID
        Cl.uint(20240101), // Date
        Cl.uint(100000), // Impressions
        Cl.uint(5000), // Clicks
        Cl.uint(250), // Conversions
        Cl.uint(50000000), // Spend
        Cl.uint(75000000), // Revenue
      ],
      deployer
    );
    expect(record.result).toBe("(ok true)");
  });

  it("should get creative performance", () => {
    simnet.callPublicFn(
      "campaign-manager",
      "add-campaign-creative",
      [Cl.uint(1), Cl.stringUtf8("ipfs://creative"), Cl.stringAscii("banner"), Cl.uint(728), Cl.uint(90)],
      advertiser
    );

    simnet.callPublicFn(
      "campaign-manager",
      "record-creative-impression",
      [Cl.uint(1), Cl.uint(1)],
      deployer
    );

    const performance = simnet.callReadOnlyFn(
      "campaign-manager",
      "get-creative-performance",
      [Cl.uint(1), Cl.uint(1)],
      deployer
    );
    expect(performance.result).toContain("impressions:");
    expect(performance.result).toContain("clicks:");
    expect(performance.result).toContain("ctr:");
  });

  it("should get A/B test results", () => {
    simnet.callPublicFn(
      "campaign-manager",
      "add-campaign-creative",
      [Cl.uint(1), Cl.stringUtf8("ipfs://a"), Cl.stringAscii("banner"), Cl.uint(728), Cl.uint(90)],
      advertiser
    );
    simnet.callPublicFn(
      "campaign-manager",
      "add-campaign-creative",
      [Cl.uint(1), Cl.stringUtf8("ipfs://b"), Cl.stringAscii("banner"), Cl.uint(728), Cl.uint(90)],
      advertiser
    );
    simnet.callPublicFn(
      "campaign-manager",
      "setup-ab-test",
      [Cl.uint(1), Cl.uint(1), Cl.uint(2), Cl.uint(50), Cl.uint(50)],
      advertiser
    );

    const results = simnet.callReadOnlyFn(
      "campaign-manager",
      "get-ab-test-results",
      [Cl.uint(1)],
      deployer
    );
    expect(results.result).toContain("variant-a-conversions:");
    expect(results.result).toContain("variant-b-conversions:");
  });

  it("should prevent non-owner from recording events", () => {
    simnet.callPublicFn(
      "campaign-manager",
      "add-campaign-creative",
      [Cl.uint(1), Cl.stringUtf8("ipfs://creative"), Cl.stringAscii("banner"), Cl.uint(728), Cl.uint(90)],
      advertiser
    );

    const record = simnet.callPublicFn(
      "campaign-manager",
      "record-creative-impression",
      [Cl.uint(1), Cl.uint(1)],
      advertiser // Not the owner
    );
    expect(record.result).toContain("err");
  });
});
