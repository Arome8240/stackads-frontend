import { describe, expect, it, beforeEach } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const publisher = accounts.get("wallet_1")!;
const verifier = accounts.get("wallet_2")!;
const reporter = accounts.get("wallet_3")!;

describe("Ad Verification Tests", () => {
  beforeEach(() => {
    // Setup publisher
    simnet.callPublicFn(
      "stackads-token",
      "transfer",
      [Cl.uint(200000000), Cl.principal(deployer), Cl.principal(publisher), Cl.none()],
      deployer
    );

    simnet.callPublicFn(
      "ad-registry",
      "register-publisher",
      [Cl.stringUtf8("ipfs://publisher")],
      publisher
    );
  });

  it("should calculate fraud score correctly", () => {
    const score = simnet.callReadOnlyFn(
      "ad-verification",
      "calculate-fraud-score",
      [
        Cl.uint(10000), // Impressions
        Cl.uint(500), // Clicks (5% CTR - normal)
        Cl.uint(50), // Conversions (10% CVR - normal)
        Cl.uint(700), // Publisher reputation (good)
      ],
      deployer
    );
    const fraudScore = parseInt(score.result.replace("u", ""));
    expect(fraudScore).toBeLessThan(700); // Should be low fraud score
  });

  it("should detect suspicious high CTR", () => {
    const score = simnet.callReadOnlyFn(
      "ad-verification",
      "calculate-fraud-score",
      [
        Cl.uint(10000),
        Cl.uint(1500), // 15% CTR - suspicious
        Cl.uint(50),
        Cl.uint(700),
      ],
      deployer
    );
    const fraudScore = parseInt(score.result.replace("u", ""));
    expect(fraudScore).toBeGreaterThan(0);
  });

  it("should detect suspicious high conversion rate", () => {
    const score = simnet.callReadOnlyFn(
      "ad-verification",
      "calculate-fraud-score",
      [
        Cl.uint(10000),
        Cl.uint(500),
        Cl.uint(300), // 60% CVR - suspicious
        Cl.uint(700),
      ],
      deployer
    );
    const fraudScore = parseInt(score.result.replace("u", ""));
    expect(fraudScore).toBeGreaterThan(0);
  });

  it("should penalize low reputation publishers", () => {
    const score = simnet.callReadOnlyFn(
      "ad-verification",
      "calculate-fraud-score",
      [
        Cl.uint(10000),
        Cl.uint(500),
        Cl.uint(50),
        Cl.uint(200), // Low reputation
      ],
      deployer
    );
    const fraudScore = parseInt(score.result.replace("u", ""));
    expect(fraudScore).toBeGreaterThan(200);
  });

  it("should allow owner to submit verification", () => {
    const proofHash = new Uint8Array(32).fill(1);
    
    const submit = simnet.callPublicFn(
      "ad-verification",
      "submit-verification",
      [
        Cl.uint(1), // Campaign ID
        Cl.principal(publisher),
        Cl.uint(10000), // Impressions
        Cl.uint(500), // Clicks
        Cl.uint(50), // Conversions
        Cl.buffer(proofHash),
      ],
      deployer
    );
    expect(submit.result).toBe("(ok true)");
  });

  it("should auto-reject high fraud scores", () => {
    const proofHash = new Uint8Array(32).fill(1);
    
    // Submit with very suspicious metrics
    simnet.callPublicFn(
      "ad-verification",
      "submit-verification",
      [
        Cl.uint(1),
        Cl.principal(publisher),
        Cl.uint(1000),
        Cl.uint(500), // 50% CTR - very suspicious
        Cl.uint(400), // 80% CVR - very suspicious
        Cl.buffer(proofHash),
      ],
      deployer
    );

    const verification = simnet.callReadOnlyFn(
      "ad-verification",
      "get-verification",
      [Cl.uint(1), Cl.principal(publisher), Cl.uint(simnet.blockHeight)],
      deployer
    );
    expect(verification.result).toContain("status: u3"); // Rejected
  });

  it("should flag medium fraud scores for review", () => {
    const proofHash = new Uint8Array(32).fill(1);
    
    // Submit with moderately suspicious metrics
    simnet.callPublicFn(
      "ad-verification",
      "submit-verification",
      [
        Cl.uint(1),
        Cl.principal(publisher),
        Cl.uint(10000),
        Cl.uint(1200), // 12% CTR - moderately suspicious
        Cl.uint(50),
        Cl.buffer(proofHash),
      ],
      deployer
    );

    const verification = simnet.callReadOnlyFn(
      "ad-verification",
      "get-verification",
      [Cl.uint(1), Cl.principal(publisher), Cl.uint(simnet.blockHeight)],
      deployer
    );
    expect(verification.result).toContain("status: u4"); // Flagged
  });

  it("should allow adding trusted verifier", () => {
    const add = simnet.callPublicFn(
      "ad-verification",
      "add-trusted-verifier",
      [Cl.principal(verifier)],
      deployer
    );
    expect(add.result).toBe("(ok true)");

    const isTrusted = simnet.callReadOnlyFn(
      "ad-verification",
      "is-trusted-verifier",
      [Cl.principal(verifier)],
      deployer
    );
    expect(isTrusted.result).toBe("true");
  });

  it("should allow trusted verifier to verify ad data", () => {
    const proofHash = new Uint8Array(32).fill(1);
    
    // Add verifier
    simnet.callPublicFn(
      "ad-verification",
      "add-trusted-verifier",
      [Cl.principal(verifier)],
      deployer
    );

    // Submit verification
    simnet.callPublicFn(
      "ad-verification",
      "submit-verification",
      [Cl.uint(1), Cl.principal(publisher), Cl.uint(10000), Cl.uint(500), Cl.uint(50), Cl.buffer(proofHash)],
      deployer
    );

    const timestamp = simnet.blockHeight;

    // Verify
    const verify = simnet.callPublicFn(
      "ad-verification",
      "verify-ad-data",
      [Cl.uint(1), Cl.principal(publisher), Cl.uint(timestamp), Cl.bool(true)],
      verifier
    );
    expect(verify.result).toBe("(ok true)");
  });

  it("should prevent non-trusted verifier from verifying", () => {
    const proofHash = new Uint8Array(32).fill(1);
    
    simnet.callPublicFn(
      "ad-verification",
      "submit-verification",
      [Cl.uint(1), Cl.principal(publisher), Cl.uint(10000), Cl.uint(500), Cl.uint(50), Cl.buffer(proofHash)],
      deployer
    );

    const timestamp = simnet.blockHeight;

    const verify = simnet.callPublicFn(
      "ad-verification",
      "verify-ad-data",
      [Cl.uint(1), Cl.principal(publisher), Cl.uint(timestamp), Cl.bool(true)],
      reporter // Not a trusted verifier
    );
    expect(verify.result).toContain("err");
  });

  it("should allow reporting fraud", () => {
    const report = simnet.callPublicFn(
      "ad-verification",
      "report-fraud",
      [
        Cl.uint(1), // Campaign ID
        Cl.principal(publisher),
        Cl.uint(1), // Fraud type: click fraud
        Cl.uint(8), // Severity: 8/10
        Cl.stringUtf8("Suspicious click patterns detected"),
      ],
      reporter
    );
    expect(report.result).toBe("(ok u1)"); // Report ID 1
  });

  it("should validate fraud type", () => {
    const report = simnet.callPublicFn(
      "ad-verification",
      "report-fraud",
      [
        Cl.uint(1),
        Cl.principal(publisher),
        Cl.uint(5), // Invalid fraud type
        Cl.uint(8),
        Cl.stringUtf8("Test"),
      ],
      reporter
    );
    expect(report.result).toContain("err");
  });

  it("should validate severity range", () => {
    const report = simnet.callPublicFn(
      "ad-verification",
      "report-fraud",
      [
        Cl.uint(1),
        Cl.principal(publisher),
        Cl.uint(1),
        Cl.uint(11), // Severity > 10
        Cl.stringUtf8("Test"),
      ],
      reporter
    );
    expect(report.result).toContain("err");
  });

  it("should allow owner to resolve fraud report", () => {
    // Create report
    simnet.callPublicFn(
      "ad-verification",
      "report-fraud",
      [Cl.uint(1), Cl.principal(publisher), Cl.uint(1), Cl.uint(8), Cl.stringUtf8("Test")],
      reporter
    );

    const resolve = simnet.callPublicFn(
      "ad-verification",
      "resolve-fraud-report",
      [Cl.uint(1), Cl.stringUtf8("Publisher suspended for 30 days")],
      deployer
    );
    expect(resolve.result).toBe("(ok true)");
  });

  it("should allow owner to remove trusted verifier", () => {
    simnet.callPublicFn(
      "ad-verification",
      "add-trusted-verifier",
      [Cl.principal(verifier)],
      deployer
    );

    const remove = simnet.callPublicFn(
      "ad-verification",
      "remove-trusted-verifier",
      [Cl.principal(verifier)],
      deployer
    );
    expect(remove.result).toBe("(ok true)");

    const isTrusted = simnet.callReadOnlyFn(
      "ad-verification",
      "is-trusted-verifier",
      [Cl.principal(verifier)],
      deployer
    );
    expect(isTrusted.result).toBe("false");
  });

  it("should allow owner to set fraud threshold", () => {
    const setThreshold = simnet.callPublicFn(
      "ad-verification",
      "set-fraud-threshold",
      [Cl.uint(800)],
      deployer
    );
    expect(setThreshold.result).toBe("(ok true)");

    const threshold = simnet.callReadOnlyFn(
      "ad-verification",
      "get-fraud-threshold",
      [],
      deployer
    );
    expect(threshold.result).toBe("u800");
  });

  it("should allow owner to set auto-reject threshold", () => {
    const setThreshold = simnet.callPublicFn(
      "ad-verification",
      "set-auto-reject-threshold",
      [Cl.uint(950)],
      deployer
    );
    expect(setThreshold.result).toBe("(ok true)");
  });

  it("should check if verification is approved", () => {
    const proofHash = new Uint8Array(32).fill(1);
    
    simnet.callPublicFn(
      "ad-verification",
      "add-trusted-verifier",
      [Cl.principal(verifier)],
      deployer
    );

    simnet.callPublicFn(
      "ad-verification",
      "submit-verification",
      [Cl.uint(1), Cl.principal(publisher), Cl.uint(10000), Cl.uint(500), Cl.uint(50), Cl.buffer(proofHash)],
      deployer
    );

    const timestamp = simnet.blockHeight;

    simnet.callPublicFn(
      "ad-verification",
      "verify-ad-data",
      [Cl.uint(1), Cl.principal(publisher), Cl.uint(timestamp), Cl.bool(true)],
      verifier
    );

    const isApproved = simnet.callReadOnlyFn(
      "ad-verification",
      "is-verification-approved",
      [Cl.uint(1), Cl.principal(publisher), Cl.uint(timestamp)],
      deployer
    );
    expect(isApproved.result).toBe("true");
  });

  it("should get verification status", () => {
    const proofHash = new Uint8Array(32).fill(1);
    
    simnet.callPublicFn(
      "ad-verification",
      "submit-verification",
      [Cl.uint(1), Cl.principal(publisher), Cl.uint(10000), Cl.uint(500), Cl.uint(50), Cl.buffer(proofHash)],
      deployer
    );

    const timestamp = simnet.blockHeight;

    const status = simnet.callReadOnlyFn(
      "ad-verification",
      "get-verification-status",
      [Cl.uint(1), Cl.principal(publisher), Cl.uint(timestamp)],
      deployer
    );
    expect(status.result).toContain("ok");
  });
});
