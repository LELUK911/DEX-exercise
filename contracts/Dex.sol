// SPDX-License-Identifier: Leluk911
pragma solidity 0.8.0;
//pragma experimental ABIEncoderV2;

import "./wallet.sol";

contract Dex is Wallet {
    enum Side {
        BUY,
        SELL
    }

    struct Order {
        uint256 Id;
        address Trader;
        Side side;
        uint256 amount;
        uint256 price;
        bytes32 Tiker;
    }
    uint256 NewID = 0;

    mapping(bytes32 => mapping(uint256 => Order[])) OrderBook;

    function getOrderBook(bytes32 _tiker, Side _side)
        external
        view
        returns (Order[] memory)
    {
        return OrderBook[_tiker][uint256(_side)];
    }

    function createLimitOrder(
        uint256 _amount,
        uint256 _price,
        bytes32 _tiker,
        Side _side
    ) external {
        //tokenExist(_tiker) {
        if (Side.BUY == _side) {
            require(balances[msg.sender]["ETH"] >= _amount * _price);
        } else if (Side.SELL == _side) {
            require(balances[msg.sender][_tiker] >= _amount);
        }
        Order[] storage orders = OrderBook[_tiker][uint256(_side)];
        orders.push(Order(NewID, msg.sender, _side, _amount, _price, _tiker));

        uint256 i = orders.length > 0 ? orders.length - 1 : 0;
        if (Side.BUY == _side) {
            while (i > 0) {
                if (orders[i - 1].price > orders[i].price) {
                    break;
                }
                Order memory ordersMove = orders[i - 1];
                orders[i - i] = orders[i];
                orders[i] = ordersMove;
                i--;
            }
        } else if (Side.SELL == _side) {
            while (i > 0) {
                if (orders[i - 1].price < orders[i].price) {
                    break;
                }
                Order memory ordersMove = orders[i - 1];
                orders[i - i] = orders[i];
                orders[i] = ordersMove;
                i--;
            }
        }
        NewID++;
    }

    // diamo per scontato ke la coppia si DAI/ETH
    function createMarketOrder(
        uint256 _amount,
        bytes32 _tiker,
        bytes32 _tikerExchange
    ) external {
        // array da usare
        Order[] storage orderSide = OrderBook[_tiker][1];
        // se nn ci sono ordini ci mandi indietro
        if (orderSide.length == 0) {
            revert("Order not present or this amount of coin");
        }
        // variabili per gestire l'rodine d'acquisto
        uint256 orderMArketLeft = _amount;
        uint256 orderMarketComplete = 0;

        // ciclo per pescare gli ordini nell array

        for (
            uint256 index = 0;
            index < orderSide.length && orderMArketLeft > 0;
            index++
        ) {
            // se l'rodine che peschiamo  non completa il nostro ordine rimanente
            if (orderSide[index].amount < orderMArketLeft) {
                // variabile che  ci da la differenza per aggiornare le variabili e inviare i soldi
                // aggiorniamo l'orderbook
                uint256 orderMarketPending = orderMArketLeft -
                    orderSide[index].amount;
                uint256 price = orderSide[index].price;
                // aggiornamenyo variabili per il prossimo ciclo
                orderMArketLeft -= orderMarketPending;
                orderMarketComplete += orderMarketPending;
                // trasferimento soldi dall user al wallet dell'order
                //------> PS deve prima approvare la spesa
                IERC20(TokenMapping[_tikerExchange].tokenAddress).transferFrom(
                    msg.sender,
                    address(this),
                    orderMarketPending * price
                );

                // aggiorniamo il bilancio del orderSeller
                orderSide[index].amount = 0;

                address OrderSeller = orderSide[index].Trader;
                balances[OrderSeller][_tikerExchange] +=
                    orderMarketPending *
                    price;
                //revert(" mi blocco qui al pimo if");
            } else if (orderSide[index].amount > orderMArketLeft) {
                // qua togliamo solo l'amount dall'ordine che rimane aperto comunque
                orderSide[index].amount -= orderMArketLeft;
                // riempiamo la variabile di completamento
                orderMarketComplete += orderMArketLeft;
                // operazioni di spostamento token
                uint256 price = orderSide[index].price;
                //------> PS deve prima approvare la spesa
                IERC20(TokenMapping[_tikerExchange].tokenAddress).transferFrom(
                    msg.sender,
                    address(this),
                    orderMArketLeft * price
                ); // aggiorniamo l'orderbook

                // aggiorniamo il bilancio del orderSeller
                address OrderSeller = orderSide[index].Trader;
                balances[OrderSeller][_tikerExchange] +=
                    orderMArketLeft *
                    price;
                //revert(" mi blocco qui al secondo if");
            }
        }

        while (orderSide.length > 0 && orderSide[0].amount == 0) {
            for (uint256 i = 0; i < orderSide.length - 1; i++) {
                orderSide[i] = orderSide[i + 1];
            }
            orderSide.pop();
        }
    }
}
