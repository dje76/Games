import React from 'react';
import StatusBar from './StatusBar.js';
import StartGameModal from './StartGameModal.js';
import PlayArea from './PlayArea.js';
import Hand from './Hand.js';
import styles from '../../Styles/LostCities.css.js';
import deck from '../../Images/LostCities/Deck.png';
import axios from 'axios'


class LostCities extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      game: {},
      player: {},
      playerScores: [0, 0],
      showCreateGameModal: false,
      avalibleGames: [],
      isPlayersTurn: true,
      gameOver: false,
      playPhase: true,
      hand: [],
      deck: [],
      playAreas: [],
      selectedCardIndex: "",
      areaChangedIndexes: []
    };

    this.handleCardClick = this.handleCardClick.bind(this);
    this.closeCreateGameModal = this.closeCreateGameModal.bind(this);
    this.handlePlayAreaClick = this.handlePlayAreaClick.bind(this);
    this.handleDeckClick = this.handleDeckClick.bind(this);
    this.getNewGameData = this.getNewGameData.bind(this);
    this.createGame = this.createGame.bind(this);

    document.body.style.backgroundColor = "beige";
  }

  createGame(){
    axios.get('http://localhost:3001/games')
    .then(response => {
      this.setState({ avalibleGames: response.data });
    });
    this.setState({ showCreateGameModal: true });
  }

  closeCreateGameModal(){
    this.setState({ showCreateGameModal: false });
  }

  endTurnSave(playAreas, hand, deck, areaChangedIndexes){
    let changedPlayAreas = [];
    for(var i = 0; i < playAreas.length; i++){
      for(var j = 0; j < areaChangedIndexes.length; j++){
        if(playAreas[i]._id === areaChangedIndexes[j])
          changedPlayAreas.push(playAreas[i]);
      }
    }
    let postData = {
      playAreas: changedPlayAreas,
      hand: hand,
      deck: deck,
      player: this.state.player,
      game: this.state.game
    };
    axios.post('http://localhost:3001/endTurnSave', postData)
    .then(function (response) {
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  getNewGameData(requestData){
    console.log(requestData.data);
    let playerScores = this.calculateScores(requestData.data.currentLostCities_playAreas, requestData.data.currentPlayer);
    this.setState({
      hand: requestData.data.currentLostCities_Hand,
      showCreateGameModal: false,
      deck: requestData.data.currentLostCities_Game.deck,
      game: requestData.data.currentGame,
      player: requestData.data.currentPlayer,
      playAreas: requestData.data.currentLostCities_playAreas,
      playerScores: playerScores,
      isPlayersTurn: requestData.data.currentLostCities_Game.playerTurn === requestData.data.currentPlayer._id
    });
  }

  calculateScores(playAreas, player){
    let playerScore = 0;
    let opponentScore = 0;
    for(let i = 0; i < playAreas.length; i++){
      if(playAreas[i].playerId === player._id && playAreas[i].playedCards.length !== 0){
        let playAreaScore = -20;
        let invesmentMultiplier = 1;
        for(let j = 0; j < playAreas[i].playedCards.length; j++){
          playAreaScore += playAreas[i].playedCards[j].value;
          if(playAreas[i].playedCards[j].value === 0)
            invesmentMultiplier++;
        }
        playerScore += playAreaScore * invesmentMultiplier;
      }
      else if(!playAreas[i].isDiscard && playAreas[i].playedCards.length !== 0){
        let playAreaScore = -20;
        let invesmentMultiplier = 1;
        for(let j = 0; j < playAreas[i].playedCards.length; j++){
          playAreaScore += playAreas[i].playedCards[j].value;
        }
        opponentScore += playAreaScore * invesmentMultiplier;
      }
    }
    return [playerScore, opponentScore];
  }

  handleDeckClick(){
    if(!this.state.isPlayersTurn || this.state.playPhase)
      return;

    let deck = this.state.deck;
    let hand = this.state.hand;
    let playAreas = this.state.playAreas;

    hand.hand.push(deck.pop());

    for(var i = 0; i < playAreas.length; i++){
      playAreas[i].selectOption = false;
    }

    let gameOver = false;
    if(deck.length === 0)
      gameOver = true;

    this.endTurnSave(playAreas, hand, deck, this.state.areaChangedIndexes);
    this.setState({ deck: deck, hand: hand, playPhase: true, isPlayersTurn: false, gameOver: gameOver, playAreas: playAreas })
  }

  handleCardClick(index){
    if(!this.state.isPlayersTurn || !this.state.playPhase)
      return;
    let hand = this.state.hand;
    let playAreas = this.state.playAreas;
    let selectedCard = hand.hand[index];

    for(let i = 0; i < hand.hand.length; i++){
      hand.hand[i].isSelected = false;
    }
    for(let i = 0; i < playAreas.length; i++){
      if(playAreas[i].suit === selectedCard.suit && (playAreas[i].playerId === this.state.player._id || playAreas[i].isDiscard)){
        if(playAreas[i].playedCards === undefined || playAreas[i].playedCards.length === 0 || selectedCard.value >= playAreas[i].playedCards[playAreas[i].playedCards.length - 1].value || playAreas[i].isDiscard)
          playAreas[i].selectOption = true;
      }
      else
        playAreas[i].selectOption = false;
    }
    selectedCard.isSelected = true;
    hand.hand[index] = selectedCard;
    this.setState({ hand: hand, selectedCardIndex: index });
  }

  handlePlayAreaClick(AreaId){
    if(!this.state.isPlayersTurn)
      return;
    let hand = this.state.hand;
    let playAreas = this.state.playAreas;
    let playPhase = false;
    let isPlayersTurn = false;
    let areaChangedIndexes = this.state.areaChangedIndexes;
    areaChangedIndexes.push(AreaId);
    if(this.state.playPhase){
      let selectedCard = hand.hand[this.state.selectedCardIndex];
      for(let i = 0; i < playAreas.length; i++){
        if(playAreas[i]._id === AreaId){
          playAreas[i].playedCards.push(selectedCard);
          playAreas[i].selectOption = false;
        }
        else if(playAreas[i].isDiscard && playAreas[i].playedCards.length > 0)
          playAreas[i].selectOption = true;
        else
          playAreas[i].selectOption = false;
      }
      hand.hand.splice(this.state.selectedCardIndex, 1);
      isPlayersTurn = true;
    }
    else{
      let cardToAddToHand = null;
      for(let i = 0; i < playAreas.length; i++){
        if(playAreas[i]._id === AreaId)
          cardToAddToHand = playAreas[i].playedCards.pop();
        playAreas[i].selectOption = false;
      }
      cardToAddToHand.isSelected = false;
      hand.hand.push(cardToAddToHand);
      playPhase = true;
      this.endTurnSave(playAreas, hand, this.state.deck, areaChangedIndexes);
    }
    let playerScores = this.calculateScores(playAreas, this.state.player);
    console.log(isPlayersTurn);
    this.setState({ playerScores: playerScores, hand: hand, selectedCardIndex: "", isPlayersTurn: isPlayersTurn, playPhase: playPhase, playAreas: playAreas, areaChangedIndexes: areaChangedIndexes });
  }

  render() {
    let OpponentPlayAreas = this.state.playAreas.filter((obj) => {return obj.playerId !== this.state.player._id && !obj.isDiscard}).map((x, index) => {
      return (
        <PlayArea
          suit={x.suit}
          isDiscard={x.isDiscard}
          PlayerId={x.PlayerId}
          isSelected={x.isSelected}
          cards={x.playedCards}
          selectOption={x.selectOption}
          key={x._id}
          identifier={x._id}
          handlePlayAreaClick={this.handlePlayAreaClick}
        />
      );
    });
    let DiscardPlayAreas = this.state.playAreas.filter((obj) => {return obj.isDiscard}).map((x, index) => {
      return (
        <PlayArea
          suit={x.suit}
          isDiscard={x.isDiscard}
          PlayerId={x.PlayerId}
          isSelected={x.isSelected}
          cards={x.playedCards}
          selectOption={x.selectOption}
          key={x._id}
          identifier={x._id}
          handlePlayAreaClick={this.handlePlayAreaClick}
        />
      );
    });
    let PlayerPlayAreas = this.state.playAreas.filter((obj) => {return obj.playerId === this.state.player._id}).map((x, index) => {
      return (
        <PlayArea
          suit={x.suit}
          isDiscard={x.isDiscard}
          PlayerId={x.PlayerId}
          isSelected={x.isSelected}
          cards={x.playedCards}
          selectOption={x.selectOption}
          key={x._id}
          identifier={x._id}
          handlePlayAreaClick={this.handlePlayAreaClick}
        />
      );
    });

    let style = Object.assign({},
      styles.deck,
      !this.state.playPhase && styles.borderHighlight,
      this.state.playPhase && styles.normalBorder
    );
    let deckDivStyle = Object.assign({},
      { textAlign: "center" },
      this.state.deck.length === 0 && styles.hidden
    );
    let ScoreStyle = Object.assign({},
      styles.scoreBlock,
      (this.state.hand.hand === undefined || this.state.hand.hand.length === 0) && styles.hidden
    );

    return (
      <div className="container"style={{ maxWidth: "100%" }}>
        <div className="row">
          <div className="col-2">
            <StatusBar
              isPlayersTurn={this.state.isPlayersTurn}
              gameOver={this.state.gameOver}
              createGame={this.createGame}
              player={this.state.player}
              game={this.state.game}
              playerScores={this.state.playerScores}
            />
          </div>
          <div className="col-8">
            <div className="board" style={styles.board}>
              <div>{OpponentPlayAreas}</div>
              <div>{DiscardPlayAreas}</div>
              <div>{PlayerPlayAreas}</div>
              <div>
                <Hand hand={this.state.hand} isPlayersTurn={this.state.isPlayersTurn} playPhase={this.state.playPhase}  handleCardClick={this.handleCardClick} />
              </div>
            </div>
          </div>
          <div className="col-2">
            <div style={ScoreStyle}>
              Score: {this.state.playerScores[1]}
            </div>
            <div style={deckDivStyle}>
              <img src={deck} style={style} onClick={this.handleDeckClick} alt="deck" />
              <div>({this.state.deck.length})</div>
            </div>
            <div style={ScoreStyle}>
              Score: {this.state.playerScores[0]}
            </div>
          </div>
        </div>
        <StartGameModal
          showCreateGameModal={this.state.showCreateGameModal}
          closeCreateGameModal={this.closeCreateGameModal}
          getNewGameData={this.getNewGameData}
          avalibleGames={this.state.avalibleGames}
        />
      </div>
    );
  }
}

export default LostCities;
