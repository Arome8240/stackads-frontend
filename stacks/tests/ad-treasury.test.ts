import { describe, expect, it, beforeEach } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const advertiser = accounts.get("wallet_1")!;
const publisher = accounts.get("wallet_2")!;

describe("Ad Treasury Tests", () => {
  beforeEach(() => {
    // Setup tokens
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

    // Register advertiser and publisher
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
  });

  it("should allow advertiser to create campaign", () => {
    const campaign = simnet.callPublicFn(
      "ad-treasury",
      "create-campaign",
      [
        Cl.uint(100000000), // 100 SADS budget
        Cl.uint(1000), // Cost per impression
        Cl.uint(10000), // Cost per click
        Cl.uint(1000), // Duration in blocks
        Cl.stringUtf8("ipfs://campaign-metadata"),
      ],
      advertiser
    );
    expect(campaign.result).toContain("ok u1"); // Campaign ID 1
  });

  it("should calculate platform fee correctly", () => {
    const fee = simnet.callReadOnlyFn(
      "ad-treasury",
      "calculate-platform-fee",
      [Cl.uint(100000000)], // 100 SADS
      deployer
    );
    expect(fee.result).toBe("u2500000"); // 2.5% = 2.5 SADS
  });

  it("should prevent non-advertiser from creating campaign", () => {
    const campaign = simnet.callPublicFn(
      "ad-treasury",
      "create-campaign",
      [
        Cl.uint(100000000),
        Cl.uint(1000),
        Cl.uint(10000),
        Cl.uint(1000),
        Cl.stringUtf8("ipfs://campaign"),
      ],
      publisher // Publisher trying to create campaign
    );
    expect(campaign.result).toContain("err");
  });

  it("should allow funding existing campaign", () => {
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

    // Fund campaign
    const fund = simnet.callPublicFn(
      "ad-treasury",
      "fund-campaign",
      [Cl.uint(1), Cl.uint(50000000)], // Add 50 SADS
      advertiser
    );
    expect(fund.result).toBe("(ok true)");
  });

  it("should record ad events correctly", () => {
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

    // Record events (only owner can do this)
    const record = simnet.callPublicFn(
      "ad-treasury",
      "record-ad-event",
      [
        Cl.uint(1), // Campaign ID
        Cl.principal(publisher),
        Cl.uint(10000), // Impressions
        Cl.uint(500), // Clicks
      ],
      deployer
    );
    expect(record.result).toContain("ok");
  });

  it("should prevent recording events beyond budget", () => {
    // Create small campaign
    simnet.callPublicFn(
      "ad-treasury",
      "create-campaign",
      [
        Cl.uint(10000000), // Only 10 SADS
        Cl.uint(1000),
        Cl.uint(10000),
        Cl.uint(1000),
        Cl.stringUtf8("ipfs://campaign"),
      ],
      advertiser
    );

    // Try to record events that exceed budget
    const record = simnet.callPublicFn(
      "ad-treasury",
      "record-ad-event",
      [
        Cl.uint(1),
        Cl.principal(publisher),
        Cl.uint(100000), // Too many impressions
        Cl.uint(5000),
      ],
      deployer
    );
    expect(record.result).toContain("err");
  });

  it("should allow publisher to claim earnings", () => {
    // Create campaign and record events
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

    simnet.callPublicFn(
      "ad-treasury",
      "record-ad-event",
      [Cl.uint(1), Cl.principal(publisher), Cl.uint(10000), Cl.uint(500)],
      deployer
    );

    // Claim earnings
    const claim = simnet.callPublicFn(
      "ad-treasury",
      "claim-earnings",
      [Cl.uint(1)],
      publisher
    );
    expect(claim.result).toContain("ok");
  });

  it("should allow advertiser to pause campaign", () => {
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

    const pause = simnet.callPublicFn(
      "ad-treasury",
      "pause-campaign",
      [Cl.uint(1)],
      advertiser
    );
    expect(pause.result).toBe("(ok true)");
  });

  it("should allow advertiser to resume paused campaign", () => {
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

    simnet.callPublicFn("ad-treasury", "pause-campaign", [Cl.uint(1)], advertiser);

    const resume = simnet.callPublicFn(
      "ad-treasury",
      "resume-campaign",
      [Cl.uint(1)],
      advertiser
    );
    expect(resume.result).toBe("(ok true)");
  });

  it("should allow advertiser to end campaign and get refund", () => {
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

    const end = simnet.callPublicFn(
      "ad-treasury",
      "end-campaign",
      [Cl.uint(1)],
      advertiser
    );
    expect(end.result).toContain("ok");
  });

  it("should prevent unauthorized users from pausing campaign", () => {
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

    const pause = simnet.callPublicFn(
      "ad-treasury",
      "pause-campaign",
      [Cl.uint(1)],
      publisher // Not the advertiser
    );
    expect(pause.result).toContain("err");
  });

  it("should check if campaign is active", () => {
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

    const isActive = simnet.callReadOnlyFn(
      "ad-treasury",
      "is-campaign-active",
      [Cl.uint(1)],
      deployer
    );
    expect(isActive.result).toBe("true");
  });

  it("should allow owner to set platform fee", () => {
    const setFee = simnet.callPublicFn(
      "ad-treasury",
      "set-platform-fee",
      [Cl.uint(500)], // 5%
      deployer
    );
    expect(setFee.result).toBe("(ok true)");

    const fee = simnet.callReadOnlyFn(
      "ad-treasury",
      "get-platform-fee-bps",
      [],
      deployer
    );
    expect(fee.result).toBe("u500");
  });

  it("should allow owner to emergency pause campaign", () => {
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

    const emergencyPause = simnet.callPublicFn(
      "ad-treasury",
      "emergency-pause-campaign",
      [Cl.uint(1)],
      deployer
    );
    expect(emergencyPause.result).toBe("(ok true)");
  });
});
