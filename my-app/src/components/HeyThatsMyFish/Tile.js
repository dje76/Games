import React from 'react';
import styles from '../../Styles/HeyThatsMyFish.css.js';
import empty from '../../Images/Onitama/empty.png';

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

    let offsetRow = parseInt(this.props.identifier[0]) % 2;
    console.log(offsetRow);

    if(image !== null)
      imageTag = <img src={image} height="20" width="20" alt="Piece"/>;
    var style = Object.assign({},
      styles.gridLi,
      offsetRow === 0 && styles.hexToTheRight,
      this.props.identifier[0] !== "0" && styles.notTopHexRow,
    );
    var hexStyle = Object.assign({},
      styles.hexagon,
      styles.Pointer,
      (offsetRow !== 0 || this.props.identifier[2] !== "7") && styles.visibleHex
    );
    return (
      <div style={style} onClick={this.handleSquareClick}>
        <div style={hexStyle}>
          {this.props.numberOfFish}
        </div>
      </div>
    );
  }
}

export default Tile;
