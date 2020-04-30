const mongoose = require('mongoose')
const Schema = mongoose.Schema

const lostCities_playAreaSchema = new Schema({
  lostCities_GameId: String,
  isDiscard: Boolean,
  playerId: String,
  suit: Number,
  playedCards: Array
});

module.exports = mongoose.model('lostCities_playArea', lostCities_playAreaSchema);
