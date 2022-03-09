const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SupplyChain", function () {
  var accounts;

  var sku = 1;
  var upc = 1;
  var ownerID;
  var originFarmerID;
  const originFarmName = "John Doe"
  const originFarmInformation = "Yarray Valley"
  const originFarmLatitude = "-38.239770"
  const originFarmLongitude = "144.341490"
  var productID = sku + upc
  const productNotes = "Best beans for Espresso"
  const productPrice = web3.utils.toWei("1", "ether")
  var itemState = 0
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
    
    await supplyChain.harvestItem(upc, originFarmerID, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes);
    
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
    expect(BigInt(resultBufferTwo[5])).to.equal(BigInt(0));
    expect(eventEmitted).to.equal(true);
  })


  // 2nd Test
  it("TESTING SMART CONTRACT FUNCTION processItem() THAT ALLOWS A FARMER TO PROCESS COFFEE", async() => {
    itemState++
    
    // Declare and Initialize a variable for event
    var eventEmitted = false
    
    // Mark an item as Processed by calling function processItem()
    try {
      await supplyChain.processItem(upc);
      eventEmitted = true;
    } catch(e) {
      console.log(e);
    }
    
    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo(upc)
    
    // Verify the result set
    expect(BigInt(resultBufferTwo[5])).to.equal(BigInt(1))
  })


  // // 3rd Test
  // it("Testing smart contract function packItem() that allows a farmer to pack coffee", async() => {
  //   const SupplyChain = await ethers.getContractFactory("SupplyChain");
  //   const supplyChain = await SupplyChain.deploy();
    
  //   itemState++
    
  //   // Declare and Initialize a variable for event
  //   var eventEmitted = false
    
  //   // Watch the emitted event Packed()
  //   await supplyChain.Packed(null, (error, event)=>{    
  //       eventEmitted = true
  //   })

  //   // Mark an item as Packed by calling function packItem()
  //   await supplyChain.packItem(upc)

  //   // Retrieve the just now saved item from blockchain by calling function fetchItem()
  //   const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

  //   // Verify the result set
  //   expect(resultBufferTwo[5], 2, 'Error: Invalid item State')
  // })

  // // 4th Test
  // it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async() => {
  //   const SupplyChain = await ethers.getContractFactory("SupplyChain");
  //   const supplyChain = await SupplyChain.deploy();
    
  //   itemState++
    
  //   // Declare and Initialize a variable for event
  //   var eventEmitted = false
    
  //   // Watch the emitted event ForSale()
  //   await supplyChain.ForSale(null, (error, event)=>{    
  //       eventEmitted = true
  //   })

  //   // Mark an item as ForSale by calling function sellItem()
  //   await supplyChain.sellItem(upc, productPrice)

  //   // Retrieve the just now saved item from blockchain by calling function fetchItem()
  //   const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

  //   // Verify the result set
  //   assert.ok(resultBufferTwo[4] > 0, 'Error: Price is less than 0')
  //   expect(resultBufferTwo[5], 3, 'Error: Invalid item State')
  // })

  // // 5th Test
  // it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async() => {
  //   const SupplyChain = await ethers.getContractFactory("SupplyChain");
  //   const supplyChain = await SupplyChain.deploy();
    
  //   itemState++

  //   await supplyChain.addDistributor(distributorID)

  //   // Declare and Initialize a variable for event
  //   var eventEmitted = false
    
  //   // Watch the emitted event Sold()
  //   await supplyChain.Sold(null, (error, event)=>{    
  //       eventEmitted = true
  //   })

  //   // console.log(await supplyChain.isDistributor(distributorID))
  //   // console.log(await supplyChain.checkDistributor({from: distributorID}))

  //   // Mark an item as Sold by calling function buyItem()
  //   await supplyChain.buyItem(upc, {from: distributorID, value: productPrice})
    
  //   // Retrieve the just now saved item from blockchain by calling function fetchItem()
  //   const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
  //   console.log(resultBufferTwo[6])

  //   // Verify the result set
  //   expect(resultBufferTwo[5], 4, 'Error: Invalid item State')
  //   expect(resultBufferTwo[6], distributorID, 'Error: Missing or Invalid distributorID')
  // })

  // // 6th Test
  // it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async() => {
  //   const SupplyChain = await ethers.getContractFactory("SupplyChain");
  //   const supplyChain = await SupplyChain.deploy();
    
  //   itemState++

  //   // Declare and Initialize a variable for event
  //   var eventEmitted = false
    
  //   // Watch the emitted event Shipped()
  //   await supplyChain.Shipped(null, (error, event)=>{    
  //       eventEmitted = true
  //   })

  //   // Mark an item as Shipped by calling function shipItem()
  //   await supplyChain.shipItem(upc, {from: distributorID})

  //   // Retrieve the just now saved item from blockchain by calling function fetchItem()
  //   const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
  //   console.log(resultBufferTwo[6])

  //   // Verify the result set
  //   expect(resultBufferTwo[5], 5, 'Error: Invalid item State')
  //   expect(resultBufferTwo[6], distributorID, 'Error: Missing or Invalid distributorID')
  // })

  // // 7th Test
  // it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async() => {
  //   const SupplyChain = await ethers.getContractFactory("SupplyChain");
  //   const supplyChain = await SupplyChain.deploy();
    
  //   itemState++
    
  //   await supplyChain.addRetailer(retailerID)
    
  //   // Declare and Initialize a variable for event
  //   var eventEmitted = false
    
  //   // Watch the emitted event Received()
  //   await supplyChain.Received(null, (error, event)=>{
  //       eventEmitted = true
  //   })

  //   // Mark an item as Sold by calling function receiveItem()
  //   await supplyChain.receiveItem(upc, {from: retailerID, value: productPrice})

  //   // Retrieve the just now saved item from blockchain by calling function fetchItem()
  //   const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
  //   console.log(resultBufferTwo[7])

  //   // Verify the result set
  //   expect(resultBufferTwo[5], 6, 'Error: Invalid item State')
  //   expect(resultBufferTwo[7], retailerID, 'Error: Missing or Invalid retailerID')     
  // })

  // // 8th Test
  // it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async() => {
  //   const SupplyChain = await ethers.getContractFactory("SupplyChain");
  //   const supplyChain = await SupplyChain.deploy();
    
  //   itemState++
    
  //   await supplyChain.addConsumer(consumerID)

  //   // Declare and Initialize a variable for event
  //   var eventEmitted = false
    
  //   // Watch the emitted event Purchased()
  //   await supplyChain.Purchased(null, (error, event)=>{    
  //       eventEmitted = true
  //   })

  //   // Mark an item as Sold by calling function purchaseItem()
  //   await supplyChain.purchaseItem(upc, {from: consumerID, value: productPrice})

  //   // Retrieve the just now saved item from blockchain by calling function fetchItem()
  //   const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
  //   console.log(resultBufferTwo[8])

  //   // Verify the result set
  //   expect(resultBufferTwo[5], 7, 'Error: Invalid item State')
  //   expect(resultBufferTwo[8], consumerID, 'Error: Missing or Invalid consumerID')   
  // })

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
  //   const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
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