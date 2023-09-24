import InvalidParametersError, {
  MOVE_NOT_YOUR_TURN_MESSAGE,
  GAME_NOT_IN_PROGRESS_MESSAGE,
  PLAYER_ALREADY_IN_GAME_MESSAGE,
  GAME_FULL_MESSAGE,
  PLAYER_NOT_IN_GAME_MESSAGE,
  BOARD_POSITION_NOT_EMPTY_MESSAGE,
} from '../../lib/InvalidParametersError';
import Player from '../../lib/Player';
import { GameMove, PlayerID, TicTacToeGameState, TicTacToeMove } from '../../types/CoveyTownSocket';
import Game from './Game';

/**
 * A TicTacToeGame is a Game that implements the rules of Tic Tac Toe.
 * @see https://en.wikipedia.org/wiki/Tic-tac-toe
 */

export default class TicTacToeGame extends Game<TicTacToeGameState, TicTacToeMove> {
  public constructor() {
    super({
      moves: [],
      status: 'WAITING_TO_START',
    });
  }

  /*
   * Checks a player's validated move to see if the game results in a win or tie.
   * This function is only called when the minimum amount of turns where a win can happen occurs (5 turns).
   * Creates a 2D array of strings that serves as the TicTacToe board, where each possible win is checked.
   * If a win is found, set the game status to OVER and sets winner to the player ID of the most recent move.
   * Otherwise, checks if all 9 moves have been taken to indicate a tie, sets the game status to OVER and sets winner to undefined.
   *
   * @param move Move that is checked along win condition.
   */
  checkGameEndCondition(move: GameMove<TicTacToeMove>): void {
    const maxMoveCount = 9;

    const rowMax = 3;
    const colMax = 3;
    let rowIndex: number;
    let colIndex: number;
    const mapTicTacToe: string[][] = [];

    for (let p = 0; p < rowMax; p++) {
      mapTicTacToe[p] = [];
      for (let q = 0; q < colMax; q++) {
        mapTicTacToe[p][q] = '';
      }
    }

    for (let i = 0; i < this.state.moves.length; i++) {
      rowIndex = this.state.moves[i].row;
      colIndex = this.state.moves[i].col;
      mapTicTacToe[rowIndex][colIndex] = this.state.moves[i].gamePiece;
    }

    for (let j = 0; j < rowMax; j++) {
      if (mapTicTacToe[j][0] === mapTicTacToe[j][1] && mapTicTacToe[j][0] === mapTicTacToe[j][2]) {
        this.state.status = 'OVER';
        this.state.winner = move.playerID;
        return;
      }
    }

    for (let k = 0; k < colMax; k++) {
      if (mapTicTacToe[0][k] === mapTicTacToe[1][k] && mapTicTacToe[0][k] === mapTicTacToe[2][k]) {
        this.state.status = 'OVER';
        this.state.winner = move.playerID;
        return;
      }
    }

    if (
      (mapTicTacToe[0][0] === mapTicTacToe[1][1] && mapTicTacToe[0][0] === mapTicTacToe[2][2]) ||
      (mapTicTacToe[0][2] === mapTicTacToe[1][1] && mapTicTacToe[0][2] === mapTicTacToe[2][0])
    ) {
      this.state.status = 'OVER';
      this.state.winner = move.playerID;
      return;
    }

    if (this.state.moves.length === maxMoveCount) {
      this.state.status = 'OVER';
      this.state.winner = undefined;
    }
  }

  /*
   * Applies a player's move to the game.
   * Uses the player's ID to determine which game piece they are using (ignores move.gamePiece)
   * Validates the move before applying it. If the move is invalid, throws an InvalidParametersError with
   * the error message specified below.
   * A move is invalid if:
   *    - The move is on a space that is already occupied (use BOARD_POSITION_NOT_EMPTY_MESSAGE)
   *    - The move is not the player's turn (MOVE_NOT_YOUR_TURN_MESSAGE)
   *    - The game is not in progress (GAME_NOT_IN_PROGRESS_MESSAGE)
   *
   * If the move is valid, applies the move to the game and updates the game state.
   *
   * If the move ends the game, updates the game's state.
   * If the move results in a tie, updates the game's state to set the status to OVER and sets winner to undefined.
   * If the move results in a win, updates the game's state to set the status to OVER and sets the winner to the player who made the move.
   * A player wins if they have 3 in a row (horizontally, vertically, or diagonally).
   *
   * @param move The move to apply to the game
   * @throws InvalidParametersError if the move is invalid (with specific message noted above)
   */
  public applyMove(move: GameMove<TicTacToeMove>): void {
    let expectedPlayerID: PlayerID | undefined;

    if (move.move.gamePiece === 'X') {
      expectedPlayerID = this.state.x;
    } else if (move.move.gamePiece === 'O') {
      expectedPlayerID = this.state.o;
    }

    if (this.state.status !== 'IN_PROGRESS') {
      throw new InvalidParametersError(GAME_NOT_IN_PROGRESS_MESSAGE);
    } else if (move.playerID !== expectedPlayerID) {
      throw new InvalidParametersError(MOVE_NOT_YOUR_TURN_MESSAGE);
    }

    const newSetOfMoves: TicTacToeMove[] = [];
    if (this.state.moves.length === 0) {
      newSetOfMoves.push(move.move);
    } else {
      for (let i = 0; i < this.state.moves.length; i += 1) {
        if (
          move.move.col === this.state.moves[i].col &&
          move.move.row === this.state.moves[i].row
        ) {
          throw new InvalidParametersError(BOARD_POSITION_NOT_EMPTY_MESSAGE);
        } else {
          newSetOfMoves.push(this.state.moves[i]);
        }
      }
      newSetOfMoves.push(move.move);
    }
    this.state.moves = newSetOfMoves;
    const minimumTurnsToWin = 5;
    if (this.state.moves.length >= minimumTurnsToWin) {
      this.checkGameEndCondition(move);
    }
  }

  /**
   * Adds a player to the game.
   * Updates the game's state to reflect the new player.
   * If the game is now full (has two players), updates the game's state to set the status to IN_PROGRESS.
   *
   * @param player The player to join the game
   * @throws InvalidParametersError if the player is already in the game (PLAYER_ALREADY_IN_GAME_MESSAGE)
   *  or the game is full (GAME_FULL_MESSAGE)
   */
  public _join(player: Player): void {
    if (player.id === this.state.x || player.id === this.state.o) {
      throw new InvalidParametersError(PLAYER_ALREADY_IN_GAME_MESSAGE);
    } else if (this.state.x !== undefined && this.state.o !== undefined) {
      throw new InvalidParametersError(GAME_FULL_MESSAGE);
    } else {
      if (this.state.x === undefined) {
        this.state.x = player.id;
      } else if (this.state.o === undefined) {
        this.state.o = player.id;
      }
      if (this.state.x !== undefined && this.state.o !== undefined) {
        this.state.status = 'IN_PROGRESS';
      } else {
        this.state.status = 'WAITING_TO_START';
      }
    }
  }

  /**
   * Removes a player from the game.
   * Updates the game's state to reflect the player leaving.
   * If the game has two players in it at the time of call to this method,
   *   updates the game's status to OVER and sets the winner to the other player.
   * If the game does not yet have two players in it at the time of call to this method,
   *   updates the game's status to WAITING_TO_START.
   *
   * @param player The player to remove from the game
   * @throws InvalidParametersError if the player is not in the game (PLAYER_NOT_IN_GAME_MESSAGE)
   */
  protected _leave(player: Player): void {
    if (this.state.x !== player.id && this.state.o !== player.id) {
      throw new InvalidParametersError(PLAYER_NOT_IN_GAME_MESSAGE);
    } else if (this.state.status === 'IN_PROGRESS') {
      if (this.state.x === player.id) {
        this.state.winner = this.state.o;
      } else if (this.state.o === player.id) {
        this.state.winner = this.state.x;
      }
      this.state.status = 'OVER';
    } else if (this.state.status === 'WAITING_TO_START') {
      this.state.status = 'WAITING_TO_START';
      if (this.state.x === player.id) {
        this.state.x = undefined;
      } else if (this.state.o === player.id) {
        this.state.o = undefined;
      }
    }
  }
}
