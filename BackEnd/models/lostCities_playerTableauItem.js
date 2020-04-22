const mongoose = require('mongoose')
const Schema = mongoose.Schema

const lostCities_playerTableauItemSchema = new Schema({
  lostCities_playerTableauItemId: { type: Number, unique: true },
  playerId: { type: Number, unique: true },
  lostCities_GameId: Number,
  tableauItemTypeId: Number,
  cardsPlayed: Array
});

module.exports = mongoose.model('lostCities_playerTableauItem', lostCities_playerTableauItemSchema);
