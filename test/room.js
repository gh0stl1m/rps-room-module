// External libraries
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');

// Entities
const { Room } = require('../src/entities');

// Use cases
const { rooms } = require('../src/useCases');

// Chai expect
const expect = chai.expect;

// Add plugins to chai
chai.use(chaiAsPromised);
chai.use(dirtyChai);
chai.use(sinonChai);

describe('Room Domain', function () {
  // logger
  const loggerStub = () => sinon.stub();

  // Before test
  let roomsUseCases;
  let roomCreateStub;
  let sandbox;
  before(() => {
    roomsUseCases = proxyquire('../src/useCases/rooms', {
      logger: loggerStub,
    });
    sandbox = sinon.sandbox.create();
    // User entity
    roomCreateStub = sandbox.stub(Room, "create")
      .resolves({
        id: 'id1',
        player1: {
          wins: 0,
        },
        player2: {
          wins: 0,
        },
      });
  });
  afterEach(() => {
    sandbox.reset();
  });
  after(() => {
    sandbox.restore();
  });

  context('Use Cases', function() {
    it('should create a new user, if it not exists', async () => {
      const newRoom = await rooms.create();
      // Validations
      sinon.assert.calledOnce(roomCreateStub);
      sinon.assert.calledWith(roomCreateStub, sinon.match({
        'player1.wins': 0,
        'player2.wins': 0,
      }));
      expect(newRoom).to.be.an('object').with.property('id').and.equal('id1');
    });
  }); // context
}); // describe

