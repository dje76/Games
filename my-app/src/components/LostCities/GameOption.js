import React from 'react';
import { Button } from 'react-bootstrap';
import styles from '../../Styles/LostCities.css.js';

class GameOption extends React.Component {
  constructor(props){
    super(props);
    this.handleJoinClick = this.handleJoinClick.bind(this);
  }

  handleJoinClick(){
    this.props.handleJoinClick(this.props.identifier, this.props.gameName);
  }

  render() {
    return (
      <div>
        <span>{this.props.gameName}</span><span style={styles.gameOptionButton}><Button variant="outline-primary" size="sm" onClick={this.handleJoinClick}>Join</Button></span>
      </div>
    );
  }
}

export default GameOption;
