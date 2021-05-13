const DefiBallot = artifacts.require('DefiBallot.sol');
  
const Side = {
  Biden: 0,
  Trump: 1
};

contract('DefiBallot', addresses => {
  const [admin, oracle, gambler1, gambler2, gambler3, gambler4, _] = addresses;

  it('should work', async () => {
    const defiBallot = await DefiBallot.new(oracle);
    
    await defiBallot.placeVote(
      Side.Beeple, 
      {from: gambler1, value: web3.utils.toWei('1')}
    );
    await defiBallot.placeVote(
      Side.Beeple, 
      {from: gambler2, value: web3.utils.toWei('1')}
    );
    await defiBallot.placeVote(
      Side.Beeple, 
      {from: gambler3, value: web3.utils.toWei('2')}
    );
    await defiBallot.placeVote(
      Side.Crossroads, 
      {from: gambler4, value: web3.utils.toWei('4')}
    );

    await defiBallot.reportResult(
      Side.Beeple, 
      Side.Crossroads, 
      {from: oracle}
    );

    const balancesBefore = (await Promise.all( 
      [gambler1, gambler2, gambler3, gambler4].map(gambler => (
        web3.eth.getBalance(gambler)
      ))
    ))
    .map(balance => web3.utils.toBN(balance));
    await Promise.all(
      [gambler1, gambler2, gambler3].map(gambler => (
        defiBallot.withdrawGain({from: gambler})
      ))
    );
    const balancesAfter = (await Promise.all( 
      [gambler1, gambler2, gambler3, gambler4].map(gambler => (
        web3.eth.getBalance(gambler)
      ))
    ))
    .map(balance => web3.utils.toBN(balance));

    //gambler 1, 2, 3 should have respectively 2, 2 and 4 extra ether
    //but we also have to take into consideration gas spent when calling
    //withdrawGain(). We can ignore this problem by just comparing
    //the first 3 digits of balances
    assert(balancesAfter[0].sub(balancesBefore[0]).toString().slice(0, 3) === '199');
    assert(balancesAfter[1].sub(balancesBefore[1]).toString().slice(0, 3) === '199');
    assert(balancesAfter[2].sub(balancesBefore[2]).toString().slice(0, 3) === '399');
    assert(balancesAfter[3].sub(balancesBefore[3]).isZero());
  });
});
