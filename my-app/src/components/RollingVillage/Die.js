import React from 'react';
import styles from '../../Styles/RollingVillage.css.js';
import one from '../../Images/RollingVillage/one.png';
import two from '../../Images/RollingVillage/two.png';
import three from '../../Images/RollingVillage/three.png';
import four from '../../Images/RollingVillage/four.png';
import five from '../../Images/RollingVillage/five.png';
import six from '../../Images/RollingVillage/six.png';

class Die extends React.PureComponent{
  render() {
    let image = null;
    let imageTag = null

    switch (this.props.dieValue) {
      case 1:
        image = one;
        break;
      case 2:
        image = two;
        break;
      case 3:
        image = three;
        break;
      case 4:
        image = four;
        break;
      case 5:
        image = five;
        break;
      case 6:
        image = six;
        break;
      default:
        break;
    }

    if(image !== null)
      imageTag = <img src={image} height="88px" width="88.3333px" alt="Piece"/>;
    return (
      <div style={styles.die}>
      {imageTag}
      </div>
    );
  }
}

export default Die;
