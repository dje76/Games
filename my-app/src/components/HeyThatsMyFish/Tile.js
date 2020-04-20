import React from 'react';
import styles from '../../Styles/HeyThatsMyFish.css.js';
import empty from '../../Images/Onitama/empty.png';
import oneFish from '../../Images/HeyThatsMyFish/oneFish.png';
import twoFish from '../../Images/HeyThatsMyFish/twoFish.png';
import threeFish from '../../Images/HeyThatsMyFish/threeFish.png';
import penguinOne from '../../Images/HeyThatsMyFish/penguinOne.png';
import penguinTwo from '../../Images/HeyThatsMyFish/penguinTwo.png';

class Tile extends React.PureComponent{
  constructor(props){
    super(props);

    this.handleSquareClick = this.handleSquareClick.bind(this);
  }

  handleSquareClick(){
    this.props.handleSquareClick(this.props.identifier);
  }

  render() {
    let image = empty;
    let imageTag = null;
    if(this.props.isBluePiece)
      image = penguinOne;
    else if(this.props.isRedPiece)
      image = penguinTwo;
    else if(this.props.numberOfFish === 1)
      image = oneFish;
    else if(this.props.numberOfFish === 2)
      image = twoFish;
    else if(this.props.numberOfFish === 3)
      image = threeFish;

    if(image !== null)
      imageTag = <img src={image} height="50" width="50" alt="Piece"/>;
    var style = Object.assign({},
      styles.gridLi,
      parseInt(this.props.identifier[0]) % 2 === 0 && styles.hexToTheRight,
      this.props.identifier[0] !== "0" && styles.notTopHexRow,
    );
    var hexStyle = Object.assign({},
      styles.hexagon,
      this.props.isSelected && styles.selected,
      !this.props.isSelected && styles.notSelected,
      ((this.props.isBluePiece && this.props.playerOneTurn) || (this.props.isRedPiece && !this.props.playerOneTurn) || (this.props.setup && !this.props.isBluePiece && !this.props.isRedPiece) || this.props.isMoveOption) && styles.Pointer,
      !this.props.removed && styles.visibleHex
    );
    return (
      <div style={style} onClick={this.handleSquareClick}>
        <div style={hexStyle}>
          {imageTag}
        </div>
      </div>
    );
  }
}

export default Tile;
