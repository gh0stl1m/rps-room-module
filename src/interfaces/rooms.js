// Use cases
const { rooms } = require('../useCases');

// Errors
const BusinessError = require('../BusinessError');
const errorNames = require('../errors');

/**
 * Method to create a new room.
 * @returns {Object} - The method returns an object with the
 *                     new room created.
 */
const Create = async () => rooms.create();

/**
 * Method to read a room by id
 * @param {String} roomId - Id of room
 * @param {*} select - Fields to read of room
 */
const ReadById = async (roomId, select = { _id: 1 }) => {
  if (!roomId) throw new BusinessError(errorNames.PARAMS_REQUIRED, 'rps-room-module');
  const roomInfo = await rooms.readOne({ _id: roomId }, select);

  return roomInfo;
};

/**
 * Method to add players to the room game
 * @param {String} roomId - Id of room
 * @param {String} player1 - Id of player 1
 * @param {String} player2 - Id of player 2
 */
const AddPlayer = async ({ room, player1, player2 } = {}) => {
  if (!room) throw new BusinessError(errorNames.PARAMS_REQUIRED, 'rps-room-module');
  if (player1 && player2) throw new BusinessError(errorNames.ADD_ONE_PLAYER_PER_TIME, 'rps-room-module');

  await rooms.addPlayer({ room, player1, player2 });
};

/**
 * Method to add round game to room
 * @param {String} room -Id of room
 * @param {String} winner - Id of winner
 * @param {Number} round - Round number
 */
const AddGameRound = async ({ room, winner, choice } = {}) => {
  if (!room || !winner || !choice) throw new BusinessError(errorNames.PARAMS_REQUIRED, 'rps-room-module');
  const userWinner = await rooms.addGameRound({ room, winner, choice: choice.toUpperCase() });

  return userWinner;
};

module.exports = {
  Create,
  ReadById,
  AddPlayer,
  AddGameRound,
};
