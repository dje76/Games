import React from 'react';
import GameOption from './GameOption.js';
import { Modal, Button, InputGroup, FormControl } from 'react-bootstrap';
import styles from '../../Styles/LostCities.css.js';
import axios from 'axios'

class StartGameModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      createGameOpen: false,
      gameName: "",
      gamePassword: "",
      playerPassword: "",
      playerName: "",
      selectedGameName: "",
      selectedId: "",
      loggedIntoGame: false,
      loginFailed: false,
      gamePlayers: [],
      selectedPlayerId: ""
    };

    this.createNewGame = this.createNewGame.bind(this);
    this.createNewGameOption = this.createNewGameOption.bind(this);
    this.gameNameChange = this.gameNameChange.bind(this);
    this.gamePasswordChange = this.gamePasswordChange.bind(this);
    this.playerNameChange = this.playerNameChange.bind(this);
    this.playerPasswordChange = this.playerPasswordChange.bind(this);
    this.handleJoinClick = this.handleJoinClick.bind(this);
    this.handleGameLogin = this.handleGameLogin.bind(this);
    this.handlePlayerCheckChange = this.handlePlayerCheckChange.bind(this);
  }

  gameNameChange(event){
    this.setState({ gameName: event.target.value });
  }

  gamePasswordChange(event){
    this.setState({ gamePassword: event.target.value });
  }

  playerNameChange(event){
    this.setState({ playerName: event.target.value });
  }

  playerPasswordChange(event){
    this.setState({ playerPassword: event.target.value });
  }

  createNewGameOption(){
    this.setState({ createGameOpen: !this.state.createGameOpen });
  }

  handleJoinClick(id, name){
    this.setState({ gameName: name, selectedId: id, loginFailed: false });
  }

  handlePlayerCheckChange(changeEvent) {
    this.setState({ selectedPlayerId: changeEvent.target.value });
  }

  createNewGame(){
    if(this.state.selectedPlayerId){
      this.loginAsPlayer();
    }
    else if(this.state.selectedId){
      this.createNewPlayer();
    }
    else{
      let that = this;
      let postData = {
        playerPassword: this.state.playerPassword,
        playerName: this.state.playerName,
        gameName: this.state.gameName,
        gamePassword: this.state.gamePassword
      };
      axios.post('http://localhost:3001/games', postData)
      .then(function (response) {
        that.props.getNewGameData(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  loginAsPlayer(){
    let that = this;
    let postData = {
      playerPassword: this.state.playerPassword,
      selectedId: this.state.selectedId,
      selectedPlayerId: this.state.selectedPlayerId
    };
    axios.post('http://localhost:3001/playerLogin', postData)
    .then(function (response) {
      if(response.data.error !== undefined)
        that.setState({ loginFailed: true });
      else{
        response.data.currentGame = { gameName: that.state.gameName, _id: that.state.selectedId };
        that.props.getNewGameData(response);
        that.setState({ loginFailed: false });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  createNewPlayer(){
    let that = this;
    let postData = {
      playerPassword: this.state.playerPassword,
      playerName: this.state.playerName,
      selectedId: this.state.selectedId
    };
    axios.post('http://localhost:3001/players', postData)
    .then(function (response) {
      response.data.currentGame = { gameName: that.state.gameName, _id: that.state.selectedId };
      that.props.getNewGameData(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  handleGameLogin(){
    let that = this;
    let postData = {
      id: this.state.selectedId,
      gamePassword: this.state.gamePassword
    };
    axios.post('http://localhost:3001/gamesLogin', postData)
    .then(function (response) {
      if(response.data !== ""){
        that.setState({ loggedIntoGame: true, loginFailed: false, gamePlayers: response.data.players });
      }
      else{
        that.setState({ loginFailed: true });
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    let modalContent = null;
    if(this.state.loggedIntoGame){
      if(this.state.gamePlayers.length === 1){
        modalContent = <>
          <div>There is only one user in this game. Add User:</div>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">Player Name</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Name"
              aria-label="Name"
              aria-describedby="basic-addon1"
              onChange={this.playerNameChange}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">Player Password</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Password"
              aria-label="Password"
              aria-describedby="basic-addon1"
              onChange={this.playerPasswordChange}
            />
          </InputGroup>
        </>;
      }
      else{
        let loginFailed = null;
        if(this.state.loginFailed)
          loginFailed = "Login Failed";
        modalContent = <>
          <input type="radio" name="player" onChange={this.handlePlayerCheckChange} value={this.state.gamePlayers[0]._id} />
          <label style={{marginRight: "15px"}}>{this.state.gamePlayers[0].playerName}</label>
          <input type="radio" name="player" onChange={this.handlePlayerCheckChange} value={this.state.gamePlayers[1]._id} />
          <label>{this.state.gamePlayers[1].playerName}</label><br/>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">Player Password</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="Password"
              aria-label="Password"
              aria-describedby="basic-addon1"
              onChange={this.playerPasswordChange}
            />
          </InputGroup>
          {loginFailed}
        </>;
      }
    }
    else if(this.state.selectedId !== ""){
      let loginFailed = null;
      if(this.state.loginFailed)
        loginFailed = "Login Failed";
      modalContent = <>
      <div>{this.state.gameName}</div>
      <div>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">Game Password</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="Password"
            aria-label="Password"
            aria-describedby="basic-addon1"
            onChange={this.gamePasswordChange}
          />
        </InputGroup>
        {loginFailed}
      </div>
      <div>
        <Button variant="outline-primary" size="sm" onClick={this.handleGameLogin}>Join</Button>
      </div>
      </>;
    }
    else if(this.state.createGameOpen){
      modalContent =
      <div>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">Game Name</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="Game"
            aria-label="Game"
            aria-describedby="basic-addon1"
            onChange={this.gameNameChange}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">Game Password</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="Password"
            aria-label="Password"
            aria-describedby="basic-addon2"
            onChange={this.gamePasswordChange}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">Player Name</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="Player"
            aria-label="Name"
            aria-describedby="basic-addon3"
            onChange={this.playerNameChange}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">Player Password</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="Password"
            aria-label="Password"
            aria-describedby="basic-addon4"
            onChange={this.playerPasswordChange}
          />
        </InputGroup>
      </div>;
    }
    else{
      let options = this.props.avalibleGames.map((x, index) => {
        return (
          <GameOption key={x._id} identifier={x._id} gameName={x.gameName} gamePassword={x.gamePassword} handleJoinClick={this.handleJoinClick} />
        );
      });
      modalContent = <><div><b>Game Name</b></div> {options}</>;
    }
    let createGameButtonText = "Create New Game";
    if(this.state.createGameOpen)
      createGameButtonText = "Join Existing";

    let canClickJoinButton = true;
    if(this.state.createGameOpen || this.state.loggedIntoGame)
      canClickJoinButton = false;
    return (
        <Modal show={this.props.showCreateGameModal} onHide={this.props.closeCreateGameModal}>
          <Modal.Header closeButton>
            <Modal.Title>Start Game</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>Join an existing game or start a new game</div>
            <div>
              <Button variant="primary" onClick={this.createNewGameOption}>{createGameButtonText}</Button>
            </div>
            <div style={styles.startGameModalContent}>{modalContent}</div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.props.closeCreateGameModal}>
              Close
            </Button>
            <Button variant="primary" onClick={this.createNewGame} disabled={canClickJoinButton}>
              Join/Create
            </Button>
          </Modal.Footer>
        </Modal>
    );
  }
}

export default StartGameModal;
