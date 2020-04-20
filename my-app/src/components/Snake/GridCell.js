import React from 'react';
import styles from '../../Styles/snake.css.js';

class GridCell extends React.PureComponent{
  render() {
    var style = Object.assign({},
      styles.gridCell,
      this.props.value === 1 && styles.gridCellFood,
      this.props.value === 2 && styles.gridCellSnake,
      { height: this.props.size + "px", width: this.props.size + "px" }
    );

    return (
      <div style={style}/>
    );
  }
}

export default GridCell;
