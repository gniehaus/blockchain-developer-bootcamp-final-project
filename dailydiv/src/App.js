import React,{useEffect} from 'react';
import './App.css';
import Web3 from 'web3';
//import fs from 'fs';
var fs = require('fs');
const divABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "accountAddress",
				"type": "address"
			}
		],
		"name": "LogDividendsPaid",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "accountAddress",
				"type": "address"
			}
		],
		"name": "LogOwnerChange",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "accountAddress",
				"type": "address"
			}
		],
		"name": "LogPurchasedNew",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "accountAddress",
				"type": "address"
			}
		],
		"name": "LogPurchasedOld",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "accountAddress",
				"type": "address"
			}
		],
		"name": "LogTokenTransfer",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenVal",
				"type": "uint256"
			}
		],
		"name": "LogTokenVal",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "subtractedValue",
				"type": "uint256"
			}
		],
		"name": "decreaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "addedValue",
				"type": "uint256"
			}
		],
		"name": "increaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "divPayment",
				"type": "uint256"
			}
		],
		"name": "payDividendAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "purchaseAsset",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "resumeContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "stopContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "getHolders",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMaxSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ids",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "idx",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "lastDividend",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "maxSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "purchaseTimestamp",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "records",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "assetsOwned",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "assetBuyer",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "timeofPurchase",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastdivTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "firstPurchase",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "stopped",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokenOwnersCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalETH",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalEthOwned",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const divAddress = '0x033E10b9a84ad03e82927C7F508C7f142e3462B2';
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

web3.eth.getAccounts().then(console.log);
console.log(web3);


const mmEnable = async () => {
  console.log('mmEnable fired')
  await web3.eth.requestAccounts().then(console.log);
  const accts = await web3.eth.getAccounts();
  var act = document.getElementById('mm-current-account')
  act.innerHTML = 'Account Address:' + accts[0];
  
}

const divSubmit = async () => {
  console.log('purchase val')
  var divInputValue = document.getElementById('div-input-box').value
  try {
  var txStatus = document.getElementById('tx-status')
  var divInputValue = web3.utils.toWei(divInputValue,'ether')
} catch (err)
{   alert('Please add investment amount.');
    console.log(err)
    txStatus.innerHTML = 'Transaction Status: Transaction Failed'
}

  const divContract = new web3.eth.Contract(divABI, divAddress)
  const accts = await web3.eth.getAccounts();
  console.log(accts);
  console.log(divInputValue);
  try {
    var txStatus = document.getElementById('tx-status')
    txStatus.innerHTML = 'Transaction Status: Transaction Pending'
    const txn = await divContract.methods.purchaseAsset(accts[0]).send({from: accts[0], 
        value:divInputValue})
    txStatus.innerHTML = 'Transaction Status: Investment Transaction Finished ' + web3.utils.fromWei(divInputValue,'ether') + ' tokens purchased'

    } catch (err)
{alert('Please add investment amount.');
    console.log(err)
    txStatus.innerHTML = 'Transaction Status: Transaction Failed'
}
 }

const getDiv = async () => {
  const divContract = new web3.eth.Contract(divABI, divAddress)
  const accts = await web3.eth.getAccounts();
  var value = await divContract.methods.getMaxSupply().call() 
  var value = web3.utils.fromWei(value,'ether');
  console.log(value)
  const ssDisplayValue = document.getElementById('div-display-value')
  ssDisplayValue.innerHTML = 'Total Supply of Div Tokens: ' + value
}

const getTotalEth = async () => {
const divContract = new web3.eth.Contract(divABI, divAddress)
var value = await divContract.methods.totalETH().call() 
var value = web3.utils.fromWei(value,'ether');
console.log(value)
const ssDisplayValue = document.getElementById('total-eth-value')
ssDisplayValue.innerHTML = 'Total ETH Contract Owns: ' + value
  }


const transferDiv = async () => {
const divContract = new web3.eth.Contract(divABI, divAddress)
const accts = await web3.eth.getAccounts();
var divTransferValue = document.getElementById('transfer-input-box').value;
try {divTransferValue = web3.utils.toWei(divTransferValue,'ether');
} catch (err)
{
    alert('Please add value to input.');
    console.log(err)
}
const divTransferAcct= document.getElementById('transfer-account-box').value
console.log(divTransferValue)
console.log(divTransferAcct)
try {
    var txStatus = document.getElementById('tx-status')
    txStatus.innerHTML = 'Transaction Status: Transaction Pending'
    await divContract.methods.transfer(divTransferAcct,divTransferValue).send({from: accts[0]});
    txStatus.innerHTML = 'Transaction Status: Div Token Transfer Finished ' + web3.utils.fromWei(divTransferValue,'ether')  + ' tokens transferred to ' + divTransferAcct

} catch (err)
{
    alert('Please add addresss to transfer div.');
    console.log(err)
    txStatus.innerHTML = 'Transaction Status: Transaction Failed'
}
}

const holderBalance = async () => {
const divContract = new web3.eth.Contract(divABI, divAddress)
const accts = await web3.eth.getAccounts()
var value = await divContract.methods.getHolders(accts[0]).call()
var initPurchase = await divContract.methods.purchaseTimestamp(accts[0]).call()
var lastDivTime = await divContract.methods.lastDividend(accts[0]).call()
console.log(value)
const divOwned = document.getElementById('div-owned-value')
const timeDiv = document.getElementById('div-purchase')
divOwned.innerHTML = 'Address: ' + accts[0] + ' owns ' + web3.utils.fromWei(value,'ether') + ' Div Tokens'
timeDiv.innerHTML = 'First purchase was timestamp ' + initPurchase + ' and last dividend was timestamp ' +  lastDivTime
console.log(accts[0])

}

const payDiv = async () => {
    const divContract = new web3.eth.Contract(divABI, divAddress)
    const accts = await web3.eth.getAccounts()
    var divAmount = document.getElementById('dividend-value').value;
    console.log(divAmount);
    var divAmount= web3.utils.toWei(divAmount,'ether');

    try {
        var txStatus = document.getElementById('tx-status')
        txStatus.innerHTML = 'Transaction Status: Transaction Pending'
    await divContract.methods.payDividendAll(divAmount).send({from: accts[0]});
    txStatus.innerHTML = 'Transaction Status: Dividends paid out in Eth' 
    } catch (err)
    {
        alert('Please dividend add payment amount. Also must be owner to pay dividends.');
        console.log(err)
        txStatus.innerHTML = 'Transaction Status: Transaction Failed'
    }
    }
    

function App() {

  return ( <div> 
    <h4>Daily Dividend POC (Phase1)</h4> 
    <button onClick={mmEnable} id="mm-connect">Connect to MetaMask</button>

    <div id="mm-detected"></div>

    <div  id="mm-current-account"></div>

    <div>
    

    <input id="div-input-box" type="number" placeholder="Amount of Div Token to Invest In"/>  
    </div>
    <button onClick={divSubmit} id="div-input-button">Purchase DIV Token (Measured in Eth)</button>

    <div>
    <button onClick={getDiv} id="div-get-value">Get Max Supply of DIV Tokens </button>
    </div>
    <div id="div-display-value">Max Supply of DIV Tokens: </div>

    <div>
    <button onClick={getTotalEth} id="get-total-eth-value">Get Contract ETH</button>
    </div>

    <div id="total-eth-value">Total ETH Contract Owns: </div>

    <div>
    <input id="transfer-input-box" type="number" placeholder="Provide transfer amount"/>  
    </div>

    <div>
    <input id="transfer-account-box"  placeholder="Provide transfer address"/>  
    </div>
    <button onClick={transferDiv} id="transfer-input-button">Transfer DIV Amount (Add Address & Amount First)</button>
    <div> </div>
    <button onClick={holderBalance} id="holders-button">Total DIV Owned: (Measured in Eth)</button>
    <div id="div-owned-value"> </div>
    <div id="div-purchase"> </div>
    
    <div>
    <input id="dividend-value" type="number" placeholder="Provide Dividend Amount"/>  
    </div>
    <div> 
    <button onClick={payDiv} id="holders-button">Pay Dividends (must be owner)</button>
  </div>

  <div id="tx-status">Transaction Status: No Transactions Selected </div>

  </div>
  
  );
}

export default App;
