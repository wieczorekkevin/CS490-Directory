import { createPlayerForTesting } from '../../TestUtils';
import {
  BOARD_POSITION_NOT_EMPTY_MESSAGE,
  GAME_FULL_MESSAGE,
  GAME_NOT_IN_PROGRESS_MESSAGE,
  MOVE_NOT_YOUR_TURN_MESSAGE,
  PLAYER_ALREADY_IN_GAME_MESSAGE,
  PLAYER_NOT_IN_GAME_MESSAGE,
} from '../../lib/InvalidParametersError';
import Player from '../../lib/Player';
import { TicTacToeMove } from '../../types/CoveyTownSocket';
import TicTacToeGame from './TicTacToeGame';

describe('TicTacToeGame', () => {
  let game: TicTacToeGame;

  beforeEach(() => {
    game = new TicTacToeGame();
  });

  describe('[T1.1] _join', () => {
    describe('When the player can be added', () => {
      it('makes the first player X and initializes the state with status WAITING_TO_START', () => {
        const player = createPlayerForTesting();
        game.join(player);
        expect(game.state.x).toEqual(player.id);
        expect(game.state.o).toBeUndefined();
        expect(game.state.moves).toHaveLength(0);
        expect(game.state.status).toEqual('WAITING_TO_START');
        expect(game.state.winner).toBeUndefined();
      });
    });
    describe('[T1.2] _leave', () => {
      describe('when the player is in the game', () => {
        describe('when the game is in progress, it should set the game status to OVER and declare the other player the winner', () => {
          test('when x leaves', () => {
            const player1 = createPlayerForTesting();
            const player2 = createPlayerForTesting();
            game.join(player1);
            game.join(player2);
            expect(game.state.x).toEqual(player1.id);
            expect(game.state.o).toEqual(player2.id);

            game.leave(player1);

            expect(game.state.status).toEqual('OVER');
            expect(game.state.winner).toEqual(player2.id);
            expect(game.state.moves).toHaveLength(0);

            expect(game.state.x).toEqual(player1.id);
            expect(game.state.o).toEqual(player2.id);
          });
        });
      });
    });
    describe('applyMove', () => {
      describe('when given a valid move', () => {
        let player1: Player;
        let player2: Player;
        beforeEach(() => {
          player1 = createPlayerForTesting();
          player2 = createPlayerForTesting();
          game.join(player1);
          game.join(player2);
        });
        it('[T2.1] should add the move to the game state', () => {
          const move: TicTacToeMove = { row: 1, col: 2, gamePiece: 'X' };
          game.applyMove({
            gameID: game.id,
            playerID: player1.id,
            move,
          });
          expect(game.state.moves).toHaveLength(1);
          expect(game.state.moves[0]).toEqual(move);
          expect(game.state.status).toEqual('IN_PROGRESS');
        });
      });
    });
  });

  describe('[T1.1a] _join', () => {
    describe('When the second player can be added', () => {
      it('makes the second player O and initializes the state with status IN_PROGRESS', () => {
        const player1 = createPlayerForTesting();
        const player2 = createPlayerForTesting();
        game.join(player1);
        game.join(player2);
        expect(game.state.x).toEqual(player1.id);
        expect(game.state.o).toEqual(player2.id);
        expect(game.state.moves).toHaveLength(0);
        expect(game.state.status).toEqual('IN_PROGRESS');
        expect(game.state.winner).toBeUndefined();
      });
    });
  });

  describe('[T1.1b] _join', () => {
    describe('Throw an error', () => {
      it('when the same player tries to join the game', () => {
        const player1 = createPlayerForTesting();
        game.join(player1);
        expect(() => game.join(player1)).toThrowError(PLAYER_ALREADY_IN_GAME_MESSAGE);
      });
    });
  });

  describe('[T1.1c] _join', () => {
    describe('Throw an error', () => {
      it('when the game is already full', () => {
        const player1 = createPlayerForTesting();
        const player2 = createPlayerForTesting();
        const player3 = createPlayerForTesting();
        game.join(player1);
        game.join(player2);
        expect(() => game.join(player3)).toThrowError(GAME_FULL_MESSAGE);
      });
    });
  });

  describe('[T1.2a] _leave', () => {
    describe('when the player is in the game', () => {
      describe('when the game is in progress, it should set the game status to OVER and declare the other player the winner', () => {
        test('when o leaves', () => {
          const player1 = createPlayerForTesting();
          const player2 = createPlayerForTesting();
          game.join(player1);
          game.join(player2);
          expect(game.state.x).toEqual(player1.id);
          expect(game.state.o).toEqual(player2.id);

          game.leave(player1);

          expect(game.state.status).toEqual('OVER');
          expect(game.state.winner).toEqual(player2.id);
          expect(game.state.moves).toHaveLength(0);

          expect(game.state.x).toEqual(player1.id);
          expect(game.state.o).toEqual(player2.id);
        });
      });
    });
  });

  describe('[T1.2b] _leave', () => {
    describe('throw an error', () => {
      it('when a player tries to leave a game they are not in', () => {
        const player1 = createPlayerForTesting();
        const player2 = createPlayerForTesting();
        game.join(player1);
        expect(() => game.leave(player2)).toThrowError(PLAYER_NOT_IN_GAME_MESSAGE);
      });
    });
  });

  describe('applyMove', () => {
    describe('when given an invalid move', () => {
      let player1: Player;
      let player2: Player;
      beforeEach(() => {
        player1 = createPlayerForTesting();
        player2 = createPlayerForTesting();
        game.join(player1);
        game.join(player2);
      });
      it('[T2.1a] should throw InvalidParamatersError with message: MOVE_NOT_YOUR_TURN_MESSAGE ', () => {
        const move: TicTacToeMove = { row: 1, col: 2, gamePiece: 'X' };
        expect(() =>
          game.applyMove({
            gameID: game.id,
            playerID: player2.id,
            move,
          }),
        ).toThrowError(MOVE_NOT_YOUR_TURN_MESSAGE);
      });
    });
  });

  describe('applyMove', () => {
    describe('when given an invalid move', () => {
      let player1: Player;
      beforeEach(() => {
        player1 = createPlayerForTesting();
        game.join(player1);
      });
      it('[T2.1b] should throw InvalidParamatersError with message: GAME_NOT_IN_PROGRESS_MESSAGE ', () => {
        const move: TicTacToeMove = { row: 1, col: 2, gamePiece: 'X' };
        expect(() =>
          game.applyMove({
            gameID: game.id,
            playerID: player1.id,
            move,
          }),
        ).toThrowError(GAME_NOT_IN_PROGRESS_MESSAGE);
      });
    });
  });

  describe('applyMove', () => {
    describe('when given an invalid move', () => {
      let player1: Player;
      let player2: Player;
      beforeEach(() => {
        player1 = createPlayerForTesting();
        player2 = createPlayerForTesting();
        game.join(player1);
        game.join(player2);
      });
      it('[T2.1c] should throw InvalidParamatersError with message: BOARD_POSITION_NOT_EMPTY_MESSAGE ', () => {
        let move: TicTacToeMove = { row: 1, col: 2, gamePiece: 'X' };
        game.applyMove({
          gameID: game.id,
          playerID: player1.id,
          move,
        });
        move = { row: 2, col: 2, gamePiece: 'O' };
        game.applyMove({
          gameID: game.id,
          playerID: player2.id,
          move,
        });
        move = { row: 2, col: 2, gamePiece: 'X' };
        expect(() =>
          game.applyMove({
            gameID: game.id,
            playerID: player1.id,
            move,
          }),
        ).toThrowError(BOARD_POSITION_NOT_EMPTY_MESSAGE);
      });
    });
  });

  describe('applyMove', () => {
    describe('when given a valid move', () => {
      let player1: Player;
      let player2: Player;
      beforeEach(() => {
        player1 = createPlayerForTesting();
        player2 = createPlayerForTesting();
        game.join(player1);
        game.join(player2);
      });
      it('[T2.2] determine a winner if a winner is found', () => {
        let move: TicTacToeMove = { row: 0, col: 0, gamePiece: 'X' };
        game.applyMove({
          gameID: game.id,
          playerID: player1.id,
          move,
        });
        move = { row: 1, col: 0, gamePiece: 'O' };
        game.applyMove({
          gameID: game.id,
          playerID: player2.id,
          move,
        });
        move = { row: 0, col: 1, gamePiece: 'X' };
        game.applyMove({
          gameID: game.id,
          playerID: player1.id,
          move,
        });
        move = { row: 1, col: 1, gamePiece: 'O' };
        game.applyMove({
          gameID: game.id,
          playerID: player2.id,
          move,
        });
        move = { row: 0, col: 2, gamePiece: 'X' };
        game.applyMove({
          gameID: game.id,
          playerID: player1.id,
          move,
        });
        expect(game.state.moves).toHaveLength(5);
        expect(game.state.status).toEqual('OVER');
        expect(game.state.winner).toEqual(player1.id);
      });
    });
  });
});
