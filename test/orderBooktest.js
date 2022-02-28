


const Dex = artifacts.require("Dex");
const mockDai = artifacts.require("mockDai");
const mockWETH = artifacts.require("mockWETH");
const truffleAssert = require("truffle-assertions");

contract("Dex", accounts => {
    //When creating a SELL market order, the seller needs to have enough tokens for the trade
    it("When creating a SELL market order, the seller needs to have enough tokens for the trade", async () => {
        let dex = await Dex.deployed();
        await dex.depositEth({ value: 400 });
        let balance = await dex.getBalance(web3.utils.fromUtf8("ETH"));
        assert.equal(balance.toNumber(), 400, "deposit not congruents");
        await truffleAssert.reverts(
            dex.createMarketOrder(401, web3.utils.fromUtf8("ETH"), 1)
        )
    });
    it("Market orders can be submitted even if the order book is empty", async () => {
        let dex = await Dex.deployed()
        await dex.depositEth({ value: 400 });
        let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("ETH"), 1);
        assert.equal(orderbook.length, 0, "orderbook empty");
        await truffleAssert.passes(
            dex.createMarketOrder(401, web3.utils.fromUtf8("ETH"), 1)
        )

    })
    //Market orders should be filled until the order book is empty or the market order is 100% filled
    it("//Market orders is 100% filled", async () => {
        let dex = await Dex.deployed()
        let dai = await mockDai.deployed();
        // user that sell ETH;
        await dex.addToken(web3.utils.fromUtf8("DAI"), dai.address);
        await dai.approve(dex.address, 10000);
        await dex.deposit(10000, web3.utils.fromUtf8("DAI"));
        ;

        // accout that create a limit order sell ETH x 

        await dex.depositEth({ from: accounts[1], value: 2 });
        await dex.createLimitOrder(2, 1000, web3.utils.fromUtf8("ETH"), 1, { from: accounts[1] });

        await dex.depositEth({ from: accounts[2], value: 7 });
        await dex.createLimitOrder(7, 1000, web3.utils.fromUtf8("ETH"), 1, { from: accounts[2] });

        await dex.depositEth({ from: accounts[3], value: 3 });
        await dex.createLimitOrder(3, 1000, web3.utils.fromUtf8("ETH"), 1, { from: accounts[3] });

        await dex.createMarketOrder(10, web3.utils.fromUtf8("ETH"), 0)


        orderbook = await dex.getOrderBook(web3.utils.fromUtf8("ETH"), 1); //Get sell side orderbook
        assert(orderbook.length == 1, "Sell side Orderbook should only have 1 order left");
        assert(orderbook[0].filled == 0, "Sell side order should have 0 filled");

    });
    it("//Market orders isnt 100% filled because order book empty", async () => {
        let dex = await Dex.deployed()
        let dai = await mockDai.deployed();
        // user that sell ETH;
        await dex.addToken(web3.utils.fromUtf8("DAI"), dai.address);
        await dai.approve(dex.address, 10000);
        await dex.deposit(10000, web3.utils.fromUtf8("DAI"));


        // accout that create a limit order sell ETH x 

        await dex.depositEth({ from: accounts[1], value: 2 });
        await dex.createLimitOrder(2, 1000, web3.utils.fromUtf8("ETH"), 1, { from: accounts[1] });

        await dex.depositEth({ from: accounts[2], value: 7 });
        await dex.createLimitOrder(2, 1000, web3.utils.fromUtf8("ETH"), 1, { from: accounts[2] });

        await dex.depositEth({ from: accounts[3], value: 3 });
        await dex.createLimitOrder(3, 1000, web3.utils.fromUtf8("ETH"), 1, { from: accounts[3] });



        await dex.createMarketOrder(10, web3.utils.fromUtf8("ETH"), 0);

        let balance = await dex.getBalance(web3.utils.fromUtf8("ETH"));

        assert(balance == 7);
        orderbook = await dex.getOrderBook(web3.utils.fromUtf8("ETH"), 1); //Get sell side orderbook
        assert(orderbook[0].filled == 0, " order book empty");
    });

})