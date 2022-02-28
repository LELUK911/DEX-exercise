// SPDX-License-Identifier: Leluk911
pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/interfaces/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Wallet is ReentrancyGuard, Ownable {
    event depositToken(address indexed, bytes32 indexed, uint256 indexed);
    event withdrawToken(address indexed, bytes32 indexed, uint256 indexed);
    event depositETH(address indexed, string, uint256 indexed);
    // use this struct for store token in wallet
    struct Token {
        bytes32 tiker;
        address tokenAddress;
    }

    mapping(bytes32 => Token) public TokenMapping;
    // array for store Token for Token.tiker
    bytes32[] public TokenList; // only list.. some information give in mapping TokenMapping

    // duble mapping for balance every Token in wallet add
    mapping(address => mapping(bytes32 => uint256)) public balances;

    modifier tokenExist(bytes32 ticker) {
        require(
            TokenMapping[ticker].tokenAddress != address(0),
            "token does not exist"
        );
        _;
    }

    function addToken(bytes32 _tiker, address _tokenAddress)
        external
        nonReentrant
        onlyOwner
    {
        // add token information i wallet
        TokenMapping[_tiker] = Token(_tiker, _tokenAddress);
        // push only _tiker.. mapping need for take address.
        TokenList.push(_tiker);
    }

    function deposit(uint256 _amount, bytes32 _tiker)
        external
        nonReentrant
        tokenExist(_tiker)
    {
        // before approve this spend
        IERC20(TokenMapping[_tiker].tokenAddress).transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        balances[msg.sender][_tiker] += _amount;
        emit depositToken(msg.sender, _tiker, _amount);
    }

    function withdraw(uint256 _amount, bytes32 _tiker)
        external
        nonReentrant
        tokenExist(_tiker)
    {
        require(TokenMapping[_tiker].tokenAddress != address(0)); // address assigne not 0X00000
        require(balances[msg.sender][_tiker] >= _amount, "balance insufficent"); // check balance before
        balances[msg.sender][_tiker] -= _amount; //update balance befor transfer
        IERC20(TokenMapping[_tiker].tokenAddress).transfer(msg.sender, _amount); // transfer
        emit withdrawToken(msg.sender, _tiker, _amount);
    }

    function depositEth() external payable {
        balances[msg.sender]["ETH"] += msg.value;
        emit depositETH(msg.sender, "ETH", msg.value);
    }

    function getBalance(bytes32 _tiker) external view returns (uint256) {
        return balances[msg.sender][_tiker];
    }
}
