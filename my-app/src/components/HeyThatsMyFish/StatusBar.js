import React from 'react';
import styles from '../../Styles/HeyThatsMyFish.css.js';
import turnArrow from '../../Images/Onitama/turnArrow.png';
import rules from "./Hey_Thats_My_Fish_Rulebook.pdf";

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
      this.props.playerOneTurn && styles.Invert
    );

    let endTurnButton = null;
    if(!this.props.gameOver)
      endTurnButton = <button className="endTurnButton" onClick={this.props.endTurn}>End Turn</button>;
    return (
      <div style={{ marginTop: "15px" }}>
        <div>Seconds: {this.props.secondsInGame}</div>
        <div><button className="startGameButton" onClick={this.props.startOver}>Re-Start</button></div>
        <div><a href={rules} target="_blank" rel="noopener noreferrer">Rules</a></div>
        <div style={styles.turnArrow}><img style={style} src={turnArrow} height="400" width="75" alt="turnArrow"/></div>
        <div>{endTurnButton}</div>
        {gameOver}
      </div>
    );
  }
}

export default StatusBar;
