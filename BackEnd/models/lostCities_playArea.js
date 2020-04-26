const mongoose = require('mongoose')
const Schema = mongoose.Schema

const lostCities_playAreaSchema = new Schema({
  lostCities_playAreaId: { type: Number, unique: true },
  playerId: { type: Number, unique: true },
  lostCities_GameId: Number,
  isDiscard: Boolean,
  playedCard: Array
});

module.exports = mongoose.model('lostCities_playArea', lostCities_playAreaSchema);
