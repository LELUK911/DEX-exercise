// The user must have ETH deposited such that deposited eth >= buy order value
// The user must have enough tokens deposited such that token balance >= sell order amount
// The BUY order book should be ordered on price from highest to lowest starting at index 0
// The SELL order book should be ordered on price from lowest to highest starting at index 0
// The User should not be able to create for not supported tokens


const Dex = artifacts.require("Dex");
const mockDai = artifacts.require("mockDai");
const mockWETH = artifacts.require("mockWETH");
const truffleAssert = require("truffle-assertions");


contract.skip("Dex", accounts => {
    it("The user must have ETH deposited such that deposited eth >= buy order value", async () => {
        let dex = await Dex.deployed();
        let dai = await mockDai.deployed();
        let account = accounts[0];
        await truffleAssert.reverts(
            dex.createLimitOrder(20, 2, web3.utils.fromUtf8("DAI"), 1)
        );
        await dex.addToken(web3.utils.fromUtf8("DAI"), dai.address, { from: account })
        await dex.depositEth({ value: 40 });
        await truffleAssert.passes(
            dex.createLimitOrder(
                20,
                2,
                web3.utils.fromUtf8("DAI"),
                0)
        );


    });
    it("The user must have enough tokens deposited such that token balance >= sell order amount", async () => {
        let dex = await Dex.deployed();
        let dai = await mockDai.deployed();
        await truffleAssert.reverts(
            dex.createLimitOrder(
                20,
                2,
                web3.utils.fromUtf8("DAI"),
                1)
        );
        await dex.addToken(web3.utils.fromUtf8("DAI"), dai.address)
        await dai.approve(dex.address, 20);
        await dex.deposit(20, web3.utils.fromUtf8("DAI"))
        await truffleAssert.passes(
            dex.createLimitOrder(20, 2, web3.utils.fromUtf8("DAI"), 1)
        )

    });
    //The BUY order book should be ordered on price from highest to lowest starting at index 0
    it("The BUY order book should be ordered on price from highest to lowest starting at index 0", async () => {
        let dex = await Dex.deployed()
        let dai = await mockDai.deployed();
        await dai.approve(dex.address, 500);
        await dex.depositEth({ value: 4000000 });
        await dex.addToken(web3.utils.fromUtf8("DAI"), dai.address)
        await dex.createLimitOrder(1, 300, web3.utils.fromUtf8("DAI"), 0)
        await dex.createLimitOrder(1, 100, web3.utils.fromUtf8("DAI"), 0)
        await dex.createLimitOrder(1, 200, web3.utils.fromUtf8("DAI"), 0)

        let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("DAI"), 0);
        for (let i = 0; i < orderbook.length - 1; i++) {
            assert(orderbook.length > 0);
            //const element = array[index];
            assert(orderbook[i] >= orderbook[i + 1])
        }
    })
    //The SELL order book should be ordered on price from lowest to highest starting at index 0
    it("The SELL order book should be ordered on price from lowest to highest starting at index 0", async () => {
        let dex = await Dex.deployed()
        let dai = await mockDai.deployed();
        await dai.approve(dex.address, 500);
        await dex.deposit(500, web3.utils.fromUtf8("DAI"));
        await dex.createLimitOrder(1, 300, web3.utils.fromUtf8("DAI"), 1)
        await dex.createLimitOrder(1, 100, web3.utils.fromUtf8("DAI"), 1)
        await dex.createLimitOrder(1, 200, web3.utils.fromUtf8("DAI"), 1)

        let orderbook = await dex.getOrderBook(web3.utils.fromUtf8("LINK"), 1);
        for (let i = 0; i < orderbook.length - 1; i++) {
            assert(orderbook.length > 0);
            //const element = array[index];
            assert(orderbook[i] <= orderbook[i + 1])
        }
    })

})
