import React from 'react';
import CheckerTile from './CheckerTile.js';
import CheckersStatusBar from './CheckersStatusBar.js';
import styles from '../../Styles/Checkers.css.js';

class Checkers extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      timerStarted: false,
      secondsInGame: 0,
      intervalId: 0,
      playerOneTurn: true,
      gameOver: false,
      playerOneWon: false,
      pieceSelected: "",
      canJumpAnotherPiece: false,
      haveToJumpAnotherPiece: false,
      dimensions: [8,8],
      cellSize: 90,
    };

    this.checkIfGameOver = this.checkIfGameOver.bind(this);
    this.onTick= this.onTick.bind(this);
    this.startOver = this.startOver.bind(this);
    this.endTurn = this.endTurn.bind(this);
    this.clearSelectedPiece = this.clearSelectedPiece.bind(this);
    this.handleSquareClick = this.handleSquareClick.bind(this);
    this.setMoveOptions = this.setMoveOptions.bind(this);
    this.SetJumpLocations = this.SetJumpLocations.bind(this);
    this.setJumpLocationsForPiece = this.setJumpLocationsForPiece.bind(this);
    this.checkifPieceCanJump = this.checkifPieceCanJump.bind(this);
    this.removeJumpedPiece = this.removeJumpedPiece.bind(this);

    let grid = Array(this.state.dimensions[1]).fill().map(() => Array(this.state.dimensions[0]).fill().map(() => { return {white: false, hasWhitePiece: false, hasRedPiece: false, isKingPiece: false, isSelected: false, isMoveOption: false, haveToJumpOption: false}; }));
    this.state.boardDimensions = [(this.state.dimensions[0] * this.state.cellSize) + 4, (this.state.dimensions[1] * this.state.cellSize) + 4];

    this.state.grid = this.setGridValues(grid);
  }

  setGridValues(grid){
    let LastSquareWasWhite = false;
    for(var i = 1; i <= this.state.dimensions[0] * this.state.dimensions[1]; i++){
      if(!LastSquareWasWhite)
        grid[Math.ceil(i/8)-1][(i-1)%8].white = true;
      else if(i < 25)
        grid[Math.ceil(i/8)-1][(i-1)%8].hasRedPiece = true;
      else if(i > 40)
        grid[Math.ceil(i/8)-1][(i-1)%8].hasWhitePiece = true;

      if((i-1)%8 !== 7)
        LastSquareWasWhite = !LastSquareWasWhite;
    }
    return grid;
  }

  startOver(){
    let grid = Array(this.state.dimensions[1]).fill().map(() => Array(this.state.dimensions[0]).fill().map(() => { return {white: false, hasWhitePiece: false, hasRedPiece: false, isKingPiece: false, isSelected: false, isMoveOption: false}; }));
    grid = this.setGridValues(grid);
    clearInterval(this.state.intervalId);
    this.setState({ grid: grid, gameOver: false, secondsInGame: 0, timerStarted: false });
  }

  endTurn(){
    let grid = this.state.grid;
    grid = this.clearSelectedPiece(grid);
    let selectedLocation = this.state.pieceSelected.split(" ");
    selectedLocation[0] = parseInt(selectedLocation[0]);
    selectedLocation[1] = parseInt(selectedLocation[1]);
    grid = this.SetJumpLocations(grid, selectedLocation);
    this.setState({ grid: grid, playerOneTurn: !this.state.playerOneTurn, canJumpAnotherPiece: false, pieceSelected: "" });
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
    let selectedSquare = grid[location[0]][location[1]];

    if((this.state.canJumpAnotherPiece || this.state.haveToJumpAnotherPiece) && !(selectedSquare.haveToJumpOption || selectedSquare.isMoveOption))
      return;
    let pieceSelected = "";
    if((selectedSquare.hasWhitePiece && this.state.playerOneTurn) || (selectedSquare.hasRedPiece && !this.state.playerOneTurn)){
      if(this.state.pieceSelected !== ""){
        grid = this.clearSelectedPiece(grid);
      }

      selectedSquare.isSelected = !selectedSquare.isSelected;
      if(selectedSquare.isSelected)
        pieceSelected = key;
      grid[location[0]][location[1]] = selectedSquare;

      if(selectedSquare.haveToJumpOption){
        let jumpOptions = this.checkifPieceCanJump(grid, location, this.state.playerOneTurn);
        grid = this.setJumpLocationsForPiece(grid, jumpOptions, location);
      }
      else
        grid = this.setMoveOptions(grid, selectedSquare, location);

      this.setState({ grid: grid, pieceSelected: pieceSelected });
    }

    if(selectedSquare.isMoveOption){
      let isKing = false;
      if(this.state.pieceSelected !== ""){
        let selectedLocation = this.state.pieceSelected.split(" ");
        selectedLocation[0] = parseInt(selectedLocation[0]);
        selectedLocation[1] = parseInt(selectedLocation[1]);
        let oldSelectedSquare = grid[selectedLocation[0]][selectedLocation[1]];
        oldSelectedSquare.isSelected = false;
        if(this.state.playerOneTurn)
          oldSelectedSquare.hasWhitePiece = false;
        else
          oldSelectedSquare.hasRedPiece = false;
        if(oldSelectedSquare.isKingPiece)
          isKing = true;
        oldSelectedSquare.isKingPiece = false;

        grid[selectedLocation[0]][selectedLocation[1]] = oldSelectedSquare;

        grid = this.clearSelectedPiece(grid);

        if(oldSelectedSquare.haveToJumpOption || this.state.canJumpAnotherPiece){
          grid = this.removeJumpedPiece(grid, selectedLocation, location);
          grid = this.clearAllHaveToJumpOption(grid);
          this.checkIfGameOver(grid);
        }
      }
      if(this.state.playerOneTurn){
        selectedSquare.hasWhitePiece = true;
        if(location[0] === 0)
          selectedSquare.isKingPiece = true;
        else
          selectedSquare.isKingPiece = isKing;
      }
      else{
        selectedSquare.hasRedPiece = true;
        if(location[0] === 7)
          selectedSquare.isKingPiece = true;
        else
          selectedSquare.isKingPiece = isKing;
      }

      selectedSquare.isSelected = false;
      grid[location[0]][location[1]] = selectedSquare;
      grid = this.SetJumpLocations(grid, location);

      this.setState({ grid: grid });
    }
  }

  removeJumpedPiece(grid, selectedLocation, moveOptionLocation){
    let pieceToRemoveLocation = [0,0];
    if(selectedLocation[0] > moveOptionLocation[0])
      pieceToRemoveLocation[0] = selectedLocation[0] - 1;
    else
      pieceToRemoveLocation[0] = selectedLocation[0] + 1;

    if(selectedLocation[1] > moveOptionLocation[1])
      pieceToRemoveLocation[1] = selectedLocation[1] - 1;
    else
      pieceToRemoveLocation[1] = selectedLocation[1] + 1;

    grid[pieceToRemoveLocation[0]][pieceToRemoveLocation[1]].hasRedPiece = false;
    grid[pieceToRemoveLocation[0]][pieceToRemoveLocation[1]].hasWhitePiece = false;

    return grid;
  }

  clearSelectedPiece(grid){
    let selectedLocation = this.state.pieceSelected.split(" ");
    selectedLocation[0] = parseInt(selectedLocation[0]);
    selectedLocation[1] = parseInt(selectedLocation[1]);
    let oldSelectedSquare = grid[selectedLocation[0]][selectedLocation[1]];
    oldSelectedSquare.isSelected = false;
    grid[selectedLocation[0]][selectedLocation[1]] = oldSelectedSquare;

    if(selectedLocation[0] > 0){
      if(selectedLocation[1] > 0)
        grid[selectedLocation[0]-1][selectedLocation[1]-1].isMoveOption = false;

      if(selectedLocation[1] < 7)
        grid[selectedLocation[0]-1][selectedLocation[1]+1].isMoveOption = false;

      if(selectedLocation[0] > 1){
        if(selectedLocation[1] > 1)
          grid[selectedLocation[0]-2][selectedLocation[1]-2].isMoveOption = false;

        if(selectedLocation[1] < 6)
          grid[selectedLocation[0]-2][selectedLocation[1]+2].isMoveOption = false;
      }
    }
    if(selectedLocation[0] < 7){
      if(selectedLocation[1] > 0)
        grid[selectedLocation[0]+1][selectedLocation[1]-1].isMoveOption = false;

      if(selectedLocation[1] < 7)
        grid[selectedLocation[0]+1][selectedLocation[1]+1].isMoveOption = false;

      if(selectedLocation[0] < 6){
        if(selectedLocation[1] > 1)
          grid[selectedLocation[0]+2][selectedLocation[1]-2].isMoveOption = false;

        if(selectedLocation[1] < 6)
          grid[selectedLocation[0]+2][selectedLocation[1]+2].isMoveOption = false;
      }
    }

    return grid;
  }

  clearAllHaveToJumpOption(grid){
    for(var i = 0; i < grid.length; i++){
      for(var j = 0; j < grid.length; j++){
        if(grid[i][j].haveToJumpOption)
          grid[i][j].haveToJumpOption = false;
      }
    }
    return grid;
  }

  setMoveOptions(grid, selectedSquare, location){
    if(location[0] > 0 && (this.state.playerOneTurn || selectedSquare.isKingPiece)){
      if(location[1] > 0 && !grid[location[0]-1][location[1]-1].hasWhitePiece && !grid[location[0]-1][location[1]-1].hasRedPiece)
        grid[location[0]-1][location[1]-1].isMoveOption = true;

      if(location[1] < 7 && !grid[location[0]-1][location[1]+1].hasWhitePiece && !grid[location[0]-1][location[1]+1].hasRedPiece)
        grid[location[0]-1][location[1]+1].isMoveOption = true;
    }
    if(location[0] < 7 && (!this.state.playerOneTurn || selectedSquare.isKingPiece)){
      if(location[1] > 0 && !grid[location[0]+1][location[1]-1].hasWhitePiece && !grid[location[0]+1][location[1]-1].hasRedPiece)
        grid[location[0]+1][location[1]-1].isMoveOption = true;

      if(location[1] < 7 && !grid[location[0]+1][location[1]+1].hasWhitePiece && !grid[location[0]+1][location[1]+1].hasRedPiece)
        grid[location[0]+1][location[1]+1].isMoveOption = true;
    }

    return grid;
  }

  SetJumpLocations(grid, location){
    let pieceSelected = "";
    let haveToJumpAnotherPiece = false;
    let jumpOptions = null;
    jumpOptions = this.checkifPieceCanJump(grid, location, this.state.playerOneTurn);

    if(this.state.haveToJumpAnotherPiece && (jumpOptions.topRight || jumpOptions.topLeft || jumpOptions.bottomRight || jumpOptions.bottomLeft)){
      this.setState({ canJumpAnotherPiece: true });
      grid[location[0]][location[1]].isSelected = true;
      grid = this.setJumpLocationsForPiece(grid, jumpOptions, location);
      pieceSelected = location[0] + " " + location[1];
    }
    else{
      this.setState({ playerOneTurn: !this.state.playerOneTurn, canJumpAnotherPiece: false });
      for(var i = 0; i < grid.length; i++){
        for(var j = 0; j < grid.length; j++){
          if(grid[i][j].white || (!grid[i][j].hasRedPiece && !grid[i][j].hasWhitePiece) || (grid[i][j].hasRedPiece && !this.state.playerOneTurn) || (grid[i][j].hasWhitePiece && this.state.playerOneTurn))
            continue;
          jumpOptions = this.checkifPieceCanJump(grid, [i, j], !this.state.playerOneTurn);

          if(jumpOptions.topRight || jumpOptions.topLeft || jumpOptions.bottomRight || jumpOptions.bottomLeft){
            haveToJumpAnotherPiece = true;
            grid[i][j].haveToJumpOption = true;
          }
        }
      }
    }

    this.setState({ haveToJumpAnotherPiece: haveToJumpAnotherPiece, pieceSelected: pieceSelected });
    return grid;
  }

  setJumpLocationsForPiece(grid, jumpOptions, selectedLocation){
    if(jumpOptions.topLeft)
      grid[selectedLocation[0]-2][selectedLocation[1]-2].isMoveOption = true;
    if(jumpOptions.topRight)
      grid[selectedLocation[0]-2][selectedLocation[1]+2].isMoveOption = true;
    if(jumpOptions.bottomLeft)
      grid[selectedLocation[0]+2][selectedLocation[1]-2].isMoveOption = true;
    if(jumpOptions.bottomRight)
      grid[selectedLocation[0]+2][selectedLocation[1]+2].isMoveOption = true;

    return grid;
  }

  checkifPieceCanJump(grid, selectedLocation, playerOneTurn){
    let topRight = false;
    let topLeft = false;
    let bottomRight = false;
    let bottomLeft = false;
    let selectedSquare = grid[selectedLocation[0]][selectedLocation[1]];
    if(selectedLocation[0] > 1 && (playerOneTurn || selectedSquare.isKingPiece)){
      if(selectedLocation[1] > 1 && ((grid[selectedLocation[0]-1][selectedLocation[1]-1].hasWhitePiece && !playerOneTurn) || (grid[selectedLocation[0]-1][selectedLocation[1]-1].hasRedPiece && playerOneTurn))){
        if(!grid[selectedLocation[0]-2][selectedLocation[1]-2].hasWhitePiece && !grid[selectedLocation[0]-2][selectedLocation[1]-2].hasRedPiece)
          topLeft = true;
      }

      if(selectedLocation[1] < 6 && ((grid[selectedLocation[0]-1][selectedLocation[1]+1].hasWhitePiece && !playerOneTurn) || (grid[selectedLocation[0]-1][selectedLocation[1]+1].hasRedPiece && playerOneTurn))){
        if(!grid[selectedLocation[0]-2][selectedLocation[1]+2].hasWhitePiece && !grid[selectedLocation[0]-2][selectedLocation[1]+2].hasRedPiece)
          topRight = true;
      }
    }
    if(selectedLocation[0] < 6 && (!playerOneTurn || selectedSquare.isKingPiece)){
      if(selectedLocation[1] > 1 && ((grid[selectedLocation[0]+1][selectedLocation[1]-1].hasWhitePiece && !playerOneTurn) || (grid[selectedLocation[0]+1][selectedLocation[1]-1].hasRedPiece && playerOneTurn))){
        if(!grid[selectedLocation[0]+2][selectedLocation[1]-2].hasWhitePiece && !grid[selectedLocation[0]+2][selectedLocation[1]-2].hasRedPiece)
          bottomLeft = true;
      }

      if(selectedLocation[1] < 6 && ((grid[selectedLocation[0]+1][selectedLocation[1]+1].hasWhitePiece && !playerOneTurn) || (grid[selectedLocation[0]+1][selectedLocation[1]+1].hasRedPiece && playerOneTurn))){
        if(!grid[selectedLocation[0]+2][selectedLocation[1]+2].hasWhitePiece && !grid[selectedLocation[0]+2][selectedLocation[1]+2].hasRedPiece)
          bottomRight = true;
      }
    }

    return { topRight: topRight, topLeft: topLeft, bottomRight: bottomRight, bottomLeft: bottomLeft };
  }

  checkIfGameOver(grid){
    let pieceFound = false;
    for(var i = 0; i < grid.length; i++){
      for(var j = 0; j < grid.length; j++){
        if((grid[i][j].hasRedPiece && this.state.playerOneTurn) || (grid[i][j].hasWhitePiece && !this.state.playerOneTurn)){
          pieceFound = true;
          break;
        }
      }
      if(pieceFound)
        break;
    }
    if(!pieceFound){
      clearInterval(this.state.intervalId);
      this.setState({ gameOver: true, playerOneWon: this.state.playerOneTurn });
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
          <CheckerTile
            white={y.white}
            hasWhitePiece={y.hasWhitePiece}
            hasRedPiece={y.hasRedPiece}
            isKingPiece={y.isKingPiece}
            isSelected={y.isSelected}
            isMoveOption={y.isMoveOption}
            haveToJumpOption={y.haveToJumpOption}
            size={this.state.cellSize}
            key={index + " " + index2}
            identifier={index + " " + index2}
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
        <div className="row">
          <div className="col-3">
            <CheckersStatusBar
              playerOneTurn={this.state.playerOneTurn}
              startOver={this.startOver}
              secondsInGame={this.state.secondsInGame}
              gameOver={this.state.gameOver}
              playerOneWon={this.state.playerOneWon}
              canJumpAnotherPiece={this.state.canJumpAnotherPiece}
              endTurn={this.endTurn}
            />
          </div>
          <div className="col-9">
            <div style={style}>
              {cells}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Checkers;
