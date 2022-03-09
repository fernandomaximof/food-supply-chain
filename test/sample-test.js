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
    await SupplyChain.deploy();

    console.log("Contract Owner: accounts[0] ", accounts[0])
    console.log("Farmer: accounts[1] ", accounts[1])
    console.log("Distributor: accounts[2] ", accounts[2])
    console.log("Retailer: accounts[3] ", accounts[3])
    console.log("Consumer: accounts[4] ", accounts[4])
    
  });

  // 1st Test
  it("Testing smart contract function harvestItem() that allows a farmer to harvest coffee", async() => {
    // Declare and Initialize a variable for event
    var eventEmitted = false
    
    // Watch the emitted event Harvested()
    await supplyChain.Harvested(null, (error, event)=>{
        eventEmitted = true
    })

    // Mark an item as Harvested by calling function harvestItem()
    await supplyChain.harvestItem(upc, originFarmerID, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes)

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

    // Verify the result set
    assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
    assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
    assert.equal(resultBufferOne[2], ownerID, 'Error: Missing or Invalid ownerID')
    assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
    assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
    assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
    assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
    assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
    assert.equal(resultBufferTwo[5], 0, 'Error: Invalid item State')
    assert.equal(eventEmitted, true, 'Invalid event emitted')
  })

  // 2nd Test
  it("Testing smart contract function processItem() that allows a farmer to process coffee", async() => {
    itemState++
    
    // Declare and Initialize a variable for event
    var eventEmitted = false
    
    // Watch the emitted event Processed()
    await supplyChain.Processed(null, (error, event)=>{    
        eventEmitted = true
    })

    // Mark an item as Processed by calling function processItem()
    await supplyChain.processItem(upc)

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

    // Verify the result set
    assert.equal(resultBufferTwo[5], 1, 'Error: Invalid item State')
  })

  // 3rd Test
  it("Testing smart contract function packItem() that allows a farmer to pack coffee", async() => {
    itemState++
    
    // Declare and Initialize a variable for event
    var eventEmitted = false
    
    // Watch the emitted event Packed()
    await supplyChain.Packed(null, (error, event)=>{    
        eventEmitted = true
    })

    // Mark an item as Packed by calling function packItem()
    await supplyChain.packItem(upc)

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

    // Verify the result set
    assert.equal(resultBufferTwo[5], 2, 'Error: Invalid item State')
  })

  // 4th Test
  it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async() => {
    itemState++
    
    // Declare and Initialize a variable for event
    var eventEmitted = false
    
    // Watch the emitted event ForSale()
    await supplyChain.ForSale(null, (error, event)=>{    
        eventEmitted = true
    })

    // Mark an item as ForSale by calling function sellItem()
    await supplyChain.sellItem(upc, productPrice)

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

    // Verify the result set
    assert.ok(resultBufferTwo[4] > 0, 'Error: Price is less than 0')
    assert.equal(resultBufferTwo[5], 3, 'Error: Invalid item State')
  })

  // 5th Test
  it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async() => {
    itemState++

    await supplyChain.addDistributor(distributorID)

    // Declare and Initialize a variable for event
    var eventEmitted = false
    
    // Watch the emitted event Sold()
    await supplyChain.Sold(null, (error, event)=>{    
        eventEmitted = true
    })

    // console.log(await supplyChain.isDistributor(distributorID))
    // console.log(await supplyChain.checkDistributor({from: distributorID}))

    // Mark an item as Sold by calling function buyItem()
    await supplyChain.buyItem(upc, {from: distributorID, value: productPrice})
    
    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
    console.log(resultBufferTwo[6])

    // Verify the result set
    assert.equal(resultBufferTwo[5], 4, 'Error: Invalid item State')
    assert.equal(resultBufferTwo[6], distributorID, 'Error: Missing or Invalid distributorID')
  })

  // 6th Test
  it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async() => {
    itemState++

    // Declare and Initialize a variable for event
    var eventEmitted = false
    
    // Watch the emitted event Shipped()
    await supplyChain.Shipped(null, (error, event)=>{    
        eventEmitted = true
    })

    // Mark an item as Shipped by calling function shipItem()
    await supplyChain.shipItem(upc, {from: distributorID})

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
    console.log(resultBufferTwo[6])

    // Verify the result set
    assert.equal(resultBufferTwo[5], 5, 'Error: Invalid item State')
    assert.equal(resultBufferTwo[6], distributorID, 'Error: Missing or Invalid distributorID')
  })

  // 7th Test
  it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async() => {
    itemState++
    
    await supplyChain.addRetailer(retailerID)
    
    // Declare and Initialize a variable for event
    var eventEmitted = false
    
    // Watch the emitted event Received()
    await supplyChain.Received(null, (error, event)=>{
        eventEmitted = true
    })

    // Mark an item as Sold by calling function receiveItem()
    await supplyChain.receiveItem(upc, {from: retailerID, value: productPrice})

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
    console.log(resultBufferTwo[7])

    // Verify the result set
    assert.equal(resultBufferTwo[5], 6, 'Error: Invalid item State')
    assert.equal(resultBufferTwo[7], retailerID, 'Error: Missing or Invalid retailerID')     
  })

  // 8th Test
  it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async() => {
    itemState++
    
    await supplyChain.addConsumer(consumerID)

    // Declare and Initialize a variable for event
    var eventEmitted = false
    
    // Watch the emitted event Purchased()
    await supplyChain.Purchased(null, (error, event)=>{    
        eventEmitted = true
    })

    // Mark an item as Sold by calling function purchaseItem()
    await supplyChain.purchaseItem(upc, {from: consumerID, value: productPrice})

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
    console.log(resultBufferTwo[8])

    // Verify the result set
    assert.equal(resultBufferTwo[5], 7, 'Error: Invalid item State')
    assert.equal(resultBufferTwo[8], consumerID, 'Error: Missing or Invalid consumerID')   
  })

  // 9th Test
  it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async() => {
    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
    //console.log(resultBufferOne)
    
    // Verify the result set:
    assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
    assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
    assert.equal(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID')
    assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
    assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
    assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
    assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
    assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
  })

  // 10th Test
  it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {
    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
    //console.log(resultBufferTwo)

    // Verify the result set:
    assert.equal(resultBufferTwo[0], sku, 'Error: Invalid item SKU')
    assert.equal(resultBufferTwo[1], upc, 'Error: Invalid item UPC')
    assert.equal(resultBufferTwo[2], productID, 'Error: Missing or Invalid productID')
    assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
    assert.equal(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
    assert.equal(resultBufferTwo[5], 7, 'Error: Missing or Invalid itemState')
    assert.equal(resultBufferTwo[6], distributorID, 'Error: Missing or Invalid distributorID')
    assert.equal(resultBufferTwo[7], retailerID, 'Error: Missing or Invalid retailerID')
    assert.equal(resultBufferTwo[8], consumerID, 'Error: Missing or Invalid consumerID')
  })
  /**/
});