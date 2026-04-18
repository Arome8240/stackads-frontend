import { ethers, network } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
  const FEE_RECIPIENT = process.env.FEE_RECIPIENT ?? deployer.address;
  if (!TOKEN_ADDRESS) throw new Error("Set TOKEN_ADDRESS in .env");

  console.log("=".repeat(50));
  console.log("Deploying AdTreasury contract");
  console.log("=".repeat(50));
  console.log(`Network:       ${network.name}`);
  console.log(`Deployer:      ${deployer.address}`);
  console.log(`Token:         ${TOKEN_ADDRESS}`);
  console.log(`Fee Recipient: ${FEE_RECIPIENT}\n`);

  const AdTreasury = await ethers.getContractFactory("AdTreasury");
  const treasury = await AdTreasury.deploy(
    TOKEN_ADDRESS,
    deployer.address,
    FEE_RECIPIENT,
  );
  await treasury.waitForDeployment();

  const address = await treasury.getAddress();
  console.log(`AdTreasury deployed to: ${address}`);
  console.log("\nVerify with:");
  console.log(
    `npx hardhat verify --network ${network.name} ${address} "${TOKEN_ADDRESS}" "${deployer.address}" "${FEE_RECIPIENT}"`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
