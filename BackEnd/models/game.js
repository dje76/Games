const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gameSchema = new Schema({
  gameId: { type: Number, unique: true },
  gamePassword: String,
  playerCount: Number,
  gameTypeId: Number
});

module.exports = mongoose.model('game', gameSchema);
