import React from 'react';
import Flag from '../../Images/Minesweeper/Flag.gif';
import Mine from '../../Images/Minesweeper/Mine.png';
import styles from '../../Styles/mineSweeper.css.js';

class MinesweeperGridCell extends React.PureComponent{
  constructor(props){
    super(props);

    this.onRightClick = this.onRightClick.bind(this);
    this.handleSquareClick = this.handleSquareClick.bind(this);
  }

  onRightClick(e){
    e.preventDefault();
    this.props.onRightClick(this.props.value, this.props.identifier);
  }

  handleSquareClick(){
    this.props.handleSquareClick(this.props.identifier);
  }

  render() {
    let imageTag = null;
    let image = null;
    var value = "";
    if(this.props.flagged)
      image = Flag;
    else if (this.props.hidden)
      value = "";
    else if(this.props.value === this.props.possibleStates.mine)
      image = Mine;
    else if(this.props.value !== 0)
      value = this.props.value;

    if(image !== null)
      imageTag = <img src={image} height='25' width='25' alt="M"/>;

    var style = Object.assign({},
      imageTag == null && styles.gridCell,
      imageTag !== null && styles.gridCellImage,
      image !== Mine && !this.props.hidden && styles.showing,
      this.props.hidden && styles.hidden,
      image === Mine && !this.props.hidden && styles.mine,
      !this.props.value === this.props.possibleStates.mine && styles.mine,
      { height: this.props.size + "px", width: this.props.size + "px" }
    );

    return (
      <div style={style} onClick={this.handleSquareClick} onContextMenu={this.onRightClick}>
       {imageTag}
       {value}
      </div>
    );
  }
}

export default MinesweeperGridCell;
