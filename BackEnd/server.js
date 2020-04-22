const express = require('express');
const mongoose = require('mongoose');
const game = require('./models/game');
const app = express();

const url = 'mongodb://127.0.0.1:27017/Boardgames';
mongoose.connect(url, { useNewUrlParser: true });
const db = mongoose.connection;
db.once('open', _ => {
  console.log('Database connected:', url)
});

db.on('error', err => {
  console.error('connection error:', err)
});

app.listen(3001, function() {
  console.log('listening on 3000');
});

app.get('/games', async (req, res) => {
  const games = await game.find();
  res.send(games);
});

app.post('/', (req, res) =>{
  const currentGame = new game ({
    gameId: 1,
    gamePassword: 'password',
    playerCount: 2,
    gameTypeId: 1
  });
  currentGame.save((error, document) => {
    if (error) console.error(error);
    console.log(document);
  });
});
