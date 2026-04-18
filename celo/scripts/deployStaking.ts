import { ethers, network } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
  if (!TOKEN_ADDRESS) throw new Error("Set TOKEN_ADDRESS in .env");

  console.log("=".repeat(50));
  console.log("Deploying Staking contract");
  console.log("=".repeat(50));
  console.log(`Network:  ${network.name}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Token:    ${TOKEN_ADDRESS}\n`);

  const Staking = await ethers.getContractFactory("Staking");
  // Using ER2o as both staking and reward token
  const staking = await Staking.deploy(
    TOKEN_ADDRESS,
    TOKEN_ADDRESS,
    deployer.address,
  );
  await staking.waitForDeployment();

  const address = await staking.getAddress();
  console.log(`Staking deployed to: ${address}`);
  console.log("\nNext: call notifyRewardAmount() to fund the reward pool");
  console.log("\nVerify with:");
  console.log(
    `npx hardhat verify --network ${network.name} ${address} "${TOKEN_ADDRESS}" "${TOKEN_ADDRESS}" "${deployer.address}"`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
