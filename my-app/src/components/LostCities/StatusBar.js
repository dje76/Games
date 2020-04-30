import React from 'react';
import styles from '../../Styles/LostCities.css.js';
import turnArrow from '../../Images/Onitama/turnArrow.png';
import rules from "./LostCities_Rules.pdf";

class StatusBar extends React.Component {
  render() {
    let gameOver = null;
    if(this.props.gameOver){
      let winner = "";
      if(this.props.playerScores[0] > this.props.playerScores[1])
        winner += "You Won!";
      else if(this.props.playerScores[0] < this.props.playerScores[1])
        winner += "Your Opponent Won!";
      else
        gameOver += "It's a Tie!";
      gameOver = <div><div>You: {this.props.playerScores[0]} Opponent: {this.props.playerScores[1]}</div>{winner}</div>;
    }
    let style = Object.assign({},
      styles.arrow,
      this.props.isPlayersTurn && styles.Invert
    );

    let gameName = this.props.game === undefined || this.props.game.gameName === null ? "" : this.props.game.gameName;
    let playerName = this.props.player === undefined || this.props.player.playerName === null ? "" : this.props.player.playerName;

    return (
      <div style={{ marginTop: "15px" }}>
        <div><button onClick={this.props.createGame}>Start Game</button></div>
        <div>Game Name: {gameName}</div>
        <div>Player Name: {playerName}</div>
        <div><a href={rules} target="_blank" rel="noopener noreferrer">Rules</a></div>
        <div style={styles.turnArrow}><img style={style} src={turnArrow} alt="turnArrow"/></div>
        {gameOver}
      </div>
    );
  }
}

export default StatusBar;
