const Dex = artifacts.require("Dex");
const mockDai = artifacts.require("mockDai");
const mockWETH = artifacts.require("mockWETH");


module.exports = async function (deployer) {
  deployer.deploy(Dex);
  deployer.deploy(mockDai);
  deployer.deploy(mockWETH);

  const OrdSEller = '0x70bC0d94BcCb808e3e2717d5F8B5432279266524';
  const OrderMarket = '0x56C2343a3862E24996e1481Ffa40bBDb8F303d7f';

  let dex = await Dex.deployed();
  let dai = await mockDai.deployed();
  let weth = await mockWETH.deployed();

  /*
  // invio i token Weth da ordSEller a order Market 
  await dai.transfer(OrderMarket, 1000000000000);
  balanceDAI = await dai.balanceOf(OrderMarket);
  console.log(`il bilancio di dai del market order -> ${balanceDAI}`);
  balanceDAI = await dai.balanceOf(OrdSEller);
  console.log(`il bilancio di dai del market Seller -> ${balanceDAI}`);

  ///

  //Aggiunta token su dex
  await dex.addToken(web3.utils.fromUtf8("DAI"), dai.address);
  await dex.addToken(web3.utils.fromUtf8("WETH"), weth.address);
  ///

  // depositare i token WETH
  await weth.approve(dex.address, 10, { from: OrdSEller });
  await dex.deposit(10, web3.utils.fromUtf8("WETH"), { from: OrdSEller });
  ///

  // creiamo ordini --- per il momento 1.
  await dex.createLimitOrder(2, 1000, web3.utils.fromUtf8("WETH"), 1, { from: OrdSEller });
  // 

  // facciamo l'ordine a mercato 
  await dai.approve(dex.address, 100000, { from: OrderMarket });
  await dex.createMarketOrder(1, web3.utils.fromUtf8("WETH"), web3.utils.fromUtf8("DAI"), { from: OrderMarket });

  // controllo io 
  let balanceFinal = await dex.getBalance(web3.utils.fromUtf8("DAI"), { from: OrdSEller });
  console.log(balanceFinal);
  */
};
//dex.getOrderBook(web3.utils.fromUtf8("WETH"),1)