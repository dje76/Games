import React from 'react';
import StatusBar from './StatusBar.js';
import StartGameModal from './StartGameModal.js';
import Hand from './Hand.js';
import styles from '../../Styles/LostCities.css.js';
import axios from 'axios'


class LostCities extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      game: {},
      player: {},
      showCreateGameModal: false,
      avalibleGames: [],
      isPlayersTurn: true,
      gameOver: false,
      hand: [],
      deck: [],
      playerAreas: [],
      apponentAreas: [],
      discardAreas: [],
      selectedCardIndex: ""
    };

    this.handleCardAreaClick = this.handleCardAreaClick.bind(this);
    this.closeCreateGameModal = this.closeCreateGameModal.bind(this);
    this.handleJoinClick = this.handleJoinClick.bind(this);
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

  getNewGameData(requestData){
    console.log(requestData.data);
    this.setState({
      isPlayersTurn: true,
      hand: requestData.data.currentLostCities_Hand,
      showCreateGameModal: false,
      deck: requestData.data.currentLostCities_Game.deck,
      game: requestData.data.currentGame,
      player: requestData.data.currentPlayer
    });
  }

  handleJoinClick(){

  }

  handleCardClick(index){
    let hand = this.state.hand.hand;
    let selectedCard = hand[index];

    for(var i = 0; i < hand.length; i++){
      hand[i].isSelected = false;
    }
    selectedCard.isSelected = true;
    hand[index] = selectedCard;
    this.setState({ hand: hand, selectedCardIndex: index });
  }

  handleCardAreaClick(index, isDiscard){
    let hand = this.state.hand.hand;
    let selectedCard = hand[this.sate.selectedCardIndex];
    let selectedArea = null;
    if(isDiscard)
      selectedArea = this.state.discardAreas[index];
    else
      selectedArea = this.state.playerAreas[index];
    selectedArea.push(selectedCard);

    hand.splice(this.sate.selectedCardIndex, 1);
    let deck = this.state.deck;
    let cardToDraw = deck.pop();
    hand.push(cardToDraw);
    this.setState({ hand: hand, selectedCardIndex: index, isPlayersTurn: false });
  }

  render() {
    return (
      <div className="container"style={{ maxWidth: "100%" }}>
        <div className="row">
          <div className="col-3">
            <StatusBar
              isPlayersTurn={this.state.isPlayersTurn}
              gameOver={this.state.gameOver}
              createGame={this.createGame}
              player={this.state.player}
              game={this.state.game}
            />
          </div>
          <div className="col-9">
            <div className="board" style={styles.board}>
              <Hand
                hand={this.state.hand}
                handleCardClick={this.handleCardClick}
              />
            </div>
          </div>
        </div>
        <StartGameModal
          showCreateGameModal={this.state.showCreateGameModal}
          closeCreateGameModal={this.closeCreateGameModal}
          handleJoinClick={this.handleJoinClick}
          getNewGameData={this.getNewGameData}
          avalibleGames={this.state.avalibleGames}
        />
      </div>
    );
  }
}

export default LostCities;
