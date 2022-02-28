const Dex = artifacts.require("Dex");
const mockDai = artifacts.require("mockDai");
const truffleAssert = require("truffle-assertions");
const BN = web3.utils.toBN;



contract.skip("Dex", accounts => {
    it("if possible for accoutn add token?", async () => {
        let dex = await Dex.deployed();
        let dai = await mockDai.deployed();
        await truffleAssert.passes(
            dex.addToken(web3.utils.fromUtf8("DAI"), dai.address, { from: accounts[0] })
        );
    });
    it("i should deposit 100 mockDai in wallet?", async () => {
        let dex = await Dex.deployed();
        let dai = await mockDai.deployed();
        await truffleAssert.passes(
            dai.approve(dex.address, 100, { from: accounts[0] })
        );
        await truffleAssert.passes(
            dex.deposit(100, web3.utils.fromUtf8("DAI"), { from: accounts[0] })
        );

    })
    it("if possible wihtdow 100 mockDai i wallet?", async () => {
        let dex = await Dex.deployed();

        await truffleAssert.passes(
            dex.withdraw(100, web3.utils.fromUtf8("DAI"))
        )
    })
    it("balance is equal 10,000 DAI next operation", async () => {
        let dai = await mockDai.deployed();
        let balance = await dai.balanceOf(accounts[0]);
        console.log(balance)
    })
    it("transfer 100 dai account1 => account2", async () => {
        let dai = await mockDai.deployed();
        await truffleAssert.passes(
            dai.transfer(accounts[1], 100, { from: accounts[0] })
        );
        await truffleAssert.passes(
            dai.transfer(accounts[2], 50, { from: accounts[1] })
        )
    })
    it(" mi aggiorna il bilancio di ETH ? ")


})