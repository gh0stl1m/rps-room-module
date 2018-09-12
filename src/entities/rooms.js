// External libraries
const { Schema } = require('mongoose');
const MongooseLeanVirtuals = require('mongoose-lean-virtuals');

// Drivers
const { MongoConnection } = require('../drivers');

// Define Schema
const Room = new Schema({
  player1: {
    user: { type: String },
    wins: { type: Number, default: 0 },
  },
  player2: {
    user: { type: String },
    wins: { type: Number, default: 0 },
  },
  games: [{
    winner: { type: String },
    round: { type: Number, default: 1 },
  }],
}, {
  timestamps: true,
  toObject: { virtuals: true },
});

// Define virtual variables
// Add 'id' field to virtuals
Room.virtual('id').get(function () {
  return this._id.toString();
});

// Plugins
Room.plugin(MongooseLeanVirtuals);

module.exports = MongoConnection.model('room', Room);
