const express = require('express');
const bodyParser = require('body-parser');
const lostCities = require('./LostCities.js');
const lostCitiesHandler = new lostCities();
const cors = require('cors');
const app = express();
const socketApp = express();
const server = require('http').createServer(socketApp);
const io = require('socket.io')(server);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
let socketList = [];

io.on("connection", (socket) => {
  console.log("New client connected");
  socketList.push(socket);
  socket.on("disconnect", () => {
    let socketToRemoveIndex = -1;
    for(let i = 0; i < socketList.length; i++){
      if(socketList[i].id === socket.id){
        socketToRemoveIndex = i;
        break;
      }
    }
    socketList.splice(socketToRemoveIndex, 1);
    console.log("Client disconnected");
  });
});

server.listen(3002, () => console.log('socket listening on port 3002'));
app.listen(3001, () => console.log('listening on 3001'));

app.post('/gamesLogin', async (req, res) => {
  lostCitiesHandler.loginToGame(req, res);
});

app.get('/games', async (req, res) => {
  lostCitiesHandler.getGames(req, res);
});

app.post('/games',async (req, res) =>{
  lostCitiesHandler.postGame(req, res);
});

app.post('/players',async (req, res) =>{
  lostCitiesHandler.postPlayer(req, res);
});

app.post('/playerLogin', async (req, res) =>{
  lostCitiesHandler.playerLogin(req, res);
});

app.post('/endTurnSave', async (req, res) =>{
  let newGameData = await lostCitiesHandler.endTurnSave(req, res);

  for(let i = 0 ; i < socketList.length; i++){
    for(let j = 0 ; j < newGameData.playerToUpdate.length; j++){
      if(socketList[i].handshake.query.playerId.toString() === newGameData.playerToUpdate[j]._id.toString())
        socketList[i].emit("UpdateGameData", newGameData);
    }
  }
});
