import React from 'react';
import Card from './Card.js';
import styles from '../../Styles/LostCities.css.js';

class Hand extends React.Component {
  render() {
    let cards = null;
    if(this.props.hand !== null && this.props.hand !== undefined && this.props.hand.hand !== null && this.props.hand.hand !== undefined){
      cards = this.props.hand.hand.map((x, index) => {
        return (
          <Card
            suit={x.suit}
            value={x.value}
            isSelected={x.isSelected}
            isHand={true}
            key={index}
            identifier={index}
            handleCardClick={this.props.handleCardClick}
            playPhase={this.props.playPhase}
            isPlayersTurn={this.props.isPlayersTurn}
          />
        );
      });
    }
    var style = Object.assign({},
      styles.hand,
      (this.props.hand.hand === undefined || this.props.hand.hand.length === 0) && styles.hidden
    );
    return (
      <div className="row" style={style}>
        {cards}
      </div>
    );
  }
}

export default Hand;
