import React from 'react';
import GridCell from './GridCell.js';
import styles from '../../Styles/snake.css.js';

class Board extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      interval: 50,
      gameOver: false,
      snakeLength: 4,
      snakeLocation: [[0,0]],
      dimensions: [40,40],
      cellSize: 15
    };
    this.state.foodLocation = [Math.floor(Math.random() * 10000) % this.state.dimensions[0], Math.floor(Math.random() * 10000) % this.state.dimensions[1]];
    this.state.grid = Array(this.state.dimensions[1]).fill().map(() => Array(this.state.dimensions[0]).fill(0));
    if(this.state.grid[this.state.foodLocation[1]] !== undefined && this.state.grid[this.state.foodLocation[1]][this.state.foodLocation[0]] !== undefined)
      this.state.grid[this.state.foodLocation[1]][this.state.foodLocation[0]] = 1;
    if(this.state.grid[this.state.snakeLocation[0][1]] !== undefined && this.state.grid[this.state.snakeLocation[0][1]][this.state.snakeLocation[0][0]] !== undefined)
      this.state.grid[this.state.snakeLocation[0][1]][this.state.snakeLocation[0][0]] = 2;

    this.state.boardDimensions = [(this.state.dimensions[0] * this.state.cellSize) + 4, (this.state.dimensions[1] * this.state.cellSize) + 4]

    this.onTickUpdate = this.onTickUpdate.bind(this);
    this.MoveSnake = this.MoveSnake.bind(this);
    this.checkIfDead = this.checkIfDead.bind(this);
    this.checkIfEatenFood = this.checkIfEatenFood.bind(this);
    this.EndGame = this.EndGame.bind(this);
    this.startOver = this.startOver.bind(this);
    this.onTickUpdateIntervalID = setInterval(this.onTickUpdate, this.state.interval);
  }

  onTickUpdate() {
    if(this.props.startOver){
      this.startOver();
    }

    if(this.state.gameOver)
      return;

    //check if food has been eaten
    var foodEaten = this.checkIfEatenFood();
    //Move Snake
    this.MoveSnake(foodEaten);

    //check if dead
    if(this.checkIfDead()){
        this.EndGame();
    }

    this.props.canChangeDirection();
  }

  startOver(){
    this.setState({ snakeLocation: [[0,0]],
      snakeLength: 4,
      gameOver: false,
      foodLocation: [Math.floor(Math.random() * 10000) % this.state.dimensions[0], Math.floor(Math.random() * 10000) % this.state.dimensions[1]] });
    var grid = Array(this.state.dimensions[1]).fill().map(() => Array(this.state.dimensions[0]).fill(0));
    if(grid[this.state.foodLocation[1]] !== undefined && grid[this.state.foodLocation[1]][this.state.foodLocation[0]] !== undefined)
      grid[this.state.foodLocation[1]][this.state.foodLocation[0]] = 1;

    this.setState({ grid: grid });
    this.props.restartFinished();
  }

  MoveSnake(foodEaten){
    var grid = this.state.grid;
    var newLocation = this.state.foodLocation;
    if(foodEaten){
      //re-place food
      var InSnake = true;
      while (InSnake){
        InSnake = false;
        newLocation = [Math.floor(Math.random() * 10000) % this.state.dimensions[0], Math.floor(Math.random() * 10000) % this.state.dimensions[1]];
        for(var i = 0; i < this.state.snakeLocation.length; i++){
          if(this.state.snakeLocation[i][0] === newLocation[0] && this.state.snakeLocation[i][1] === newLocation[1]){
            InSnake = true;
            break;
          }
        }
      }

      if(grid[newLocation[1]] !== undefined && grid[newLocation[1]][newLocation[0]] !== undefined)
        grid[newLocation[1]][newLocation[0]] = 1;

      this.props.foodEaten();
    }
    //Move Snake
    var needsToBeLonger = false;
    var newSnake = this.state.snakeLocation;
    if(newSnake.length < this.state.snakeLength)
      needsToBeLonger = true;
    switch (this.props.directionFacing){
      case 38: // up
        newSnake.unshift([newSnake[0][0], newSnake[0][1] - 1]);
        break;
      case 40: // down
        newSnake.unshift([newSnake[0][0], newSnake[0][1] + 1]);
        break;
      case 37: //left
        newSnake.unshift([newSnake[0][0] - 1, newSnake[0][1]]);
        break;
      case 39: // right
        newSnake.unshift([newSnake[0][0] + 1, newSnake[0][1]]);
        break;
      default:
        break;
    }

    if(!needsToBeLonger){
      grid[newSnake[newSnake.length-1][1]][newSnake[newSnake.length-1][0]] = 0;
      newSnake.pop();
    }

    if(grid[newSnake[0][1]] !== undefined && grid[newSnake[0][1]][newSnake[0][0]] !== undefined)
      grid[newSnake[0][1]][newSnake[0][0]] = 2;

    if(foodEaten)
      this.setState({ snakeLocation: newSnake, grid: grid, snakeLength: this.state.snakeLength + 1, foodLocation: newLocation });
    else
      this.setState({ snakeLocation: newSnake, grid: grid });
  }

  checkIfDead(){
    //is outside of play
    if(this.state.snakeLocation[0][0] > this.state.dimensions[0] - 1 ||
      this.state.snakeLocation[0][0] < 0 ||
      this.state.snakeLocation[0][1] > this.state.dimensions[1] - 1 ||
      this.state.snakeLocation[0][1] < 0)
      return true;

    //ran into self
    for(var i = 4; i < this.state.snakeLocation.length; i++){
      if(this.state.snakeLocation[0][0] === this.state.snakeLocation[i][0] &&
        this.state.snakeLocation[0][1] === this.state.snakeLocation[i][1])
        return true;
    }

    return false;
  }

  checkIfEatenFood(){
    //snake head overlapping with food
    if(this.state.snakeLocation[0][0] === this.state.foodLocation[0] &&
      this.state.snakeLocation[0][1] === this.state.foodLocation[1])
      return true;

    return false;
  }

  EndGame(){
    this.setState({ gameOver: true });
  }

  render() {
    const cells = this.state.grid.map((x, index) => {
      return x.map((y, index2) => {
        return (
          <GridCell
            value={y}
            size={this.state.cellSize}
            key={index + " " + index2}
            />
        );
      });
    });

    var style = Object.assign({},
      styles.board,
      { height: this.state.boardDimensions[0] + "px", width: this.state.boardDimensions[1] + "px", marginLeft: "calc(50% - " + (this.state.boardDimensions[1]/2) + "px)" }
    );
    return (
      <div className="col">
        <div style={style}>
          {cells}
        </div>
      </div>
    );
  }
}

export default Board;
