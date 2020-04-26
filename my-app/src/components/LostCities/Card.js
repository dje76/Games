import React from 'react';

class Card extends React.Component {
  handleCardClick(){
    this.props.handleCardClick(this.props.key);
  }

  render() {
    return (
      <div className="col-1" onClick={this.handleCardClick}>
        <span>{this.props.value}</span><span>{this.props.suit}</span>
      </div>
    );
  }
}

export default Card;
