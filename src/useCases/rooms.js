// Logger
const logger = require('../logger');

// Business Errors
const errorNames = require('../errors');
const BusinessError = require('../BusinessError');

// Entities
const { Room } = require('../entities');

/**
 * Method to read the room information
 * @param {Object} query - Filter query
 * @param {Object} select - Fields of document to return
 * @returns {Object} - The method returns an object with the element found by
 *                     the query criteria
 */
const readOne = async (query, select = { _id: 1 }) => (await Room.find(query, select)
  .limit(1)
  .lean({ virtuals: true }))[0];

/**
 * Method to create a new room.
 * @returns {Object} - The method returns an object with the
 *                     new room created.
 */
const create = async () => {
  // Will create a new user;
  let roomCreated;
  try {
    roomCreated = await Room.create({
      'player1.wins': 0,
      'player2.wins': 0,
    });
  } catch (err) {
    logger.error(`(rps-room-module): Error creating room: ${err.message}`);
    throw new BusinessError(errorNames.DATABASE_ERROR, 'rps-room-module');
  }

  return roomCreated;
};

/**
 * Method to add players to the room game
 * @param {String} roomId - Id of room
 * @param {String} player1 - Id of player 1
 * @param {String} player2 - Id of player 2
 */
const addPlayer = async ({ room, player1, player2 }) => {
  let updateParams = {};
  if (player1) updateParams = { $set: { 'player1.user': player1 } };
  if (player2) updateParams = { $set: { 'player2.user': player2 } };

  // Add player
  const updateStatus = await Room.update({
    _id: room,
  }, updateParams);

  if ((updateStatus.ok === 0) || (updateStatus.nModified === 0)) {
    logger.error('(rps-room-module): Error adding player to room');
    throw new BusinessError(errorNames.ROOM_DOES_NOT_EXISTS, 'rps-room-module');
  }
};

/**
 * Method to add round game to room
 * @param {String} room -Id of room
 * @param {String} winner - Id of winner
 * @param {Number} choice - User choice
 */
const addGameRound = async ({ room, winner, choice }) => {
  const playerWin = await readOne({
    $and: [
      { _id: room },
      { $or: [
        { 'player1.user': winner },
        { 'player2.user': winner },
      ] },
    ],
  }, { player1: 1, player2: 1 });
  const updateParams = { $push: { games: { winner, choice } } };
  if (playerWin.player1.user === winner) {
    updateParams.$inc = { 'player1.wins': 1 };
  } else {
    updateParams.$inc = { 'player2.wins': 1 };
  }
  const updateStatus = await Room.update({
    $and: [
      { _id: room },
      { $or: [
        { 'player1.user': winner },
        { 'player2.user': winner },
      ] },
    ],
  }, updateParams);

  if ((updateStatus.ok === 0) || (updateStatus.nModified === 0)) {
    logger.error('(rps-room-module): Error adding game round to room');
    throw new BusinessError(errorNames.ROOM_DOES_NOT_EXISTS, 'rps-room-module');
  }
  // Validate if winner exists
  const userWinner = await readOne({
    $and: [
      { _id: room },
      { $or: [
        { 'player1.wins': { $gte: 3 } },
        { 'player2.wins': { $gte: 3 } },
      ] },
    ],
  }, { _id: 1, player1: 1, player2: 1 });

  return userWinner;
};

module.exports = {
  readOne,
  create,
  addPlayer,
  addGameRound,
};
