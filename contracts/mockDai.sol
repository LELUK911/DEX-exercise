// SPDX-License-Identifier: Leluk911
pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract mockDai is ERC20 {
    uint256 private _totalSupply = 1000000000000;

    constructor() ERC20("mockDai", "DAI") {
        _mint(msg.sender, _totalSupply);
    }
}
