import React from 'react';
import styles from '../../Styles/RollingVillage.css.js';
import houseGuide from '../../Images/RollingVillage/houseGuide.png';
import lakeGuide from '../../Images/RollingVillage/lakeGuide.png';
import forestGuide from '../../Images/RollingVillage/forestGuide.png';
import townSquareGuide from '../../Images/RollingVillage/townSquareGuide.png';

class Project extends React.PureComponent{
  constructor(props){
    super(props);

    this.handleProjectClick = this.handleProjectClick.bind(this);
  }

  handleProjectClick(){
    this.props.handleProjectClick(this.props.index);
  }

  render() {
    let image = null;
    let imageTag = null

    switch (this.props.index) {
      case 0:
        image = houseGuide;
        break;
      case 1:
        image = forestGuide;
        break;
      case 2:
        image = lakeGuide;
        break;
      case 3:
        image = townSquareGuide;
        break;
      default:
        break;
    }

    let style = Object.assign({},
      styles.project,
      this.props.value === 1 && styles.objectProject,
      this.props.value === 2 && styles.selectedProject,
      (this.props.value === 1 || this.props.value === 2) && styles.Pointer
    );

    if(image !== null)
      imageTag = <img style={{ width: "100%" }} src={image} alt="project"/>;
    return (
      <div style={style} onClick={this.handleProjectClick}>
      {imageTag}
      </div>
    );
  }
}

export default Project;
