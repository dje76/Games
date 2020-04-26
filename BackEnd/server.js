const express = require('express');
const bodyParser = require('body-parser');
const lostCities = require('./LostCities.js');
const lostCitiesHandler = new lostCities();
const cors = require('cors');
const app = express();
const socket = express();
const server = require('http').createServer(socket);
const io = require('socket.io')(server);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

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
