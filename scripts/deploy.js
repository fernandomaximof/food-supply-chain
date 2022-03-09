const { task } = require("hardhat/config");
const { getAccount } = require("./helpers");

task("deploy", "DEPLOYS THE NFT.SOL CONTRACT").setAction(async function (taskArguments, hre) {
    const FarmerRole = await hre.ethers.getContractFactory("FarmerRole", getAccount());
    const DistributorRole = await hre.ethers.getContractFactory("DistributorRole", getAccount());
    const RetailerRole = await hre.ethers.getContractFactory("RetailerRole", getAccount());
    const ConsumerRole = await hre.ethers.getContractFactory("ConsumerRole", getAccount());
    const SupplyChain = await hre.ethers.getContractFactory("SupplyChain", getAccount());
    await FarmerRole.deploy();
    await DistributorRole.deploy();
    await RetailerRole.deploy();
    await ConsumerRole.deploy();
    const supplyChain = await SupplyChain.deploy();
    console.log(`CONTRACT DEPLOYED TO ADDRESS: ${supplyChain.address}`);
});