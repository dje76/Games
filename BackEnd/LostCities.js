const mongoose = require('mongoose');
const game = require('./models/game');
const player = require('./models/player');
const lostCities_Game = require('./models/lostCities_Game');
const lostCities_Hand = require('./models/lostCities_Hand');
const url = 'mongodb://127.0.0.1:27017/Boardgames';

class LostCities {
  constructor(){
    mongoose.connect(url, { useNewUrlParser: true });
    this.db = mongoose.connection;
    this.db.once('open', _ => {
      console.log('Database connected:', url)
    });

    this.db.on('error', err => {
      console.error('connection error:', err)
    });
  }

  async getGames(req, res){
    const games = await game.find();
    res.send(games);
  }

  async postGame(req, res){
    const currentGame = new game ({
      gameName: req.body.gameName,
      gamePassword: req.body.gamePassword,
      gameComplete: false,
      playerCount: 2,
      gameTypeId: 1
    });
    const insertedGame = await currentGame.save();

    const currentplayer = new player ({
      gameId: insertedGame._id,
      playerPassword: req.body.playerPassword,
      playerName: req.body.playerName
    });
    const insertedPlayer = await currentplayer.save();

    let deck = this.buildDeck();
    let hand = [];
    for(let i = 0; i < 8; i++){
      hand.push(deck.pop());
    }
    const currentLostCities_Game = new lostCities_Game ({
      gameId: insertedGame._id,
      deck: deck,
      playerTurn: insertedPlayer._id
    });
    const insertedLostCities_Game = await currentLostCities_Game.save();

    const currentLostCities_Hand = new lostCities_Hand ({
      playerId: insertedPlayer._id,
      hand: hand,
      lostCities_GameId: insertedLostCities_Game._id
    });
    const insertedLostCities_Hand = await currentLostCities_Hand.save();

    res.send({
      currentGame: insertedGame,
      currentPlayer: insertedPlayer,
      currentLostCities_Game: insertedLostCities_Game,
      currentLostCities_Hand: insertedLostCities_Hand
    });
  }

  async loginToGame(req, res){
    const currentGame = await game.findOne({ _id: req.body.id, gamePassword: req.body.gamePassword });
    if(currentGame !== null){
      const currentPlayers = await player.find({ gameId: currentGame._id });
      res.send({ game: currentGame, players: currentPlayers });
    }
    else{
      res.send(currentGame);
    }
  }

  async postPlayer(req, res){
    if(req.body.selectedId === "" || req.body.selectedId === null || req.body.selectedId === undefined){
      res.send({ error: "no game Id" });
      return;
    }
    const currentplayer = new player ({
      gameId: req.body.selectedId,
      playerPassword: req.body.playerPassword,
      playerName: req.body.playerName
    });
    const insertedPlayer = await currentplayer.save();

    let currentLostCities_Game = await lostCities_Game.findOne({ gameId: req.body.selectedId });
    let hand = [];
    for(let i = 0; i < 8; i++){
      hand.push(currentLostCities_Game.deck.pop());
    }
    const currentLostCities_Hand = new lostCities_Hand ({
      playerId: insertedPlayer._id,
      hand: hand,
      lostCities_GameId: currentLostCities_Game._id
    });
    const insertedLostCities_Hand = await currentLostCities_Hand.save();
    const newLostCities_Hand = await currentLostCities_Game.save();

    res.send({
      currentPlayer: insertedPlayer,
      currentLostCities_Game: newLostCities_Hand,
      currentLostCities_Hand: insertedLostCities_Hand
    });
  }

  async playerLogin(req, res){
    if(req.body.selectedId === "" || req.body.selectedId === null || req.body.selectedId === undefined){
      res.send({ error: "no game Id" });
      return;
    }
    const currentplayer = await player.findOne ({
      _id: req.body.selectedPlayerId,
      playerPassword: req.body.playerPassword
    });
    let currentLostCities_Game = await lostCities_Game.findOne({ gameId: req.body.selectedId });
    const currentLostCities_Hand = await lostCities_Hand.findOne({ playerId: currentplayer._id });

    if(currentLostCities_Hand === undefined || currentLostCities_Hand === null){
      let hand = [];
      for(let i = 0; i < 8; i++){
        hand.push(currentLostCities_Game.deck.pop());
      }
      const currentLostCities_Hand = new lostCities_Hand ({
        playerId: currentplayer._id,
        hand: hand,
        lostCities_GameId: currentLostCities_Game._id
      });
      console.log(currentLostCities_Game.deck.length);
      const insertedLostCities_Hand = await currentLostCities_Hand.save();
      const newLostCities_Game = await currentLostCities_Game.save();

      res.send({
        currentPlayer: currentplayer,
        currentLostCities_Game: newLostCities_Game,
        currentLostCities_Hand: insertedLostCities_Hand
      });
    }
    else
      res.send({
        currentPlayer: currentplayer,
        currentLostCities_Game: currentLostCities_Game,
        currentLostCities_Hand: currentLostCities_Hand
      });
  }

  buildDeck(){
    let deck = [];
    for(let i = 1; i < 66; i++){
      let cardValue = i % 13;
      if(cardValue === 0)
        cardValue = 13;
      if(i < 14)
        deck.push({ value: cardValue, suit: "Yellow" });
      else if(i < 27)
        deck.push({ value: cardValue, suit: "White" });
      else if(i < 40)
        deck.push({ value: cardValue, suit: "Blue" });
      else if(i < 53)
        deck.push({ value: cardValue, suit: "Green" });
      else
        deck.push({ value: cardValue, suit: "Red" });
    }
    var currentIndex = deck.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = deck[currentIndex];
      deck[currentIndex] = deck[randomIndex];
      deck[randomIndex] = temporaryValue;
    }
    return deck;
  };
}

module.exports = LostCities;
