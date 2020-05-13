import React from 'react';
import Tile from './Tile.js';
import StatusBar from './StatusBar.js';
import Die from './Die.js';
import Project from './Project.js';
import { Button } from 'react-bootstrap';
import styles from '../../Styles/RollingVillage.css.js';
import board from '../../Images/RollingVillage/board.png';
import scoreBar from '../../Images/RollingVillage/scoreBar.png';


class RollingVillage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      timerStarted: false,
      secondsInGame: 0,
      intervalId: 0,
      gameOver: false,
      cantRollDice: false,
      actionSelectNeededToScore: false,
      turnPoints: [null, null, null, null, null, null, null, null, null],
      turnIndex: 0,
      projects: [null, null, null, null],
      selectedProject: -1,
      alreadyAddedProject: false,
      diceValues: [null, null],
      totalPoints: 0,
      actionDivs: [0,0,0,0,0],
      bonusProjects: [],
      actionMessage: "",
      dimensions: [6,5],
      boardDimensions: null,
      cellSize: 88,
      projectTypes: {
        house: 1,
        forest: 2,
        lake: 3,
        square: 4
      }
    };

    this.handleSquareClick = this.handleSquareClick.bind(this);
    this.handleProjectClick = this.handleProjectClick.bind(this);
    this.handleActionOptionClick = this.handleActionOptionClick.bind(this);
    this.rollDice = this.rollDice.bind(this);
    this.onTick= this.onTick.bind(this);
    this.startOver = this.startOver.bind(this);
    this.clearMoveOptions = this.clearMoveOptions.bind(this);

    let grid = Array(this.state.dimensions[1]).fill().map(() =>
      Array(this.state.dimensions[0]).fill().map(() => { return { projectType: 0, isOption: false, value: 0 }; }));
    this.state.grid = this.setGridValues(grid);
    this.state.boardDimensions = [(this.state.dimensions[0] * this.state.cellSize) + 4, (this.state.dimensions[1] * this.state.cellSize) + 4];

    document.body.style.backgroundColor = "beige";
  }

  setGridValues(grid){
    let dimensions = this.state.dimensions;
    for(let i = 1; i <= this.state.dimensions[0] * this.state.dimensions[1]; i++){
      if(i === 1 || i === 6 || i === 25 || i === 30)
        grid[Math.ceil(i/dimensions[0])-1][(i-1)%dimensions[0]].value = 3;
      else if(i === 3 || i === 4 || i === 13 || i === 18 || i === 27 || i === 28)
        grid[Math.ceil(i/dimensions[0])-1][(i-1)%dimensions[0]].value = 2;
      else if(i === 8 || i === 11 || i === 15 || i === 16 || i === 20 || i === 23)
        grid[Math.ceil(i/dimensions[0])-1][(i-1)%dimensions[0]].value = 1;
    }
    return grid;
  }

  startOver(){
    let grid = Array(this.state.dimensions[1]).fill().map(() =>
      Array(this.state.dimensions[0]).fill().map(() => { return { projectType: 0, isOption: false, value: 0 }; }));
    grid = this.setGridValues(grid)
    clearInterval(this.state.intervalId);
    this.setState({ grid: grid, actionDivs: [0,0,0,0,0], projects: [null, null, null, null],
      turnPoints: [null, null, null, null, null, null, null, null, null], diceValues: [null, null],
      gameOver: false, secondsInGame: 0, timerStarted: false, cantRollDice: false });
  }

  handleActionOptionClick(index){
    let actionDivs = [0,0,0,0,0];
    actionDivs[index] = 1;
    if(this.state.diceValues[0] + this.state.diceValues[1] === 2 || this.state.diceValues[0] + this.state.diceValues[1] === 12){
      if(this.state.actionSelectNeededToScore){
        let grid = this.state.grid;
        let turnIndex = this.state.turnIndex;
        let turnPoints = this.state.turnPoints;
        let gameOver = false;
        let totalPoints = 0;
        let actionMessage = "";
        if(this.state.bonusMode){
          turnPoints[turnIndex] = this.scoreRow(grid, actionDivs);
          if(turnIndex === 8){
            actionMessage = "Game Over!";
            gameOver = true;
            clearInterval(this.state.intervalId);
            totalPoints = this.getTotalPoints(grid, turnPoints);
          }
          else
            actionMessage = "Roll the dice!";
          turnIndex++;
        }
        else{
          turnPoints[turnIndex] = this.scoreRow(grid, actionDivs);
          actionMessage = "Roll the dice!";
          turnIndex++;
        }
        this.setState({ bonusMode: false, turnIndex: turnIndex, turnPoints: turnPoints, cantRollDice: false,
          gameOver: gameOver, totalPoints: totalPoints, actionMessage: actionMessage
        });
      }
      else
        this.setState({ actionDivs: actionDivs });
    }
  }

  handleSquareClick(key){
    if(!this.state.timerStarted){
      let intervalId = setInterval(this.onTick, 1000);
      this.setState({ timerStarted: true, intervalId: intervalId });
    }

    let location = key.split(" ");
    location[0] = parseInt(location[0]);
    location[1] = parseInt(location[1]);
    let grid = this.state.grid;
    let projects = this.state.projects;

    if(!grid[location[0]][location[1]].isOption)
      return;

    grid[location[0]][location[1]].projectType = this.state.selectedProject + 1;
    grid = this.clearColumnMoveOptions(grid, location[1]);
    let selectedProject = this.state.selectedProject;
    if(!this.hasMoveOption(grid)){
      projects[this.state.selectedProject] = null;
      selectedProject = -1;
    }

    let turnIndex = this.state.turnIndex;
    let turnPoints = this.state.turnPoints;
    let cantRollDice = true;
    let gameOver = false;
    let bonusMode = false;
    let actionSelectNeededToScore = false;
    let totalPoints = 0;
    let actionMessage = "Select a spot to build!";
    let bonusProjects = this.state.bonusProjects;
    if(this.state.bonusMode){
      bonusProjects.push(this.state.selectedProject + 1);
      grid = this.clearMoveOptions(grid);
      projects[0] = null;
      projects[1] = null;
      projects[2] = null;
      if(this.state.actionDivs.includes(1)){
        cantRollDice = false;
        turnPoints[turnIndex] = this.scoreRow(grid, this.state.actionDivs);
        if(turnIndex === 8){
          actionMessage = "Game Over!";
          gameOver = true;
          clearInterval(this.state.intervalId);
          cantRollDice = true;
          totalPoints = this.getTotalPoints(grid, turnPoints);
        }
        else
          actionMessage = "Roll the dice!";
        turnIndex++;
      }
      else{
        actionMessage = "Select an action row!";
        actionSelectNeededToScore = true;
      }
    }
    else if(!this.hasProjectOption(projects)){
      if (turnIndex === 2 || turnIndex === 5 || turnIndex === 8){
        actionMessage = "Select a bonus project to build!";
        projects[0] = 1;
        projects[1] = 1;
        projects[2] = 1;
        for(let i = 0; i < bonusProjects.length; i++){
          if(bonusProjects[i] === 1)
            projects[0] = 0;
          else if(bonusProjects[i] === 2)
            projects[1] = 0;
          else if(bonusProjects[i] === 3)
            projects[2] = 0;
        }
        bonusMode = true;
      }
      else{
        if(this.state.actionDivs.includes(1)){
          cantRollDice = false;
          turnPoints[turnIndex] = this.scoreRow(grid, this.state.actionDivs);
          actionMessage = "Roll the dice!";
          turnIndex++;
        }
        else{
          actionMessage = "Select an action row!";
          actionSelectNeededToScore = true;
        }
      }
    }

    this.setState({ grid: grid, bonusProjects: bonusProjects,bonusMode: bonusMode, selectedProject: selectedProject,
      projects: projects, turnIndex: turnIndex, turnPoints: turnPoints, cantRollDice: cantRollDice,
      gameOver: gameOver, totalPoints: totalPoints, actionMessage: actionMessage, actionSelectNeededToScore: actionSelectNeededToScore
    });
  }

  rollDice(){
    let projects = [null, null, null, null];
    let diceValues = [Math.round(Math.random() * 5) + 1, Math.round(Math.random() * 5) + 1];
    if(diceValues[0] === 1 || diceValues[0] === 4 || diceValues[1] === 1 || diceValues[1] === 4)
      projects[0] = 1;
    else
      projects[0] = null;
    if(diceValues[0] === 2 || diceValues[0] === 5 || diceValues[1] === 2 || diceValues[1] === 5)
      projects[1] = 1;
    else
      projects[1] = null;
    if(diceValues[0] === 3 || diceValues[0] === 6 || diceValues[1] === 3 || diceValues[1] === 6)
      projects[2] = 1;
    else
      projects[2] = null;
    if(diceValues[0] === diceValues[1])
      projects[3] = 1;
    else
      projects[3] = null;

    let actionDivs = [0,0,0,0,0];
    let actionMessage = "Select a project to build!";
    switch (diceValues[0] + diceValues[1]) {
      case 2:
        actionMessage += "\n Select An score Column!";
        break;
      case 3:
      case 4:
        actionDivs[0] = 1
        break;
      case 5:
      case 6:
        actionDivs[1] = 1
        break;
      case 7:
        actionDivs[2] = 1
        break;
      case 8:
      case 9:
        actionDivs[3] = 1
        break;
      case 10:
      case 11:
        actionDivs[4] = 1
        break;
      case 12:
        actionMessage += "\n Select An score Column!";
        break;
      default:

    }
    this.setState({ actionDivs: actionDivs, diceValues: diceValues, projects: projects, cantRollDice: true, actionMessage: actionMessage });
  }

  handleProjectClick(index){
    let grid = this.state.grid;
    let projects = this.state.projects;
    if(projects[index] === null)
      return;
    for(let i = 0; i < projects.length; i++){
      if(projects[i] === 2)
        projects[i] = 1;
    }
    projects[index] = 2;
    grid = this.clearMoveOptions(grid);

    if(this.state.bonusMode){
      grid = this.setColumnMoveOptions(grid, 0);
      grid = this.setColumnMoveOptions(grid, 1);
      grid = this.setColumnMoveOptions(grid, 2);
      grid = this.setColumnMoveOptions(grid, 3);
      grid = this.setColumnMoveOptions(grid, 4);
      grid = this.setColumnMoveOptions(grid, 5);
    }
    else{
      if(index === 0){
        if(this.state.diceValues[0] === 1 || this.state.diceValues[0] === 4)
          grid = this.setMoveOptions(grid, 1);
        if(this.state.diceValues[1] === 1 || this.state.diceValues[1] === 4)
          grid = this.setMoveOptions(grid, 0);
      }
      if(index === 1){
        if(this.state.diceValues[0] === 2 || this.state.diceValues[0] === 5)
          grid = this.setMoveOptions(grid, 1);
        if(this.state.diceValues[1] === 2 || this.state.diceValues[1] === 5)
          grid = this.setMoveOptions(grid, 0);
      }
      if(index === 2){
        if(this.state.diceValues[0] === 3 || this.state.diceValues[0] === 6)
          grid = this.setMoveOptions(grid, 1);
        if(this.state.diceValues[1] === 3 || this.state.diceValues[1] === 6)
          grid = this.setMoveOptions(grid, 0);
      }
      if(index === 3){
        grid = this.setMoveOptions(grid, 0);
      }
    }

    this.setState({ grid: grid, projects: projects, selectedProject: index, actionMessage: "Select a spot to build!" });
  }

  setMoveOptions(grid, diceValueIndex){
    if(this.hasMoveOptionColumn(grid, this.state.diceValues[diceValueIndex] - 1) !== 0)
      grid = this.setColumnMoveOptions(grid, this.state.diceValues[diceValueIndex] - 1);
    else{
      if(this.hasMoveOptionColumn(grid, this.state.diceValues[diceValueIndex] - 2) >
        this.hasMoveOptionColumn(grid, this.state.diceValues[diceValueIndex]))
        grid = this.setColumnMoveOptions(grid, this.state.diceValues[diceValueIndex] - 2);
      else
        grid = this.setColumnMoveOptions(grid, this.state.diceValues[diceValueIndex]);
    }
    return grid;
  }

  setColumnMoveOptions(grid, columnIndex){
    if(columnIndex > 5 || columnIndex < 0)
      return grid;
    for(let i = 0; i < grid.length; i++){
      if(grid[i][columnIndex].projectType === 0)
        grid[i][columnIndex].isOption = true;
    }
    return grid;
  }

  clearMoveOptions(grid){
    for(let i = 0; i < grid.length; i++){
      for(let j = 0; j < grid[i].length; j++){
        grid[i][j].isOption = false;
      }
    }
    return grid;
  }

  hasMoveOptionColumn(grid, index){
    if(index < 0 || index > 5)
      return 0;
    let moveOptionCount = 0;
    for(let i = 0; i < grid.length; i++){
      if(grid[i][index].projectType === 0)
        moveOptionCount++;
    }
    return moveOptionCount;
  }

  hasMoveOption(grid){
    for(let i = 0; i < grid.length; i++){
      for(let j = 0; j < grid.length; j++){
        if(grid[i][j].isOption)
          return true;
      }
    }
    return false;
  }

  hasProjectOption(projects){
    for(let i = 0; i < projects.length; i++){
      if(projects[i] === 1 || projects[i] === 2)
        return true;
    }
    return false;
  }

  scoreRow(grid, actionDivs){
    let totalPoints = 0;

    let baseRowIndex = -1;
    for(let i = 0; i < actionDivs.length; i++){
      if(actionDivs[i] === 1){
        baseRowIndex = i;
        break;
      }
    }

    let previousAreas = [];
    for(let i = 0; i < 6; i++){
      let inPreviousArea = false;
      for(let j = 0; j < previousAreas.length; j++){
        for(let k = 0; k < previousAreas[j].length; k++){
          if(previousAreas[j][k][0] === baseRowIndex && previousAreas[j][k][1] === i){
            inPreviousArea = true;
            break;
          }
        }
        if(inPreviousArea)
          break;
      }
      if(!inPreviousArea && grid[baseRowIndex][i].projectType > 0 &&
          grid[baseRowIndex][i].projectType < 4 && grid[baseRowIndex][i].value !== 0){
        let listOfLocationsInArea = this.getTotalPointsOfArea(grid, [baseRowIndex, i], [[baseRowIndex, i]], grid[baseRowIndex][i].projectType);
        for(let j = 0; j < listOfLocationsInArea.length; j++){
          totalPoints += grid[listOfLocationsInArea[j][0]][listOfLocationsInArea[j][1]].value;
        }
        previousAreas.push(listOfLocationsInArea);
        console.log(listOfLocationsInArea);
      }
    }
    return totalPoints;
  }

  getTotalPointsOfArea(grid, location, listOfLocationsInArea, projectType){
    listOfLocationsInArea = this.getTotalPointsOfAreaAtLocation(grid, [location[0] + 1, location[1]], listOfLocationsInArea, projectType);
    listOfLocationsInArea = this.getTotalPointsOfAreaAtLocation(grid, [location[0] - 1, location[1]], listOfLocationsInArea, projectType);
    listOfLocationsInArea = this.getTotalPointsOfAreaAtLocation(grid, [location[0], location[1] + 1], listOfLocationsInArea, projectType);
    listOfLocationsInArea = this.getTotalPointsOfAreaAtLocation(grid, [location[0], location[1] - 1], listOfLocationsInArea, projectType);

    return listOfLocationsInArea;
  }
  getTotalPointsOfAreaAtLocation(grid, location, listOfLocationsInArea, projectType){
    if(location[0] < 5 && location[0] > -1 && location[1] < 6 &&
        location[1] > -1 && grid[location[0]][location[1]].projectType === projectType){
      let inList = false;
      for(let i = 0; i < listOfLocationsInArea.length; i++){
        if(listOfLocationsInArea[i][0] === location[0] && listOfLocationsInArea[i][1] === location[1]){
          inList = true;
          break;
        }
      }
      if(!inList){
        listOfLocationsInArea.push([location[0], location[1]]);
        listOfLocationsInArea = this.getTotalPointsOfArea(grid, [location[0], location[1]], listOfLocationsInArea, projectType);
      }
    }
    return listOfLocationsInArea;
  }

  clearColumnMoveOptions(grid, index){
    for(let i = 0; i < grid.length; i++){
      grid[i][index].isOption = false;
    }
    return grid;
  }

  getTotalPoints(grid, turnPoints){
    let totalPoints = 0;
    for(let i = 0; i < turnPoints.length; i++){
      totalPoints += turnPoints[i];
    }

    for(let i = 0; i < grid.length; i++){
      for(let j = 0; j < grid.length; j++){
        if(grid[i][j].projectType === 4){
          let hasLake = false;
          let hasHouse = false;
          let hasForest = false;
          let adjacentSquares = []

          if(i > 0)
            adjacentSquares.push(grid[i - 1][j]);
          if(i < 6)
            adjacentSquares.push(grid[i + 1][j]);
          if(j > 0)
            adjacentSquares.push(grid[i][j - 1]);
          if(j < 6)
            adjacentSquares.push(grid[i][j + 1]);
          for(let k = 0; k < adjacentSquares.length; k++){
            if(adjacentSquares[k].value === 1)
              hasHouse = true;
            if(adjacentSquares[k].value === 2)
              hasForest = true;
            if(adjacentSquares[k].value === 3)
              hasLake = true;
          }

          if(hasHouse && hasForest && hasLake)
            totalPoints += 10;
        }
      }
    }

    return totalPoints;
  }

  onTick(){
    let seconds = this.state.secondsInGame + 1;
    this.setState({ secondsInGame: seconds });
  }

  render() {
    let style = Object.assign({},
      styles.board,
      { backgroundImage: `url(${board})`, backgroundSize: "contain", backgroundRepeat: "no-repeat"}
    );
    let turnPointsDivStyle = Object.assign({},
      styles.turnPointsDiv,
      {backgroundImage: `url(${scoreBar})`}
    );
    const cells = this.state.grid.map((x, index) => {
      return x.map((y, index2) => {
        return (
          <Tile
            projectType={y.projectType}
            isOption={y.isOption}
            size={this.state.cellSize}
            key={index + " " + index2}
            identifier={index + " " + index2}
            handleSquareClick={this.handleSquareClick}
            projectTypes={this.state.projectTypes}
            />
        );
      });
    });

    const turnPoints = this.state.turnPoints.map((x, index) => {
      return (
        <div style={styles.turnPoints} key={index} >{x}</div>
      );
    });

    return (
      <div className="container"style={{ maxWidth: "100%" }}>
        <div className="row">
          <div className="col-3">
            <StatusBar
              startOver={this.startOver}
              secondsInGame={this.state.secondsInGame}
              gameOver={this.state.gameOver}
              totalPoints={this.state.totalPoints}
              actionDivs={this.state.actionDivs}
              handleActionOptionClick={this.handleActionOptionClick}
            />
          </div>
          <div className="col-6">
            <div style={{ marginTop: "10px", width: "547px" }} >
              <Project handleProjectClick={this.handleProjectClick} value={this.state.projects[0]} index={0} />
              <Project handleProjectClick={this.handleProjectClick} value={this.state.projects[1]} index={1} />
              <Project handleProjectClick={this.handleProjectClick} value={this.state.projects[2]} index={2} />
              <Project handleProjectClick={this.handleProjectClick} value={this.state.projects[3]} index={3} />
            </div>
            <div className="board" style={style}>
              <div style= {{ width: "100%", height: "100%" }}>{cells}</div>
            </div>
            <div style={turnPointsDivStyle}>
              {turnPoints}
            </div>
          </div>
          <div className="col-3">
            <div style={{ marginTop: "50px" }}>
              <Button variant="primary" onClick={this.rollDice} disabled={this.state.cantRollDice}>Roll Dice</Button>
            </div>
            <Die dieValue={this.state.diceValues[0]} />
            <Die dieValue={this.state.diceValues[1]} />
            <div>{this.state.actionMessage}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default RollingVillage;
