import { ethers, network } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("=".repeat(50));
  console.log("Deploying ER2o token");
  console.log("=".repeat(50));
  console.log(`Network:   ${network.name}`);
  console.log(`Deployer:  ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Balance:   ${ethers.formatEther(balance)} CELO\n`);

  // 100 million tokens minted to deployer at launch
  const INITIAL_SUPPLY = 100_000_000;

  const ER2o = await ethers.getContractFactory("ER2o");
  const token = await ER2o.deploy(deployer.address, INITIAL_SUPPLY);

  await token.waitForDeployment();

  const address = await token.getAddress();
  const totalSupply = await token.totalSupply();

  console.log(`ER2o deployed to:  ${address}`);
  console.log(`Initial supply:    ${ethers.formatEther(totalSupply)} ER2O`);
  console.log(`Max supply:        1,000,000,000 ER2O`);
  console.log("\nVerify with:");
  console.log(
    `npx hardhat verify --network ${network.name} ${address} "${deployer.address}" "${INITIAL_SUPPLY}"`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
