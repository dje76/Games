import React from 'react';
import ActionOption from './ActionOption.js';
import { Button } from 'react-bootstrap';
import styles from '../../Styles/RollingVillage.css.js';
import rules from "./RollingVillage_Rules.pdf";
import logo from '../../Images/RollingVillage/RollingVillage.png';
import actionBar from '../../Images/RollingVillage/actionBar.png';
import finalScore from '../../Images/RollingVillage/finalScore.png';

class StatusBar extends React.Component {
  render() {
    let gameOver = null;
    if(this.props.gameOver)
      gameOver = <>{this.props.totalPoints}</>;

    let actionStyle = Object.assign({},
      styles.actionBar,
      {backgroundImage: `url(${actionBar})`}
    );
    let finalScoreStyle = Object.assign({},
      styles.finalScore,
      {backgroundImage: `url(${finalScore})`}
    );

    const actionDivs = this.props.actionDivs.map((x, index) => {
      return (
        <ActionOption
          handleActionOptionClick={this.props.handleActionOptionClick}
          value={x}
          key={index} 
          identifier={index}
        />
      );
    });

    return (
      <div style={{ marginTop: "15px" }}>
        <div><img style={{ width: "100%" }} src={logo} alt="logo"/></div>
        <div style={actionStyle}>{actionDivs}</div>
        <div>Seconds: {this.props.secondsInGame}</div>
        <div><Button variant="primary" onClick={this.props.startOver}>Re-Start</Button></div>
        <div><a href={rules} target="_blank" rel="noopener noreferrer">Rules</a></div>
        <div style={finalScoreStyle}>{gameOver}</div>
      </div>
    );
  }
}

export default StatusBar;
