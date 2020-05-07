import React from 'react';
import styles from '../../Styles/RollingVillage.css.js';
import house from '../../Images/RollingVillage/house.png';
import lake from '../../Images/RollingVillage/lake.png';
import forest from '../../Images/RollingVillage/forest.png';
import townSquare from '../../Images/RollingVillage/townSquare.png';

class Tile extends React.PureComponent{
  constructor(props){
    super(props);

    this.handleSquareClick = this.handleSquareClick.bind(this);
  }

  handleSquareClick(){
    this.props.handleSquareClick(this.props.identifier);
  }

  render() {
    let image = null;
    let imageTag = null

    switch (this.props.projectType) {
      case this.props.projectTypes.house:
        image = house;
        break;
      case this.props.projectTypes.forest:
        image = forest;
        break;
      case this.props.projectTypes.lake:
        image = lake;
        break;
      case this.props.projectTypes.square:
        image = townSquare;
        break;
      default:
        break;
    }

    if(image !== null)
      imageTag = <img src={image} style={{ width: "100%", height: "100%"}} alt="obj"/>;
    var style = Object.assign({},
      styles.Tile,
      this.props.isOption && styles.Pointer,
      this.props.isOption && styles.objectProject
    );
    return (
      <div style={style} onClick={this.handleSquareClick}>
      {imageTag}
      </div>
    );
  }
}

export default Tile;
