pragma solidity ^0.7.3;

contract DefiBallot {
  enum Side { Beeple, Crossroads }
  struct Result {
    Side winner;
    Side loser;
  }
  Result result;
  bool electionFinished;

  mapping(Side => uint) public votes;
  mapping(address => mapping(Side => uint)) public votesPerGambler;
  address public oracle;

  constructor(address _oracle) {
    oracle = _oracle; 
  }

  function placeVote(Side _side) external payable {
    require(electionFinished == false, 'election is finished');
    votes[_side] += msg.value;
    votesPerGambler[msg.sender][_side] += msg.value;
  }

  function withdrawGain() external {
    uint gamblerVote = votesPerGambler[msg.sender][result.winner];
    require(gamblerVote > 0, 'you do not have any winning bet');  
    require(electionFinished == true, 'election not finished yet');
    uint gain = gamblerVote + votes[result.loser] * gamblerVote / votes[result.winner];
    votesPerGambler[msg.sender][Side.Beeple] = 0;
    votesPerGambler[msg.sender][Side.Crossroads] = 0;
    msg.sender.transfer(gain);
  }

  function reportResult(Side _winner, Side _loser) external {
    require(oracle == msg.sender, 'only oracle');
    result.winner = _winner;
    result.loser = _loser;
    electionFinished = true;
  }
}
