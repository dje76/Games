import React from 'react';
import OnitamaTile from './OnitamaTile.js';
import OnitamaStatusBar from './OnitamaStatusBar.js';
import OnitamaCardBar from './OnitamaCardBar.js';
import styles from '../../Styles/Onitama.css.js';
import deck from './cards.json';
import Background from '../../Images/Onitama/woodFloor.png';


class Onitama extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      timerStarted: false,
      secondsInGame: 0,
      intervalId: 0,
      playerOneTurn: false,
      cards: [],
      selectedCard: "",
      gameOver: false,
      playerOneWon: false,
      tabletopMode: false,
      pieceSelected: "",
      dimensions: [5,5],
      cellSize: 145,
    };

    this.checkIfGameOver = this.checkIfGameOver.bind(this);
    this.onTick= this.onTick.bind(this);
    this.startOver = this.startOver.bind(this);
    this.handleTabletopCheck = this.handleTabletopCheck.bind(this);
    this.clearSelectedPiece = this.clearSelectedPiece.bind(this);
    this.handleSquareClick = this.handleSquareClick.bind(this);
    this.selectCardClick = this.selectCardClick.bind(this);
    this.setMoveOptions = this.setMoveOptions.bind(this);
    this.updateCards = this.updateCards.bind(this);

    let grid = Array(this.state.dimensions[1]).fill().map(() => Array(this.state.dimensions[0]).fill().map(() => { return { isBluePiece: false, isRedPiece: false, isMaster: false, isSelected: false, isMoveOption: false, isTempleArch: false }; }));
    this.state.boardDimensions = [(this.state.dimensions[0] * this.state.cellSize) + 4, (this.state.dimensions[1] * this.state.cellSize) + 4];

    this.state.grid = this.setGridValues(grid);
    this.state.cards = this.propulateCards();
    this.state.playerOneTurn = this.state.cards[2].playerOneFirst;
    document.body.style.backgroundColor = "beige";
  }

  setGridValues(grid){
    let dimensions = this.state.dimensions;
    for(var i = 1; i <= this.state.dimensions[0] * this.state.dimensions[1]; i++){
      if(i < 6)
        grid[Math.ceil(i/dimensions[0])-1][(i-1)%dimensions[1]].isRedPiece = true;
      else if(i > 20)
        grid[Math.ceil(i/dimensions[0])-1][(i-1)%dimensions[1]].isBluePiece = true;

      if(i === 3 || i === 23){
         grid[Math.ceil(i/dimensions[0])-1][(i-1)%dimensions[1]].isMaster = true;
         grid[Math.ceil(i/dimensions[0])-1][(i-1)%dimensions[1]].isTempleArch = true;
      }
    }
    return grid;
  }

  propulateCards(){
    let randomCards = [];
    while(randomCards.length !== 5){
      let index = Math.floor(Math.random() * 15);
      let alreadyInCards = false;
      for(let i = 0; i < randomCards.length; i++){
        if(randomCards[i].cardTypeId === deck.cards[index].cardTypeId){
          alreadyInCards = true;
          break;
        }
      }
      if(!alreadyInCards)
        randomCards.push(deck.cards[index]);
    }
    let cards = [];
    for(var i = 1; i < 6; i++){
      let card = { cardId: i, cardTypeId: randomCards[i-1].cardTypeId, isSelected: false, cardMoveOptions: randomCards[i-1].cardMoveOptions, playerOneFirst: randomCards[i-1].playerOneFirst };
      cards.push(card);
    }

    return cards;
  }

  startOver(){
    let grid = Array(this.state.dimensions[1]).fill().map(() => Array(this.state.dimensions[0]).fill().map(() => { return {isBluePiece: false, isRedPiece: false, isMaster: false, isSelected: false, isMoveOption: false, isTempleArch: false}; }));
    grid = this.setGridValues(grid);
    let cards = this.propulateCards();
    clearInterval(this.state.intervalId);
    this.setState({ grid: grid, cards: cards, playerOneTurn: cards[2].playerOneFirst, pieceSelected: "", gameOver: false, secondsInGame: 0, timerStarted: false });
  }

  handleTabletopCheck(){
  	this.setState({tabletopMode: !this.state.tabletopMode});
  }

  selectCardClick(cardTypeId, cardStatus){
    let cards = this.state.cards;
    let selectedCard = null;
    for(var i = 0; i < this.state.cards.length; i++){
      if(cards[i].cardTypeId === cardTypeId){
        cards[i].isSelected = true;
        selectedCard = cards[i];
      }
      else
        cards[i].isSelected = false;
    }

    if(this.state.pieceSelected !== ""){
      let grid = this.state.grid;
      let location = this.state.pieceSelected.split(" ");
      location[0] = parseInt(location[0]);
      location[1] = parseInt(location[1]);
      let selectedSquare = grid[location[0]][location[1]];

      grid = this.clearSelectedPiece(grid);
      selectedSquare.isSelected = true;
      grid[location[0]][location[1]] = selectedSquare;
      grid = this.setMoveOptions(grid, location, selectedCard);
    }
    this.setState({ cards: cards });
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

    if(!selectedSquare.isMoveOption && !(selectedSquare.isBluePiece && this.state.playerOneTurn) && !(selectedSquare.isRedPiece && !this.state.playerOneTurn))
      return;

    let pieceSelected = location[0] + " " + location[1];
    if(selectedSquare.isMoveOption){
      if(this.state.pieceSelected !== ""){
        let selectedLocation = this.state.pieceSelected.split(" ");
        let cards = this.state.cards;
        selectedLocation[0] = parseInt(selectedLocation[0]);
        selectedLocation[1] = parseInt(selectedLocation[1]);
        let oldSelectedSquare = grid[selectedLocation[0]][selectedLocation[1]];
        selectedSquare.isMaster = oldSelectedSquare.isMaster;
        selectedSquare.isBluePiece = oldSelectedSquare.isBluePiece;
        selectedSquare.isRedPiece = oldSelectedSquare.isRedPiece;
        oldSelectedSquare.isSelected = false;
        oldSelectedSquare.isBluePiece = false;
        oldSelectedSquare.isRedPiece = false;
        oldSelectedSquare.isMaster = false;
        grid[selectedLocation[0]][selectedLocation[1]] = oldSelectedSquare;

        grid = this.clearSelectedPiece(grid);
        cards = this.updateCards(cards);

        this.checkIfGameOver(grid);
        this.setState({ grid: grid, playerOneTurn: !this.state.playerOneTurn, cards: cards, pieceSelected: "" });
      }
    }
    else if(selectedSquare.isBluePiece || selectedSquare.isRedPiece){
      grid = this.clearSelectedPiece(grid);
      selectedSquare.isSelected = true;
      grid[location[0]][location[1]] = selectedSquare;
      let selectedCard = null;
      for(let i = 0; i < this.state.cards.length; i++){
        if(this.state.cards[i].isSelected)
          selectedCard = this.state.cards[i];
      }
      if(selectedCard !== null)
        grid = this.setMoveOptions(grid, location, selectedCard);

      this.setState({ grid: grid, pieceSelected: pieceSelected });
    }
  }

  updateCards(cards){
    let selectedCardIndex = null;
    for(var i = 0; i < cards.length; i++){
      if(cards[i].isSelected)
        selectedCardIndex = i;
    }
    cards[selectedCardIndex].isSelected = false;

    let cardUsed = cards.splice(selectedCardIndex,1);
    cards.splice(2,0,cardUsed[0]);

    return cards;
  }

  clearSelectedPiece(grid){
    for(var i = 0; i < grid.length; i++){
      for(var j = 0; j < grid.length; j++){
        grid[i][j].isSelected = false;
        grid[i][j].isMoveOption = false;
      }
    }
    return grid;
  }

  setMoveOptions(grid, location, selectedCard){
    for(let i = 0; i < selectedCard.cardMoveOptions.length; i++){
      let moveOption = [];
      if(!this.state.playerOneTurn){
        moveOption[0] = selectedCard.cardMoveOptions[i][0] * -1;
        moveOption[1] = selectedCard.cardMoveOptions[i][1] * -1;
      }
      else
        moveOption = selectedCard.cardMoveOptions[i];

      if(location[0] + moveOption[0] > 4 || location[0] + moveOption[0] < 0 || location[1] + moveOption[1] > 4 || location[1] + moveOption[1] < 0)
        continue;

      let newLocation = [location[0] + moveOption[0], location[1] + moveOption[1]];

      if((grid[newLocation[0]][newLocation[1]].isBluePiece && this.state.playerOneTurn) || (grid[newLocation[0]][newLocation[1]].isRedPiece && !this.state.playerOneTurn))
        continue;
      grid[newLocation[0]][newLocation[1]].isMoveOption = true;
    }

    return grid;
  }

  checkIfGameOver(grid){
    let gameover = false;
    let MasterCount = 0
    for(var i = 0; i < grid.length; i++){
      for(var j = 0; j < grid.length; j++){
        if((i === 0 && j === 2 && grid[i][j].isBluePiece && grid[i][j].isMaster && this.state.playerOneTurn) || (i === 4 && j === 2 && grid[i][j].isTempleArch && grid[i][j].isRedPiece && grid[i][j].isMaster && !this.state.playerOneTurn)){
          gameover = true;
          break;
        }
        if(grid[i][j].isMaster)
          MasterCount++;
      }
      if(gameover)
        break;
    }
    if(MasterCount < 2)
      gameover = true;
    if(gameover){
      clearInterval(this.state.intervalId);
      this.setState({ gameOver: true, playerOneWon: this.state.playerOneTurn });
    }
  }

  onTick(){
    let seconds = this.state.secondsInGame + 1;
    this.setState({ secondsInGame: seconds });
  }

  render() {
    var style = Object.assign({},
      styles.board,
      { height: this.state.boardDimensions[0] + "px", width: this.state.boardDimensions[1] + "px", marginLeft: "calc(50% - " + (this.state.boardDimensions[1]/2) + "px)" },
      { backgroundImage: `url(${Background})` }
    );
    const cells = this.state.grid.map((x, index) => {
      return x.map((y, index2) => {
        return (
          <OnitamaTile
            isBluePiece={y.isBluePiece}
            isRedPiece={y.isRedPiece}
            isMaster={y.isMaster}
            isSelected={y.isSelected}
            isMoveOption={y.isMoveOption}
            isTempleArch={y.isTempleArch}
            playerOneTurn={this.state.playerOneTurn}
            size={this.state.cellSize}
            key={index + " " + index2}
            identifier={index + " " + index2}
            tabletopMode={this.state.tabletopMode}
            handleSquareClick={this.handleSquareClick}
            />
        );
      });
    });

    return (
      <div className="container" style={{ maxWidth: "100%" }}>
        <div className="row">
          <div className="col-1">
            <OnitamaStatusBar
              playerOneTurn={this.state.playerOneTurn}
              startOver={this.startOver}
              secondsInGame={this.state.secondsInGame}
              gameOver={this.state.gameOver}
              playerOneWon={this.state.playerOneWon}
              tabletopMode={this.state.tabletopMode}
              handleTabletopCheck={this.handleTabletopCheck}
            />
          </div>
          <div className="col-7">
            <div className="board" style={style}>
              {cells}
            </div>
          </div>
          <div className="col-4">
            <OnitamaCardBar
              playerOneTurn={this.state.playerOneTurn}
              cards={this.state.cards}
              selectedCard={this.state.selectedCard}
              selectCardClick={this.selectCardClick}
              tabletopMode={this.state.tabletopMode}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Onitama;
