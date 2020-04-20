import React from 'react';
import styles from '../../Styles/Checkers.css.js';
import turnArrow from '../../Images/Onitama/turnArrow.png';

class CheckersStatusBar extends React.Component {
  render() {
    let endTurnButton = null;
    let gameOver = "";
    if(this.props.gameOver){
      if(this.props.playerOneWon)
        gameOver = "White Player Won!";
      else
        gameOver = "Red Player Won!";
    }

    let style = Object.assign({},
      this.props.playerOneTurn && styles.Invert
    );

    if(this.props.canJumpAnotherPiece)
      endTurnButton = <button className="endTurnButton" onClick={this.props.endTurn}>End Turn</button>;
    return (
      <div>
        <div>Seconds: {this.props.secondsInGame}</div>
        <div><button className="startGameButton" onClick={this.props.startOver}>Start Over</button></div>
        <div style={styles.turnArrow}><img style={style} src={turnArrow} height="400" width="75" alt="turnArrow"/></div>
        <div>{endTurnButton}</div>
        <div>{gameOver}</div>
      </div>
    );
  }
}

export default CheckersStatusBar;
