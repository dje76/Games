import React from 'react';
import redPiece from '../../Images/Checkers/redPiece.png';
import redKingPiece from '../../Images/Checkers/redKingPiece.png';
import redPieceSelected from '../../Images/Checkers/redPieceSelected.png';
import redKingPieceSelected from '../../Images/Checkers/redKingPieceSelected.png';
import redPieceOption from '../../Images/Checkers/redPieceOption.png';
import redKingPieceOption from '../../Images/Checkers/redKingPieceOption.png';
import whitePiece from '../../Images/Checkers/whitePiece.png';
import whiteKingPiece from '../../Images/Checkers/whiteKingPiece.png';
import whitePieceSelected from '../../Images/Checkers/whitePieceSelected.png';
import whiteKingPieceSelected from '../../Images/Checkers/whiteKingPieceSelected.png';
import whitePieceOption from '../../Images/Checkers/whitePieceOption.png';
import whiteKingPieceOption from '../../Images/Checkers/whiteKingPieceOption.png';
import moveOption from '../../Images/Checkers/moveOption.png';
import styles from '../../Styles/Checkers.css.js';

class CheckerTile extends React.PureComponent{
  constructor(props){
    super(props);

    this.handleSquareClick = this.handleSquareClick.bind(this);
  }

  handleSquareClick(){
    this.props.handleSquareClick(this.props.identifier);
  }

  render() {
    let image = null;
    let imageTag = null;
    if(this.props.isMoveOption)
      image = moveOption;
    else if(this.props.hasRedPiece){
      if(this.props.isSelected){
        if(this.props.isKingPiece)
          image = redKingPieceSelected;
        else
          image = redPieceSelected;
      }
      else if(this.props.haveToJumpOption){
        if(this.props.isKingPiece)
          image = redKingPieceOption;
        else
          image = redPieceOption;
      }
      else{
        if(this.props.isKingPiece)
          image = redKingPiece;
        else
          image = redPiece;
      }
    }
    else if(this.props.hasWhitePiece){
      if(this.props.isSelected){
        if(this.props.isKingPiece)
          image = whiteKingPieceSelected;
        else
          image = whitePieceSelected;
      }
      else if(this.props.haveToJumpOption){
        if(this.props.isKingPiece)
          image = whiteKingPieceOption;
        else
          image = whitePieceOption;
      }
      else{
        if(this.props.isKingPiece)
          image = whiteKingPiece;
        else
          image = whitePiece;
      }
    }

    if(image !== null)
      imageTag = <img src={image} height={this.props.size} width={this.props.size} alt="P"/>;

    var style = Object.assign({},
      styles.tile,
      this.props.white && styles.whiteTile,
      !this.props.white && styles.blackTile,
      imageTag !== null && styles.TilePointer,
      { height: this.props.size + "px", width: this.props.size + "px" }
    );
    return (
      <div style={style} onClick={this.handleSquareClick}>
        {imageTag}
      </div>
    );
  }
}

export default CheckerTile;
