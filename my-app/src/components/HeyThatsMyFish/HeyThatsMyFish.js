import React from 'react';
import Tile from './Tile.js';
import StatusBar from './StatusBar.js';
import styles from '../../Styles/HeyThatsMyFish.css.js';


class HeyThatsMyFish extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      timerStarted: false,
      secondsInGame: 0,
      intervalId: 0,
      playerOneTurn: true,
      pieceSelected: "",
      gameOver: false,
      onlyCurrentPlayerCanMove: false,
      playerFishTotal: [0,0],
      setup: true,
      numberOfPenguins: 0,
      dimensions: [8,8],
    };

    this.handleSquareClick = this.handleSquareClick.bind(this);
    this.endTurn = this.endTurn.bind(this);
    this.onTick= this.onTick.bind(this);
    this.startOver = this.startOver.bind(this);
    this.clearBoard = this.clearBoard.bind(this);
    this.setMoveOptions = this.setMoveOptions.bind(this);
    this.setMoveLines = this.setMoveLines.bind(this);

    let grid = Array(this.state.dimensions[1]).fill().map(() => Array(this.state.dimensions[0]).fill().map(() => { return { isRedPiece: false, isBluePiece: false, isMoveOption: false, numberOfFish: 0, removed: false, isSelected: false }; }));
    this.state.grid = this.setGridValues(grid);

    document.body.style.backgroundColor = "#8bd5df";
  }

  setGridValues(grid){
    let oneFish = Array(30).fill(1);
    let twoFish = Array(20).fill(2);
    let threeFish = Array(10).fill(3);
    let fishTiles = oneFish.concat(twoFish).concat(threeFish);
    var currentIndex = fishTiles.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = fishTiles[currentIndex];
      fishTiles[currentIndex] = fishTiles[randomIndex];
      fishTiles[randomIndex] = temporaryValue;
    }
    let dimensions = this.state.dimensions;
    for(var i = 1; i <= dimensions[0] * dimensions[1]; i++){
      if(i === 8 || i === 24 || i === 40 || i === 56)
        grid[Math.ceil(i/dimensions[0])-1][(i-1)%dimensions[1]].removed = true;
      else
        grid[Math.ceil(i/dimensions[0])-1][(i-1)%dimensions[1]].numberOfFish = fishTiles.pop();
    }
    return grid;
  }

  startOver(){
    let grid = Array(this.state.dimensions[1]).fill().map(() => Array(this.state.dimensions[0]).fill().map(() => { return { isRedPiece: false, isBluePiece: false, isMoveOption: false, numberOfFish: 0, removed: false, isSelected: false }; }));
    grid = this.setGridValues(grid);
    clearInterval(this.state.intervalId);
    this.setState({ grid: grid, playerOneTurn: true, pieceSelected: "", setup: true, gameOver: false, secondsInGame: 0, timerStarted: false, onlyCurrentPlayerCanMove: false });
  }

  endTurn(){
    let grid = this.state.grid;
    grid = this.clearBoard(grid);
    let gameOver = false;
    if(this.state.onlyCurrentPlayerCanMove){
      clearInterval(this.state.intervalId);
      gameOver = true;
    }
    this.setState({ grid: grid, playerOneTurn: !this.state.playerOneTurn, onlyCurrentPlayerCanMove: true, gameOver: gameOver });
  }

  handleSquareClick(key){
    if(!this.state.timerStarted){
      let intervalId = setInterval(this.onTick, 1000);
      this.setState({ timerStarted: true, intervalId: intervalId });
    }

    let location = key.split(" ");
    location[0] = parseInt(location[0]);
    location[1] = parseInt(location[1]);
    let grid = this.state.grid;

    if(this.state.setup && !(grid[location[0]][location[1]].isBluePiece || grid[location[0]][location[1]].isRedPiece)){
      if(this.state.playerOneTurn)
        grid[location[0]][location[1]].isBluePiece = true;
      else
        grid[location[0]][location[1]].isRedPiece = true;

      let setup = true;
      if(this.state.numberOfPenguins === 7)
        setup = false;
      this.setState({ grid: grid, playerOneTurn: !this.state.playerOneTurn, numberOfPenguins: this.state.numberOfPenguins + 1, setup: setup });
    }
    else if((grid[location[0]][location[1]].isBluePiece && this.state.playerOneTurn) || (grid[location[0]][location[1]].isRedPiece && !this.state.playerOneTurn)){
      grid = this.clearBoard(grid);
      grid[location[0]][location[1]].isSelected = true;
      grid = this.setMoveOptions(grid, location);
      this.setState({ grid: grid, pieceSelected: key });
    }
    else if(grid[location[0]][location[1]].isMoveOption){
      let playerFishTotal = this.state.playerFishTotal;
      let selectedLocation = this.state.pieceSelected.split(" ");
      selectedLocation[0] = parseInt(selectedLocation[0]);
      selectedLocation[1] = parseInt(selectedLocation[1]);
      grid[selectedLocation[0]][selectedLocation[1]].isSelected = false;
      grid[selectedLocation[0]][selectedLocation[1]].removed = true;
      if(this.state.playerOneTurn){
        playerFishTotal[0] += grid[selectedLocation[0]][selectedLocation[1]].numberOfFish;
        grid[location[0]][location[1]].isBluePiece = true;
      }
      else{
        playerFishTotal[1] += grid[selectedLocation[0]][selectedLocation[1]].numberOfFish;
        grid[location[0]][location[1]].isRedPiece = true;
      }
      grid = this.clearBoard(grid);

      let playerOneTurn = this.state.playerOneTurn;
      if(!this.state.onlyCurrentPlayerCanMove)
        playerOneTurn = !playerOneTurn;
      this.setState({ grid: grid, playerOneTurn: playerOneTurn, playerFishTotal: playerFishTotal });
    }
  }

  clearBoard(grid){
    for(var i = 0; i < grid.length; i++){
      for(var j = 0; j < grid.length; j++){
        if(grid[i][j].isMoveOption)
          grid[i][j].isMoveOption = false;
        if(grid[i][j].isSelected)
          grid[i][j].isSelected = false;
      }
    }
    return grid;
  }

  setMoveOptions(grid, location){
    grid = this.setMoveLines(grid, location, [-1,-1]);
    grid = this.setMoveLines(grid, location, [-1,0]);
    grid = this.setMoveLines(grid, location, [0,-1]);
    grid = this.setMoveLines(grid, location, [0,1]);
    grid = this.setMoveLines(grid, location, [+1,-1]);
    grid = this.setMoveLines(grid, location, [+1,0]);

    return grid;
  }

  setMoveLines(grid, location, direction){
    if(location[0] % 2 === 1 || direction[0] === 0){
      if(location[0] + direction[0] >= 0 &&
        location[0] + direction[0] < grid.length &&
        location[1] + direction[1] >= 0 &&
        location[1] + direction[1] < grid.length &&
        !grid[location[0] + direction[0]][location[1] + direction[1]].isBluePiece &&
        !grid[location[0] + direction[0]][location[1] + direction[1]].isRedPiece &&
        !grid[location[0] + direction[0]][location[1] + direction[1]].removed
      ){
        grid[location[0]+direction[0]][location[1]+direction[1]].isMoveOption = true;
        grid = this.setMoveLines(grid, [location[0] + direction[0],location[1] + direction[1]], direction);
      }
    }
    else{
      if(location[0] + direction[0] >= 0 &&
        location[0] + direction[0] < grid.length &&
        location[1] + direction[1] + 1 >= 0 &&
        location[1] + direction[1] + 1 < grid.length &&
        !grid[location[0] + direction[0]][location[1] + direction[1] + 1].isBluePiece &&
        !grid[location[0] + direction[0]][location[1] + direction[1] + 1].isRedPiece &&
        !grid[location[0] + direction[0]][location[1] + direction[1] + 1].removed
      ){
        grid[location[0]+direction[0]][location[1]+direction[1] + 1].isMoveOption = true;
        grid = this.setMoveLines(grid, [location[0] + direction[0],location[1] + direction[1] + 1], direction);
      }
    }
    return grid;
  }

  onTick(){
    let seconds = this.state.secondsInGame + 1;
    this.setState({ secondsInGame: seconds });
  }

  render() {
    const cells = this.state.grid.map((x, index) => {
      return x.map((y, index2) => {
        return (
          <Tile
            isBluePiece={y.isBluePiece}
            isRedPiece={y.isRedPiece}
            isMoveOption={y.isMoveOption}
            isSelected={y.isSelected}
            numberOfFish={y.numberOfFish}
            removed={y.removed}
            playerOneTurn={this.state.playerOneTurn}
            setup={this.state.setup}
            key={index + " " + index2}
            identifier={index + " " + index2}
            handleSquareClick={this.handleSquareClick}
            />
        );
      });
    });

    return (
      <div className="container"style={{ maxWidth: "100%" }}>
        <div className="row">
          <div className="col-3">
            <StatusBar
              playerOneTurn={this.state.playerOneTurn}
              startOver={this.startOver}
              secondsInGame={this.state.secondsInGame}
              gameOver={this.state.gameOver}
              playerFishTotal={this.state.playerFishTotal}
              endTurn={this.endTurn}
            />
          </div>
          <div className="col-9">
            <div className="board" style={styles.board}>
              {cells}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HeyThatsMyFish;
