import React from 'react';
import MinesweeperGridCell from './MinesweeperGridCell.js';
import MinesweeperStatus from './MinesweeperStatus.js';
import styles from '../../Styles/mineSweeper.css.js';

class Minesweeper extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      timerStarted: false,
      secondsInGame: 0,
      intervalId: 0,
      flagsLeft: 99,
      numberOfMines: 99,
      interval: 50,
      gameOver: false,
      dead: false,
      mineLocations: [],
      dimensions: [25,25],
      cellSize: 25,
      possibleStates: {
        mine: -1
      }
    };

    this.checkIfDead = this.checkIfDead.bind(this);
    this.onTick= this.onTick.bind(this);
    this.startOver = this.startOver.bind(this);
    this.handleSquareClick = this.handleSquareClick.bind(this);
    this.buildMineData = this.buildMineData.bind(this);
    this.onRightClick = this.onRightClick.bind(this);

    let mineLocations = this.buildMineData();
    this.state.mineLocations = mineLocations;

    let grid = Array(this.state.dimensions[1]).fill().map(() => Array(this.state.dimensions[0]).fill().map(() => { return {flagged: false, value: 0, hidden: true}; }));
    this.state.boardDimensions = [(this.state.dimensions[0] * this.state.cellSize) + 4, (this.state.dimensions[1] * this.state.cellSize) + 4];

    this.state.grid = this.setGridValues(grid, mineLocations);
    document.body.style.backgroundColor = "beige";
  }

  setGridValues(grid, mineLocations){
    for(var i = 0; i < mineLocations.length; i++){
      grid[mineLocations[i][1]][mineLocations[i][0]].value = this.state.possibleStates.mine;

      if(mineLocations[i][1] > 0){
        if(mineLocations[i][0] > 0){
          if(grid[mineLocations[i][1]-1][mineLocations[i][0]-1].value >= 0){
            grid[mineLocations[i][1]-1][mineLocations[i][0]-1].value++;
          }
        }
        if(grid[mineLocations[i][1]-1][mineLocations[i][0]].value >= 0){
          grid[mineLocations[i][1]-1][mineLocations[i][0]].value++;
        }
      }
      if(mineLocations[i][1] < grid.length -1){
        if(mineLocations[i][0] < grid[0].length -1){
          if(grid[mineLocations[i][1]+1][mineLocations[i][0]+1].value >= 0){
            grid[mineLocations[i][1]+1][mineLocations[i][0]+1].value++;
          }
        }
        if(grid[mineLocations[i][1]+1][mineLocations[i][0]].value >= 0){
          grid[mineLocations[i][1]+1][mineLocations[i][0]].value++;
        }
      }
      if(mineLocations[i][0] > 0){
        if(mineLocations[i][1] < grid.length -1){
          if(grid[mineLocations[i][1]+1][mineLocations[i][0]-1].value >= 0){
            grid[mineLocations[i][1]+1][mineLocations[i][0]-1].value++;
          }
        }
        if(grid[mineLocations[i][1]][mineLocations[i][0]-1].value >= 0){
          grid[mineLocations[i][1]][mineLocations[i][0]-1].value++;
        }
      }

      if(mineLocations[i][0] < grid.length -1){
        if(mineLocations[i][1] > 0){
          if(grid[mineLocations[i][1]-1][mineLocations[i][0]+1].value >= 0){
            grid[mineLocations[i][1]-1][mineLocations[i][0]+1].value++;
          }
        }
        if(grid[mineLocations[i][1]][mineLocations[i][0]+1].value >= 0){
          grid[mineLocations[i][1]][mineLocations[i][0]+1].value++;
        }
      }
    }
    return grid;
  }

  startOver(){
    let grid = Array(this.state.dimensions[1]).fill().map(() => Array(this.state.dimensions[0]).fill().map(() => { return {flagged: false, value: 0, hidden: true}; }));
    let mineLocations = this.buildMineData();
    grid = this.setGridValues(grid, mineLocations);
    clearInterval(this.state.intervalId);
    this.setState({ grid: grid, mineLocations: mineLocations, flagsLeft: 99, gameOver: false, dead: false, secondsInGame: 0, timerStarted: false });
  }

  handleSquareClick(key){
    if(!this.state.timerStarted){
      let intervalId = setInterval(this.onTick, 1000);
      this.setState({ timerStarted: true, intervalId: intervalId });
    }
    let location = key.split(" ");
    if(this.state.gameOver || this.state.grid[location[0]][location[1]].flagged)
      return;
    if(this.checkIfDead(location)){
      let grid = this.state.grid;
      grid = grid.map(x => x.map(y => {
        y.hidden = false;
        return y;
      }));
      clearInterval(this.state.intervalId);
      this.setState({ gameOver: true, dead: true, grid: grid });
    }
    else{
      let grid = this.state.grid;
      grid = this.clearSquares(grid, location);
      this.setState({ grid: grid });
      if(this.state.flagsLeft === 0){
        this.checkIfWon();
      }
    }
  }

  clearSquares(grid, location){
    if(location[0] < 0 || location[0] > this.state.dimensions[0] - 1 || location[1] < 0 || location[1] > this.state.dimensions[0] - 1 || !grid[location[0]][location[1]].hidden)
      return grid;
    grid[location[0]][location[1]].hidden = false;
    if(grid[location[0]][location[1]].value === 0){
      grid = this.clearSquares(grid, [location[0] - 1, location[1] - 1]);
      grid = this.clearSquares(grid, [location[0], location[1] - 1]);
      grid = this.clearSquares(grid, [location[0] - 1, location[1]]);

      grid = this.clearSquares(grid, [location[0] + 1, location[1] - 1]);
      grid = this.clearSquares(grid, [location[0] - 1, location[1] + 1]);

      grid = this.clearSquares(grid, [location[0] + 1, location[1]]);
      grid = this.clearSquares(grid, [location[0], location[1] + 1]);
      grid = this.clearSquares(grid, [location[0] + 1, location[1] + 1]);
    }
    return grid;
  }

  checkIfDead(location){
    let grid = this.state.grid;
    if(grid[location[0]][location[1]].value === this.state.possibleStates.mine)
      return true;
    return false;
  }

  checkIfWon(){
    let allMinesFlagged = true;
    for(var i = 0; i < this.state.mineLocations.length; i++){
      if(!this.state.grid[this.state.mineLocations[i][1]][this.state.mineLocations[i][0]].flagged)
        allMinesFlagged = false;
    }

    if(allMinesFlagged){
      clearInterval(this.state.intervalId);
      this.setState({ gameOver: true });
    }
  }

  buildMineData(){
    let mineLocations = Array(this.state.numberOfMines).fill();
    let possibleOptions = Array(this.state.dimensions[0] * this.state.dimensions[1]).fill().map((x, index) => index);
    mineLocations = mineLocations.map((x, index) => {
      let mineLocation = possibleOptions.splice(Math.floor(Math.random() * (possibleOptions.length - 1)), 1)[0];
      return [mineLocation % this.state.dimensions[0],Math.floor(mineLocation/this.state.dimensions[0])];
    });

    return mineLocations;
  }

  onRightClick(value, key){
    if(this.state.gameOver)
      return;
    let flagsLeft = this.state.flagsLeft;
    let grid = this.state.grid;
    let location = key.split(" ");
    if(grid[location[0]][location[1]].flagged){
      flagsLeft++;
    }
    else{
      flagsLeft--;
    }
    grid[location[0]][location[1]].flagged = !grid[location[0]][location[1]].flagged;

    if(flagsLeft === 0){
      this.checkIfWon();
    }

    this.setState({ grid: grid, flagsLeft: flagsLeft });
  }

  onTick(){
    let seconds = this.state.secondsInGame + 1;
    this.setState({ secondsInGame: seconds });
  }

  render() {
    const cells = this.state.grid.map((x, index) => {
      return x.map((y, index2) => {
        return (
          <MinesweeperGridCell
            value={y.value}
            flagged={y.flagged}
            hidden={y.hidden}
            size={this.state.cellSize}
            gameOver={this.state.gameOver}
            key={index + " " + index2}
            identifier={index + " " + index2}
            possibleStates={this.state.possibleStates}
            onRightClick={this.onRightClick}
            handleSquareClick={this.handleSquareClick}
            />
        );
      });
    });
    var style = Object.assign({},
      styles.board,
      { height: this.state.boardDimensions[0] + "px", width: this.state.boardDimensions[1] + "px", marginLeft: "calc(50% - " + (this.state.boardDimensions[1]/2) + "px)" }
    );
    return (
      <div className="container">
        <MinesweeperStatus
          flagsLeft={this.state.flagsLeft}
          startOver={this.startOver}
          secondsInGame={this.state.secondsInGame}
          gameOver={this.state.gameOver}
          dead={this.state.dead}
        />
        <div className="row">
          <div className="col">
            <div style={style}>
              {cells}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Minesweeper;
