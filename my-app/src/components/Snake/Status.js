import React from 'react';
import styles from '../../Styles/snake.css.js';

class Status extends React.PureComponent {
  render() {
    return (
      <div className="row" style={styles.statusRow}>
        <div className="col-2 offset-md-4" style={styles.statusRowCol}>Total Score: {this.props.totalScore}</div>
        <div className="col-2" style={styles.statusRowCol}><button onClick={this.props.newGame}>Start Over</button></div>
      </div>
    );
  }
}

export default Status;
