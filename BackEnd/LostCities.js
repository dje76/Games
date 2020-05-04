const mongoose = require('mongoose');
const game = require('./models/game');
const player = require('./models/player');
const lostCities_Game = require('./models/lostCities_Game');
const lostCities_Hand = require('./models/lostCities_Hand');
const lostCities_playArea = require('./models/lostCities_playArea');
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

    let playAreas = [];
    for(let i = 0; i < 10; i++){
      if(i < 5){
        let currentLostCities_Hand = new lostCities_playArea ({
          lostCities_GameId: insertedLostCities_Game._id,
          isDiscard: true,
          playerId: "",
          suit: (i % 5) + 1,
          playedCards: []
        });
        playAreas.push(await currentLostCities_Hand.save());
      }
      else{
        let currentLostCities_Hand = new lostCities_playArea ({
          lostCities_GameId: insertedLostCities_Game._id,
          isDiscard: false,
          playerId: insertedPlayer._id,
          suit: (i % 5) + 1,
          playedCards: []
        });
        playAreas.push(await currentLostCities_Hand.save());
      }
    }

    res.send({
      currentGame: insertedGame,
      currentPlayer: insertedPlayer,
      currentLostCities_Game: insertedLostCities_Game,
      currentLostCities_Hand: insertedLostCities_Hand,
      currentLostCities_playAreas: playAreas
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

    let playAreas = [];
    for(let i = 0; i < 5; i++){
      let currentLostCities_Hand = new lostCities_playArea ({
        lostCities_GameId: currentLostCities_Game._id,
        isDiscard: false,
        playerId: insertedPlayer._id,
        suit: i + 1,
        playedCards: []
      });
      playAreas.push(await currentLostCities_Hand.save());
    }
    const gamePlayAreas = await lostCities_playArea.find({ lostCities_GameId: currentLostCities_Game._id });

    res.send({
      currentPlayer: insertedPlayer,
      currentLostCities_Game: newLostCities_Hand,
      currentLostCities_Hand: insertedLostCities_Hand,
      currentLostCities_playAreas: gamePlayAreas
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
    if(currentplayer !== undefined && currentplayer !== null){
      const currentLostCities_Game = await lostCities_Game.findOne({ gameId: req.body.selectedId });
      const currentLostCities_Hand = await lostCities_Hand.findOne({ playerId: currentplayer._id });
      const gamePlayAreas = await lostCities_playArea.find({ lostCities_GameId: currentLostCities_Game._id });

      res.send({
        currentPlayer: currentplayer,
        currentLostCities_Game: currentLostCities_Game,
        currentLostCities_Hand: currentLostCities_Hand,
        currentLostCities_playAreas: gamePlayAreas
      });
    }
    else
      res.send({ error: "Could not find user"});
  }


  async endTurnSave(req, res){
    let newGame = null;
    if(req.body.deck.length === 0){
      const currentGame = await game.findOne ({ _id: req.body.game._id });
      currentGame.gameComplete = true;
      let newGame = await currentGame.save();
    }

    const currentPlayers = await player.find({ gameId: req.body.game._id });
    let changePlayerId = "";
    if(currentPlayers[0]._id.toString() === req.body.player._id.toString())
      changePlayerId = currentPlayers[1]._id;
    else
      changePlayerId = currentPlayers[0]._id;
    const currentLostCities_Game = await lostCities_Game.findOne({ gameId: req.body.game._id });
    currentLostCities_Game.deck = req.body.deck;
    currentLostCities_Game.playerTurn = changePlayerId;
    let newLostCities_Game = await currentLostCities_Game.save();

    const currentLostCities_Hand = await lostCities_Hand.findOne({ _id: req.body.hand._id });
    currentLostCities_Hand.hand = req.body.hand.hand;
    await currentLostCities_Hand.save();

    let newPlayAreas = [];
    for(let i = 0; i < req.body.playAreas.length; i++){
      const playArea = await lostCities_playArea.findOne({ _id: req.body.playAreas[i]._id });
      playArea.playedCards = req.body.playAreas[i].playedCards;
      const newPlayArea = await playArea.save();
      newPlayAreas.push(newPlayArea);
    }

    res.send({ complete: true });
    return { newPlayAreas: newPlayAreas, newLostCities_Game: newLostCities_Game, newGame: newGame, playerToUpdate: currentPlayers };
  }

  buildDeck(){
    let deck = [];
    for(let i = 1; i < 60; i++){
      let cardValue = i % 12;
      if(cardValue > 10 || cardValue === 1)
        cardValue = 0;
      if(i < 14)
        deck.push({ value: cardValue, suit: 1 });
      else if(i < 27)
        deck.push({ value: cardValue, suit: 2 });
      else if(i < 40)
        deck.push({ value: cardValue, suit: 3 });
      else if(i < 53)
        deck.push({ value: cardValue, suit: 4 });
      else
        deck.push({ value: cardValue, suit: 5 });
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
