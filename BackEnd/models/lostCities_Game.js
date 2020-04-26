const mongoose = require('mongoose')
const Schema = mongoose.Schema

const lostCities_GameSchema = new Schema({
  gameId: { type: String, unique: true },
  deck: Array,
  playerTurn: String
});

module.exports = mongoose.model('lostCities_Game', lostCities_GameSchema);
