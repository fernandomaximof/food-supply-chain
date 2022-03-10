const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SupplyChain", function () {
  var accounts;

  var sku = 1;
  var upc = 1;
  var ownerID;
  var originFarmerID;
  const originFarmName = "John Doe";
  const originFarmInformation = "Yarray Valley";
  const originFarmLatitude = "-38.239770";
  const originFarmLongitude = "144.341490";
  var productID = sku + upc;
  const productNotes = "Best beans for Espresso";
  const productPrice = web3.utils.toWei("1", "ether");
  var itemState = 0;
  var distributorID;
  var retailerID;
  var consumerID;
  const emptyAddress = '0x00000000000000000000000000000000000000'

  var supplyChain;
  
  beforeEach(async function() {
    accounts = await web3.eth.getAccounts();
    ownerID = accounts[0];
    originFarmerID = accounts[1];
    distributorID = accounts[2];
    retailerID = accounts[3];
    consumerID = accounts[4];

    const FarmerRole = await ethers.getContractFactory("FarmerRole");
    const DistributorRole = await ethers.getContractFactory("DistributorRole");
    const RetailerRole = await ethers.getContractFactory("RetailerRole");
    const ConsumerRole = await ethers.getContractFactory("ConsumerRole");
    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    await FarmerRole.deploy();
    await DistributorRole.deploy();
    await RetailerRole.deploy();
    await ConsumerRole.deploy();
    supplyChain = await SupplyChain.deploy();
    await supplyChain.deployed()
    
  });


  // 1st Test
  it("TESTING SMART CONTRACT FUNCTION harvestItem() THAT ALLOWS A FARMER TO HARVEST COFFEE", async() => {
    // Declare and Initialize a variable for event
    var eventEmitted = false;

    // Mark an item as Harvested by calling function harvestItem()
    try {
      await supplyChain.harvestItem(upc, originFarmerID, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes);
      eventEmitted = true;
    } catch(e) {
      console.log(e);
    }
    
    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne(upc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc);
    
    // Verify the result set
    //expect(resultBufferOne[0]).to.equal(sku);
    expect(BigInt(resultBufferOne[1])).to.equal(BigInt(upc));
    expect(resultBufferOne[2]).to.equal(ownerID);
    expect(resultBufferOne[3]).to.equal(originFarmerID);
    expect(resultBufferOne[4]).to.equal(originFarmName);
    expect(resultBufferOne[5]).to.equal(originFarmInformation);
    expect(resultBufferOne[6]).to.equal(originFarmLatitude);
    expect(resultBufferOne[7]).to.equal(originFarmLongitude);
    expect(BigInt(resultBufferTwo[5])).to.equal(BigInt(itemState));
    expect(eventEmitted).to.equal(true);
  
  })


  // 2nd Test
  it("TESTING SMART CONTRACT FUNCTION processItem() THAT ALLOWS A FARMER TO PROCESS COFFEE", async() => {
    await supplyChain.harvestItem(upc, originFarmerID, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes);
    
    itemState++;

    var eventEmitted = false;
    
    try {
      await supplyChain.processItem(upc);
      eventEmitted = true;
    } catch(e) {
      console.log(e);
    }
    
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc);
    
    expect(BigInt(resultBufferTwo[5])).to.equal(BigInt(itemState));
  
  })


  // 3rd Test
  it("TESTING SMART CONTRACT FUNCTION packItem() THAT ALLOWS A FARMER TO PACK COFFEE", async() => {
    await supplyChain.harvestItem(upc, originFarmerID, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes);
    await supplyChain.processItem(upc);

    itemState++;
    
    var eventEmitted = false;
    
    try {
      await supplyChain.packItem(upc);
      eventEmitted = true;
    } catch(e) {
      console.log(e);
    }

    const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc);

    expect(BigInt(resultBufferTwo[5])).to.equal(BigInt(itemState));
  
  })

  
  // 4th Test
  it("TESTING SMART CONTRACT FUNCTION sellItem() THAT ALLOWS A FARMER TO SELL COFFEE", async() => {
    await supplyChain.harvestItem(upc, originFarmerID, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes);
    await supplyChain.processItem(upc);
    await supplyChain.packItem(upc);
    
    itemState++
    
    var eventEmitted = false
    
    try {
      await supplyChain.sellItem(upc, productPrice);
      eventEmitted = true;
    } catch(e) {
      console.log(e);
    }

    const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc)

    expect(parseInt(resultBufferTwo[4])).to.be.above(parseInt(0));
    expect(BigInt(resultBufferTwo[5])).to.be.equal(BigInt(3));

  })


  // 5th Test
  it("TESTING SMART CONTRACT FUNCTION buyItem() THAT ALLOWS A DISTRIBUTOR TO BUY COFFEE", async() => {
    await supplyChain.harvestItem(upc, originFarmerID, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes);
    await supplyChain.processItem(upc);
    await supplyChain.packItem(upc);
    await supplyChain.sellItem(upc, productPrice);

    itemState++;

    var eventEmitted = false;

    [owner, addr1, addr2] = await ethers.getSigners();

    try {
      await supplyChain.addDistributor(distributorID);
    } catch(e) {
      console.log(e);
    }

    // console.log(await supplyChain.isDistributor(distributorID))

    try {
      await supplyChain.connect(addr2).buyItem(upc, {value: productPrice});
      eventEmitted = true;
    } catch(e) {
      console.log(e);
    }

    const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc);

    expect(BigInt(resultBufferTwo[5])).to.be.equal(BigInt(4));
    expect(resultBufferTwo[6]).to.be.equal(distributorID);

  })


  // 6th Test
  it("TESTING SMART CONTRACT FUNCTION shipItem() THAT ALLOWS A DISTRIBUTOR TO SHIP COFFEE", async() => {
    await supplyChain.harvestItem(upc, originFarmerID, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes);
    await supplyChain.processItem(upc);
    await supplyChain.packItem(upc);
    await supplyChain.sellItem(upc, productPrice);
    
    [owner, addr1, addr2] = await ethers.getSigners();

    try {
      await supplyChain.addDistributor(distributorID);
      await supplyChain.connect(addr2).buyItem(upc, {value: productPrice});
    } catch(e) {
      console.log(e);
    }

    itemState++;

    var eventEmitted = false;
    
    try {
      await supplyChain.connect(addr2).shipItem(upc);
      eventEmitted = true;
    } catch(e) {
      console.log(e);
    }

    const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc)

    expect(BigInt(resultBufferTwo[5])).to.be.equal(BigInt(5));
    expect(resultBufferTwo[6]).to.be.equal(distributorID);
  
  })

  // 7th Test
  it("TESTING SMART CONTRACT FUNCTION receiveItem() THAT ALLOWS A RETAILER TO MARK COFFEE RECEIVED", async() => {
    await supplyChain.harvestItem(upc, originFarmerID, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes);
    await supplyChain.processItem(upc);
    await supplyChain.packItem(upc);
    await supplyChain.sellItem(upc, productPrice);
    
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    try {
      await supplyChain.addDistributor(distributorID);
      await supplyChain.connect(addr2).buyItem(upc, {value: productPrice});
      await supplyChain.connect(addr2).shipItem(upc);
    } catch(e) {
      console.log(e);
    }
    
    itemState++

    var eventEmitted = false;

    try {
      await supplyChain.addRetailer(retailerID);
    } catch(e) {
      console.log(e);
    }

    try {
      await supplyChain.connect(addr3).receiveItem(upc, {value: productPrice});
      eventEmitted = true;
    } catch(e) {
      console.log(e);
    }

    const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc)
    
    expect(BigInt(resultBufferTwo[5])).to.be.equal(BigInt(6));
    expect(resultBufferTwo[7]).to.be.equal(retailerID);

  })


  // 8th Test
  it("TESTING SMART CONTRACT FUNCTION purchaseItem() THAT ALLOWS A CONSUMER TO PURCHASE COFFEE", async() => {
    await supplyChain.harvestItem(upc, originFarmerID, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes);
    await supplyChain.processItem(upc);
    await supplyChain.packItem(upc);
    await supplyChain.sellItem(upc, productPrice);
    
    [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    try {
      await supplyChain.addDistributor(distributorID);
      await supplyChain.connect(addr2).buyItem(upc, {value: productPrice});
      await supplyChain.connect(addr2).shipItem(upc);
      await supplyChain.addRetailer(retailerID);
      await supplyChain.connect(addr3).receiveItem(upc, {value: productPrice});
    } catch(e) {
      console.log(e);
    }
    
    itemState++;

    var eventEmitted = false;

    try {
      await supplyChain.addConsumer(consumerID);
    } catch(e) {
      console.log(e);
    }

    try {
      await supplyChain.connect(addr4).purchaseItem(upc, {value: productPrice})
      eventEmitted = true;
    } catch(e) {
      console.log(e)
    }

    const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc)

    expect(BigInt(resultBufferTwo[5])).to.be.equal(BigInt(7));
    expect(resultBufferTwo[8]).to.be.equal(consumerID); 

  })
  

  // // 9th Test
  // it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async() => {
  //   const SupplyChain = await ethers.getContractFactory("SupplyChain");
  //   const supplyChain = await SupplyChain.deploy();
    
  //   // Retrieve the just now saved item from blockchain by calling function fetchItem()
  //   const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
  //   //console.log(resultBufferOne)
    
  //   // Verify the result set:
  //   expect(resultBufferOne[0], sku, 'Error: Invalid item SKU')
  //   expect(resultBufferOne[1], upc, 'Error: Invalid item UPC')
  //   expect(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID')
  //   expect(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
  //   expect(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
  //   expect(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
  //   expect(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
  //   expect(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
  // })

  // // 10th Test
  // it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {
  //   const SupplyChain = await ethers.getContractFactory("SupplyChain");
  //   const supplyChain = await SupplyChain.deploy();
    
  //   // Retrieve the just now saved item from blockchain by calling function fetchItem()
  //   const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc)
  //   //console.log(resultBufferTwo)

  //   // Verify the result set:
  //   expect(resultBufferTwo[0], sku, 'Error: Invalid item SKU')
  //   expect(resultBufferTwo[1], upc, 'Error: Invalid item UPC')
  //   expect(resultBufferTwo[2], productID, 'Error: Missing or Invalid productID')
  //   expect(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
  //   expect(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
  //   expect(resultBufferTwo[5], 7, 'Error: Missing or Invalid itemState')
  //   expect(resultBufferTwo[6], distributorID, 'Error: Missing or Invalid distributorID')
  //   expect(resultBufferTwo[7], retailerID, 'Error: Missing or Invalid retailerID')
  //   expect(resultBufferTwo[8], consumerID, 'Error: Missing or Invalid consumerID')
  // })
  /**/
});