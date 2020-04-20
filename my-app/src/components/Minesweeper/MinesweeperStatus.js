import React from 'react';
import gameInProgress from '../../Images/Minesweeper/gameInProgress.gif';
import Died from '../../Images/Minesweeper/Died.gif';
import Won from '../../Images/Minesweeper/Won.gif';
import styles from '../../Styles/mineSweeper.css.js';

class MinesweeperStatus extends React.PureComponent {
  render() {
    let image = null;
    if(this.props.dead)
      image = Died;
    else if(this.props.gameOver)
      image = Won;
    else
      image = gameInProgress;

    return (
      <div className="row" style={styles.statusRow}>
        <div className="col-2 offset-md-3" style={styles.statusRowCol}>Seconds: {this.props.secondsInGame}</div>
        <div className="col-2" style={styles.statusRowCol}><button className="startGameButton" onClick={this.props.startOver}><img src={image} height="40" width="40" alt="Status Button" /></button></div>
        <div className="col-2" style={styles.statusRowCol}>Flags Left: {this.props.flagsLeft}</div>
      </div>
    );
  }
}

export default MinesweeperStatus;
