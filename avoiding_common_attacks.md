I have identified two common attack vectors and have commented them within the code. The first is the use of modifiers only for validation. I have two modifiers: isOwner and isStopped. Both help control against attacks and potential bugs. If a bug exists, the contract can be shutdown by turning stopped = true. The main functions use both these modifers to add greater security to the contract.

Attack vector number two is the use of require statements within functions. for purchaseAsset, not only is isStopped included, but I require the total supply minted of DIV token to be less than the max supply. Additionally, I make sure eth has been sent with the function call. I also check in the transfer function to make sure eth is seent. Ultimately, I inherit the _transfer function from open zeppelin erc20 contract.


Additional, truffle required the ^ carrot for solidity version. I commented this in the code, but I would remove this for an actual production launch.
