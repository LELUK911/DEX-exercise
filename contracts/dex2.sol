// SPDX-License-Identifier: Leluk911
pragma solidity 0.8.0;
pragma experimental ABIEncoderV2;

import "./wallet.sol";

contract Dex2 is Wallet {
    enum Side {
        BUY,
        SELL
    }

    struct Order {
        uint256 Id;
        address Trader;
        bool buyOrder;
        uint256 amount;
        uint256 price;
        bytes32 Tiker;
        bool execute;
    }

    uint256 id;
    mapping(bytes32 => mapping(uint256 => Order[])) public OrderBook;
    mapping(uint256 => mapping(bytes32 => Order[])) public buyOrder;
    mapping(uint256 => mapping(bytes32 => Order[])) public sellOrder;
    mapping(bytes32 => uint256) priceTiker;

    function getOrderBook(bytes32 _tiker, Side _side)
        external
        view
        returns (Order[] memory)
    {
        return OrderBook[_tiker][uint256(_side)];
    }

    function createLimitOrder(
        bool _buyorder,
        uint256 _amount,
        uint256 _price,
        bytes32 _tiker,
        Side _side,
        bytes32 _tikerSell
    ) external tokenExist(_tiker) {
        Order memory newOrder = Order(
            id,
            msg.sender,
            _buyorder,
            _amount,
            _price,
            _tiker,
            false
        );
        id++;
        require(
            balances[msg.sender][_tikerSell] >= _amount * _price,
            "balance insufficent for this order"
        );

        OrderBook[_tiker][uint256(_side)].push(newOrder);
        if (Side.BUY == _side) {
            buyOrder[_price][_tiker].push(newOrder);
        } else {
            sellOrder[_price][_tiker].push(newOrder);
        }
    }

    function setprice(uint256 _price, bytes32 _tiker) external onlyOwner {
        priceTiker[_tiker] = _price;
    }

    function executeOrder(uint256 _price, bytes32 _tiker) internal {}
}
