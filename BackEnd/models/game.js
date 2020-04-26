const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gameSchema = new Schema({
  gamePassword: String,
  gameName: { type: String, unique: true },
  playerCount: Number,
  gameTypeId: Number,
  gameComplete: Boolean
});

module.exports = mongoose.model('game', gameSchema);
