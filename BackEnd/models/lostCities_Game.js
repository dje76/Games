const mongoose = require('mongoose')
const Schema = mongoose.Schema

const lostCities_GameSchema = new Schema({
  lostCities_GameId: { type: Number, unique: true },
  gameId: { type: Number, unique: true },
  deck: Array
});

module.exports = mongoose.model('lostCities_Game', lostCities_GameSchema);
