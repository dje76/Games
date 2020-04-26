const mongoose = require('mongoose')
const Schema = mongoose.Schema

const lostCities_HandSchema = new Schema({
  playerId: { type: String, unique: true },
  lostCities_GameId: String,
  hand: Array
});

module.exports = mongoose.model('lostCities_Hand', lostCities_HandSchema);
