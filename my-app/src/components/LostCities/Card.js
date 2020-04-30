import React from 'react';
import styles from '../../Styles/LostCities.css.js';
import Yellow from '../../Images/LostCities/Yellow.png';
import Blue from '../../Images/LostCities/Blue.png';
import White from '../../Images/LostCities/White.png';
import Green from '../../Images/LostCities/Green.png';
import Red from '../../Images/LostCities/Red.png';

class Card extends React.Component {
  constructor(props){
    super(props);
    this.handleCardClick = this.handleCardClick.bind(this);
  }

  handleCardClick(){
    if(this.props.isHand)
      this.props.handleCardClick(this.props.identifier);
  }

  render() {
    let BackgroundStyle = "";
    switch(this.props.suit){
      case 1:
        BackgroundStyle = { backgroundImage: `url(${Yellow})` };
        break;
      case 2:
        BackgroundStyle = { backgroundImage: `url(${Blue})` };
        break;
      case 3:
        BackgroundStyle = { backgroundImage: `url(${White})` };
        break;
      case 4:
        BackgroundStyle = { backgroundImage: `url(${Green})` };
        break;
      case 5:
        BackgroundStyle = { backgroundImage: `url(${Red})` };
        break;
    }
    let cardValue = ""
    if(this.props.value === 0 || this.props.value > 10)
      cardValue = "🤝";
    else
      cardValue = this.props.value;
    var style = Object.assign({},
      styles.card,
      this.props.isSelected && styles.borderHighlight,
      !this.props.isSelected && styles.normalBorder,
      this.props.isPlayersTurn && this.props.playPhase && styles.Pointer,
      BackgroundStyle
    );
    return (
      <div style={style} onClick={this.handleCardClick}>{cardValue}</div>
    );
  }
}

export default Card;
