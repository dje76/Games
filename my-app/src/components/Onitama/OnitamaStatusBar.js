import React from 'react';
import styles from '../../Styles/Onitama.css.js';
import turnArrow from '../../Images/Onitama/turnArrow.png';
import rules from "./Onitama_Rulebook.PDF";

class OnitamaStatusBar extends React.Component {
  render() {
    let gameOver = "";
    if(this.props.gameOver){
      if(this.props.playerOneWon)
        gameOver = "Blue Player Won!";
      else
        gameOver = "Red Player Won!";
    }
    let style = Object.assign({},
      this.props.playerOneTurn && styles.Invert
    );
    return (
      <div style={{ marginTop: "15px" }}>
        <div>Seconds: {this.props.secondsInGame}</div>
        <div><button className="startGameButton" onClick={this.props.startOver}>Re-Start</button></div>
        <div>Tabletop Mode: <input type="checkbox" checked={this.props.tabletopMode} onChange={this.props.handleTabletopCheck}/></div>
        <div><a href={rules} target="_blank" rel="noopener noreferrer">Rules</a></div>
        <div style={styles.turnArrow}><img style={style} src={turnArrow} height="400" width="75" alt="turnArrow"/></div>
        <div>{gameOver}</div>
      </div>
    );
  }
}

export default OnitamaStatusBar;
