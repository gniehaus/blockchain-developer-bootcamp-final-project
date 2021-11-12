1. Users will need to invest in DIV token by sending eth to the smart contract.
function purchaseAsset(address _addr) public payable returns(bool) { 
//purchase eth get DIV token
}

2. The owner of DIV token has ownership rights in tokenized stocks/etf and will recieve dividends
function payDividendAll(uint divPayment) public isOwner returns(bool) {
//loops through all holders of DIV token and pays argument divPayment. This should be more mathematical in the future.
}

3. The owner has the ability to liquidate their positition to another recipient
function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
//if the DIV token is transfered somewhere else, we need to update our struct to account for who owns the DIV token.
}

4. We will provide users the ability to see how much eth the smart contract has received
 function totalETH() public view returns (uint256) {
  return totalEthOwned;
}
  
5. Uses are able to check the max supply of tokens available (5)  
function getMaxSupply() public view returns (uint256) {
  return maxSupply;
}

6. Users will be able to see how many people have either purchased directly from the contract or have transferred DIV between themselves.
function tokenOwnersCount() public view returns (uint256) {
  return ids._value;
}

7. Users can check how much DIV a digital wallet is holding based on address.
function getHolders(address _addr) public view returns (uint256) {
  return records[idx[_addr]].assetsOwned;
}
