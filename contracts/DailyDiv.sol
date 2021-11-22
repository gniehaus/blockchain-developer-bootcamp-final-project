///@notice the ^ is used to work with truffle. This can be removed when productionalized.
pragma solidity ^0.8.0;

/// @title POC for Daily Dividends
/// @author Grayson Niehaus
/// @notice This is a POC to demonstrate the feasibility of paying ETH to holders of DIV token

/// @notice leverage the ERC20 token and counters contract from OpenZeppelin
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
 

//inherit the ERC20 contract to mint DIV token to investors
/// ***DESIGN PATTERN #1 - INHERITANCE AND INTERFACES***
contract DailyDiv is ERC20  {
  /// @notice inherit the Counters contract to keep an index of digital wallets who invest
    using Counters for Counters.Counter;
  /// @notice alias name to ids
    Counters.Counter public ids;
  
  /// @notice owner of smart contract
    address public owner;
  /// @notice total number of DIV tokens created
    uint256 public maxSupply;
  /// @notice total amount of ETH owned by smart contract
    uint256 public totalEthOwned;
  /// @notice emergency stop flag
    bool public stopped;
    
    constructor() ERC20("DivToken", "DIV") {
    /// ***DESIGN PATTERN #2 - Access Control Design Patterns***
    /// @notice set owner equal to creator of smart contract
        owner = msg.sender; 
    /// @notice only 10000 tokens in instance
        maxSupply = 10000 * 10 **18;
    /// @notice initial increment because wallets without tokens show up as idx 0. Wallets who have not invested show up as 0...
    /// @notice ...avoids conflict of an actual owner with idx 0 
        ids.increment();
    /// @notice initial eth set as 0
        totalEthOwned = 0;

    /// @notice start contract in working state
      stopped = false;
    }
    
    //set mappings
    /// @notice in order to loop through record holders we need the index to be a number not an address
    /// @notice store the address to uint mapping then use that int as the key for the struct, holders
    mapping (uint => holders) public records;
    mapping (address => uint) public idx;

    /// @notice purchased event for new investors
    event LogPurchasedNew(address accountAddress);

    /// @notice purchased event for old investors
    event LogPurchasedOld(address accountAddress);

    /// @notice dividend event
    event LogDividendsPaid(address accountAddress);

    /// @notice token val event
    event LogTokenVal(uint256 tokenVal);

    /// @notice token val event
    event LogTokenTransfer(address accountAddress);


    /// @notice owner change even
    event LogOwnerChange(address accountAddress);

    /// @notice holders struct
    struct holders { 
      uint assetsOwned;
      address payable assetBuyer;
      uint timeofPurchase;
      uint lastdivTime;
      uint firstPurchase;
   }

   /// ***DESIGN PATTERN #2 - Access Control Design Patterns***
  /// @notice quality control to make sure only the smart contract owner can pay dividends
  /// @notice used in the payDividendAll function
   /// ***ATTACK VECTOR #1 - Use modifiers only for validation***
  modifier isOwner (){
    require(owner == msg.sender);
  _;
}

   /// ***DESIGN PATTERN #3 - Access Control Design Patterns***
  /// @notice quality control to make sure contract is in working state
  /// @notice if a bug is found stopped will equal true
  /// ***ATTACK VECTOR #1 - Use modifiers only for validation***

modifier isStopped (){
  require(stopped==false);
_;
}

  /// @notice send ETH to smart contract and recieve DIV token back
  /// @param _addr: the address to pay receive the DIV token
  /// @return bool true, if total supply is now met and some amount of ETH is sent 
  function purchaseAsset(address _addr) public payable isStopped returns(bool) {
    /// ***ATTACK VECTOR #2 - Proper use of require statements***
    /// @notice  don't mint anymore tokens if max tokens are reached
    require(ERC20.totalSupply() + msg.value <= maxSupply, 'ERC20Capped: cap exceeded');
    /// @notice require each call to have a value
    require(msg.value > 0, 'No eth sent, please send eth');
    
    /// @notice logic if the investor has purchased in the past
    if (records[idx[_addr]].firstPurchase > 0)
    {  
      /// @notice mint new token and increase total eth owned
      _mint(_addr,msg.value);
      totalEthOwned += msg.value;


      /// @notice store uint as records mapping
      records[idx[_addr]] = holders({
      assetsOwned: ERC20.balanceOf(_addr), 
      assetBuyer: payable(_addr),
      timeofPurchase: block.timestamp,
      firstPurchase: records[idx[_addr]].firstPurchase,
      lastdivTime: records[idx[_addr]].lastdivTime  
    });
      /// @notice emit events
      emit LogPurchasedOld(_addr);  
      emit LogTokenVal(ids._value);
    
    }
    /// @notice logic if new investor invests
    else {
      _mint(_addr,msg.value);
      totalEthOwned += msg.value;
      idx[_addr] = ids._value;
      records[idx[_addr]] = holders({
      assetsOwned:  ERC20.balanceOf(_addr), 
      assetBuyer: payable(_addr),
      firstPurchase: block.timestamp,
      timeofPurchase: block.timestamp,
      lastdivTime: records[idx[_addr]].lastdivTime

    });
    /// @notice increase variables ids by 1
      ids.increment();

    /// @notice emit address of purchase event and new value of ids
      emit LogPurchasedNew(_addr);
      emit LogTokenVal(ids._value);
    }
      return true; 
  }
     
  /// @notice For owners of DIV token, pay them ETH
  /// @param divPayment: the amount of eth sent to owners of DIV token
  /// @dev if statement should be updated in future to pay on a daily basis, not just lastdivTime
  /// @dev loop through ints, which is used to slice records
  /// @dev using keepers from Chainlink would be a way to automate this
  /// @return bool true, if modifer isOwner passes
  function payDividendAll(uint divPayment) public isOwner isStopped returns(bool) {
    for (uint i=1; i<ids._value; i++) {
        if (block.timestamp >= records[i].lastdivTime) {
        emit LogDividendsPaid(records[i].assetBuyer);
        records[i].assetBuyer.transfer(divPayment);
        records[i].lastdivTime = block.timestamp;
        totalEthOwned -= divPayment;
        }
      }
    return true;   
    }
      
  /// @notice Transfers DIV tokens between addresses and stores recipient info in holders, if appropriate
  /// @dev overrides OpenZeppelin ERC20 transfer function to account for investors who we need to store in our struct, holders
  /// @return bool true, if require code is met
  function transfer(address recipient, uint256 amount) public virtual override isStopped returns (bool) {
        /// ***ATTACK VECTOR #2 - Proper use of require statements***
      require(amount > 0, 'No eth sent, please send eth');
      _transfer(_msgSender(), recipient, amount);
      if (records[idx[recipient]].firstPurchase > 0)
      {
          records[idx[recipient]] = holders({
          assetsOwned: ERC20.balanceOf(recipient), 
          assetBuyer: payable(recipient),
          timeofPurchase: block.timestamp,
          firstPurchase: records[idx[recipient]].firstPurchase,
          lastdivTime: records[idx[recipient]].lastdivTime  
      });
       /// @notice emit address of transfer event. No need to update ids sent the address has already invested
       emit LogTokenVal(ids._value);
      }
      else
      {
          idx[recipient] = ids._value;
          /// @notice store uint as records mapping
          records[idx[recipient]] = holders({
          assetsOwned: ERC20.balanceOf(recipient), 
          assetBuyer: payable(recipient),
          firstPurchase: block.timestamp,
          timeofPurchase: block.timestamp,
          lastdivTime: records[idx[recipient]].lastdivTime
      });
      /// @notice emit address of transfer event and new value of ids
      ids.increment();
      emit LogPurchasedNew(recipient);
      emit LogTokenVal(ids._value);
      }
      return true;
      }


  /// ***DESIGN PATTERN #2 - Access Control Design Patterns***
  /// @notice delegates a new owner of the smart contract
  /// @param newOwner: Address to take ownership of the smart contract
  /// @return bool true if the isOwner modifier passes
  function transferOwnership(address newOwner) public isOwner isStopped returns(bool) {
    owner = newOwner;
    emit LogOwnerChange(newOwner);
    return true;
  }
    
  /// @notice returns the total amount of ETH the smart contract holds
  /// @return Total ETH in WEI, uint256
  function totalETH() public view returns (uint256) {
    return totalEthOwned;
  }

  /// @notice returns the max supply of DIV Tokens
  /// @return Total DIV Tokens in WEI, uint256
  function getMaxSupply() public view returns (uint256) {
    return maxSupply;
  }

  /// @notice returns how many unique individuals have invested or have had DIV transferred
  /// @return Total unique investors as an integer
  function tokenOwnersCount() public view returns (uint256) {
    return ids._value;
  }

  /// @notice returns the total amount of div tokens the holder owns
  /// @param _addr: the address that may or may not hold any DIV
  /// @return DIV Tokens owned in WEI, uint256
  function getHolders(address _addr) public view returns (uint256) {
    return records[idx[_addr]].assetsOwned;
  }
  
  /// @notice returns the last dividend timestamp for an address
  /// @param _addr: the address that may or may not hold any DIV
    function lastDividend(address _addr) public view returns (uint256) {
    return records[idx[_addr]].lastdivTime;
  }
  
 /// @notice returns the first timetamp div was purchased for an account
 /// @param _addr: the address that may or may not hold any DIV
    function purchaseTimestamp(address _addr) public view returns (uint256) {
    return records[idx[_addr]].firstPurchase;
  }

/// ***DESIGN PATTERN #3 - Access Control Design Patterns***
/// @notice turns off core functionality of code
function stopContract() isOwner public {
    stopped = true;
}
/// ***DESIGN PATTERN #3 - Access Control Design Patterns***
/// @notice turns back on core functionality of code
function resumeContract() isOwner public {
    stopped = false;
}
}
       