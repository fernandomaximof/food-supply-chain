const { task } = require("hardhat/config");
const { getAccount } = require("./helpers");

task("check-balance", "PRINTS OUT THE BALANCE OF YOUR ACCOUNT").setAction(async function (taskArguments, hre) {
    const account = getAccount();
    console.log(`ACCOUNT BALANCE FOR ${account.address}: ${await account.getBalance()}`);
});

task("deploy", "DEPLOYS THE NFT.SOL CONTRACT").setAction(async function (taskArguments, hre) {
    const Bloodz = await hre.ethers.getContractFactory("Bloodz", getAccount());
    const nft = await Bloodz.deploy();
    console.log(`CONTRACT DEPLOYED TO ADDRESS: ${nft.address}`);
});