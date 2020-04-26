import React from 'react';
import Card from './Card.js';

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
            key={index}
            identifier={index}
            handleCardClick={this.props.handleCardClick}
          />
        );
      });
    }
    return (
      <div className="row">
        {cards}
      </div>
    );
  }
}

export default Hand;
