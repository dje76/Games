const mongoose = require('mongoose')
const Schema = mongoose.Schema

const lostCities_HandSchema = new Schema({
  lostCities_HandId: { type: Number, unique: true },
  playerId: { type: Number, unique: true },
  lostCities_GameId: Number,
  hand: Array
});

module.exports = mongoose.model('lostCities_Hand', lostCities_HandSchema);
