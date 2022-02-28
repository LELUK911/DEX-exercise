const Dex = artifacts.require("Dex");
const mockDai = artifacts.require("mockDai");
const mockWETH = artifacts.require("mockWETH");
const truffleAssert = require("truffle-assertions");

contract("Dex", accounts => {

    it("Make order fill 100% with one order", async () => {
        let dex = await Dex.deployed();
        let dai = await mockDai.deployed();
        let SellerETH = '0x56C2343a3862E24996e1481Ffa40bBDb8F303d7f';
        let weth = await mockWETH.deployed();

        await weth.transfer(SellerETH, 10000);

        await dex.addToken(web3.utils.fromUtf8("DAI"), dai.address);
        await dex.addToken(web3.utils.fromUtf8("WETH"), weth.address);

        await weth.approve(dex.address, 1000, { from: accounts[1] });
        await dex.deposit(1000, web3.utils.fromUtf8("WETH"), { from: accounts[1] });

        await dex.createLimitOrder(2, 100, web3.utils.fromUtf8("WETH"), 1, { from: accounts[1] })

        await dai.approve(dex.address, 1000);
        await dex.createMarketOrder(1, web3.utils.fromUtf8("WETH"), web3.utils.fromUtf8("DAI"), 0)







    });
})