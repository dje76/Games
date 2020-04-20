import React from 'react';
import styles from '../../Styles/Onitama.css.js';
import blueStudent from '../../Images/Onitama/blueStudent.png';
import blueMaster from '../../Images/Onitama/blueMaster.png';
import blueStudentArch from '../../Images/Onitama/blueStudentArch.png';
import blueMasterArch from '../../Images/Onitama/blueMasterArch.png';
import redStudent from '../../Images/Onitama/redStudent.png';
import redMaster from '../../Images/Onitama/redMaster.png';
import redStudentArch from '../../Images/Onitama/redStudentArch.png';
import redMasterArch from '../../Images/Onitama/redMasterArch.png';
import arch from '../../Images/Onitama/Arch.png';
import moveOption from '../../Images/Onitama/moveOption.png';
import empty from '../../Images/Onitama/empty.png';
import archMoveOption from '../../Images/Onitama/ArchMoveOption.png';

class OnitamaTile extends React.PureComponent{
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
    if(this.props.isRedPiece){
      if(this.props.isTempleArch){
        if(this.props.isMaster)
          image = redMasterArch;
        else
          image = redStudentArch;
      }
      else{
        if(this.props.isMaster)
          image = redMaster;
        else
          image = redStudent;
      }
    }
    else if(this.props.isBluePiece){
      if(this.props.isTempleArch){
        if(this.props.isMaster)
          image = blueMasterArch;
        else
          image = blueStudentArch;
      }
      else{
        if(this.props.isMaster)
          image = blueMaster;
        else
          image = blueStudent;
      }
    }
    else if(this.props.isMoveOption){
      if(this.props.isTempleArch)
        image = archMoveOption;
      else
        image = moveOption;
    }
    else if(this.props.isTempleArch)
      image = arch;

    let hasPointer = false;
    if((this.props.playerOneTurn && this.props.isBluePiece) || (!this.props.playerOneTurn && this.props.isRedPiece) || this.props.isMoveOption)
      hasPointer = true;

    if(image !== null)
      imageTag = <img src={image} height={this.props.size} width={this.props.size} alt="Piece"/>;
    var style = Object.assign({},
      styles.Tile,
      { height: this.props.size + "px", width: this.props.size + "px" },
      hasPointer && styles.Pointer,
      this.props.isSelected && styles.selectedPiece,
      (this.props.isRedPiece || this.props.identifier === "0 2") && this.props.tabletopMode && styles.Invert,
      (this.props.isMoveOption && (this.props.isBluePiece || this.props.isRedPiece)) && styles.pieceMoveOption
    );
    return (
      <div
        style={style}
        onClick={this.handleSquareClick}
      >
      {imageTag}
      </div>
    );
  }
}

export default OnitamaTile;
