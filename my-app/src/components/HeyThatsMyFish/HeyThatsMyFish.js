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
      gameOver: false,
      lastPlayercouldMove: true,
      dimensions: [8,8],
    };

    this.handleSquareClick = this.handleSquareClick.bind(this);
    this.endTurn = this.endTurn.bind(this);
    this.onTick= this.onTick.bind(this);
    this.startOver = this.startOver.bind(this);
    this.clearMoveOptions = this.clearMoveOptions.bind(this);
    this.setMoveOptions = this.setMoveOptions.bind(this);
    this.flipPieces = this.flipPieces.bind(this);
    this.canFlipPiece = this.canFlipPiece.bind(this);
    this.checkIfGameOver = this.checkIfGameOver.bind(this);

    let grid = Array(this.state.dimensions[1]).fill().map(() => Array(this.state.dimensions[0]).fill().map(() => { return { isRedPiece: false, isBluePiece: false, isMoveOption: false, numberOfFish: 0, removed: false }; }));

    this.state.grid = this.setGridValues(grid);
    console.log(this.state.grid);
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
    let grid = Array(this.state.dimensions[1]).fill().map(() => Array(this.state.dimensions[0]).fill().map(() => { return { isRedPiece: false, isBluePiece: false, isMoveOption: false, numberOfFish: 0 }; }));
    grid = this.setGridValues(grid);
    clearInterval(this.state.intervalId);
    this.setState({ grid: grid, playerOneTurn: true, pieceSelected: "", gameOver: false, secondsInGame: 0, timerStarted: false });
  }

  endTurn(){
    let grid = this.state.grid;
    grid = this.clearMoveOptions(grid);
    grid = this.setMoveOptions(grid, !this.state.playerOneTurn);
    this.checkIfGameOver(grid);
    this.setState({ grid: grid, playerOneTurn: !this.state.playerOneTurn, lastPlayercouldMove: false });
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

    if(!grid[location[0]][location[1]].isMoveOption)
      return;

    if(this.state.playerOneTurn)
      grid[location[0]][location[1]].isWhitePiece = true;
    else
      grid[location[0]][location[1]].isBlackPiece = true;

    grid = this.flipPieces(grid, location, true, this.state.playerOneTurn);
    grid = this.clearMoveOptions(grid);
    grid = this.setMoveOptions(grid, !this.state.playerOneTurn);
    this.checkIfGameOver(grid);
    this.setState({ grid: grid, playerOneTurn: !this.state.playerOneTurn, lastPlayercouldMove: true });
  }

  clearMoveOptions(grid){
    for(var i = 0; i < grid.length; i++){
      for(var j = 0; j < grid.length; j++){
        grid[i][j].isMoveOption = false;
      }
    }
    return grid;
  }

  setMoveOptions(grid, playerOneTurn){
    for(var i = 0; i < this.state.dimensions[0]; i++){
      for(var j = 0; j < this.state.dimensions[1]; j++){
        if(!grid[i][j].isWhitePiece && !grid[i][j].isBlackPiece)
          grid = this.flipPieces(grid, [i,j], false, playerOneTurn)
      }
    }
    return grid;
  }

  flipPieces(grid, location, filpPiece, playerOneTurn){
    let possibleFlipDirection = [false,false,false,false,false,false,false,false];
    if(location[0]-1 >= 0 && location[1]-1 >= 0 && ((grid[location[0]-1][location[1]-1].isBlackPiece && playerOneTurn) || (grid[location[0]-1][location[1]-1].isWhitePiece && !playerOneTurn)))
      possibleFlipDirection[0] = [-1,-1];
    if(location[0]-1 >= 0 && ((grid[location[0]-1][location[1]].isBlackPiece && playerOneTurn) || (grid[location[0]-1][location[1]].isWhitePiece && !playerOneTurn)))
      possibleFlipDirection[2] = [-1,0];
    if(location[0]-1 >= 0 && location[1]+1 < this.state.dimensions[1] && ((grid[location[0]-1][location[1]+1].isBlackPiece && playerOneTurn) || (grid[location[0]-1][location[1]+1].isWhitePiece && !playerOneTurn)))
      possibleFlipDirection[3] = [-1,1];
    if(location[1]-1 >= 0 && ((grid[location[0]][location[1]-1].isBlackPiece && playerOneTurn) || (grid[location[0]][location[1]-1].isWhitePiece && !playerOneTurn)))
      possibleFlipDirection[4] = [0,-1];
    if(location[1]+1 < this.state.dimensions[1] && ((grid[location[0]][location[1]+1].isBlackPiece && playerOneTurn) || (grid[location[0]][location[1]+1].isWhitePiece && !playerOneTurn)))
      possibleFlipDirection[5] = [0,1];
    if(location[0]+1 < this.state.dimensions[0] && location[1]-1 >= 0 && ((grid[location[0]+1][location[1]-1].isBlackPiece && playerOneTurn) || (grid[location[0]+1][location[1]-1].isWhitePiece && !playerOneTurn)))
      possibleFlipDirection[6] = [1,-1];
    if(location[0]+1 < this.state.dimensions[0] && ((grid[location[0]+1][location[1]].isBlackPiece && playerOneTurn) || (grid[location[0]+1][location[1]].isWhitePiece && !playerOneTurn)))
      possibleFlipDirection[7] = [1,0];
    if(location[0]+1 < this.state.dimensions[0] && location[1]+1 < this.state.dimensions[1] && ((grid[location[0]+1][location[1]+1].isBlackPiece && playerOneTurn) || (grid[location[0]+1][location[1]+1].isWhitePiece && !playerOneTurn)))
      possibleFlipDirection[8] = [1,1];

    for(let i = 0; i < possibleFlipDirection.length; i++){
      if(!possibleFlipDirection[i])
        continue;

      let result = this.canFlipPiece(grid, [location[0]+possibleFlipDirection[i][0],location[1]+possibleFlipDirection[i][1]], possibleFlipDirection[i], filpPiece, playerOneTurn);
      grid = result.grid;
      if(!filpPiece && result.canFlip)
        grid[location[0]][location[1]].isMoveOption = true;
    }
    return grid;
  }

  canFlipPiece(grid, location, direction, filpPiece, playerOneTurn){
    if(location[0] < 0 || location[1] < 0 || location[0] > this.state.dimensions[0] - 1 || location[1] > this.state.dimensions[1] - 1)
      return { grid: grid, canFlip: false };
    if((grid[location[0]][location[1]].isBlackPiece && !playerOneTurn) || (grid[location[0]][location[1]].isWhitePiece && playerOneTurn))
      return { grid: grid, canFlip: true };
    if((grid[location[0]][location[1]].isBlackPiece && playerOneTurn) || (grid[location[0]][location[1]].isWhitePiece && !playerOneTurn)){
      let newLocation = [location[0]+direction[0],location[1]+direction[1]];
      let result = this.canFlipPiece(grid, newLocation, direction, filpPiece, playerOneTurn);
      if(result.canFlip && filpPiece){
        grid = result.grid;
        if(grid[location[0]][location[1]].isBlackPiece){
          grid[location[0]][location[1]].isBlackPiece = false;
          grid[location[0]][location[1]].isWhitePiece = true;
        }
        else{
          grid[location[0]][location[1]].isBlackPiece = true;
          grid[location[0]][location[1]].isWhitePiece = false;
        }
      }
      return { grid: grid, canFlip: result.canFlip };
    }
    else
      return { grid: grid, canFlip: false };
  }

  checkIfGameOver(grid){
    let hasMoveOption = false;
    let hasFreeSpace = false;
    let PieceCount = [0,0];
    for(var i = 0; i < grid.length; i++){
      for(var j = 0; j < grid.length; j++){
        if(grid[i][j].isWhitePiece)
          PieceCount[0]++;
        else if(grid[i][j].isBlackPiece)
          PieceCount[1]++;
        else if(grid[i][j].isMoveOption)
          hasMoveOption = true;
        else
          hasFreeSpace = true;
        if(hasMoveOption)
          return;
      }
    }

    if((!this.state.lastPlayercouldMove || !hasFreeSpace) && !hasMoveOption){
      clearInterval(this.state.intervalId);
      this.setState({ gameOver: true, playerPieceTotal: PieceCount });
    }
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
            isWhitePiece={y.isWhitePiece}
            isBlackPiece={y.isBlackPiece}
            isMoveOption={y.isMoveOption}
            numberOfFish={y.numberOfFish}
            playerOneTurn={this.state.playerOneTurn}
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
              playerPieceTotal={this.state.playerPieceTotal}
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
