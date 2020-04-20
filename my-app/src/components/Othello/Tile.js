import React from 'react';
import styles from '../../Styles/Othello.css.js';
import whitePiece from '../../Images/Checkers/whitePiece.png';
import blackPiece from '../../Images/Othello/blackPiece.png';
import moveOption from '../../Images/Onitama/moveOption.png';
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
    let imageTag = null
    if(this.props.isWhitePiece)
      image = whitePiece;
    else if(this.props.isBlackPiece)
      image = blackPiece;
    else if(this.props.isMoveOption)
      image = moveOption;
    else
      image = empty;

    if(image !== null)
      imageTag = <img src={image} height={this.props.size} width={this.props.size} alt="Piece"/>;
    var style = Object.assign({},
      styles.Tile,
      { height: this.props.size + "px", width: this.props.size + "px" },
      this.props.isMoveOption && styles.Pointer,
    );
    return (
      <div style={style} onClick={this.handleSquareClick}>
      {imageTag}
      </div>
    );
  }
}

export default Tile;
