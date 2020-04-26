const mongoose = require('mongoose')
const Schema = mongoose.Schema

const lostCities_discardPileSchema = new Schema({
  lostCities_GameId: Number,
  tableauItemTypeId: Number,
  cardsDiscarded: Array
});

module.exports = mongoose.model('lostCities_discardPile', lostCities_discardPileSchema);
