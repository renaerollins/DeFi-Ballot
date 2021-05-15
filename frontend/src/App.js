import React, { useState, useEffect } from 'react';
import getBlockchain from './ethereum.js';
import { Doughnut } from 'react-chartjs-2';
import './App.css';

const SIDE = {
  BEEPLE: 0,
  CROSSROADS: 1
};

function App() {
  const [defiBallot, setDefiBallot] = useState(undefined);
  const [votePredictions, setVotePredictions] = useState(undefined);
  const [myVotes, setMyVotes] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const { signerAddress, defiBallot } = await getBlockchain();
      const votes = await Promise.all([
        defiBallot.votes(SIDE.BEEPLE),
        defiBallot.votes(SIDE.CROSSROADS)
      ]);
      const votePredictions = {
      	labels: [
      		'Crossroads',
      		'Beeple',
      	],
      	datasets: [{
      		data: [votes[1].toString(), votes[0].toString()],
      		backgroundColor: [
            '#86fde8',
            '#acb6e5',
      		],
      		hoverBackgroundColor: [
            '#86fde8',
            '#acb6e5',
      		],
      	}]
      };
      const myVotes = await Promise.all([
        defiBallot.votesPerGambler(signerAddress, SIDE.CROSSROADS),
        defiBallot.votesPerGambler(signerAddress, SIDE.BEEPLE),
      ]);
      setMyVotes(myVotes);
      //console.log(myBets[0].toString());
      setVotePredictions(votePredictions);
      setDefiBallot(defiBallot);
    };
    init();
  }, []);

  if(
    typeof defiBallot === 'undefined'
    || typeof votePredictions === 'undefined'
    || typeof myVotes === 'undefined'
  ) {
    return 'Loading...';
  }

  const placeVote = async (side, e) => {
    e.preventDefault();
    await defiBallot.placeVote(
      side, 
      {value: e.target.elements[0].value}
    );
  };

  const withdrawGain = async () => {
    await defiBallot.withdrawGain();
  };

  return (
  <div className='body'>
    <div className='container'>
     <h1 className='text-center'>DeFi Ballot</h1>
     <div className="jumbotron">
            <h1 className="display-4 text-center">Most Popular NFT of 2021</h1>
            <p className="lead text-center"><ins>Current Votes</ins></p>
            <div className='chart'>
               <Doughnut data={votePredictions} />
            </div>
          </div>
          <div className='col'>
        <h2 className='your__bets'>Your bets</h2>
        <div className='col__one'>
          <b>Beeple:</b> {myVotes[0].toString()} ETH (wei)
        </div>
        <div className='col__two'>
          <b>Crossroads:</b> {myVotes[1].toString()} ETH (wei)
        </div>
      </div>
      <div className='row'>
        <div className='col-sm-6'>
          <div className="card__one">
            <img src='./images/crossroads.jpg' alt='Crossroads NFT' className='img__one' />
            <div className="card-body">
              <h5 className="card-title"><b>Crossroads</b></h5>
              <form className="form-inline" onSubmit={e => placeVote(SIDE.CROSSROADS, e)}>
                <input 
                  type="text" 
                  className="form-control mb-2 mr-sm-2" 
                  placeholder="Place a bet.. (ether)"
                />
                <button 
                  type="submit" 
                  className="button"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className='col-sm-6'>
          <div className="card__two">
            <img src='./images/beeple.jpg' alt='Beeple NFT' className='img__two'/>
            <div className="card-body">
              <h5 className="card-title"><b>Beeple</b></h5>
              <form className="form-inline">
                <input 
                  type="text" 
                  className="form-control mb-2 mr-sm-2" 
                  placeholder="Place a bet.. (ether)"
                />
                <button 
                  type="submit" 
                  className="button"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
      <h2>Did you win, claim your prize..</h2>
      <button 
        type="submit" 
        className="button"
        onClick={e => withdrawGain()}
      >
        Submit
      </button>
    </div>
    </div>
  </div>
  );
}

export default App;
