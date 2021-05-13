const DefiBallot = artifacts.require('DefiBallot');

const Side = {
  Beeple: 0,
  Crossroads: 1
};

module.exports = async function (deployer, _network, addresses) {
  const [admin, oracle, gambler1, gambler2, gambler3, gambler4, _] = addresses;
  await deployer.deploy(DefiBallot, oracle);
  const defiBallot = await DefiBallot.deployed();
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
    {from: gambler4, value: web3.utils.toWei('1')}
  );
};
