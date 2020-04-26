const mongoose = require('mongoose')
const Schema = mongoose.Schema

const playerSchema = new Schema({
  playerPassword: String,
  playerName: { type: String, unique: true },
  gameId: String
});

module.exports = mongoose.model('player', playerSchema);
