# Dapp for ConsenSys Academy Blockchain Developer Bootcamp



Dependencies: 
```  
npm install @openzeppelin/contracts ```
```npm install web3 ```
```npm install -g truffle```
```npm install gh-pages --save-dev ```

Start React App on localserver with npm start.

Run truffle tests with Truffle test

The core of finance and investments are based on time and returns, which both can be optimized with smart contracts and blockchain.

As an investor, currently technology takes two days to confirm the record keeper of a security. This leads to the idea of an "ex-dividend" date. This is the date when the security stops trading with dividend rights. Dividends are generally paid out quarterly, with some etfs providing monthly dividends. As an investor, if I can receive dividends earlier, I can reinvest those dividends and increase APY with compounding interest.

Blockchain technology allows for immediate (or close to) execuation and record keeping, thus eliminating the need for an ex-dividend date. The goal of my project is to capture eth from an investor and transfer back a "DIV" token. This DIV token will represent ownership in a tokenized stock or etf. Currently, tokenized stocks are illegal within the US, so this portion would need to be phase 2 (If the SEC eventually allows).

The current steps of the DAPP:

Attach your digital wallet to the DAPP
Purchase a DIV token (only 10k in existence!) by sending eth to the smart contract Ropsten: [0x033E10b9a84ad03e82927C7F508C7f142e3462B2].
Your digital wallet address, time of purchase, and amount will be stored in a struct
The owner of the account will pay dividends to all holders of DIV token Only the owner can pay dividends For demo purposes this is based on last block.timestamp, but eventually should be daily
If the DIV token is transferred, capture this information the same way as somebody purchasing from the smart contract
On/Off switch if bug is found in the contract
Public Ethereum Account: 0x35e9328De57f5DF21dfBdE7b0D67672Dd59A26C8
Github Pages Deployed Address: https://gniehaus.github.io/blockchain-developer-bootcamp-final-project/
