import React from 'react';
import Card from './Card.js';
import styles from '../../Styles/LostCities.css.js';
import Yellow from '../../Images/LostCities/Yellow.png';
import Blue from '../../Images/LostCities/Blue.png';
import White from '../../Images/LostCities/White.png';
import Green from '../../Images/LostCities/Green.png';
import Red from '../../Images/LostCities/Red.png';

class PlayArea extends React.Component {
  constructor(props){
    super(props);
    this.handlePlayAreaClick = this.handlePlayAreaClick.bind(this);
  }

  handlePlayAreaClick(){
    if(this.props.selectOption)
      this.props.handlePlayAreaClick(this.props.identifier);
  }

  render() {
    let Background = null;
    switch(this.props.suit){
      case 1:
        Background = Yellow;
        break;
      case 2:
        Background = Blue;
        break;
      case 3:
        Background = White;
        break;
      case 4:
        Background = Green;
        break;
      case 5:
        Background = Red;
        break;
      default:
        break;
    }
    if(this.props.isDiscard)
      Background = null;
    var style = Object.assign({},
      styles.playArea,
      this.props.isDiscard && styles.discardArea,
      !this.props.isDiscard && styles.playerArea,
      this.props.selectOption && styles.borderHighlight,
      !this.props.selectOption && styles.normalBorder,
      { backgroundImage: `url(${Background})` }
    );
    let cards = " ";
    if(this.props.isDiscard && this.props.cards !== undefined && this.props.cards.length > 0){
      if(this.props.cards[this.props.cards.length - 1].value === 0 || this.props.cards[this.props.cards.length - 1].value > 10)
        cards = "🤝";
      else
        cards = this.props.cards[this.props.cards.length - 1].value;
    }
    else{
      for(let i = 0; i < this.props.cards.length; i++){
        if(i !== 0)
          cards += ", ";
        if(this.props.cards[i].value === 0 || this.props.cards[i].value > 10)
          cards += "🤝";
        else
          cards += this.props.cards[i].value;
      }
    }
    return (
      <div style={style} onClick={this.handlePlayAreaClick}>
        {cards}
      </div>
    );
  }
}

export default PlayArea;
