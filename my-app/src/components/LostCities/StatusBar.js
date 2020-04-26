import React from 'react';
import styles from '../../Styles/LostCities.css.js';
import turnArrow from '../../Images/Onitama/turnArrow.png';
import rules from "./LostCities_Rules.pdf";

class StatusBar extends React.Component {
  render() {
    let gameOver = null;
    if(this.props.gameOver){
      if(this.props.playerFishTotal[0] > this.props.playerFishTotal[1])
        gameOver = <div><div>Blue: {this.props.playerFishTotal[0]} Red: {this.props.playerFishTotal[1]}</div>Blue Player Won!</div>;
      else if(this.props.playerFishTotal[0] < this.props.playerFishTotal[1])
        gameOver = <div><div>Blue: {this.props.playerFishTotal[0]} Red: {this.props.playerFishTotal[1]}</div>Red Player Won!</div>;
      else
        gameOver = <div><div>Blue: {this.props.playerFishTotal[0]} Red: {this.props.playerFishTotal[1]}</div>It's a Tie!</div>;
    }
    let style = Object.assign({},
      this.props.playersTurn && styles.Invert
    );

    let gameName = this.props.game === undefined || this.props.game.gameName === null ? "" : this.props.game.gameName;
    let playerName = this.props.player === undefined || this.props.player.playerName === null ? "" : this.props.player.playerName;

    return (
      <div style={{ marginTop: "15px" }}>
        <div><button onClick={this.props.createGame}>Start Game</button></div>
        <div>Game Name: {gameName}</div>
        <div>Player Name: {playerName}</div>
        <div><a href={rules} target="_blank" rel="noopener noreferrer">Rules</a></div>
        <div style={styles.turnArrow}><img style={style} src={turnArrow} height="400" width="75" alt="turnArrow"/></div>
        {gameOver}
      </div>
    );
  }
}

export default StatusBar;
