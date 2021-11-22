DailyDiv = artifacts.require("DailyDiv");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("DailyDiv", function (accounts) {
  it("should assert true", async function () {
    await DailyDiv.deployed();
    return assert.isTrue(true);
  });


  // this test checks to make sure the proper amount of tokens (10k) exist
  it("has initial max supply of 10000", async function() {
    const ddinstance = await DailyDiv.deployed();
    const maxSupply = await ddinstance.getMaxSupply.call();
    assert.equal(maxSupply, 10000 * 10 **18,'Total Div Token Supply should be 5');
  }
  );

  // this test checks to make sure initial id count is set to 1. Addresses who have not invested show up as 0. 
  //This is why id is set to 1 at initiation.
  it("has initial id count of 1", async function() {
    const ddinstance = await DailyDiv.deployed();
    const tokenOwners = await ddinstance.tokenOwnersCount.call();
    assert.equal(tokenOwners, 1,'Initial Value of ids is 1');
  }
  );

  //Once account[0] invests, id count is incremented. This is the counters from solidity. id count shoudl now be 2
  describe("functionality", () =>{
    it("id count should equal 2",async () => {
      const ddinstance = await DailyDiv.deployed();
      await ddinstance.purchaseAsset(accounts[0],{value: 1, from: accounts[0]});
      const tokenOwners = await ddinstance.tokenOwnersCount.call(); 
      assert.equal(tokenOwners, 2,'ID Value after purchase is not 2');
    });
  });

  // account[0] has invested in 2 div tokens for the price of 2 eth. Total eth should be 2.
  describe("functionality", () =>{
    it("Total ETH Owned Equals 1",async () => {
      const ddinstance = await DailyDiv.deployed();
      await ddinstance.purchaseAsset(accounts[0], {value: 1, from: accounts[0]});
      const totalEth = await ddinstance.totalETH.call(); 
      assert.equal(totalEth, 2,'Total ETH Does not Equal 2');
    });
  });
  
  //this is the third time we have called purchaseAsset from accounts[0]. This means accounts 0 should have 3 Eth.
  describe("functionality", () =>{
    it("Account[0] ETH is Correctly Stored",async () => {
      const ddinstance = await DailyDiv.deployed();
      await ddinstance.purchaseAsset(accounts[0], {value: 1, from: accounts[0]});
      const addressEth = await ddinstance.getHolders.call(accounts[0]); 
      assert.equal(addressEth, 3,'Struct Stores 3 ETH');
    });
  });

  //First time calling for account[1]. Account[1] should have 1 Eth.
  describe("functionality", () =>{
    it("Account[1] ETH is Correctly Stored",async () => {
      const ddinstance = await DailyDiv.deployed();
      await ddinstance.purchaseAsset(accounts[1], {value: 1, from: accounts[1]});
      const addressEth = await ddinstance.getHolders.call(accounts[1]); 
      assert.equal(addressEth, 1,'Struct Stores 1 ETH');
    });
  });

// total eth should equal 4 after acount[0] invested 3 times and account[1], once.
  describe("functionality", () =>{
    it("Total ETH Owned Equals 4",async () => {
      const ddinstance = await DailyDiv.deployed();
      const totalEth = await ddinstance.totalETH.call(); 
      assert.equal(totalEth, 4,'Total ETH Does not Equal 4');
    });
  });

// token owners equals 3 now since the initial value of 1 plus account[0] and account[1].
  describe("functionality", () =>{
    it("id count should equal 3",async () => {
      const ddinstance = await DailyDiv.deployed();
      const tokenOwners = await ddinstance.tokenOwnersCount.call(); 
      assert.equal(tokenOwners, 3,'ID Value is not 3');
    });
  });

// The smart contract owns 4 eth, after paying 1 Eth in dividends to account[0] and account[1] total Eth should equal 2.
  describe("functionality", () =>{
    it("Total ETH should equal 2 After Paying Dividends",async () => {
      const [owner, nonOwner] = accounts;
      const ddinstance = await DailyDiv.deployed(owner);
      try {
      await ddinstance.payDividendAll(1)
      } catch(err){ }
      const totalEth = await ddinstance.totalETH.call();  
      assert.equal(totalEth, 2,'Total ETH Does not equal 2 After Paying Dividends');
    });
  });

  // Only the owner should be able to pay dividends. Since account[1] is not the owner, this call should not go through and total eth should equal 2.
  describe("functionality", () =>{
    it("Only Onwer Should be able to Pay Dividends",async () => {
      const [owner, nonOwner] = accounts;
      const ddinstance = await DailyDiv.deployed(owner);
      try {
      await ddinstance.payDividendAll(1, {from: nonOwner});
      } catch(err){ }
      const totalEth = await ddinstance.totalETH.call(); 
      assert.equal(totalEth, 2,'Total ETH Is not the Same');
    });
  });
});
