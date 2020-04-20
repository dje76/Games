import React from 'react';
import styles from '../../Styles/Onitama.css.js';
import rabbit from '../../Images/Onitama/Rabbit.png';
import cobra from '../../Images/Onitama/Cobra.png';
import rooster from '../../Images/Onitama/Rooster.png';
import ox from '../../Images/Onitama/Ox.png';
import eel from '../../Images/Onitama/Eel.png';
import frog from '../../Images/Onitama/Frog.png';
import goose from '../../Images/Onitama/Goose.png';
import horse from '../../Images/Onitama/Horse.png';
import crab from '../../Images/Onitama/Crab.png';
import crane from '../../Images/Onitama/Crane.png';
import dragon from '../../Images/Onitama/Dragon.png';
import elephant from '../../Images/Onitama/Elephant.png';
import mantis from '../../Images/Onitama/Mantis.png';
import monkey from '../../Images/Onitama/Monkey.png';
import tiger from '../../Images/Onitama/Tiger.png';
import boar from '../../Images/Onitama/Boar.png';


class OnitamaCard extends React.Component {
  constructor(props){
    super(props);
    this.selectCardClick = this.selectCardClick.bind(this);
  }

  selectCardClick(){
    if(((this.props.playerOneTurn && this.props.cardStatus === 1) || (!this.props.playerOneTurn && this.props.cardStatus === 3)))
      this.props.selectCardClick(this.props.cardTypeId, this.props.cardStatus);
  }

  render() {
    let cardType = this.getCardType();
    let style = Object.assign({},
      styles.cardDiv,
      this.props.cardStatus === 2 && styles.middleCard,
      this.props.cardStatus === 3 && this.props.tabletopMode && styles.Invert,
      !this.props.playerOneTurn && this.props.cardStatus === 2 && this.props.tabletopMode && styles.Invert,
      ((!this.props.playerOneTurn && this.props.cardStatus === 3)||(this.props.playerOneTurn && this.props.cardStatus === 1)) && styles.Pointer,
      this.props.isSelected && styles.selectedCard
    );
    return (
      <div style={style} onClick={this.selectCardClick}>
        <img src={cardType} height="230" width="180" alt="BM"/>
      </div>
    );
  }

  getCardType(){
    let cardType = null;
    switch(this.props.cardTypeId){
      case 1:
        cardType = rabbit;
        break;
      case 2:
        cardType = cobra;
        break;
      case 3:
        cardType = ox;
        break;
      case 4:
        cardType = rooster;
        break;
      case 5:
        cardType = eel;
        break;
      case 6:
        cardType = horse;
        break;
      case 7:
        cardType = frog;
        break;
      case 8:
        cardType = goose;
        break;
      case 9:
        cardType = crab;
        break;
      case 10:
        cardType = crane;
        break;
      case 11:
        cardType = dragon;
        break;
      case 12:
        cardType = elephant;
        break;
      case 13:
        cardType = mantis;
        break;
      case 14:
        cardType = monkey;
        break;
      case 15:
        cardType = tiger;
        break;
      case 16:
        cardType = boar;
        break;
      default:
        cardType = null;
        break;
    }
    return cardType;
  }
}

export default OnitamaCard;
