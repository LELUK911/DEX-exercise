// SPDX-License-Identifier: Leluk911
pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract mockWETH is ERC20 {
    uint256 private _totalSupply = 10000;

    constructor() ERC20("mockWETH", "WETH") {
        _mint(msg.sender, _totalSupply);
    }
}
