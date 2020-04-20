import React from 'react';
import Board from './Board.js';
import Status from './Status.js';

class Snake extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      totalScore: 0,
      directionFacing: 39, // left, up, right, down
      startOver: false,
      AllowDirectionChange: true
    };

    this.changeDirection = this.changeDirection.bind(this);
    this.newGame = this.newGame.bind(this);
    this.restartFinished = this.restartFinished.bind(this);
    this.canChangeDirection = this.canChangeDirection.bind(this);
    this.foodEaten = this.foodEaten.bind(this);
    document.body.style.backgroundColor = "beige";
  }

  newGame(){
    this.setState({ startOver: true, directionFacing: 39, totalScore: 0 });
  }

  restartFinished(){
    this.setState({ startOver: false });
  }

  canChangeDirection(){
    this.setState({ AllowDirectionChange: true });
  }

  foodEaten(){
    this.setState({ totalScore: this.state.totalScore + 1 });
  }

  changeDirection({ keyCode }){
    if(keyCode === 13){
      this.setState({ startOver: true, directionFacing: 39, totalScore: 0 });
      return;
    }

    var changeDirection = true;
    var currentDirection = this.state.directionFacing;
    [[38, 40], [37, 39]].forEach(dir => {
      if (dir.indexOf(currentDirection) > -1 && dir.indexOf(keyCode) > -1) {
        changeDirection = false;
      }
    });

    if (changeDirection && this.state.AllowDirectionChange){
      this.setState({ directionFacing: keyCode, AllowDirectionChange: false });
    }
  }

  render() {
    return (
      <div className="container"
        onKeyDown={this.changeDirection}
        tabIndex="0"
      >
        <Status
          totalScore={this.state.totalScore}
          newGame={this.newGame}
        />
        <div className="row">
          <Board
            directionFacing={this.state.directionFacing}
            startOver={this.state.startOver}
            restartFinished={this.restartFinished}
            canChangeDirection={this.canChangeDirection}
            foodEaten={this.foodEaten}
          />
        </div>
      </div>
    );
  }
}

export default Snake;
