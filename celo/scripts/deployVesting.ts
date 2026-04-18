import { ethers, network } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  // Replace with deployed ER2o address
  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
  if (!TOKEN_ADDRESS) throw new Error("Set TOKEN_ADDRESS in .env");

  console.log("=".repeat(50));
  console.log("Deploying Vesting contract");
  console.log("=".repeat(50));
  console.log(`Network:  ${network.name}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Token:    ${TOKEN_ADDRESS}\n`);

  const Vesting = await ethers.getContractFactory("Vesting");
  const vesting = await Vesting.deploy(TOKEN_ADDRESS, deployer.address);
  await vesting.waitForDeployment();

  const address = await vesting.getAddress();
  console.log(`Vesting deployed to: ${address}`);
  console.log("\nVerify with:");
  console.log(
    `npx hardhat verify --network ${network.name} ${address} "${TOKEN_ADDRESS}" "${deployer.address}"`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
