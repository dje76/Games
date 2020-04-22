const mongoose = require('mongoose')
const Schema = mongoose.Schema

const playerSchema = new Schema({
  playerId: { type: Number, unique: true },
  playerPassword: String,
  playerName: { type: String, unique: true },
  gameId: Number
});

module.exports = mongoose.model('player', playerSchema);
