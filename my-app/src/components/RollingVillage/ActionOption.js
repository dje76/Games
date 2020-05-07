import React from 'react';
import styles from '../../Styles/RollingVillage.css.js';

class ActionOption extends React.PureComponent{
  constructor(props){
    super(props);
    this.handleActionOptionClick = this.handleActionOptionClick.bind(this);
  }

  handleActionOptionClick(){
    this.props.handleActionOptionClick(this.props.identifier);
  }

  render() {
    let style = Object.assign({},
      styles.actionDivs,
      this.props.value === 1 && styles.objectProject
    );
    return (
      <div style={style} onClick={this.handleActionOptionClick}></div>
    );
  }
}

export default ActionOption;
